'use strict'

// Live view of arena matches: board, timeline, viewers and queue. It is fed by
// the server-sent events of /worms/arena/stream (see worms-live.js) and used
// by the match page and the arena tv. Needs wormer.js.

const LIVE_VIEW_STYLES = `
  .lv-title { text-align: center; margin: 16px 0 4px 0; }
  .lv-badge { display: inline-block; font-size: 13px; padding: 2px 8px; border-radius: 6px; background: #f59e0b; color: #1f2937; vertical-align: middle; margin-left: 8px; }
  .lv-banner { border: 1px solid #f59e0b; background: rgba(245, 158, 11, 0.12); color: #fcd34d; border-radius: 8px; padding: 8px 12px; margin: 12px 0; }
  .lv-banner.lv-banner-own { border-color: #22c55e; background: rgba(34, 197, 94, 0.12); color: #86efac; }
  .lv-meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px 16px; color: gray; font-size: 14px; margin-bottom: 6px; }
  .lv-stage { position: relative; }
  .lv-foreign .lv-stage { outline: 3px solid #f59e0b; outline-offset: 3px; }
  .lv-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); color: white; padding: 12px 20px; border-radius: 10px; font-size: 22px; text-align: center; z-index: 1000; max-width: 90%; }
  .lv-overlay small { display: block; font-size: 15px; color: gray; margin-top: 4px; }
  .lv-dots span { animation: lv-dot 1.4s infinite; opacity: 0.2; }
  .lv-dots span:nth-child(2) { animation-delay: 0.2s; }
  .lv-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes lv-dot { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
  .lv-controls { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  .lv-controls button { min-width: 40px; }
  .lv-range { flex: 1; min-width: 160px; accent-color: #3b82f6; }
  .lv-pos { color: gray; font-size: 14px; min-width: 110px; text-align: right; font-variant-numeric: tabular-nums; }
  .lv-live.lv-is-live { color: #ef4444; border-color: #ef4444; }
  .lv-result { text-align: center; font-size: 18px; margin-top: 16px; }
  .lv-result small { display: block; color: gray; font-size: 15px; }
  .lv-queue { color: gray; font-size: 14px; margin-top: 8px; }
  .lv-stats { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 10px; font-size: 14px; color: #d1d5db; }
  .lv-stats b { color: gray; font-weight: normal; }
  .lv-r { color: rgb(239, 68, 68); }
  .lv-g { color: rgb(34, 197, 94); }
`

