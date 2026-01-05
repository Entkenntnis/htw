import fs from 'fs'
import path from 'path'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withQuizData(App) {
  /** @type {number[]} */
  let quizIDs = []

  /** @type {{[key: number]: string}} */
  const titles = {}

  App.entry.add(async () => {
    // this is REALLY an ugly hack to import a CJS module in an ESM context
    // make a copy of .js to .cjs
    const srcPath = path.join(
      import.meta.dirname,
      '../../../public/quiz/quiz-data-de.js'
    )
    const destPath = path.join(
      import.meta.dirname,
      '../../../public/quiz/quiz-data-de.cjs'
    )
    fs.copyFileSync(srcPath, destPath)
    // append `module.exports = { QUIZ_DATA }` to the .cjs file
    fs.appendFileSync(destPath, '\nmodule.exports = { QUIZ_DATA }\n', 'utf-8')

    quizIDs = //@ts-ignore
      (await import('../../../public/quiz/quiz-data-de.cjs')).QUIZ_DATA.map(
        //@ts-ignore
        (q) => {
          titles[q.id] = q.de.topic
          return q.id
        }
      )
  })

  App.quizData = {
    hasQuizById(quizid) {
      return quizIDs.includes(quizid)
    },
    numberOfQuizzes() {
      return quizIDs.length
    },
    getQuizIds() {
      return quizIDs
    },
    getQuizTitleById(quizid) {
      return titles[quizid]
    },
  }
}
