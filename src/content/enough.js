import { renderPage } from '../helper/render-page.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupEnough(App) {
  App.express.get('/enough', async (req, res) => {
    // rare race conditions are possible, but shouldn't be tragic
    let count = await App.storage.getItem('enough_counter_v0')
    if (!count) {
      count = '0'
    }
    await App.storage.setItem(
      'enough_counter_v0',
      (parseInt(count) + 1).toString()
    )

    let count2 = await App.storage.getItem('enough_long_counter_v0')

    renderPage(App, req, res, {
      page: 'enough',
      heading: 'Enough',
      backButton: false,
      content: `
        <p><a href="/map">zurück</a></p>

        <!-- Aufrufe: ${count} -->
        <!-- länger verweilt (5min): ${count2} -->

        <p style="margin-bottom:48px; margin-top:36px; max-width: 65ch; ">Du gehst in die Bibliothek von Hack The Web. Du nimmst ein Buch aus dem Regel und beginnst zu lesen.</p>

        <script>

          document.addEventListener("DOMContentLoaded", function() {
            // Finde das erste Element mit der Klasse "container"
            const container = document.querySelector(".container");

            // Erstelle das neue HTML-Element
            const iframeContainer = document.createElement("div");
            iframeContainer.style.position = "relative";
            iframeContainer.style.width = "100%";
            iframeContainer.style.paddingTop = "56.25%";

            const iframe = document.createElement("iframe");
            iframe.src = "https://entkenntnis.github.io/enough-german/";
            iframe.style.position = "absolute";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            iframe.allowFullscreen = true; // Vollbild erlauben

            // Füge das iframe in das Container-Div ein
            iframeContainer.appendChild(iframe);

            // Füge das neue Element nach dem "container"-Div ein
            if (container) {
              container.insertAdjacentElement("afterend", iframeContainer);
            }
          });

          window.addEventListener('load', () => {
            // Set a 5-minute delay (300,000 milliseconds)
            setTimeout(() => {
              // Make the GET request to /enough-longer-session, ignoring response and errors
              fetch('/enough-longer-session').catch(() => {
                // Intentionally ignore any errors
              });
            }, 300000); // 5 minutes in milliseconds
          });
        </script>
      `,
    })
  })

  App.express.get('/enough-longer-session', async (req, res) => {
    let count = await App.storage.getItem('enough_long_counter_v0')
    if (!count) {
      count = '0'
    }
    await App.storage.setItem(
      'enough_long_counter_v0',
      (parseInt(count) + 1).toString()
    )
    res.send('ok')
  })
}