class LiveView {
  /**
   * @param {HTMLElement} root
   * @param {{ ownMatchId?: number, foreignText?: (info: any) => string, catchUpOnFinish?: boolean, holdResultMs?: number }} [opts]
   */
  constructor(root, opts = {}) {
    this.opts = opts
    if (!document.getElementById('lv-styles')) {
      const style = document.createElement('style')
      style.id = 'lv-styles'
      style.textContent = LIVE_VIEW_STYLES
      document.head.appendChild(style)
    }
    root.innerHTML = `
      <div class="lv-banner" hidden></div>
      <h4 class="lv-title"></h4>
      <div class="lv-meta"><span class="lv-viewers"></span><span class="lv-queue-short"></span></div>
      <div class="lv-stage">
        <div class="lv-board"></div>
        <div class="lv-overlay" hidden></div>
      </div>
      <div class="lv-controls">
        <button type="button" class="btn btn-sm btn-outline-secondary lv-play" title="Pause / Weiter">⏸</button>
        <input type="range" class="lv-range" min="0" max="0" value="0" step="1" aria-label="Zeitleiste">
        <span class="lv-pos"></span>
        <button type="button" class="btn btn-sm btn-outline-secondary lv-live">● Live</button>
        <label style="margin: 0;"><input type="checkbox" class="lv-turbo"> Turbo</label>
      </div>
      <div class="lv-stats"></div>
      <div class="lv-result" hidden></div>
    `
    this.root = root
    /** @param {string} cls */
    const $ = (cls) => /** @type {HTMLElement} */ (root.querySelector('.' + cls))
    this.el = {
      banner: $('lv-banner'),
      title: $('lv-title'),
      viewers: $('lv-viewers'),
      queue: $('lv-queue-short'),
      board: $('lv-board'),
      overlay: $('lv-overlay'),
      play: $('lv-play'),
      range: /** @type {HTMLInputElement} */ ($('lv-range')),
      pos: $('lv-pos'),
      live: $('lv-live'),
      turbo: /** @type {HTMLInputElement} */ ($('lv-turbo')),
      result: $('lv-result'),
      stats: $('lv-stats'),
    }

    this.wormer = new Wormer(this.el.board)
    this.matchId = null
    this.started = false
    this.following = true
    this.dragging = false
    this.finished = null
    this.lastInfo = null
    this.seekTarget = -1
    this.thinkMs = { red: [0, 0], green: [0, 0] }
    this.lastStats = 0
    /** @type {[string, any][]} */
    this.held = []
    this.resultShownAt = 0

    this.el.play.addEventListener('click', () => {
      this.wormer.paused = !this.wormer.paused
      if (this.wormer.paused) this.following = false
    })
    this.el.live.addEventListener('click', () => this.goLive())
    this.el.turbo.addEventListener('change', () => {
      this.wormer.turbo = this.el.turbo.checked
    })
    this.el.range.addEventListener('input', () => {
      this.dragging = true
      this.following = false
      // seek at most once per frame while dragging
      if (this.seekTarget < 0) {
        requestAnimationFrame(() => {
          if (this.started) this.wormer.seek(this.seekTarget * 2)
          this.seekTarget = -1
        })
      }
      this.seekTarget = parseInt(this.el.range.value)
    })
    this.el.range.addEventListener('change', () => {
      this.dragging = false
      const max = parseInt(this.el.range.max)
      if (parseInt(this.el.range.value) >= max && this.isLive()) {
        this.following = true
      }
    })
    // the animation pauses while the tab is hidden, catch up when coming back
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState == 'visible' && this.following) {
        this.catchUp()
      }
    })
    setInterval(() => this.updateControls(), 100)
    this.showOverlay('Verbinde', '', true)
  }

  /** @param {EventSource} source */
  attach(source) {
    /** @param {string} name @param {(data: any) => void} fn */
    const on = (name, fn) =>
      source.addEventListener(name, (e) =>
        fn(JSON.parse(/** @type {MessageEvent} */ (e).data))
      )
    on('match', (info) => this.dispatch('match', info))
    on('start', (start) => this.dispatch('start', start))
    on('moves', (data) => this.dispatch('moves', data))
    on('finished', (data) => this.dispatch('finished', data))
    on('viewers', (data) => this.onViewers(data))
    on('queue', (data) => this.onQueue(data))
  }

  /**
   * Arena tv: the next match may start on the server while the end of the
   * current one is still being shown, its events wait until the result was
   * visible for a moment.
   * @param {string} name
   * @param {any} data
   */
  dispatch(name, data) {
    const holding =
      this.held.length > 0 ||
      (name == 'match' && data?.id !== this.matchId && this.isHolding())
    if (holding) {
      this.held.push([name, data])
      return
    }
    if (name == 'match') this.onMatch(data)
    else if (name == 'start') this.onStart(data)
    else if (name == 'moves') this.onMoves(data)
    else if (name == 'finished') this.onFinished(data)
  }

  isHolding() {
    const hold = this.opts.holdResultMs
    if (!hold || !this.finished || !this.started) return false
    if (!this.resultShownAt) return true
    return Date.now() - this.resultShownAt < hold
  }

  releaseHeld() {
    if (!this.held.length || this.isHolding()) return
    let held = this.held
    this.held = []
    // several matches passed meanwhile (e.g. tab in background): only the
    // newest one is of interest
    let last = -1
    held.forEach(([name], i) => {
      if (name == 'match') last = i
    })
    if (last > 0) held = held.slice(last)
    for (const [name, data] of held) this.dispatch(name, data)
  }

  isLive() {
    return this.started && !this.wormer.liveDone
  }

  /** @param {string} title @param {string} [subtitle] @param {boolean} [dots] */
  showOverlay(title, subtitle, dots) {
    const html =
      escapeLV(title) +
      (dots
        ? '<span class="lv-dots"><span>.</span><span>.</span><span>.</span></span>'
        : '') +
      (subtitle ? '<small>' + escapeLV(subtitle) + '</small>' : '')
    // only update on change, otherwise the dot animation restarts
    if (this.el.overlay.dataset.html != html) {
      this.el.overlay.dataset.html = html
      this.el.overlay.innerHTML = html
    }
    this.el.overlay.hidden = false
  }

  hideOverlay() {
    this.el.overlay.hidden = true
  }

  /** @param {any} info */
  setTitle(info) {
    this.el.title.innerHTML = info
      ? `<span style="color: rgb(239, 68, 68)">${escapeLV(info.red)}</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${escapeLV(info.green)}</span>` +
        (info.foreign ? '<span class="lv-badge">Fremdes Match</span>' : '')
      : ''
  }

  /** @param {any} info */
  onMatch(info) {
    // same match again after a reconnect: keep everything
    if (info && info.id === this.matchId) {
      this.setTitle(info)
      return
    }
    const wasForeign = this.lastInfo && this.lastInfo.foreign
    this.lastInfo = info
    this.wormer.stop()
    this.wormer = new Wormer(this.el.board)
    this.wormer.turbo = this.el.turbo.checked
    this.matchId = info ? info.id : null
    this.started = false
    this.following = true
    this.finished = null
    this.resultShownAt = 0
    this.thinkMs = { red: [0, 0], green: [0, 0] }
    this.el.result.hidden = true
    this.setTitle(info)
    this.root.classList.toggle('lv-foreign', !!(info && info.foreign))

    if (!info) {
      this.el.banner.hidden = true
      this.showOverlay(
        'Gerade läuft kein Match',
        'Sobald jemand in der Arena herausfordert, geht es hier los.'
      )
      return
    }
    if (info.foreign) {
      this.el.banner.className = 'lv-banner'
      this.el.banner.textContent = this.opts.foreignText
        ? this.opts.foreignText(info)
        : 'Das ist das Match von jemand anderem.'
      this.el.banner.hidden = false
    } else if (wasForeign && info.id === this.opts.ownMatchId) {
      this.el.banner.className = 'lv-banner lv-banner-own'
      this.el.banner.textContent = 'Jetzt geht es los: Dein Match startet!'
      this.el.banner.hidden = false
      setTimeout(() => {
        if (this.matchId === info.id) this.el.banner.hidden = true
      }, 5000)
    } else {
      this.el.banner.hidden = true
    }
    this.showOverlay('Match startet', 'Bots werden geladen', true)
  }

  /** @param {any} start */
  onStart(start) {
    if (this.started) return
    this.started = true
    this.joining = true
    this.hideOverlay()
    this.wormer.runLive(start)
  }

  /** @param {{from: number, dirs: number[]}} data */
  onMoves(data) {
    if (!this.started) return
    const have = this.wormer.dirs.length
    if (data.from > have) return
    // server side think time per move, even = red, odd = green
    for (let i = have - data.from; i < (data.ms || []).length; i++) {
      const side = (data.from + i) % 2 == 0 ? this.thinkMs.red : this.thinkMs.green
      side[0] += data.ms[i]
      side[1]++
    }
    this.wormer.feedLive(data.dirs.slice(have - data.from))
    // joined a match that is already running: start at the current state
    if (this.joining) {
      this.joining = false
      this.catchUp()
    }
  }

  /** @param {any} data */
  onFinished(data) {
    this.finished = data
    if (data.status == 'cancelled' || data.status == 'error') {
      this.el.banner.hidden = true
      this.showOverlay(
        data.status == 'cancelled'
          ? 'Match abgebrochen'
          : 'Match fehlgeschlagen',
        data.status == 'cancelled'
          ? 'Es hat nicht begonnen und wird nicht gewertet.'
          : 'Es ist ein Fehler passiert.'
      )
      if (this.onResult) this.onResult(data)
      return
    }
    if (!this.started) {
      // the server sends the start position first, so the match ended
      // before it had one (given up right at the beginning)
      this.showOverlay('Match beendet')
      this.showResult()
      return
    }
    const sawMoves = this.wormer.dirs.length > 0
    this.wormer.onFinish = () => this.showResult()
    this.wormer.finishLive(data)
    const end = data.dirs.length - (data.dirs.length % 2)
    if (!sawMoves || data.aborted) {
      // joined after the end, or someone gave up: show the final board
      this.wormer.seek(data.dirs.length + 2)
    } else if (this.opts.catchUpOnFinish) {
      // arena tv: don't lag behind for minutes, show the last seconds
      const keep = Math.ceil(5000 / 120) * 2
      if (end - this.wormer.consumed > keep) this.wormer.seek(end - keep)
    }
  }

  showResult() {
    const data = this.finished
    if (!data || !this.lastInfo) return
    const info = this.lastInfo
    const redWins = data.status == 'red-win'
    let html = `🏆 <span style="color: ${redWins ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)'}">${escapeLV(redWins ? info.red : info.green)}</span> gewinnt`
    if (data.aborted) html += '<small>Rot hat aufgegeben</small>'
    if (data.elo) {
      /** @param {number[]} e */
      const fmt = (e) => {
        const diff = Math.round(e[1]) - Math.round(e[0])
        return `${Math.round(e[1])} (${diff >= 0 ? '+' : ''}${diff})`
      }
      html += `<small>ELO: ${escapeLV(info.red)} ${fmt(data.elo.red)} · ${escapeLV(info.green)} ${fmt(data.elo.green)}</small>`
    }
    this.el.result.innerHTML = html
    this.el.result.hidden = false
    if (!this.resultShownAt) this.resultShownAt = Date.now()
    if (this.onResult) this.onResult(data)
  }

  /** @param {{names: string[]}} data */
  onViewers(data) {
    const names = data.names
    if (!names.length) {
      this.el.viewers.textContent = ''
      return
    }
    const shown = names.slice(0, 8).join(', ')
    const more = names.length > 8 ? ` und ${names.length - 8} weitere` : ''
    this.el.viewers.textContent = `👀 ${names.length} ${names.length == 1 ? 'Zuschauer' : 'Zuschauer'}: ${shown}${more}`
  }

  /** @param {{next: {red: string, green: string}[], total: number}} data */
  onQueue(data) {
    this.queue = data
    if (!data.total) {
      this.el.queue.textContent = 'Warteschlange: leer'
      return
    }
    const next = data.next[0]
    this.el.queue.textContent = `Als Nächstes: ${next.red} vs ${next.green}${data.total > 1 ? ` (+${data.total - 1} weitere)` : ''}`
  }

  // jump close to the newest move (or the last seconds of a finished match)
  catchUp() {
    if (this.isLive()) {
      this.wormer.skipAhead()
    } else if (this.started && this.finished && !this.wormer.winner) {
      const w = this.wormer
      const end = w.dirs.length - (w.dirs.length % 2)
      const keep = Math.ceil(w.liveBuffer / 120) * 2
      if (end - w.consumed > keep) w.seek(end - keep)
    }
  }

  goLive() {
    this.following = true
    this.wormer.paused = false
    if (this.isLive()) {
      this.wormer.skipAhead()
    } else if (this.started) {
      this.wormer.seek(this.wormer.dirs.length + 2)
    }
  }

  updateControls() {
    this.releaseHeld()
    const w = this.wormer
    const total = this.started ? Math.floor(w.dirs.length / 2) : 0
    const pos = this.started ? Math.floor(w.consumed / 2) : 0
    this.el.range.disabled = !this.started
    if (!this.dragging) {
      this.el.range.max = String(total)
      this.el.range.value = String(pos)
    }
    this.el.pos.textContent = `Runde ${this.dragging ? this.el.range.value : pos} / ${total}`
    this.el.play.textContent = w.paused ? '▶' : '⏸'
    this.el.play.disabled = !this.started

    if (this.isLive()) {
      const behindMs = (total - pos) * (w.interval || 120)
      const atLive = this.following && !w.paused && behindMs < 3000
      this.el.live.hidden = false
      this.el.live.classList.toggle('lv-is-live', atLive)
      this.el.live.textContent = atLive
        ? '● LIVE'
        : `▶ Live (−${Math.max(1, Math.round(behindMs / 1000))} s)`
    } else {
      this.el.live.hidden = !this.started
      this.el.live.classList.remove('lv-is-live')
      this.el.live.textContent = '⏭ Ende'
    }

    const now = Date.now()
    if (now - this.lastStats > 300) {
      this.lastStats = now
      this.updateStats()
    }
  }

  // cheap numbers for the round that is shown right now
  updateStats() {
    const w = this.wormer
    if (!this.started || !w.startPos) {
      this.el.stats.innerHTML = ''
      return
    }
    const W = 74
    const H = 42
    const N = W * H
    if (!this.statBuf) {
      this.statBuf = {
        dist: new Int32Array(N),
        own: new Uint8Array(N),
        queue: new Int32Array(N),
      }
    }
    const { dist, own, queue } = this.statBuf
    dist.fill(-1)
    own.fill(0)

    // territory: which free cells each worm reaches first (ties count for nobody)
    const red = w.redX * H + w.redY
    const green = w.greenX * H + w.greenY
    let head = 0
    let tail = 0
    dist[red] = 0
    own[red] = 1
    queue[tail++] = red
    dist[green] = 0
    own[green] = 2
    queue[tail++] = green
    let meet = false
    while (head < tail) {
      const c = queue[head++]
      const o = own[c]
      if (o == 3) continue
      for (const n of [c - H, c + H, c - 1, c + 1]) {
        if (w.board[Math.floor(n / H)][n % H] !== 0) continue
        if (dist[n] == -1) {
          dist[n] = dist[c] + 1
          own[n] = o
          queue[tail++] = n
        } else if (own[n] != o) {
          meet = true
          if (dist[n] == dist[c] + 1) own[n] = 3
        }
      }
    }
    let redArea = 0
    let greenArea = 0
    for (let i = 0; i < N; i++) {
      if (dist[i] > 0) {
        if (own[i] == 1) redArea++
        else if (own[i] == 2) greenArea++
      }
    }

    const shown = Math.min(w.consumed, w.dirs.length)
    let turnsRed = 0
    let turnsGreen = 0
    let lastRed = w.startPos.dirRed
    let lastGreen = w.startPos.dirGreen
    for (let i = 0; i < shown; i++) {
      if (i % 2 == 0) {
        if (w.dirs[i] !== lastRed) turnsRed++
        lastRed = w.dirs[i]
      } else {
        if (w.dirs[i] !== lastGreen) turnsGreen++
        lastGreen = w.dirs[i]
      }
    }
    const lenRed = Math.ceil(shown / 2) + 1
    const lenGreen = Math.floor(shown / 2) + 1
    const free = 72 * 40 - lenRed - lenGreen

    /** @param {string} label @param {string} r @param {string} g */
    const pair = (label, r, g) =>
      '<span><b>' + label + '</b> <span class="lv-r">' + r + '</span> · <span class="lv-g">' + g + '</span></span>'
    let html = meet
      ? pair(
          'Gebiet',
          Math.round((redArea / free) * 100) + ' %',
          Math.round((greenArea / free) * 100) + ' %'
        )
      : pair('Getrennt, Platz', redArea + ' Felder', greenArea + ' Felder')
    html += pair('Länge', String(lenRed), String(lenGreen))
    html += pair('Kurven', String(turnsRed), String(turnsGreen))
    html += '<span><b>Frei</b> ' + free + ' Felder</span>'
    const ms = this.thinkMs
    if (ms.red[1] && ms.green[1]) {
      html += pair(
        'Ø Rechenzeit',
        Math.round(ms.red[0] / ms.red[1]) + ' ms',
        Math.round(ms.green[0] / ms.green[1]) + ' ms'
      )
    }
    this.el.stats.innerHTML = html
  }
}

/** @param {any} text */
function escapeLV(text) {
  const div = document.createElement('div')
  div.textContent = text == null ? '' : String(text)
  return div.innerHTML
}
