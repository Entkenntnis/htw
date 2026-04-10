import Sequelize from 'sequelize'
import escapeHtml from 'escape-html'
import { resolveFromDate } from '../../helper/date-range.js'
import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupSurvey(App) {
  App.express.get_async_fix('/survey', async (req, res) => {
    if (!req.user || !App.config.editors.includes(req.user.name)) {
      res.send('Zugriff nur für Editor')
      return
    }

    const { fromDateStr, fromDateUTC } = resolveFromDate(req.query?.from, 7)

    const entries = (
      await App.db.models.KVPair.findAll({
        where: {
          key: {
            [Sequelize.Op.or]: [{ [Sequelize.Op.like]: 'survey_v2_%' }],
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
        version: parts[1],
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

    let chronoEntries = entries.slice()
    chronoEntries.reverse()

    // const analysisEntries = chronoEntries.filter(
    //   (entry) => entry.version === 'v2'
    // )
    // const v3Entries = chronoEntries.filter((entry) => entry.version === 'v3')

    const userIds = new Set()

    let skipDup = 0
    let skipNoise = 0

    const relevantEnt = chronoEntries.filter((entry) => {
      if (userIds.has(entry.userId)) {
        skipDup++
        return false
      }
      if (
        entry.obj.q1 === entry.obj.q2 &&
        entry.obj.q2 === entry.obj.q3 &&
        entry.obj.q3 === entry.obj.q4
      ) {
        skipNoise++
        return false
      }
      userIds.add(entry.userId)
      return entry.obj
    })

    const relevantEntriesV3 = relevantEnt.filter((entry) => {
      // TOOD: also allow version = 3 submissions
      return entry.obj['survey-trial']
    })

    /*
    
    TODO: please create graphs entry.obj
    q1 to q4 is 1, 2, 3, 4
    recommend is 0 - 10

    I want horizontal bar charts that show the values colour coded with labels
    Use /lib/chart.js

    The questions are

    q1: 'Ich habe hier etwas Neues übers Hacking gelernt.'
    q2: 'Ich hätte die Aufgaben lieber ohne die Geschichte drumherum gemacht.'
    q3: 'Die Aufgaben haben mir nicht genug Neues beigebracht.'
    q4: 'Ich finde es gut, dass es eine Geschichte gibt, die sich durch die Aufgaben zieht.'
    recommend: Wie wahrscheinlich ist es auf einer Skala von 0 bis 10, dass du Hack The Web einer FreundIn weiterempfehlen würdest?

    Show questions in UI as well, q1 and q3 (negated) and q2 (negated) and q4 are related, group them






    */

    // OLD STUFF
    // let sumQ1 = 0
    // let sumQ2 = 0
    // let sumQ3 = 0
    // let sumQ4 = 0

    // let recommendYes = 0
    // let recommendNo = 0
    // let de = 0
    // let en = 0

    // relevantEnt.forEach((entry) => {
    //   sumQ1 += parseInt(entry.obj.q1)
    //   sumQ2 += 5 - parseInt(entry.obj.q2)
    //   sumQ3 += parseInt(entry.obj.q3)
    //   sumQ4 += 5 - parseInt(entry.obj.q4)
    //   if (entry.obj.recommend === 'yes') recommendYes++
    //   if (entry.obj.recommend === 'no') recommendNo++
    //   if (entry.obj.lng === 'de') de++
    //   if (entry.obj.lng === 'en') en++
    // })

    // /**
    //  * @param {number} value
    //  */
    // function convertToPercentage(value) {
    //   // 1 -> -100%, 4 -> + 100%
    //   return ((value - 1) / 3) * 200 - 100
    // }

    // const avgQ1 = convertToPercentage(sumQ1 / relevantEnt.length)
    // const avgQ2 = convertToPercentage(sumQ2 / relevantEnt.length)
    // const avgQ3 = convertToPercentage(sumQ3 / relevantEnt.length)
    // const avgQ4 = convertToPercentage(sumQ4 / relevantEnt.length)

    // const overall = (avgQ1 + avgQ2 + avgQ3 + avgQ4) / 4

    // <p style="margin-top: 48px">1. Der Einstieg bei Hack The Web ist klar und verständlich: <strong>${Math.round(avgQ1)}%</strong></p>

    //     <p>2. Am Anfang fühlte ich mich etwas verloren und wusste nicht genau, was von mir erwartet wird [NEG]: <strong>${Math.round(avgQ2)}%</strong></p>

    //     <p>3. Die ersten Aufgaben bieten einen motivierenden und passenden Einstieg in das Thema Hacking: <strong>${Math.round(avgQ3)}%</strong></p>

    //     <p>4. Ich finde die ersten Aufgaben zu langsam oder langweilig oder direkt zu schwierig [NEG]: <strong>${Math.round(avgQ4)}%</strong></p>

    //     <p><strong>→ Guter-Start-Faktor: ${Math.round(overall)}%</strong></p>

    // <p style="margin-top: 32px">Sprache: DE: ${de} / EN: ${en}</p>
    //     <p>Würdest du Hack The Web deinen Freunden weiterempfehlen: Ja: ${recommendYes} (<strong>${Math.round(
    //       (recommendYes * 100) / (recommendYes + recommendNo)
    //     )}%</strong>) / Nein: ${recommendNo}</p>

    renderPage(App, req, res, {
      page: 'survey',
      heading: 'Umfrage Auswertung',
      content: `
        <p>Zeitraum ab: ${fromDateStr} • Einträge: ${chronoEntries.length} / abzüglich Duplikate: ${skipDup}, Low Effort: ${skipNoise}</p>

        <h2 style="margin-top:32px;">Einzelansicht</h2>
        <small style="margin-bottom: 48px; display: inline-block;">Was hat dir an Hack The Web besonders gut gefallen und warum? (max. 300 Zeichen) / Was würdest du an Hack The Web verbessern oder anders machen? (max. 300 Zeichen)</small>
        ${entries
          .map((entry) => {
            return `<p><span style="color: gray">${new Date(entry.ts).toLocaleString('de-DE')} /<span style="user-select: none;"> </span>${escapeHtml(
              userIndex[entry.userId]?.name ?? '--- gelöscht ---'
            )}<span style="user-select: none;"> </span>(${userIndex[entry.userId]?.score ?? -1}) / ${
              entry.obj.q1
            }_${entry.obj.q2}_${entry.obj.q3}_${entry.obj.q4}_${
              entry.obj.recommend
            }</span><span style="display: inline-block; margin-left: 24px; margin-right: 24px;">•</span>${escapeHtml(
              entry.obj.good || '--'
            )}<span style="display: inline-block; margin-left: 24px; margin-right: 24px;">•</span>${escapeHtml(
              entry.obj.improve || '--'
            )}${entry.obj['survey-trial'] == 1 ? ' <span style="margin-left: 24px; border: 1px solid lime">&nbsp;trial&nbsp;</span>' : ''}</p>`
          })
          .join('')}
        </div>
      `,
    })
  })
}
