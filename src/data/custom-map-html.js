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

  const wwwmVisible = req.user.score >= 150 || showAll
  const mortalCoilVisible = req.user.score >= 200 || showAll
  const wormsVisible = req.user.score >= 250 || showAll
  const pleaseFixMeVisible = req.user.score >= 300 || showAll

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

  if (wwwmVisible) {
    output += `<a draggable="false" href="/wer-wird-wort-millionaer" style="position:absolute;left:1350px;top:122px;" class="text-reset text-decoration-none fade-in">
            <img draggable="false" src="/wwwm.png" style="width:78px;">
            ${wwwm_win ? `<div style="position: absolute; right: 0px; bottom: -9px; color: #fff; font-size:24px; padding:4px 7px; border-radius:12px; min-width:24px; text-align:center; box-shadow: 0 1px 0 rgba(0,0,0,0.3);">🏆</div>` : ''}
          </a>`
  }

  if (mortalCoilVisible) {
    output += `<a draggable="false" href="/mortal-coil" style="position:absolute;left:1550px;top:116px;" class="text-reset text-decoration-none fade-in">
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

  if (showMortalcoilLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1550px;top:126px;gap:8px;padding:8px 10px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">🔒 ab 200 Punkten</span>
      </div>`
  }

  if (showWormsLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1733px;top:126px;gap:8px;padding:8px 10px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">🔒 ab 250 Punkten</span>
      </div>`
  }

  if (showPleaseFixMeLocked) {
    output += `<div class="lang-picker fade-in text-reset text-decoration-none" style="position:absolute;left:1870px;top:126px;gap:8px;padding:8px 10px;z-index:1;">
        <span style="font-weight:600;color:#ddd;">🔒 ab 300 Punkten</span>
      </div>`
  }

  if (wormsVisible) {
    output += `<a draggable="false" href="/worms" style="position:absolute;left:1733px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>Worms</div>
            <img draggable="false" src="/worms.png" style="width:46px">
          </a>`
  }

  if (pleaseFixMeVisible) {
    output += `<a draggable="false" href="/please-fix-me" style="position:absolute;left:1870px;top:120px;" class="text-reset text-decoration-none fade-in">
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

  // TODO
  const logbookVisible = showAll // any story available
  const enoughVisible = showAll // story 4 available
  const musicVisible = showAll // story 5 available

  if (logbookVisible) {
    output += `<a draggable="false" href="/logbook" style="position:absolute;left:1188px;top:120px;" class="text-reset text-decoration-none fade-in">
            <div>${req.lng == 'de' ? 'Reisebericht' : 'Travel Log'}</div>
            <img draggable="false" src="/story/book.png" style="width:40px;margin-left:21px; margin-top: 3px; border-radius: 6px;">
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
