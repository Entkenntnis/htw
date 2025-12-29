/**
 *
 * @param {{App: import("./types.js").App, req: import("express").Request, solved: number[]}} param0
 * @returns {Promise<string>}
 */
export async function customMapHtmlCreator({ App, req, solved }) {
  if (!req.user) return ''

  const showAll =
    App.config.editors.includes(req.user.name) ||
    App.config.demos.includes(req.user.name)

  const mapMeta = await App.mapMeta.get(req.user.id)

  const logbookVisible = showAll || mapMeta.storiesAvailable.length > 0 // any story available
  const enoughVisible = showAll || mapMeta.storiesAvailable.includes(4) // story 4 available
  const musicVisible = showAll || mapMeta.storiesAvailable.includes(5) // story 5 available

  const hackerQuizVisible =
    showAll || req.user.score >= 100 || mapMeta.storiesAvailable.includes(3)
  const wwwmVisible = req.user.score >= 150 || showAll
  const mortalCoilVisible = req.user.score >= 200 || showAll
  const wormsVisible = req.user.score >= 250 || showAll
  const pleaseFixMeVisible = req.user.score >= 300 || showAll

  const showWwwmLocked = !wwwmVisible && hackerQuizVisible
  const showMortalcoilLocked = wwwmVisible && !mortalCoilVisible
  const showWormsLocked = mortalCoilVisible && !wormsVisible
  const showPleaseFixMeLocked = wormsVisible && !pleaseFixMeVisible

  let mortalcoillevel = 0

  if (mortalCoilVisible) {
    const raw = parseInt(
      (await App.storage.getItem(`mortalcoil_${req.user.id}`)) ?? 'NaN'
    )
    if (!isNaN(raw)) {
      mortalcoillevel = raw
    }
  }

  let wwwm_win = false
  if (wwwmVisible) {
    if (await App.storage.getItem(`wwwm-win-${req.user.id}`)) {
      wwwm_win = true
    }
  }

  let output = ''

  if (hackerQuizVisible) {
    output += `<a draggable="false" href="/quiz" style="position:absolute;left:1350px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>Hacker Quiz</div>
            <img draggable="false" src="/quiz/logo.png" style="width:52px;margin-left:12px">
          </a>`
  }

  if (wwwmVisible) {
    output += `<a draggable="false" href="/wer-wird-wort-millionaer" style="position:absolute;left:1530px;top:122px;" class="text-reset text-decoration-none fade-in">
            <img draggable="false" src="/wwwm.png" style="width:78px;">
            ${wwwm_win ? `<div style="position: absolute; right: 0px; bottom: -9px; color: #fff; font-size:24px; padding:4px 7px; border-radius:12px; min-width:24px; text-align:center; box-shadow: 0 1px 0 rgba(0,0,0,0.3);">🏆</div>` : ''}
          </a>`
  }

  if (mortalCoilVisible) {
    output += `<a draggable="false" href="/mortal-coil" style="position:absolute;left:1670px;top:116px;" class="text-reset text-decoration-none fade-in">
            <div>Mortal Coil</div>
            <img draggable="false" src="/mortal_coil.png" style="width:42px;margin-top:6px;margin-left:14px;">
            ${
              mortalcoillevel
                ? `
                    <div style="position: absolute; right: 6px; bottom: -9px; background: rgba(60,60,60,0.95); color: #fff; font-size:12px; padding:4px 7px; border-radius:12px; min-width:24px; text-align:center; box-shadow: 0 1px 0 rgba(0,0,0,0.3);">${mortalcoillevel}</div>
                  `
                : ''
            }
          </a>`
  }

  if (showWwwmLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1470px;top:126px;gap:8px;padding:3px 6px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">${req.lng == 'de' ? '🔒 ab 150 Punkten' : '🔒 from 150 points'}</span>
      </div>`
  }

  if (showMortalcoilLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1670px;top:126px;gap:8px;padding:3px 6px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">${req.lng == 'de' ? '🔒 ab 200 Punkten' : '🔒 from 200 points'}</span>
      </div>`
  }

  if (showWormsLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1823px;top:126px;gap:8px;padding:3px 6px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">${req.lng == 'de' ? '🔒 ab 250 Punkten' : '🔒 from 250 points'}</span>
      </div>`
  }

  if (showPleaseFixMeLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1930px;top:126px;gap:8px;padding:3px 6px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">${req.lng == 'de' ? '🔒 ab 300 Punkten' : '🔒 from 300 points'}</span>
      </div>`
  }

  if (wormsVisible) {
    output += `<a draggable="false" href="/worms" style="position:absolute;left:1823px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>Worms</div>
            <img draggable="false" src="/worms.png" style="width:46px">
          </a>`
  }

  if (pleaseFixMeVisible) {
    output += `<a draggable="false" href="/please-fix-me" style="position:absolute;left:1930px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>Please Fix Me!</div>
            <img draggable="false" src="/pfm.png" style="width:65px;margin-left:16px; margin-top: 2px; border-radius: 4px; border: 1px solid #2c2c2cff;">
          </a>`
  }

  if (req.user && App.config.editors.includes(req.user.name)) {
    output += `<div style="position: absolute; left: 1000px; top: -25px;">
            <a href="/mapflow" draggable="false">MapFlow</a><a draggable="false" href="/events" style="margin-left: 24px;">Events</a>
            <a draggable="false" href="/survey" style="margin-left: 24px;">Survey</a><a draggable="false" href="/feedback" style="margin-left: 24px;">Feedback</a>
            <a draggable="false" href="/questions" style="margin-left: 24px;">Questions</a><a href="/experiments" draggable="false" style="margin-left: 24px;">Experiments</a>
            <a href="${prometheusUrl}" target="_blank" draggable="false" style="margin-left: 24px;">Perf-Monitor</a>
          </div>`
  }

  const newStoriesCount = !showAll
    ? mapMeta.storiesAvailable.filter(
        (storyid) => !mapMeta.storiesCompleted.includes(storyid)
      ).length
    : 0

  if (logbookVisible) {
    output += `<a draggable="false" href="/logbook" style="position:absolute;left:1188px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>${req.lng == 'de' ? 'Reisebericht' : 'Travel Log'}</div>
            <img draggable="false" src="/story/book.png" style="width:40px;margin-left:21px; margin-top: 3px; border-radius: 6px;">
            ${
              newStoriesCount > 0
                ? `<div style="position: absolute; right: 9px; bottom: -9px; background-color: var(--main-color); color:#ffffff; font-size:12px; padding:2px 6px; border-radius:12px; min-width:22px; text-align:center; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);">${newStoriesCount}</div>`
                : ''
            }
          </a>`
  }

  if (enoughVisible) {
    output += `<a draggable="false" href="/enough" style="position:absolute;left:140px;top:955px;" class="text-reset text-decoration-none fade-in">
            <div>&nbsp;&nbsp;&nbsp;Enough</div>
            <img draggable="false" src="/enough.png" style="width:65px;margin-top:6px;">
          </a>`
  }

  if (musicVisible) {
    output += `<a draggable="false" href="/music" target="_blank" style="position:absolute;left:158px;top:1160px;" class="text-reset text-decoration-none fade-in">
            <div>Musik</div>
            <img draggable="false" src="/musical-note.png" style="width:36px; margin-top: 4px;">
          </a>`
  }

  if (solved.includes(300)) {
    output += `
      <div class="lang-picker fade-in" style="position: absolute; left: 1790px; top: 210px; display: flex; flex-direction: column; align-items: flex-start; gap: 0; padding-bottom: 6px; padding-top: 6px;">
        <div style="opacity:0.8;">${req.lng == 'de' ? 'Filter' : 'Filter'}</div>
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" id="show-easy" ${mapMeta.communityFilter.includes('E') ? 'checked' : ''}/>
          <span>${req.lng == 'de' ? 'Einfach' : 'Easy'}</span>
        </label>
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" id="show-medium" ${mapMeta.communityFilter.includes('M') ? 'checked' : ''}/>
          <span>${req.lng == 'de' ? 'Mittel' : 'Medium'}</span>
        </label>
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer; margin-bottom: 0;">
          <input type="checkbox" id="show-hard" ${mapMeta.communityFilter.includes('H') ? 'checked' : ''}/>
          <span>${req.lng == 'de' ? 'Schwer' : 'Hard'}</span>
        </label>
      </div>

      <style>
        body.hide-easy .map-difficulty-easy { display: none; }
        body.hide-medium .map-difficulty-medium { display: none; }
        body.hide-hard .map-difficulty-hard { display: none; }
      </style>
      <script>
        (function() {
          function applyVisibility() {
            var easy = document.getElementById('show-easy');
            var medium = document.getElementById('show-medium');
            var hard = document.getElementById('show-hard');

            if (!easy || !medium || !hard) return;

            document.body.classList.toggle('hide-easy', !easy.checked);
            document.body.classList.toggle('hide-medium', !medium.checked);
            document.body.classList.toggle('hide-hard', !hard.checked);

            // Persist selection to server as a compact filter string like "E", "EM", "EMH"
            try {
              var filter = (easy.checked ? 'E' : '') + (medium.checked ? 'M' : '') + (hard.checked ? 'H' : '');
              fetch('/community-filter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ filter: filter })
              });
            } catch (e) {
              // Ignore network errors silently
            }
          }

          var easyCb = document.getElementById('show-easy');
          var mediumCb = document.getElementById('show-medium');
          var hardCb = document.getElementById('show-hard');

          if (easyCb) easyCb.addEventListener('change', applyVisibility);
          if (mediumCb) mediumCb.addEventListener('change', applyVisibility);
          if (hardCb) hardCb.addEventListener('change', applyVisibility);

          // Initialize based on current checkbox states
          applyVisibility();
        })();
      </script>
    `
  }

  return `
    <img style="position:absolute;left:110px;top:100px;z-index:-1;" src="/start_galaxy.png">
    <img style="position:absolute;left:1298px;top:903px;z-index:-1;" src="/passage_galaxy.png">
    <img style="position:absolute;left:650px;top:1640px;z-index:-1;" src="/passage_2_galaxy.png">
    <span style="position:absolute; left:680px; top:1680px;z-index:-2; font-size:8px;">&#87;&#65;&#76;&#68;&#79;</span>
    ${output}
  `
}

const prometheusUrl =
  'https://prometheus.arrrg.de/query?g0.expr=label_replace%28rate%28http_request_duration_seconds_bucket%7Ble%3D%220.05%22%7D%5B5m%5D%29%2C+%22bucket%22%2C+%220-0.05%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%220.1%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%220.05%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%220.05-0.1%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%220.2%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%220.1%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%220.1-0.2%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%220.4%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%220.2%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%220.2-0.4%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%220.8%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%220.4%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%220.4-0.8%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%221.6%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%220.8%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%220.8-1.6%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%223.5%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%221.6%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%221.6-3.5%22%2C+%22%22%2C+%22%22%29+or+label_replace%28%28rate%28http_request_duration_seconds_bucket%7Ble%3D%22%2BInf%22%7D%5B5m%5D%29+-+ignoring%28le%29+rate%28http_request_duration_seconds_bucket%7Ble%3D%223.5%22%7D%5B5m%5D%29%29%2C+%22bucket%22%2C+%223.5-Inf%22%2C+%22%22%2C+%22%22%29&g0.show_tree=0&g0.tab=graph&g0.range_input=6h&g0.res_type=auto&g0.res_density=medium&g0.display_mode=stacked&g0.show_exemplars=0'
