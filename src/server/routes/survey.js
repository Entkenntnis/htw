import Sequelize from 'sequelize'
import escapeHtml from 'escape-html'
import { resolveFromDate } from '../../helper/date-range.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupSurvey(App) {
  App.express.get_async_fix('/survey', async (req, res) => {
    if (!req.user || req.user.name != 'editor') {
      res.send('Zugriff nur für Editor')
      return
    }

    const { fromDateStr, fromDateUTC } = resolveFromDate(req.query?.from, 7)

    const entries = (
      await App.db.models.KVPair.findAll({
        where: {
          key: {
            [Sequelize.Op.like]: 'survey_v2_%',
          },
          updatedAt: { [Sequelize.Op.gte]: fromDateUTC },
        },
        raw: true,
      })
    ).map((raw) => {
      const parts = raw.key.split('_')
      const id = parseInt(parts[2])
      const obj = JSON.parse(raw.value)
      return {
        userId: id,
        obj,
        ts: parseInt(parts[3]),
      }
    })

    entries.sort((a, b) => b.ts - a.ts)

    /** @type {{[key: number]: {name: string, score: number}}} */
    const userIndex = {}

    void (
      await App.db.models.User.findAll({
        where: { id: entries.map((e) => e.userId) },
        raw: true,
      })
    ).forEach((user) => {
      userIndex[user.id] = {
        name: user.name,
        score: user.score,
        //createdAt: user.createdAt,
      }
    })

    let ENT = entries.slice()
    ENT.reverse()

    const userIds = new Set()

    ENT = ENT.filter((entry) => {
      // if (userIds.has(entry.userId)) {
      //   return false
      // }
      userIds.add(entry.userId)
      return entry.obj
    })

    // // Helper function to calculate mean
    // /**
    //  * @param {number[]} values
    //  */
    // function calculateMean(values) {
    //   const sum = values.reduce((acc, val) => acc + val, 0)
    //   return (sum / values.length).toLocaleString('de-DE')
    // }

    // // Helper function to calculate frequency of each Likert scale (1-5)
    // /**
    //  * @param {number[]} values
    //  */
    // function calculateFrequency(values) {
    //   const frequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    //   values.forEach((val) => {
    //     frequency[/** @type {1 | 2 | 3 | 4 | 5} */ (val)]++
    //   })
    //   return frequency
    // }

    // // Extract values for interest, challenge, and fun
    // const interests = ENT.map((entry) => parseInt(entry.obj.interest))
    // const challenges = ENT.map((entry) => parseInt(entry.obj.challenge))
    // const funs = ENT.map((entry) => parseInt(entry.obj.fun))

    // // Calculate means
    // const meanInterest = calculateMean(interests)
    // const meanChallenge = calculateMean(challenges)
    // const meanFun = calculateMean(funs)

    // // Calculate frequencies
    // const freqInterest = calculateFrequency(interests)
    // const freqChallenge = calculateFrequency(challenges)
    // const freqFun = calculateFrequency(funs)

    // // Generate HTML output
    // const likert = `
    //   <table class="table" style="margin-top:24px;">
    //     <thead>
    //       <tr>
    //         <th>Aspekt</th>
    //         <th>Mittelwert</th>
    //         <th>Häufigkeit (1)</th>
    //         <th>Häufigkeit (2)</th>
    //         <th>Häufigkeit (3)</th>
    //         <th>Häufigkeit (4)</th>
    //         <th>Häufigkeit (5)</th>
    //       </tr>
    //     </thead>
    //     <tr>
    //       <td>Wie sehr hat Hack The Web dein Interesse am Thema Hacking und Technologie geweckt?</td>
    //       <td>${meanInterest}</td>
    //       <td>${freqInterest[1]}</td>
    //       <td>${freqInterest[2]}</td>
    //       <td>${freqInterest[3]}</td>
    //       <td>${freqInterest[4]}</td>
    //       <td>${freqInterest[5]}</td>
    //     </tr>
    //     <tr>
    //       <td>Wie herausfordernd fandest du die Aufgaben auf Hack The Web?</td>
    //       <td>${meanChallenge}</td>
    //       <td>${freqChallenge[1]}</td>
    //       <td>${freqChallenge[2]}</td>
    //       <td>${freqChallenge[3]}</td>
    //       <td>${freqChallenge[4]}</td>
    //       <td>${freqChallenge[5]}</td>
    //     </tr>
    //     <tr>
    //       <td>Wie viel Spaß hattest du beim Lösen der Aufgaben auf Hack The Web?</td>
    //       <td>${meanFun}</td>
    //       <td>${freqFun[1]}</td>
    //       <td>${freqFun[2]}</td>
    //       <td>${freqFun[3]}</td>
    //       <td>${freqFun[4]}</td>
    //       <td>${freqFun[5]}</td>
    //     </tr>
    //   </table>
    // `

    // /**
    //  * @param {{ obj: {learnmore: 'yes'|'no', morecreative: 'yes'|'no', easystart: 'yes'|'no', recommend: 'yes'|'no'}}[]} entries
    //  */
    // function generateBinaryAspectReport(entries) {
    //   // Initialisiere die Zähler für Ja/Nein für jeden Aspekt
    //   const counts = {
    //     learnmore: { yes: 0, no: 0 },
    //     morecreative: { yes: 0, no: 0 },
    //     easystart: { yes: 0, no: 0 },
    //     recommend: { yes: 0, no: 0 },
    //   }

    //   // Durchlaufe alle Einträge und zähle die Antworten
    //   entries.forEach((entry) => {
    //     const obj = entry.obj

    //     if (obj.learnmore === 'yes') counts.learnmore.yes++
    //     else counts.learnmore.no++

    //     if (obj.morecreative === 'yes') counts.morecreative.yes++
    //     else counts.morecreative.no++

    //     if (obj.easystart === 'yes') counts.easystart.yes++
    //     else counts.easystart.no++

    //     if (obj.recommend === 'yes') counts.recommend.yes++
    //     else counts.recommend.no++
    //   })

    //   // Generiere die HTML-Tabelle
    //   let html = `
    //     <table class="table" style="margin-top:36px;">
    //       <thead>
    //         <tr>
    //           <th>Aspekt</th>
    //           <th>Anzahl "Nein"</th>
    //           <th>Anzahl "Ja"</th>
    //         </tr>
    //       </thead>
    //       <tr>
    //         <td>Würdest du nach dieser Erfahrung mehr über Hacking und IT-Sicherheit lernen wollen?</td>
    //         <td>${counts.learnmore.no}</td>
    //         <td>${counts.learnmore.yes} (${Math.round((counts.learnmore.yes * 100) / ENT.length)}%)</td>
    //       </tr>
    //       <tr>
    //         <td>Hast du das Gefühl, dass du durch die Rätsel kreativer geworden bist oder deine Problemlösungsfähigkeiten verbessert hast?</td>
    //         <td>${counts.morecreative.no}</td>
    //         <td>${counts.morecreative.yes} (${Math.round((counts.morecreative.yes * 100) / ENT.length)}%)</td>
    //       </tr>
    //       <tr>
    //         <td>Hattest du das Gefühl, dass du die Aufgaben auch ohne Vorwissen lösen konntest?</td>
    //         <td>${counts.easystart.no}</td>
    //         <td>${counts.easystart.yes} (${Math.round((counts.easystart.yes * 100) / ENT.length)}%)</td>
    //       </tr>
    //       <tr>
    //         <td>Würdest du Hack The Web weiterempfehlen?</td>
    //         <td>${counts.recommend.no}</td>
    //         <td>${counts.recommend.yes} (${Math.round((counts.recommend.yes * 100) / ENT.length)}%)</td>
    //       </tr>
    //     </table>
    //   `

    //   return html
    // }

    // /**
    //  * @param {{obj: {good: string, improve: string}}[]} entries
    //  */
    // function generateFreitextReport(entries) {
    //   // Listen für die Freitext-Antworten
    //   /**
    //    * @type {string[]}
    //    */
    //   let goodTexts = []
    //   /**
    //    * @type {string[]}
    //    */
    //   let improveTexts = []

    //   // Durchlaufen der Einträge und Sammeln der Freitext-Antworten
    //   entries.forEach((entry) => {
    //     const obj = entry.obj

    //     // Sammeln der 'good' Antworten, falls vorhanden
    //     if (obj.good) {
    //       goodTexts.push(escapeHtml(obj.good))
    //     }

    //     // Sammeln der 'improve' Antworten, falls vorhanden
    //     if (obj.improve) {
    //       improveTexts.push(escapeHtml(obj.improve))
    //     }
    //   })

    //   goodTexts.reverse()
    //   improveTexts.reverse()

    //   // Generieren der HTML-Ausgabe für die Freitext-Antworten
    //   let html = `<div style="margin-top:36px;">`

    //   // Freitext-Antworten für 'good' hinzufügen, falls vorhanden
    //   if (goodTexts.length > 0) {
    //     html += `
    //       <h3>Freitext-Antworten "Gut":</h3>
    //       <ul>
    //         ${goodTexts.map((text) => `<li>${text}</li>`).join('')}
    //       </ul>
    //     `
    //   } else {
    //     html += `<h5>Keine Freitext-Antworten zu "Gut" vorhanden.</h5>`
    //   }

    //   // Freitext-Antworten für 'improve' hinzufügen, falls vorhanden
    //   if (improveTexts.length > 0) {
    //     html += `
    //       <h3>Freitext-Antworten "Verbesserung":</h3>
    //       <ul>
    //         ${improveTexts.map((text) => `<li>${text}</li>`).join('')}
    //       </ul>
    //     `
    //   } else {
    //     html += `<h5>Keine Freitext-Antworten zu "Verbesserung" vorhanden.</h5>`
    //   }

    //   html += `</div>`

    //   return html
    // }

    res.send(`
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <link href="/theme/darkly.min.css" rel="stylesheet">
        <title>Umfrage Auswertung</title>
      </head>
      <body>
        <div class="container-fluid">
          <div style="margin-top: 24px;"><a href="/">← Zurück</a></div>
          <h1 class="my-5">Umfrage Auswertung</h1>
          <h2>Auswertung</h2>
          <p>Zeitraum ab: ${fromDateStr} • Einträge: ${ENT.length}</p>

          <p>TOOD: Guter-Start-Indikator, Details, Filterung, Weiterempfehlung, ...</p>

          <pre style="height: 400px; background-color: gray; overflow-y: auto;">${JSON.stringify(ENT, null, 2)}</pre>

          <h2 style="margin-top:32px;">Einzelansicht</h2>
          <small style="margin-bottom: 48px; display: inline-block;">Was hat dir an Hack The Web besonders gut gefallen und warum? (max. 300 Zeichen) / Was würdest du an Hack The Web verbessern oder anders machen? (max. 300 Zeichen)</small>
          ${entries
            .map((entry) => {
              return `<p><span style="color: gray">${new Date(entry.ts).toLocaleString()} / ${escapeHtml(
                userIndex[entry.userId]?.name ?? '--- gelöscht ---'
              )} (${userIndex[entry.userId]?.score ?? -1}) / ${
                entry.obj.q1
              }_${entry.obj.q2}_${entry.obj.q3}_${entry.obj.q4}_${
                entry.obj.recommend
              }</span> &nbsp;&nbsp;•&nbsp;&nbsp; ${escapeHtml(
                entry.obj.good || '--'
              )} &nbsp;&nbsp;•&nbsp;&nbsp; ${escapeHtml(
                entry.obj.improve || '--'
              )}</p>`
            })
            .join('')}
          </div>
      </body>
    </html>
      `)
  })
}
