'use strict'

// Small statistics for the round that is on screen: territory of both worms,
// turns, free cells and (live view only) the average think time per move.
// Needs wormer.js.

const WORM_STATS_STYLES = `
  .worm-stats { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px 16px; margin: 8px 0; font-size: 15px; color: #d1d5db; font-variant-numeric: tabular-nums; min-height: 44px; }
  .worm-stats.ws-no-time { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .worm-stats b { display: block; color: gray; font-weight: normal; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .worm-stats .ws-r { color: rgb(239, 68, 68); }
  .worm-stats .ws-g { color: rgb(34, 197, 94); }
  @media (max-width: 600px) { .worm-stats, .worm-stats.ws-no-time { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
`

const wormStats = {
  thinkTime: { red: [0, 0], green: [0, 0] },

  /**
   * Live view: server side think times in ms, starting with move `from`
   * (even moves are red, odd ones green)
   * @param {number} from
   * @param {number[]} ms
   */
  addThinkTimes(from, ms) {
    if (!ms) return
    ms.forEach((t, i) => {
      const side = (from + i) % 2 == 0 ? this.thinkTime.red : this.thinkTime.green
      side[0] += t
      side[1]++
    })
  },

  /**
   * Shows the statistics in `el` and keeps them up to date. The columns are
   * fixed, changing numbers never move the others around.
   * @param {HTMLElement} el
   * @param {() => any} getWormer
   * @param {boolean} withThinkTime
   */
  show(el, getWormer, withThinkTime) {
    if (!document.getElementById('worm-stats-styles')) {
      const style = document.createElement('style')
      style.id = 'worm-stats-styles'
      style.textContent = WORM_STATS_STYLES
      document.head.appendChild(style)
    }
    el.className = 'worm-stats' + (withThinkTime ? '' : ' ws-no-time')
    const update = () => {
      let wormer = null
      try {
        wormer = getWormer()
      } catch (e) {
        // the page creates the wormer a bit later
      }
      el.innerHTML = this.render(wormer, withThinkTime)
    }
    update()
    setInterval(update, 300)
  },

  render(w, withThinkTime) {
    /** @param {string} label @param {string} value */
    const cell = (label, value) => '<div><b>' + label + '</b>' + value + '</div>'
    /** @param {string} label @param {string | number} r @param {string | number} g */
    const pair = (label, r, g) =>
      cell(label, '<span class="ws-r">' + r + '</span> · <span class="ws-g">' + g + '</span>')

    const ms = this.thinkTime
    const time =
      ms.red[1] && ms.green[1]
        ? pair(
            'Ø Rechenzeit in ms',
            Math.round(ms.red[0] / ms.red[1]),
            Math.round(ms.green[0] / ms.green[1])
          )
        : cell('Ø Rechenzeit in ms', '–')

    if (!w || !w.dirs) {
      return (
        cell('Schritt', '–') +
        cell('Gebiet in %', '–') +
        cell('Kurven', '–') +
        cell('Freie Felder', '–') +
        (withThinkTime ? time : '')
      )
    }

    const W = 74
    const H = 42
    const N = W * H
    if (!this.buf) {
      this.buf = {
        dist: new Int32Array(N),
        own: new Uint8Array(N),
        queue: new Int32Array(N),
      }
    }
    const { dist, own, queue } = this.buf
    dist.fill(-1)
    own.fill(0)

    // territory: which free cells each worm reaches first, ties count for nobody
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
    let free = 0
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const i = x * H + y
        if (w.board[x][y] === 0) free++
        if (dist[i] > 0 && own[i] == 1) redArea++
        if (dist[i] > 0 && own[i] == 2) greenArea++
      }
    }

    // turns: direction changes between two moves of the same worm
    const shown = Math.min(w.consumed, w.dirs.length)
    let turnsRed = 0
    let turnsGreen = 0
    for (let i = 2; i < shown; i++) {
      if (w.dirs[i] !== w.dirs[i - 2]) {
        if (i % 2 == 0) turnsRed++
        else turnsGreen++
      }
    }

    return (
      cell('Schritt', String(Math.floor(shown / 2))) +
      (meet
        ? pair(
            'Gebiet in %',
            free ? Math.round((redArea / free) * 100) : 0,
            free ? Math.round((greenArea / free) * 100) : 0
          )
        : pair('Getrennt, Felder', redArea, greenArea)) +
      pair('Kurven', turnsRed, turnsGreen) +
      cell('Freie Felder', String(free)) +
      (withThinkTime ? time : '')
    )
  },
}
