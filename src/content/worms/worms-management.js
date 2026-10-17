import { renderPage } from '../../helper/render-page.js'
import {
  getWormsTranslator,
  renderNavigation,
  toScriptJson,
  wormerMessages,
} from './worms-basic.js'
import { Sequelize } from 'sequelize'
import { safeRoute } from '../../helper/helper.js'

/**
 * @param {(key: string) => string} t
 * @returns {string}
 */
function getDefaultBotCode(t) {
  return `/**
 * ${t('worms.management.template.direction')}
 *
 * @param {number} dx         ${t('worms.management.template.width')}
 * @param {number} dy         ${t('worms.management.template.height')}
 * @param {number[][]} board  ${t('worms.management.template.board')}
 *                            -1 = ${t('worms.management.template.wall')}, 0 = ${t('worms.management.template.free')}, 1 = ${t('worms.management.template.red')}, 2 = ${t('worms.management.template.green')}
 * @param {number} x          ${t('worms.management.template.x')}
 * @param {number} y          ${t('worms.management.template.y')}
 * @param {number} dir        ${t('worms.management.template.directionValue')}
 * @param {number} oppX       ${t('worms.management.template.opponentX')}
 * @param {number} oppY       ${t('worms.management.template.opponentY')}
 *
 * @returns {number}          ${t('worms.management.template.returnValue')}
 */
function think(dx, dy, board, x, y, dir, oppX, oppY) {
  // ${t('worms.management.template.writeCode')}

  return dir
}
`
}

/**
 * True if the code is still exactly the template, in any language (or with the
 * raw template keys, from when they were missing). Then the editor may show the
 * template in the user's language. Anything the user wrote must stay untouched.
 * @param {import("../../data/types.js").App} App
 * @param {string} code
 * @returns {boolean}
 */
