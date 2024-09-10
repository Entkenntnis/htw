const Sequelize = require('sequelize')
const escapeHtml = require('escape-html')

const cutoff = '2024-09-10'

module.exports = (App) => {
  App.express.get('/survey', async (req, res) => {
    if (!req.user || !req.user.name == 'editor')
      return res.send('Zugriff nur für Editor')

    const entries = (
      await App.db.models.KVPair.findAll({
        where: {
          key: {
            [Sequelize.Op.like]: 'survey_v1_%',
          },
          updatedAt: {
            [Sequelize.Op.gte]: new Date(cutoff),
          },
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
        createdAt: user.createdAt,
      }
    })

    let ENT = entries.slice()
    ENT.reverse()

    const userIds = new Set()

    ENT = ENT.filter((entry) => {
      if (userIds.has(entry.userId)) {
        return false
      }
      userIds.add(entry.userId)
      return entry.obj && entry.obj.agree == 'yes'
    })

    // Helper function to calculate mean
    function calculateMean(values) {
      const sum = values.reduce((acc, val) => acc + val, 0)
      return (sum / values.length).toLocaleString()
    }

    // Helper function to calculate frequency of each Likert scale (1-5)
    function calculateFrequency(values) {
      const frequency = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      values.forEach((val) => {
        frequency[val]++
      })
      return frequency
    }

    // Extract values for interest, challenge, and fun
    const interests = ENT.map((entry) => parseInt(entry.obj.interest))
    const challenges = ENT.map((entry) => parseInt(entry.obj.challenge))
    const funs = ENT.map((entry) => parseInt(entry.obj.fun))

    // Calculate means
    const meanInterest = calculateMean(interests)
    const meanChallenge = calculateMean(challenges)
    const meanFun = calculateMean(funs)

    // Calculate frequencies
    const freqInterest = calculateFrequency(interests)
    const freqChallenge = calculateFrequency(challenges)
    const freqFun = calculateFrequency(funs)

    // Generate HTML output
    const likert = `
      <table class="table" style="margin-top:24px;">
        <thead>
          <tr>
            <th>Aspekt</th>
            <th>Mittelwert</th>
            <th>Häufigkeit (1)</th>
            <th>Häufigkeit (2)</th>
            <th>Häufigkeit (3)</th>
            <th>Häufigkeit (4)</th>
            <th>Häufigkeit (5)</th>
          </tr>
        </thead>
        <tr>
          <td>Interesse</td>
          <td>${meanInterest}</td>
          <td>${freqInterest[1]}</td>
          <td>${freqInterest[2]}</td>
          <td>${freqInterest[3]}</td>
          <td>${freqInterest[4]}</td>
          <td>${freqInterest[5]}</td>
        </tr>
        <tr>
          <td>Herausforderung</td>
          <td>${meanChallenge}</td>
          <td>${freqChallenge[1]}</td>
          <td>${freqChallenge[2]}</td>
          <td>${freqChallenge[3]}</td>
          <td>${freqChallenge[4]}</td>
          <td>${freqChallenge[5]}</td>
        </tr>
        <tr>
          <td>Spaß</td>
          <td>${meanFun}</td>
          <td>${freqFun[1]}</td>
          <td>${freqFun[2]}</td>
          <td>${freqFun[3]}</td>
          <td>${freqFun[4]}</td>
          <td>${freqFun[5]}</td>
        </tr>
      </table>
    `

    function generateBinaryAspectReport(entries) {
      // Initialisiere die Zähler für Ja/Nein für jeden Aspekt
      const counts = {
        learnmore: { yes: 0, no: 0 },
        morecreative: { yes: 0, no: 0 },
        easystart: { yes: 0, no: 0 },
        recommend: { yes: 0, no: 0 },
      }

      // Durchlaufe alle Einträge und zähle die Antworten
      entries.forEach((entry) => {
        const obj = entry.obj

        if (obj.learnmore === 'yes') counts.learnmore.yes++
        else counts.learnmore.no++

        if (obj.morecreative === 'yes') counts.morecreative.yes++
        else counts.morecreative.no++

        if (obj.easystart === 'yes') counts.easystart.yes++
        else counts.easystart.no++

        if (obj.recommend === 'yes') counts.recommend.yes++
        else counts.recommend.no++
      })

      // Generiere die HTML-Tabelle
      let html = `
        <table class="table" style="margin-top:36px;">
          <thead>
            <tr>
              <th>Aspekt</th>
              <th>Anzahl "Nein"</th>
              <th>Anzahl "Ja"</th>
            </tr>
          </thead>
          <tr>
            <td>Mehr Lernen von Hacking</td>
            <td>${counts.learnmore.no}</td>
            <td>${counts.learnmore.yes}</td>
          </tr>
          <tr>
            <td>Kreativer</td>
            <td>${counts.morecreative.no}</td>
            <td>${counts.morecreative.yes}</td>
          </tr>
          <tr>
            <td>Start ohne Vorwissen möglich</td>
            <td>${counts.easystart.no}</td>
            <td>${counts.easystart.yes}</td>
          </tr>
          <tr>
            <td>Weiterempfehlung</td>
            <td>${counts.recommend.no}</td>
            <td>${counts.recommend.yes}</td>
          </tr>
        </table>
      `

      return html
    }

    function generateFreitextReport(entries) {
      // Listen für die Freitext-Antworten
      let goodTexts = []
      let improveTexts = []

      // Durchlaufen der Einträge und Sammeln der Freitext-Antworten
      entries.forEach((entry) => {
        const obj = entry.obj

        // Sammeln der 'good' Antworten, falls vorhanden
        if (obj.good) {
          goodTexts.push(escapeHtml(obj.good))
        }

        // Sammeln der 'improve' Antworten, falls vorhanden
        if (obj.improve) {
          improveTexts.push(escapeHtml(obj.improve))
        }
      })

      // Generieren der HTML-Ausgabe für die Freitext-Antworten
      let html = `<div style="margin-top:36px;">`

      // Freitext-Antworten für 'good' hinzufügen, falls vorhanden
      if (goodTexts.length > 0) {
        html += `
          <h3>Freitext-Antworten "Gut":</h3>
          <ul>
            ${goodTexts.map((text) => `<li>${text}</li>`).join('')}
          </ul>
        `
      } else {
        html += `<h5>Keine Freitext-Antworten zu "Gut" vorhanden.</h5>`
      }

      // Freitext-Antworten für 'improve' hinzufügen, falls vorhanden
      if (improveTexts.length > 0) {
        html += `
          <h3>Freitext-Antworten "Verbesserung":</h3>
          <ul>
            ${improveTexts.map((text) => `<li>${text}</li>`).join('')}
          </ul>
        `
      } else {
        html += `<h5>Keine Freitext-Antworten zu "Verbesserung" vorhanden.</h5>`
      }

      html += `</div>`

      return html
    }

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
          <h1 class="my-5">Umfrage Auswertung</h1>
          <h2>Auswertung</h2>
          <p>Einträge: ${ENT.length}</p>
          ${likert}
          ${generateBinaryAspectReport(ENT)}
          ${generateFreitextReport(ENT)}
          <h2 style="margin-top:32px;">Einzelansicht</h2>
          ${entries
            .map((entry) => {
              return `<p>${new Date(
                parseInt(entry.ts)
              ).toLocaleString()} / ${escapeHtml(
                userIndex[entry.userId].name
              )} (${userIndex[entry.userId].score})<br />Interesse: ${
                entry.obj.interest
              }, Herausforderung: ${entry.obj.challenge}, Spaß: ${
                entry.obj.fun
              }, mehr Lernen: ${entry.obj.learnmore}, kreativer: ${
                entry.obj.morecreative
              }, ohne Vorwissen: ${entry.obj.easystart}, empfehlen: ${
                entry.obj.recommend
              }, positiv: &quot;${escapeHtml(
                entry.obj.good || '--'
              )}&quot;, negativ: &quot;${escapeHtml(
                entry.obj.improve || '--'
              )}&quot;, Zustimmung: <strong>${entry.obj.agree}</strong></p>`
            })
            .join('')}
          </div>
      </body>
    </html>
      `)
  })
}
