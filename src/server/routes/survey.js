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
      return entry.obj['survey-trial'] || entry.obj.version == '3'
    })

    const chartEntries = relevantEntriesV3

    const questionLabels = {
      q1: 'Ich habe hier etwas Neues übers Hacking gelernt.',
      q2: 'Ich hätte die Aufgaben lieber ohne die Geschichte drumherum gemacht.',
      q3: 'Die Aufgaben haben mir nicht genug Neues beigebracht.',
      q4: 'Ich finde es gut, dass es eine Geschichte gibt, die sich durch die Aufgaben zieht.',
      recommend:
        'Wie wahrscheinlich ist es auf einer Skala von 0 bis 10, dass du Hack The Web einer FreundIn weiterempfehlen würdest?',
    }

    const likertScaleValues = [1, 2, 3, 4]
    const recommendScaleValues = Array.from({ length: 11 }, (_, i) => i)

    /**
     * @param {{obj: {[key: string]: any}}[]} inputEntries
     * @param {string} key
     * @param {number[]} allowedValues
     * @param {(value: number) => number} [transform]
     */
    function buildScaleCounts(inputEntries, key, allowedValues, transform) {
      const counts = allowedValues.map(() => 0)
      inputEntries.forEach((entry) => {
        const value = parseInt(entry.obj[key], 10)
        if (Number.isNaN(value)) return
        const normalized = transform ? transform(value) : value
        const index = allowedValues.indexOf(normalized)
        if (index >= 0) counts[index]++
      })
      return counts
    }

    const likertColors = ['#d9534f', '#f0ad4e', '#a9f9a8', '#5cb85c']
    const likertColorsNegated = [...likertColors].reverse()
    const recommendColors = [
      '#d9534f',
      '#dd684a',
      '#e87d46',
      '#f1944a',
      '#f6ab50',
      '#f2c057',
      '#d3c85b',
      '#a7c763',
      '#7cc66b',
      '#5fbf6e',
      '#4caf50',
    ]

    const likertQuestions = [
      { key: 'q1', label: questionLabels.q1, invertColorScale: false },
      { key: 'q3', label: questionLabels.q3, invertColorScale: true },
      { key: 'q4', label: questionLabels.q4, invertColorScale: false },
      { key: 'q2', label: questionLabels.q2, invertColorScale: true },
    ]

    const likertQuestionCharts = likertQuestions.map((question) => {
      const counts = buildScaleCounts(
        chartEntries,
        question.key,
        likertScaleValues
      )
      return {
        key: question.key,
        label: question.label,
        counts,
        totalCount: counts.reduce((sum, count) => sum + count, 0),
        colors: question.invertColorScale ? likertColorsNegated : likertColors,
      }
    })

    const recommendCounts = buildScaleCounts(
      chartEntries,
      'recommend',
      recommendScaleValues
    )

    const chartPayload = {
      hasData: chartEntries.length > 0,
      chartEntryCount: chartEntries.length,
      likertLabels: likertScaleValues.map(String),
      recommendLabels: recommendScaleValues.map(String),
      recommendColors,
      likertQuestionCharts,
      recommendQuestion: {
        label: questionLabels.recommend,
        counts: recommendCounts,
      },
    }

    renderPage(App, req, res, {
      page: 'survey',
      heading: 'Umfrage Auswertung',
      content: `
        <p>Zeitraum ab: ${fromDateStr} • Einträge: ${chronoEntries.length} / abzüglich Duplikate: ${skipDup}, Low Effort: ${skipNoise}</p>

        <h2 style="margin-top: 32px;">Grafische Auswertung</h2>
        <details><summary>Anzeigen (${chartPayload.chartEntryCount} Einträge)</summary>
        ${
          chartPayload.hasData
            ? `
          <div style="max-width: 960px; margin-bottom: 20px; height: 170px;">
            <canvas id="survey-chart-q1"></canvas>
          </div>
          <div style="max-width: 960px; margin-bottom: 100px; height: 170px;">
            <canvas id="survey-chart-q3"></canvas>
          </div>
          <div style="max-width: 960px; margin-bottom: 20px; height: 170px;">
            <canvas id="survey-chart-q4"></canvas>
          </div>
          <div style="max-width: 960px; margin-bottom: 100px; height: 170px;">
            <canvas id="survey-chart-q2"></canvas>
          </div>
          <div style="max-width: 960px; margin-bottom: 28px;">
            <canvas id="survey-chart-recommend"></canvas>
          </div>

          <script src="/lib/chart.js"></script>
          <script>
            ;(() => {
              const payload = ${JSON.stringify(chartPayload)}
              if (!payload.hasData || typeof Chart === 'undefined') return

              const likertPercentageLabelsPlugin = {
                id: 'likertPercentageLabels',
                afterDatasetsDraw(chart, _args, options) {
                  if (options && options.enabled === false) return
                  const ctx = chart.ctx
                  ctx.save()
                  chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex)
                    if (meta.hidden) return
                    meta.data.forEach((bar, dataIndex) => {
                      const value = Number(dataset.data[dataIndex])
                      if (!Number.isFinite(value) || value <= 0) return
                      const barX = Number(bar.x)
                      const barBase = Number(bar.base)
                      const barY = Number(bar.y)
                      const centerX =
                        Number.isFinite(barX) && Number.isFinite(barBase)
                          ? barBase + (barX - barBase) / 2
                          : bar.tooltipPosition().x
                      const centerY = Number.isFinite(barY)
                        ? barY
                        : bar.tooltipPosition().y
                      ctx.fillStyle = options?.color ?? '#111111'
                      ctx.font = options?.font ?? '11px sans-serif'
                      ctx.textAlign = 'center'
                      ctx.textBaseline = 'middle'
                      ctx.fillText(Math.round(value) + '%', centerX, centerY)
                    })
                  })
                  ctx.restore()
                },
              }

              function createLikertChart(canvasId, question) {
                const canvas = document.getElementById(canvasId)
                if (!canvas) return
                const totalCount =
                  Number(question.totalCount) ||
                  question.counts.reduce((sum, count) => sum + count, 0)
                const datasets = question.counts.map((count, index) => ({
                  label: payload.likertLabels[index],
                  data: [totalCount > 0 ? (count / totalCount) * 100 : 0],
                  backgroundColor: question.colors[index],
                  borderColor: '#111111',
                  borderWidth: 1,
                  stack: 'likert',
                  rawCount: count,
                }))

                new Chart(canvas, {
                  plugins: [likertPercentageLabelsPlugin],
                  type: 'bar',
                  data: {
                    labels: ['Antworten'],
                    datasets,
                  },
                  options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                      title: {
                        display: true,
                        text: question.label,
                        font: { size: 16 },
                      },
                      likertPercentageLabels: {
                        color: '#111111',
                      },
                      tooltip: {
                        callbacks: {
                          label(context) {
                            const percentage = Math.round(context.parsed.x)
                            const rawCount =
                              Number(context.dataset.rawCount) || 0
                            return (
                              context.dataset.label +
                              ': ' +
                              percentage +
                              '% (' +
                              rawCount +
                              ')'
                            )
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        stacked: true,
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: {
                          callback(value) {
                            return value + '%'
                          },
                        },
                        title: { display: true, text: 'Anteil Antworten (%)' },
                      },
                      y: {
                        stacked: true,
                        ticks: { display: false },
                      },
                    },
                  },
                })
              }

              createLikertChart('survey-chart-q1', payload.likertQuestionCharts[0])
              createLikertChart('survey-chart-q3', payload.likertQuestionCharts[1])
              createLikertChart('survey-chart-q4', payload.likertQuestionCharts[2])
              createLikertChart('survey-chart-q2', payload.likertQuestionCharts[3])

              const recommendCanvas = document.getElementById('survey-chart-recommend')
              if (recommendCanvas) {
                new Chart(recommendCanvas, {
                  type: 'bar',
                  data: {
                    labels: payload.recommendLabels,
                    datasets: [
                      {
                        label: 'Anzahl',
                        data: payload.recommendQuestion.counts,
                        backgroundColor: payload.recommendColors,
                        borderColor: '#111111',
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: {
                        display: true,
                        text: payload.recommendQuestion.label,
                        font: { size: 16 },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: { precision: 0 },
                        title: { display: true, text: 'Anzahl Antworten' },
                      },
                      y: {
                        title: { display: true, text: 'Skalenwert' },
                      },
                    },
                  },
                })
              }
            })()
          </script>
        `
            : '<p>Keine auswertbaren Umfrageeinträge für die grafische Auswertung gefunden.</p>'
        }
        </details>

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
