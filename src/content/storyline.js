import { renderPage } from '../helper/render-page.js'
import { renderTemplate } from '../helper/render-template.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupStoryline(App) {
  App.express.get('/story/:id', async (req, res) => {
    const id = req.params.id

    // ups, this got a bit uglier than expected
    const story =
      STORIES[/** @type {keyof STORIES} */ (/** @type {unknown} */ (id))]

    if (!req.user || !story) {
      res.redirect('/')
      return
    }

    const mapMeta = await App.mapMeta.get(req.user.id)
    if (
      !mapMeta.storiesAvailable.includes(parseInt(id)) &&
      !App.config.editors.includes(req.user.name)
    ) {
      res.redirect('/')
      return
    }

    App.event.create('story-view-' + id, req.user.id)

    if (req.query.logbook === '1') {
      req.session.returnToLogbook = true
    }

    const lng = req.lng === 'en' ? 'en' : 'de'
    const pageTitle =
      lng === 'en' && story.enTitle ? story.enTitle : story.title
    renderPage(App, req, res, {
      page: 'story',
      title: pageTitle,
      content: `
        <style>
          /* Scene-wide layout classes moved from scene files */
          .scene-root { text-align: center; }
          .scene-panel .panel-inner .scene-content {
            max-width: 65ch;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }
          .scene-skip {
            position: fixed;
            top: 12px;
            right: 12px;
            color: rgba(255, 255, 255, 0.75);
            text-decoration: none;
            font-size: 13px;
            padding: 4px 8px;
            border-radius: 6px;
            transition: opacity 120ms ease-in;
            opacity: 0.8;
          }
          .scene-skip:hover { opacity: 1; color: rgba(255, 255, 255, 0.9); }
          .scene-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            overflow: auto;
            padding-bottom: 14vh;
            padding-top: 14vh;
            padding-left: 12px;
            padding-right: 12px;
          }
          .scene-panel {
            display: flex;
            justify-content: center;
          }
          .scene-panel .panel-inner {
            width: 100%;
            max-width: 72ch;
            margin: 0 auto;
            padding: 18px 16px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(var(--main-color-rgb), 0.22);
            box-shadow:
              0 0 0 1px rgba(var(--main-color-rgb), 0.12) inset,
              0 0 20px rgba(var(--main-color-rgb), 0.12);
            backdrop-filter: saturate(140%) blur(4px);
          }
          /* Shared story animations and affordances */
          @media (prefers-reduced-motion: reduce) {
            .scene-panel .panel-inner .fade-in,
            .scene-panel .panel-inner .line-fade-in {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
          .scene-panel .panel-inner .fade-in { opacity: 0; transform: translateY(6px); }
          .scene-panel .panel-inner .fade-in.start { animation: sceneFadeIn 1000ms ease-out forwards; }
          .scene-panel .panel-inner .line-fade-in { opacity: 0; transform: translateY(4px); }
          .scene-panel .panel-inner .line-fade-in.start { animation: sceneFadeIn var(--line-dur, 1000ms) ease-out forwards; }
          @keyframes sceneFadeIn { to { opacity: 1; transform: none; } }

          .scene-panel .panel-inner .continue { opacity: 0; pointer-events: none; }
          .scene-panel .panel-inner .continue.show { transition: opacity 300ms ease-in; opacity: 1; pointer-events: auto; }
          .scene-panel .panel-inner .skip { animation: none !important; opacity: 1 !important; transform: none !important; }

          .scene-panel .panel-inner.scene-interactive { cursor: pointer; user-select: none; }

          .scene-panel .panel-inner .click-hint {
            position: fixed;
            bottom: 16px;
            right: 16px;
            font-size: 12px;
            line-height: 1.2;
            color: currentColor;
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 200ms ease-in;
            pointer-events: none;
            z-index: 1000;
          }
          .scene-panel .panel-inner .click-hint.show { opacity: 0.75; }
        </style>
        <div class="scene-container">
          <a href="/story/${id}/skip" class="scene-skip" aria-label="${lng === 'en' ? 'Skip' : 'Überspringen'}">${lng === 'en' ? 'skip' : 'überspringen'}</a>
          <div class="scene-panel">
            <div class="panel-inner">
              ${await renderTemplate(App, req, '../story-scenes/' + id + '_' + lng, { username: req.user.name })}
            </div>
          </div>
        </div>
        <script>
          (function() {
            var c = document.querySelector('.scene-panel .panel-inner')
            if (!c) return
            var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
            var btn = c.querySelector('.continue')
            var ps = c.querySelectorAll('p.fade-in, blockquote.fade-in')
            if (!ps || ps.length === 0) return

            var hint = document.createElement('div')
            hint.className = 'click-hint'
            hint.setAttribute('aria-hidden', 'true')
            var hintText = '${lng === 'en' ? 'Click to continue' : 'Klicken um fortzufahren'}'
            hint.textContent = hintText
            c.appendChild(hint)

            var P_DUR = 4000, L_GAP = 600
            function calcDur(s) {
              var w = (s || '').trim().split(/\s+/).filter(Boolean).length
              var d = 2400 + w * 120
              if (d < 2400) d = 2400
              if (d > 7000) d = 7000
              return d
            }
            for (var i = 0; i < ps.length; i++) {
              var ls0 = ps[i].querySelectorAll('.line-fade-in')
              for (var j = 0; j < ls0.length; j++) {
                var d0 = calcDur(ls0[j].textContent || '')
                var clamped = Math.min(d0, 1000)
                ls0[j].style.setProperty('--line-dur', clamped + 'ms')
              }
            }

            var state = { pi: 0, li: -1, timeout: null, currentEl: null, currentType: null, done: false }
            function showContinue() {
              if (btn) { btn.classList.add('show'); btn.removeAttribute('aria-hidden') }
              state.done = true
              if (hint) hint.classList.remove('show')
              c.classList.remove('scene-interactive')
            }
            function nextParagraph(immediate) {
              state.pi++
              if (state.pi < ps.length) startParagraph(state.pi, immediate)
              else showContinue()
            }
            function startParagraph(i, immediate) {
              var p = ps[i]
              p.classList.add('start')
              state.currentEl = p
              state.currentType = 'paragraph'
              state.li = -1
              var ls = p.querySelectorAll('.line-fade-in')
              if (ls.length) {
                if (immediate) { startLine(0) }
                else { state.timeout = setTimeout(function(){ startLine(0) }, P_DUR) }
              } else {
                if (immediate) { state.timeout = setTimeout(function(){ nextParagraph(false) }, P_DUR) }
                else { state.timeout = setTimeout(function(){ nextParagraph(false) }, P_DUR) }
              }
            }
            function startLine(j) {
              var p = ps[state.pi]
              var ls = p.querySelectorAll('.line-fade-in')
              state.li = j
              var line = ls[j]
              line.classList.add('start')
              state.currentEl = line
              state.currentType = 'line'
              var d = calcDur(line.textContent || '')
              state.timeout = setTimeout(function(){
                if (j + 1 < ls.length) startLine(j + 1)
                else nextParagraph()
              }, d + L_GAP)
            }
            function skipCurrent() {
              if (state.timeout) { clearTimeout(state.timeout); state.timeout = null }
              if (state.currentEl) state.currentEl.classList.add('skip')
              if (state.currentType === 'paragraph') {
                var ls = ps[state.pi].querySelectorAll('.line-fade-in')
                if (ls.length) startLine(0)
                else nextParagraph(true)
              } else if (state.currentType === 'line') {
                var p = ps[state.pi]
                var ls2 = p.querySelectorAll('.line-fade-in')
                if (state.li + 1 < ls2.length) startLine(state.li + 1)
                else nextParagraph()
              } else {
                startParagraph(state.pi, true)
              }
            }
            function startSequence() {
              if (reduce) {
                for (var i = 0; i < ps.length; i++) {
                  ps[i].classList.add('skip'); ps[i].classList.add('start')
                  var ls = ps[i].querySelectorAll('.line-fade-in')
                  for (var j = 0; j < ls.length; j++) { ls[j].classList.add('skip'); ls[j].classList.add('start') }
                }
                showContinue(); return
              }
              c.classList.add('scene-interactive')
              if (hint) hint.classList.add('show')
              startParagraph(0, false)
              c.addEventListener('click', function(ev){
                if (state.done) return
                if (ev.target && ev.target.closest && ev.target.closest('.continue')) return
                skipCurrent()
              })
            }
            if ('IntersectionObserver' in window) {
              new IntersectionObserver(function(e, o){ if (e[0].isIntersecting) { startSequence(); o.disconnect() } }, { threshold: 0.1 }).observe(c)
            } else {
              startSequence()
            }
          })()
        </script>
      `,
    })
  })

  App.express.post('/story/:id/complete', async (req, res) => {
    const id = req.params.id

    // ups, this got a bit uglier than expected
    const story =
      STORIES[/** @type {keyof STORIES} */ (/** @type {unknown} */ (id))]

    if (!req.user || !story) {
      res.redirect('/')
      return
    }

    if (
      !App.config.editors.includes(req.user.name) &&
      !App.config.demos.includes(req.user.name)
    ) {
      await App.mapMeta.markAsCompleted(req.user.id, parseInt(id))
    }
    App.event.create('story-complete-' + id, req.user.id)

    if (req.session.returnToLogbook) {
      delete req.session.returnToLogbook
      res.redirect('/logbook')
      return
    }

    res.redirect('/')
  })

  App.express.get('/story/:id/skip', (req, res) => {
    const id = req.params.id

    // ups, this got a bit uglier than expected
    const story =
      STORIES[/** @type {keyof STORIES} */ (/** @type {unknown} */ (id))]

    if (!req.user || !story) {
      res.redirect('/')
      return
    }

    App.event.create('story-skip-' + id, req.user.id)

    if (req.session.returnToLogbook) {
      delete req.session.returnToLogbook
      res.redirect('/logbook')
      return
    }

    res.redirect('/')
  })

  App.express.get('/logbook', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }
    const lng = req.lng === 'en' ? 'en' : 'de'
    const heading = lng === 'en' ? 'Travel Log' : 'Reisebericht'
    const mapMeta = await App.mapMeta.get(req.user.id)

    if (App.config.editors.includes(req.user.name)) {
      // Editors can see all stories
      mapMeta.storiesAvailable = Object.keys(STORIES).map((k) => parseInt(k))
      mapMeta.storiesCompleted = Object.keys(STORIES).map((k) => parseInt(k))
    }

    renderPage(App, req, res, {
      page: 'logbook',
      heading,
      content: `
        <style>
          .story-entry { transition: all 0.2s ease-in-out; }
          .story-entry.available:hover { filter: brightness(1.22); transform: scale(1.01); }
          .story-entry.available { color: var(--main-color); background: rgba(var(--main-color-rgb), 0.06); border: 1px solid rgba(var(--main-color-rgb), 0.18); }
          .story-entry.completed { color: rgba(255, 255, 255, 0.65); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.14); }
          .story-entry.unavailable { color: rgba(255, 255, 255, 0.45); background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.12); cursor: default; }
          .story-entry.completed .badge, .story-entry.unavailable .badge { background: rgba(255, 255, 255, 0.10) !important; color: rgba(255, 255, 255, 0.70) !important; }
          .story-entry.unavailable .story-title { color: rgba(255, 255, 255, 0.30); }
          .story-entry.completed .checkmark { margin-left: 8px; color: rgba(255, 255, 255, 0.75); }
          .story-entry.unavailable { justify-content: center; }
        </style>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          margin-bottom: 100px;
        ">
          ${Object.entries(STORIES)
            .map(([id, story], idx) => {
              const lng = req.lng === 'en' ? 'en' : 'de'
              const t =
                lng === 'en' && story.enTitle ? story.enTitle : story.title
              const sid = parseInt(id)
              const available = mapMeta.storiesAvailable.includes(sid)
              const completed = mapMeta.storiesCompleted.includes(sid)
              const cls = available
                ? completed
                  ? 'completed'
                  : 'available'
                : 'unavailable'
              const titleText = available ? t : '???'
              const containerOpen = available
                ? `<a href="/story/${id}?logbook=1" class="story-entry ${cls}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;text-decoration:none;">`
                : `<div class="story-entry ${cls}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;">`
              const containerClose = available ? `</a>` : `</div>`
              const badgeHtml = available
                ? `
              <span class="badge" style="
                display: inline-flex;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                background: rgba(var(--main-color-rgb), 0.15);
                color: var(--main-color);
                font-weight: 700;
                align-items: center;
                justify-content: center;
              ">${idx + 1}</span>`
                : ''
              return `
            ${containerOpen}
              ${badgeHtml}
              <span class="story-title" style="
                font-weight: 600;
                letter-spacing: .2px;
              ">${titleText}</span>
              ${completed ? '<span class="checkmark" aria-hidden="true">✓</span>' : ''}
            ${containerClose}
          `
            })
            .join('')}
        </div>
      `,
    })
  })
}

const STORIES = {
  1: { title: 'Bex Vorstellung', enTitle: 'Introducing Bex' },
  2: { title: 'Josh Vorstellung', enTitle: 'Introducing Josh' },
  3: { title: 'Der Plan', enTitle: 'The Plan' },
  4: { title: 'Sehnsucht', enTitle: 'Longing' },
  5: { title: 'Unschuldig', enTitle: 'Innocent' },
  6: { title: 'Ohnmacht', enTitle: 'Fainting' },
  7: { title: 'Weiterkämpfen', enTitle: 'Keep Fighting' },
  8: { title: 'Epilog', enTitle: 'Epilogue' },
}