function isUntouchedTemplate(App, code) {
  /** @param {string} text */
  const normalize = (text) =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+$/gm, '')
      .trim()
  const templates = App.config.languages.map((lng) => {
    const i18n = App.i18n.get(lng)
    return getDefaultBotCode(i18n.t.bind(i18n))
  })
  templates.push(getDefaultBotCode((key) => key))
  return templates.map(normalize).includes(normalize(code))
}

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsManagement(App) {
  App.express.get(
    '/worms/your-bots',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      if (App.config.demos.includes(user.name)) {
        return renderPage(App, req, res, {
          page: 'worms-drafts',
          heading: 'Worms',
          backButton: false,
          content: `
            ${renderNavigation(3, req, App)}

            <p>${t('worms.management.demoInvite')}</p>
          `,
        })
      }

      const bots = await App.db.models.WormsBotDraft.findAll({
        where: { UserId: user.id },
        // order by lower case name
        order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']],
      })

      req.session.lastWormsTab = 'your-bots'
      renderPage(App, req, res, {
        page: 'worms-drafts',
        heading: 'Worms',
        backButton: false,
        props: {
          navigation: renderNavigation(3, req, App),
          drafts: bots.map((bot) => ({
            id: bot.id,
            name: bot.name,
            nameBase64: Buffer.from(bot.name, 'utf-8').toString('base64'),
            updatedAtFromNow: App.moment(bot.updatedAt)
              .locale(req.lng)
              .fromNow(),
          })),
          lastTestRun: req.session.lastTestRun,
        },
      })
    })
  )

  App.express.post(
    '/worms/drafts/create',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      if (App.config.demos.includes(req.user.name)) {
        res.status(403).send('forbidden')
        return
      }

      const name = req.body?.name ? req.body.name.toString() : ''

      if (!name || name.length > 32) {
        res.send(t('worms.management.invalidBotName'))
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { name, UserId: req.user.id },
        })) > 0
      ) {
        res.send(t('worms.management.botNameExists'))
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { UserId: req.user.id },
        })) >= 20
      ) {
        res.send(t('worms.management.botLimit'))
        return
      }

      await App.db.models.WormsBotDraft.create({
        name,
        UserId: req.user.id,
        code: getDefaultBotCode(t),
      })

      res.redirect('/worms/your-bots')
    })
  )

  App.express.post(
    '/worms/drafts/delete',
    safeRoute(async (req, res) => {
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN

      if (isNaN(id)) {
        res.sendStatus(400)
        return
      }

      await App.db.models.WormsBotDraft.destroy({
        where: { id, UserId: req.user.id },
      })

      res.sendStatus(200)
    })
  )

  App.express.post(
    '/worms/drafts/rename',
    safeRoute(async (req, res) => {
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN
      const name = req.body?.name ? req.body.name.toString() : ''

      if (isNaN(id) || !name || name.length > 32) {
        res.sendStatus(400)
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.sendStatus(404)
        return
      }

      bot.name = name
      await bot.save()
      res.sendStatus(200)
    })
  )

  App.express.get(
    '/worms/drafts/edit',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.query.id ? parseInt(req.query.id.toString()) : NaN

      if (isNaN(id)) {
        res.send(t('worms.management.invalidId'))
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.send(t('worms.management.botNotFound'))
        return
      }

      const initialCode = isUntouchedTemplate(App, bot.code)
        ? getDefaultBotCode(t)
        : bot.code

      renderPage(App, req, res, {
        page: 'worms-drafts-edit',
        heading: t('worms.management.editBot') + ' - ' + bot.name,
        backButton: false,
        outsideOfContainer: true,
        props: {
          botName: bot.name,
          botId: bot.id,
          initialCodeJson: toScriptJson(initialCode),
        },
      })
    })
  )

  App.express.post(
    '/worms/drafts/save',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN

      if (isNaN(id)) {
        res.send(t('worms.management.invalidId'))
        return
      }

      const code = req.body?.code ? req.body.code.toString() : ''

      // ensure code is not too long
      if (code.length > 100000) {
        res.send(t('worms.management.codeTooLong'))
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.send(t('worms.management.botNotFound'))
        return
      }

      bot.code = code
      await bot.save()
      res.send('ok')
    })
  )

  App.express.get(
    '/worms/your-bots/test-run',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      // 'me' instead of a bot id: the user plays this side with the keyboard
      const rHuman = req.query.rId == 'me'
      const gHuman = req.query.gId == 'me'
      const rId = req.query.rId ? parseInt(req.query.rId.toString()) : NaN
      const gId = req.query.gId ? parseInt(req.query.gId.toString()) : NaN

      if ((isNaN(rId) && !rHuman) || (isNaN(gId) && !gHuman)) {
        res.send(t('worms.management.missingIds'))
        return
      }

      // two humans: that's the 2-player mode
      if (rHuman && gHuman) {
        res.redirect('/worms/two-player')
        return
      }

      const rBot = rHuman
        ? null
        : await App.db.models.WormsBotDraft.findOne({
            where: { id: rId, UserId: req.user.id },
          })
      const gBot = gHuman
        ? null
        : await App.db.models.WormsBotDraft.findOne({
            where: { id: gId, UserId: req.user.id },
          })

      if ((!rBot && !rHuman) || (!gBot && !gHuman)) {
        res.send(t('worms.management.botNotFound'))
        return
      }

      req.session.lastTestRun = [rHuman ? 'me' : rId, gHuman ? 'me' : gId]

      const repeat = req.query.repeat
        ? parseInt(req.query.repeat.toString())
        : NaN

      const human = rHuman ? 'red' : gHuman ? 'green' : null

      if (!isNaN(repeat) && !human && rBot && gBot) {
        renderPage(App, req, res, {
          page: 'worms-test-run-headless',
          backButton: false,
          title: t('worms.testRun.title') + ' (headless)',
          props: {
            rBot,
            gBot,
            repeat,
            rCode: toScriptJson(rBot?.code ?? ''),
            gCode: toScriptJson(gBot?.code ?? ''),
          },
        })
        return
      }

      renderPage(App, req, res, {
        page: 'worms-test-run',
        backButton: false,
        title: t('worms.testRun.title'),
        props: {
          rBot,
          gBot,
          human,
          wormerMessages: wormerMessages(t),
          rCode: toScriptJson(rBot?.code ?? ''),
          gCode: toScriptJson(gBot?.code ?? ''),
        },
      })
    })
  )
}
