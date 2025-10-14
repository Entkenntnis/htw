import { secrets } from '../helper/secrets-loader.js'

/** @type {import('../data/types.js').HtwChallenge[]} */
export const communityChallenges2 = [
  {
    id: 344,
    pos: { x: 2080, y: 90 },
    title: { de: 'Discord IV', en: 'Discord IV' },
    date: '2025-10-10',
    deps: [335],
    noScore: true,
    author: 'Simonselles',
    html: {
      de: `
        <p>Emoji IDs verstehst du ... Die Antwort auf diese Aufgabe ist die ID der ersten menschlichen Textnachricht auf unserem Server.</p>
      `,
      en: `
        <p>You understand emoji ids... The answer to this task is the id of the first human text message on our server.</p>
      `,
    },
    solution: secrets('chal_344'),
  },

  {
    id: 345,
    pos: { x: 2200, y: 105 },
    title: { de: 'Discord V', en: 'Discord V' },
    date: '2025-10-13',
    deps: [335],
    releaseTs: new Date(
      'Sat Oct 12 2025 23:55:00 GMT+0200 (Mitteleuropäische Sommerzeit)'
    ).getTime(),
    noScore: true,
    author: 'CARLO',
    html: {
      de: `
        <p>Eine Person auf dem Server liebt das Wort "damn" und verwendet es mehr als alle anderen - wie oft hat diese Person das Wort bis zur Veröffentlichung (2025-10-13) dieser Aufgabe auf dem Server verwendet?</p>
       
      `,
      en: `
        <p>A person on the server loves the word "damn" and uses it more than everyone else - how many times has this person used the word on the server up until the release of this challenge (2025-10-13)?</p>
      `,
    },
    solution: secrets('chal_345'),
  },

  {
    id: 346,
    pos: { x: 2080, y: 755 },
    title: { de: 'Tag 1 🍬', en: 'Day 1 🍬' },
    date: '2025-10-25',
    deps: [300],
    releaseTs: new Date(
      'Sat Oct 25 2025 18:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    html: {
      de: `
        ${'Genieße dein letztes Halloween! Die Antwort lautet RIP.'
          .split('')
          .map(
            (letter) =>
              `<p style="font-size:40px; padding-left: ${Math.round(Math.random() * 100)}px; color: #222;">${
                letter == ' ' ? '&nbsp;' : letter
              }</p>`
          )
          .join('')}
       
      `,
      en: `
        ${'Enjoy your last Halloween! The answer is RIP.'
          .split('')
          .map(
            (letter) =>
              `<p style="font-size:40px; padding-left: ${Math.round(Math.random() * 100)}px; color: #222;">${
                letter == ' ' ? '&nbsp;' : letter
              }</p>`
          )
          .join('')}
      `,
    },
    solution: secrets('chal_346'),
  },

  {
    id: 347,
    pos: { x: 2300, y: 865 },
    title: { de: 'Tag 2 🕸️', en: 'Day 2 🕸️' },
    date: '2025-10-26',
    deps: [346],
    releaseTs: new Date(
      'Sun Oct 26 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    render: () => {
      return {
        de: `
        <p>TODO</p>
       
      `,
        en: `
        <p>TODO</p>
      `,
      }
    },
    solution: secrets('chal_347'),
  },

  {
    id: 348,
    pos: { x: 2230, y: 985 },
    title: { de: 'Tag 3 🫣', en: 'Day 3 🫣' },
    date: '2025-10-27',
    deps: [346],
    releaseTs: new Date(
      'Mon Oct 27 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    render: () => {
      const deko = `<pre style="line-height: 1.2">
                                  ;::;;::;,
                            ;::;;::;;,
                           ;;:::;;::;;,
           .vnmmnv%vnmnv%,.;;;:::;;::;;,  .,vnmnv%vnmnv,
        vnmmmnv%vnmmmnv%vnmmnv%;;;;;;;%nmmmnv%vnmmnv%vnmmnv
      vnmmnv%vnmmmmmnv%vnmmmmmnv%;:;%nmmmmmmnv%vnmmmnv%vnmmmnv
     vnmmnv%vnmmmmmnv%vnmmmmmmmmnv%vnmmmmmmmmnv%vnmmmnv%vnmmmnv
    vnmmnv%vnmmmmmnv%vnmmmmmmmmnv%vnmmmmmmmmmmnv%vnmmmnv%vnmmmnv
   vnmmnv%vnmmmmmnv%vnmm;mmmmmmnv%vnmmmmmmmm;mmnv%vnmmmnv%vnmmmnv,
  vnmmnv%vnmmmmmnv%vnmm;' mmmmmnv%vnmmmmmmm;' mmnv%vnmmmnv%vnmmmnv
  vnmmnv%vnmmmmmnv%vn;;    mmmmnv%vnmmmmmm;;    nv%vnmmmmnv%vnmmmnv
 vnmmnv%vnmmmmmmnv%v;;      mmmnv%vnmmmmm;;      v%vnmmmmmnv%vnmmmnv
 vnmmnv%vnmmmmmmnv%vnmmmmmmmmm;;       mmmmmmmmmnv%vnmmmmmmnv%vnmmmnv
 vnmmnv%vnmmmmmmnv%vnmmmmmmmmmm;;     mmmmmmmmmmnv%vnmmmmmmnv%vnmmmnv
 vnmmnv%vnmmmmm nv%vnmmmmmmmmmmnv;, mmmmmmmmmmmmnv%vn;mmmmmnv%vnmmmnv
 vnmmnv%vnmmmmm  nv%vnmmmmmmmmmnv%;nmmmmmmmmmmmnv%vn; mmmmmnv%vnmmmnv
 \`vnmmnv%vnmmmm,  v%vnmmmmmmmmmmnv%vnmmmmmmmmmmnv%v;  mmmmnv%vnnmmnv'
  vnmmnv%vnmmmm;,   %vnmmmmmmmmmnv%vnmmmmmmmmmnv%;'   mmmnv%vnmmmmnv
   vnmmnv%vnmmmm;;,   nmmm;'              mmmm;;'    mmmnv%vnmmmmnv'
   \`vnmmnv%vnmmmmm;;,.         mmnv%v;,            mmmmnv%vnmmmmnv'
    \`vnmmnv%vnmmmmmmnv%vnmmmmmmmmnv%vnmmmmmmnv%vnmmmmmnv%vnmmmmnv'
      \`vnmvn%vnmmmmmmnv%vnmmmmmmmnv%vnmmmmmnv%vnmmmmmnv%vnmmmnv'
          \`vn%vnmmmmmmn%:%vnmnmmmmnv%vnmmmnv%:%vnmmnv%vnmnv'

</pre>
      `
      return {
        de: `
        ${deko}

        <p><a href="/chals/348.py">Python Script</a></p>

        <p>Dieses Python-Script gibt dir die Antwort. Es ist nur etwas langsam. (Das Skript ist harmlos und enthält keinen Virus, versprochen! - die Aufgabe lässt sich aber auch lösen, ohne das Script auszuführen)</p>

       
      `,
        en: `
        ${deko}
        
        <p><a href="/chals/348.py">Python script</a></p>

        <p>This Python script gives you the answer. It's just a bit slow. (The script is harmless and contains no virus, promise! — but you can also solve the challenge without running the script.)</p>

      `,
      }
    },
    solution: secrets('chal_348'),
  },

  {
    id: 349,
    pos: { x: 2490, y: 815 },
    title: { de: 'Tag 4 😱', en: 'Day 4 😱' },
    date: '2025-10-28',
    deps: [347],
    releaseTs: new Date(
      'Tue Oct 28 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    html: {
      de: `
        <p>Ein Schrei schallt durch die Nacht. Was der Schrei wohl bedeutet?</p>
      
        <p>A̱ẢÁ AÂĀȀÅȂĀ ÂAA̧A̰ A̱ÁȂ A̱Ä ÃÄA̧A̰Ā, ĂAÄĀÁĀ ȦĂÄĀ. ĂÁA̧ẠÁȂÁÃ, A̮ȂẢÃA̧A̰ÁÃ ȦĂÄĀ. A̱ÁẢÂ ȦĂÄĀ. ȦĂÄĀ. ȦĂÄĀ. ȦĂÄĀ.</p>
       
      `,
      en: `
        <p>A scream echoes through the night. What could that scream mean?</p>
      
        <p>ĀA̰Á AÂÃȀÁȂ A̦ÅÄ AȂÁ ĂÅÅẠẢÂA̋ A̮ÅȂ ẢÃ ȦĂÅÅA̱. A̱ÁĂẢA̧ẢÅÄÃ, A̮ȂÁÃA̰ ȦĂÅÅA̱. A̦ÅÄȂ ȦĂÅÅA̱. ȦĂÅÅA̱. ȦĂÅÅA̱. ȦĂÅÅA̱.</p>
      `,
    },
    solution: secrets('chal_349').split(','),
  },

  {
    id: 350,
    pos: { x: 2280, y: 1135 },
    title: { de: 'Tag 5 ☠️', en: 'Day 5 ☠️' },
    date: '2025-10-29',
    deps: [348],
    releaseTs: new Date(
      'Wed Oct 29 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    html: {
      de: `
        <p>Der arme Geist hat 6 Einschusslöcher. Vielleicht wollte er dir was sagen? Schaue genau auf den Rot-Ton:</p>

        <p><img src="/chals/350.png"></p>
       
      `,
      en: `
        <p>The poor ghost has 6 bullet holes. Maybe it was trying to tell you something? Look closely at the shade of red:</p>

        <p><img src="/chals/350.png"></p>
      `,
    },
    solution: secrets('chal_350'),
  },

  {
    id: 351,
    pos: { x: 2430, y: 1035 },
    title: { de: 'Tag 6 ⚰️', en: 'Day 6 ⚰️' },
    date: '2025-10-30',
    deps: [347, 348],
    releaseTs: new Date(
      'Thu Oct 30 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    enableFeedback: true,
    author: 'Anna',
    html: {
      de: `
        <p style="overflow-wrap: break-word; color: red; font-size: 200px;">SW4gZGVyIGxldHp0ZW4gTmFjaHQgaGFzdCBkdSB2b24gU+RyZ2VuIGdldHLkdW10LCBhdWYgZWluZW0gZGF2b24gc3RhbmQgc29nYXIgZGVpbiBOYW1lLiBFaW4gV29ydCBnZWh0IGRpciBuaWNodCBhdXMgZGVtIFNpbm4uIEJlaW4uIEJlaW4uIEJlaW4uIEJFRUVFRUlJSUlJTiEhISEhISEgRHUgaGFzdCBrZWluZSBBaG51bmcsIHdhcyBlcyBiZWRldXRlbiBzb2xsLiBFcyBtYWNodCBkaXIgQW5nc3QuIERpZSBBbnR3b3J0IGxhdXRldCBCZWluLiBNb3JnZW4gaXN0IEhhbGxvd2Vlbi4gV2FzIHNvbGwgc2Nob24gcGFzc2llcmVuLCB3ZW5uIGR1IGVpbmZhY2ggWnVoYXVzZSBibGVpYnN0PyBLaW5kZXIgd2VyZGVuIGFuIGRlciBU/HIga2xpbmdlbiwgZHUgc2NoYXVzdCBkaXIgZWluZW4gRmlsbSBhbiAoa2VpbiBIb3Jyb3JmaWxtKSB1bmQgZGFubiBpc3QgZGVyIGdhbnplIFNwdWsgYW0gbuRjaHN0ZW4gVGFnIHZvcmJlaS4=</p>
       
      `,
      en: `
        <p style="overflow-wrap: break-word; color: red; font-size: 200px;">TGFzdCBuaWdodCB5b3UgZHJlYW1lZCBvZiBjb2ZmaW5zOyBvbmUgb2YgdGhlbSBldmVuIGhhZCB5b3VyIG5hbWUgb24gaXQuIFlvdSBjYW4ndCBnZXQgb25lIHdvcmQgb3V0IG9mIHlvdXIgaGVhZC4gQmVpbi4gQmVpbi4gQmVpbi4gQkVFRUVFRUlJSUlJTiEhISEhISEgWW91IGhhdmUgbm8gaWRlYSB3aGF0IGl0J3Mgc3VwcG9zZWQgdG8gbWVhbi4gSXQgc2NhcmVzIHlvdS4gVGhlIGFuc3dlciBpcyBCZWluLiBUb21vcnJvdyBpcyBIYWxsb3dlZW4uIFdoYXQgY291bGQgcG9zc2libHkgaGFwcGVuIGlmIHlvdSBqdXN0IHN0YXkgaG9tZT8gS2lkcyB3aWxsIHJpbmcgdGhlIGRvb3JiZWxsLCB5b3UnbGwgd2F0Y2ggYSBtb3ZpZSAobm90IGEgaG9ycm9yIGZpbG0pLCBhbmQgdGhlbiB0aGUgd2hvbGUgc3Bvb2sgd2lsbCBiZSBvdmVyIHRoZSBuZXh0IGRheS4=</p>
      `,
    },
    solution: secrets('chal_351'),
  },

  {
    id: 352,
    pos: { x: 2510, y: 1215 },
    title: { de: 'Happy Halloween?', en: 'Happy Halloween?' },
    date: '2025-10-31',
    deps: [351],
    releaseTs: new Date(
      'Fri Oct 31 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    render: () => {
      const script = `
        <style>
          #scare-div { 
              display: none; 
              position: fixed; 
              top: 0; left: 0; 
              width: 100vw; 
              height: 100vh; 
              z-index: 9999; 
              background: black; 
              pointer-events: none;
          }
          #scare-div.active { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
          }
          #scare-div img { 
              max-width: 100%; 
              max-height: 100%; 
          }
          #scare-div.active img { 
              animation: f 0.1s linear infinite; 
          }
          @keyframes f { 
              50% { opacity: 0.2; transform: scale(1.1); } 
          }
        </style>

        <!-- The HTML elements -->
        
        <p><img src="/chals/hw25_7.jpg" id="trigger-div"></p> 
        <div id="scare-div">
            <img src="/chals/horror-5233620_960_720.jpg">
        </div>

        <!-- The JavaScript logic -->
        <script>
            const trigger = document.getElementById('trigger-div');
            const scare = document.getElementById('scare-div');
            let isScaring = false;

            let confirmed = false;
            try { confirmed = sessionStorage.getItem('epilepsyWarnConfirmed') === '1'; } catch (_) {}
            confirmed = confirmed || confirm("EPILEPSIE WARNUNG: Wenn du empfindlich auf plötzliche, helle Bilder reagierst, solltest du diese Aufgabe nicht machen. Fortfahren?");

            if (!confirmed) {
              window.location.href = '/';
            } else {
              try { sessionStorage.setItem('epilepsyWarnConfirmed', '1'); } catch (_) {}
              setTimeout(() => {
                trigger.onmouseover = () => {
                  if (isScaring) return;
                  isScaring = true;
                  scare.classList.add('active');
                  setTimeout(() => {
                    scare.classList.remove('active');
                    isScaring = false;
                  }, 750); // Jumpscare duration in milliseconds
                };
              }, 500); // Delay before enabling the jumpscare
            }
        </script>
      `
      return {
        de: `

        <p>Es klingelt. Du erwartest heute Abend natürlich Gruppen an Kinder. Stattdessen ... liegt da ein abgehacktest Kinderbein, blutverschmiert mit zuckenden Zehen.</p>

        <p>Richtig Panik bekommst du aber erst, als du die Nachricht entzifferst:</p>

        ${script}
      `,
        en: `
        <p>The doorbell rings. You are, of course, expecting groups of children tonight. Instead... there lies a hacked-off child's leg, smeared with blood, its toes twitching.</p>
        <p>But the real panic only sets in when you decipher the message:</p>
        ${script}
      `,
      }
    },
    solution: secrets('chal_352'),
    afterSolveText: {
      de: `
        <p>Am nächsten Morgen spazieren Kinder an deiner offenen Wohnungstür vorbei. Von dir ist keine Spur zu sehen. Eine Woche später wirst du als vermisst gemeldet und der Fall nach einem Jahr ohne Hinweise geschlossen 🪦</p>
        <div id="halloween-blood-352" style="margin-bottom: 100px;">
          <p class="blood-text">Happy Halloween!
            <span class="drip d1"></span>
            <span class="drip d2"></span>
            <span class="drip d3"></span>
          </p>
          <style>
            /* Scoped styles: only affect this snippet */
            #halloween-blood-352 .blood-text {
              display: inline-block;
              position: relative;
              color: #b30000;
              font-weight: 800;
              font-size: 32px;
              letter-spacing: 0.02em;
              text-shadow:
                0 0 2px #4d0000,
                0 0 8px #990000,
                0 2px 0 #660000,
                0 3px 4px rgba(64,0,0,0.6);
              filter: drop-shadow(0 1px 0 #4d0000) drop-shadow(0 2px 2px rgba(64,0,0,0.5));
            }

            #halloween-blood-352 .blood-text .drip {
              position: absolute;
              top: 100%;
              width: 6px;
              height: 0;
              background: linear-gradient(#cc0000, #5a0000);
              border-radius: 0 0 50% 50%;
              box-shadow: 0 0 4px #5a0000;
              animation-name: hb352-drip;
              animation-timing-function: ease-in;
              animation-iteration-count: infinite;
            }

            #halloween-blood-352 .blood-text .d1 { left: 18%; animation-duration: 2.6s; animation-delay: .15s; }
            #halloween-blood-352 .blood-text .d2 { left: 46%; animation-duration: 3.1s; animation-delay: .55s; }
            #halloween-blood-352 .blood-text .d3 { left: 72%; animation-duration: 2.8s; animation-delay: .95s; }

            @keyframes hb352-drip {
              0%   { height: 0; opacity: 0; transform: translateY(0); }
              10%  { height: 10px; opacity: 1; }
              60%  { height: 16px; opacity: 1; transform: translateY(8px); }
              90%  { height: 0; opacity: 0.9; transform: translateY(18px); }
              100% { height: 0; opacity: 0; transform: translateY(22px); }
            }
          </style>
        </div>
      `,
      en: `
        <p>The next morning, children stroll past your apartment's open door. There's no trace of you. A week later, you are reported missing, and after a year with no leads, the case is closed 🪦</p>
        <div id="halloween-blood-352-en" style="margin-bottom: 100px;">
          <p class="blood-text">Happy Halloween!
            <span class="drip d1"></span>
            <span class="drip d2"></span>
            <span class="drip d3"></span>
          </p>
          <style>
            /* Scoped styles (EN): only affect this snippet */
            #halloween-blood-352-en .blood-text {
              display: inline-block;
              position: relative;
              color: #b30000;
              font-weight: 800;
              font-size: 32px;
              letter-spacing: 0.02em;
              text-shadow:
                0 0 2px #4d0000,
                0 0 8px #990000,
                0 2px 0 #660000,
                0 3px 4px rgba(64,0,0,0.6);
              filter: drop-shadow(0 1px 0 #4d0000) drop-shadow(0 2px 2px rgba(64,0,0,0.5));
            }

            #halloween-blood-352-en .blood-text .drip {
              position: absolute;
              top: 100%;
              width: 6px;
              height: 0;
              background: linear-gradient(#cc0000, #5a0000);
              border-radius: 0 0 50% 50%;
              box-shadow: 0 0 4px #5a0000;
              animation-name: hb352-drip;
              animation-timing-function: ease-in;
              animation-iteration-count: infinite;
            }

            #halloween-blood-352-en .blood-text .d1 { left: 18%; animation-duration: 2.6s; animation-delay: .15s; }
            #halloween-blood-352-en .blood-text .d2 { left: 46%; animation-duration: 3.1s; animation-delay: .55s; }
            #halloween-blood-352-en .blood-text .d3 { left: 72%; animation-duration: 2.8s; animation-delay: .95s; }

            @keyframes hb352-drip {
              0%   { height: 0; opacity: 0; transform: translateY(0); }
              10%  { height: 10px; opacity: 1; }
              60%  { height: 16px; opacity: 1; transform: translateY(8px); }
              90%  { height: 0; opacity: 0.9; transform: translateY(18px); }
              100% { height: 0; opacity: 0; transform: translateY(22px); }
            }
          </style>
        </div>
      `,
    },
  },

  /*{
    id: 339,
    pos: { x: 1530, y: 705 },
    title: { de: 'Junkfood', en: 'Junkfood' },
    date: '2024-04-23',
    deps: [300],
    noScore: true,
    author: 'teebee',
    html: {
      de: `
        <p>Nicht so gierig, sonst verschluckst Du es. Immer nur Häppchen für Häppchen!</p>
          TODO
       
      `,
      en: `
      <p>Not so greedy, otherwise you'll swallow it. Just bite by bite every time!</p>
          
      TODO
      `,
    },
    solution: secrets('chal_339'),
  },*/

  /*{
    id: 338,
    pos: { x: 2160, y: 945 },
    title: { de: 'Minecraft III', en: 'Minecraft III' },
    date: '2024-02-01',
    deps: [337],
    noScore: true,
    author: 'QWERTZ',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>

      `,
    },
    solution: '42',
  },*/
]
