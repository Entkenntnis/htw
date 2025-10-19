/**
 * Helper around setting up everything
 *
 * @param {import("../data/types.js").App} App
 * @param {import("express").Request} req
 * @param {string} templateName
 */
export async function renderTemplate(App, req, templateName) {
  return await new Promise((res) => {
    App.express.render(
      // not sure why I need to go up two levels here
      '../../content/views/' + templateName,
      { locale: req.lng },
      (err, html) => {
        if (err) return res('<p>Error: ' + err + '</p>')
        res(html)
      }
    )
  })
}
