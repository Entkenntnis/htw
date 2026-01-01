import { renderPage } from '../helper/render-page.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupEnough(App) {
  App.express.get('/enough', async (req, res) => {
    const strings = {
      de: {
        back: 'zurück',
        intro:
          'Die interplanetare Bibliothek umfängt dich mit sanftem Neonlicht, während das leise Surren des Raumschiffs dich sanft an deine Reise erinnert. Deine Finger streifen den Buchrücken eines Holobuchs, auf dessen Einband das Wort <i>Enough</i> schimmert. Plötzlich verblassen die Chromwände hinter dir und ein leuchtender Text füllt dein Sichtfeld.',
      },
      en: {
        back: 'back',
        intro:
          'The interplanetary library envelops you in soft neon light, while the gentle hum of the spaceship gently reminds you of your journey. Your fingers brush the spine of a holobook, on whose cover the word <i>Enough</i> shimmers. Suddenly, the chrome walls behind you fade away and a glowing text fills your field of vision.',
      },
    }
    renderPage(App, req, res, {
      page: 'enough',
      heading: 'Enough',
      backButton: false,
      content: `
        <p><a href="/map">${strings[req.lng].back}</a></p>

        <p style="margin-bottom:48px; margin-top:36px; max-width: 65ch;">${strings[req.lng].intro}</p>

        <pre>|
|
|
|
|
|
|
v
|
|
|
|
|
|
v
|
|
|
|
|
|
v</pre>

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
            iframe.src = "https://entkenntnis.github.io/enough-german/${req.lng == 'de' ? '' : 'index-en.html'}";
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
            
            window.addEventListener(
              "message",
              (event) => {
                console.log(event)
                if (event.origin !== "https://entkenntnis.github.io") {
                  return;
                }
                if (typeof event.data !== "string") {
                  return;
                }
                const page = event.data.trim();
                fetch('/api/event?key=' + encodeURIComponent('enough_page_' + page))
              },
            );
          });
        </script>
      `,
    })
  })
}
