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
    pos: { x: 1400, y: 2400 },
    title: { de: 'Halloween 2025 - Tag 1 🍬', en: 'Halloween 2025 - Day 1 🍬' },
    date: '2025-10-25',
    deps: [300],
    releaseTs: new Date(
      'Sat Oct 25 2025 18:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
    hideLink: true,
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
    pos: { x: 1460, y: 2500 },
    title: { de: 'Tag 2 🕸️', en: 'Day 2 🕸️' },
    date: '2025-10-26',
    deps: [346],
    releaseTs: new Date(
      'Sun Oct 26 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
    render: () => {
      return {
        de: `
        <p>Das wird bald dein neues Zuhause:</p>

        <p style="margin-top: 32px;">

 ███████████            ███               █████ █████                  ██████ 
░░███░░░░░░█           ░░░               ░░███ ░░███                  ███░░███
 ░███   █ ░  ████████  ████   ██████   ███████  ░███████    ██████   ░███ ░░░ 
 ░███████   ░░███░░███░░███  ███░░███ ███░░███  ░███░░███  ███░░███ ███████   
 ░███░░░█    ░███ ░░░  ░███ ░███████ ░███ ░███  ░███ ░███ ░███ ░███░░░███░    
 ░███  ░     ░███      ░███ ░███░░░  ░███ ░███  ░███ ░███ ░███ ░███  ░███     
 █████       █████     █████░░██████ ░░████████ ████ █████░░██████   █████    
░░░░░       ░░░░░     ░░░░░  ░░░░░░   ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░   ░░░░░     
                                                                              
                                                                              
                                                                              </p>
       
      `,
        en: `
        <p>This will be your home, soon!</p>

        <p style="margin-top: 32px;">

   █████████                                                                              █████
  ███▒▒▒▒▒███                                                                            ▒▒███ 
 ███     ▒▒▒  ████████   ██████   █████ █████  ██████  █████ ████  ██████   ████████   ███████ 
▒███         ▒▒███▒▒███ ▒▒▒▒▒███ ▒▒███ ▒▒███  ███▒▒███▒▒███ ▒███  ▒▒▒▒▒███ ▒▒███▒▒███ ███▒▒███ 
▒███    █████ ▒███ ▒▒▒   ███████  ▒███  ▒███ ▒███████  ▒███ ▒███   ███████  ▒███ ▒▒▒ ▒███ ▒███ 
▒▒███  ▒▒███  ▒███      ███▒▒███  ▒▒███ ███  ▒███▒▒▒   ▒███ ▒███  ███▒▒███  ▒███     ▒███ ▒███ 
 ▒▒█████████  █████    ▒▒████████  ▒▒█████   ▒▒██████  ▒▒███████ ▒▒████████ █████    ▒▒████████
  ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒      ▒▒▒▒▒▒▒▒    ▒▒▒▒▒     ▒▒▒▒▒▒    ▒▒▒▒▒███  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒      ▒▒▒▒▒▒▒▒ 
                                                        ███ ▒███                               
                                                       ▒▒██████                                
                                                        ▒▒▒▒▒▒                                 

        </p>
        
      `,
      }
    },
    solution: secrets('chal_347').split(','),
  },

  {
    id: 348,
    pos: { x: 1340, y: 2500 },
    title: { de: 'Tag 3 🫣', en: 'Day 3 🫣' },
    date: '2025-10-27',
    deps: [346],
    releaseTs: new Date(
      'Mon Oct 27 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
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
    pos: { x: 1550, y: 2600 },
    title: { de: 'Tag 4 😱', en: 'Day 4 😱' },
    date: '2025-10-28',
    deps: [347],
    releaseTs: new Date(
      'Tue Oct 28 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
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
    pos: { x: 1250, y: 2600 },
    title: { de: 'Tag 5 ☠️', en: 'Day 5 ☠️' },
    date: '2025-10-29',
    deps: [348],
    releaseTs: new Date(
      'Wed Oct 29 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
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
    pos: { x: 1400, y: 2600 },
    title: { de: 'Tag 6 ⚰️', en: 'Day 6 ⚰️' },
    date: '2025-10-30',
    deps: [347, 348],
    releaseTs: new Date(
      'Thu Oct 30 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
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
    pos: { x: 1400, y: 2700 },
    title: { de: 'Happy Halloween?', en: 'Happy Halloween?' },
    date: '2025-10-31',
    deps: [351],
    releaseTs: new Date(
      'Fri Oct 31 2025 18:00:00 GMT+0100 (Mitteleuropäische Normalzeit)'
    ).getTime(),
    noScore: true,
    author: 'Anna',
    color: '#eb7719ff',
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
    renderAfterSolveText: () => {
      return {
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
      }
    },
  },

  {
    id: 353,
    pos: { x: 2222, y: 235 },
    title: { de: 'Discord VI', en: 'Discord VI' },
    date: '2025-10-18',
    deps: [335],
    noScore: true,
    author: 'QWERTZ',
    html: {
      de: `
        <p>Was ist die Role ID der Entwicklerin?</p>
       
      `,
      en: `
        <p>What is the Role ID of the Entwicklerin?</p>
      `,
    },
    solution: secrets('chal_353'),
  },

  {
    id: 354,
    pos: { x: 1522, y: 805 },
    title: { de: 'Honey Morello', en: 'Honey Morello' },
    date: '2025-10-27',
    deps: [300],
    noScore: true,
    author: 'bennosaurusrex',
    render: () => {
      const chal = `
        <pre>
Once upon a time there was a creature She was found in 1969\u200c\u200b\u200c\u200b\u200b
And again in the 1980s In the 90s, she popped up all over the place\u200b\u200c\u200b\u200b\u200b
And by the turn of the century, she belonged to the people\u200b\u200b\u200c\u200b\u200c
She was beautiful, vulnerable, power and success\u200b\u200b\u200b\u200b\u200b\u200b
And she was terrifying Impossible to pin down\u200b\u200b\u200b\u200b\u200c
She was alive and maybe not\u200b\u200c\u200c\u200c\u200b
And I’d be a completely different person if she didn’t exist\u200c\u200b\u200b\u200c\u200c

In 2016, she made it to Beijing\u200c\u200b\u200c\u200c\u200c
And in 2020, I met her in person\u200b\u200b\u200c\u200b\u200c
And in 2025 she and I both stopped being able to tell the difference between real and pretend human beings online\u200c\u200b\u200b\u200c\u200b

Do you think angels live in stories?\u200b\u200b\u200b\u200b\u200b\u200b
Do you think at a certain point anyone who’s ever crossed a certain threshold of vitality has to become hyper real?\u200b\u200c\u200b\u200b\u200c
When the internet finishes dying And every comment section is a deep sea graveyard of Schroediger’s eyes\u200c\u200b\u200b\u200c\u200c
A big tangled mess of concentric interwoven biblically accurate angels\u200b\u200b\u200b\u200b\u200b\u200b
Will everyone have crossed that threshold?\u200b\u200c\u200c\u200b\u200c
Will we all be viral?\u200b\u200b\u200c\u200b\u200c
Will we all be angels?\u200b\u200c\u200c\u200b\u200c
And will we all be contaminated?\u200b\u200b\u200c\u200b\u200c
        </pre>
      
      `
      return {
        de: `
          ${chal}
          <small>Manchmal ist die Botschaft in unsichtbaren Zeichen versteckt.</small>
        `,
        en: `
          ${chal}
          <small>Sometimes the message is hidden in invisible characters.</small>
        `,
      }
    },
    solution: secrets('chal_354'),
  },

  {
    id: 355,
    pos: { x: 2272, y: 155 },
    title: { de: 'Discord VII', en: 'Discord VII' },
    date: '2025-10-28',
    deps: [335],
    noScore: true,
    releaseTs: new Date('2025-10-27 15:00:00 GMT+0100').getTime(),
    author: 'QWERTZ',
    html: {
      de: `
        <p>Tokens sind mächtige Zeichenketten. Wenn man den Token von einer Person hat, dann kann man sich unter deren Account anmelden ... Da du so ein guter Hacker bist, kannst du mir bestimmt die ersten 24 Zeichen des Tokens von @QWERTZ sagen.</p>
      `,
      en: `
        <p>Tokens are powerful strings. If you have someone’s token, you can log in under their account ... Since you’re such a good hacker, you can surely tell me the first 24 characters of @QWERTZ’s token.</p>
      `,
    },
    solution: secrets('chal_355'),
  },

  {
    id: 356,
    pos: { x: 1660, y: 765 },
    title: { de: 'Lost Challenge', en: 'Lost Challenge' },
    date: '2025-11-04',
    deps: [300],
    noScore: true,
    releaseTs: new Date('2025-11-04 11:11:11 GMT+0100').getTime(),
    author: 'ChecksMc',
    html: {
      de: `
        <p>Neuerdings findet sich unter <a href="https://www.reddit.com/r/HackTW/" target="_blank">www.reddit.com/r/HackTW</a> ein Sub für Hack The Web. Hm, die erste Nachricht ist etwas kryptisch, wofür ist sie eigentlich da?</p>
      `,
      en: `
        <p>There’s now a subreddit for Hack The Web at <a href="https://www.reddit.com/r/HackTW/" target="_blank">www.reddit.com/r/HackTW</a>. Hmm, the first post is a bit cryptic — what is it actually for?</p>
      `,
    },
    solution: secrets('chal_356'),
  },

  {
    id: 357,
    pos: { x: 1620, y: 525 },
    title: { de: 'Base4096', en: 'Base4096' },
    date: '2025-11-06',
    deps: [300],
    noScore: true,
    releaseTs: new Date('2025-11-06 11:11:11 GMT+0100').getTime(),
    author: 'CARLO',
    html: {
      de: `
        <p><code>aHR0cHM6Ly9iYXNlNDA5Ni5pbmZpbml0eWZyZWVhcHAuY29tLw==</code></p>
      
        <p>🗾🜈⚖🦢🅩🆠🅉🍠🃦🦮🅨❔⛏⃣🉨⩈🌢↗🟕🊍🗣😫🉿🪘🜜🩮🊱⨂⪏🇇🇴🎄🟵</p>
      `,
      en: `
        <p><code>aHR0cHM6Ly9iYXNlNDA5Ni5pbmZpbml0eWZyZWVhcHAuY29tLw==</code></p>
      
        <p>🗾🜈⚖🦢🅩🆠🅉🍠🃦🦮🅨❔⛏⃣🉨⩈🌢↗🟕🊍🗣😫🉿🪘🜜🩮🊱⨂⪏🇇🇴🎄🟵</p>
      `,
    },
    solution: secrets('chal_357'),
  },

  {
    id: 358,
    pos: { x: 1700, y: 330 },
    title: { de: 'Zeitzonen', en: 'Time zones' },
    date: '2025-11-12',
    deps: [300],
    noScore: true,
    releaseTs: new Date('2025-11-12 16:16:16 GMT+0100').getTime(),
    author: 'peter34788',
    html: {
      de: `
        <p>Es gibt auf der Welt 24 Standardzeitzonen – jeweils eine pro Stunde (z. B. UTC+01:00 für Mitteleuropa; UTC steht für Coordinated Universal Time). Doch wenn man es genauer nimmt, sind es deutlich mehr als 24, denn in manchen Länder gibt es Halbe oder sogar Viertelstundenabweichungen (z. B. UTC+05:30 in Indien oder UTC+05:45 in Nepal), unterschiedliche Sommerzeitregelungen oder politischen Sonderregelungen.</p>

        <p>Und da du jetzt ein bisschen mehr über Zeitzonen weißt, wird die Antwort erst angezeigt, wenn du dich in meiner Zeitzone befindest, also wir sehen uns bei 21°19'54.5"N 157°55'10.3"W.</p>

        <script>window.challenge_locale = "de";</script>
        <script src="/chals/358.js"></script>

        <p style="margin-top: 32px;"><button onclick="checker()" class="btn btn-secondary">Check</button></p>
      `,
      en: `
        <p>There are 24 standard time zones in the world — one per hour (for example UTC+01:00 for Central Europe; UTC stands for Coordinated Universal Time). But if you look more closely, there are far more than 24, because some countries use half-hour or even quarter-hour offsets (for example UTC+05:30 in India or UTC+05:45 in Nepal), different daylight saving time rules, or political exceptions.</p>

        <p>And now that you know a bit more about time zones, the answer will only be shown when you're in my time zone — so I'll see you at 21°19'54.5"N 157°55'10.3"W.</p>

        <script>window.challenge_locale = "en";</script>
        <script src="/chals/358.js"></script>

        <p style="margin-top: 32px;"><button onclick="checker()" class="btn btn-secondary">Check</button></p>
      `,
    },
    solution: secrets('chal_358'),
    renderAfterSolveText: () => {
      return {
        de: `
          <p>Aber weißt du auch was das ist? - Die Datumsgrenze ist eine gedachte Linie auf der Erde, die den Wechsel des Kalendertages markiert. Sie verläuft größtenteils entlang des 180. Längengrads im Pazifischen Ozean. Ihre Aufgabe ist es, weltweit einheitlich festzulegen, wann ein neuer Tag beginnt.</p>
          
          <p>Wer die Datumsgrenze von Osten nach Westen überquert, muss das Datum um einen Tag vorstellen. Umgekehrt – von Westen nach Osten – wird das Datum um einen Tag zurückgestellt. So kann es passieren, dass man an einem Ort Montag hat, während es auf der anderen Seite der Linie noch Sonntag ist.</p>
        `,
        en: `
          <p>But do you also know what that is? The International Date Line is an imaginary line on the Earth that marks the change of calendar day. It largely follows the 180th meridian across the Pacific Ocean. Its purpose is to provide a uniform point at which the date advances by one day.</p>
          
          <p>When you cross the date line from east to west, you must advance the calendar by one day. Conversely — when crossing from west to east — the calendar is set back by one day. This can lead to situations where it is Monday on one side of the line while still Sunday on the other.</p>
        `,
      }
    },
  },

  {
    id: 359,
    pos: { x: 1530, y: 455 },
    title: { de: 'IUPAC', en: 'IUPAC' },
    date: '2025-11-15',
    deps: [300],
    noScore: true,
    releaseTs: new Date('2025-11-15 08:00:00 GMT+0100').getTime(),
    author: 'bennosaurusrex',
    html: {
      de: `
        <p>Als ich heute mein Labor besucht habe und mich in meinen Massagesessel legen wollte fiel mir ein Zettel - wahrscheinlich von meinem Praktikanten auf - was will er mir mit dieser unmöglichen Mischung sagen?</p>
      
        <p><img src="/chals/Monophosphomonoaurimonoselenid.jpg"></p>
      `,
      en: `
        <p>When I visited my lab today and wanted to lie down in my massage chair, I noticed a note — probably from my intern — what is he trying to tell me with this impossible mixture?</p>
      
        <p><img src="/chals/359_en.jpg"></p>
      `,
    },
    solution: secrets('chal_359').split(','),
  },

  {
    id: 360,
    pos: { x: 2200, y: 800 },
    title: { de: 'Tag 1', en: 'TODO' },
    date: '2025-12-18',
    deps: [300],
    noScore: true,
    releaseTs: new Date('2025-12-18 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 361,
    pos: { x: 2733, y: 1046 },
    title: { de: 'Tag 2', en: 'TODO' },
    date: '2025-12-19',
    deps: [360],
    noScore: true,
    releaseTs: new Date('2025-12-19 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 362,
    pos: { x: 2547, y: 1274 },
    title: { de: 'Tag 3', en: 'TODO' },
    date: '2025-12-20',
    deps: [360],
    noScore: true,
    releaseTs: new Date('2025-12-20 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 363,
    pos: { x: 2195, y: 1160 },
    title: { de: 'Tag 4', en: 'TODO' },
    date: '2025-12-21',
    deps: [361],
    noScore: true,
    releaseTs: new Date('2025-12-21 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 364,
    pos: { x: 2516, y: 797 },
    title: { de: 'Tag 5', en: 'TODO' },
    date: '2025-12-22',
    deps: [362],
    noScore: true,
    releaseTs: new Date('2025-12-22 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 365,
    pos: { x: 2343, y: 996 },
    title: { de: 'Tag 6', en: 'TODO' },
    date: '2025-12-23',
    deps: [364, 360],
    noScore: true,
    releaseTs: new Date('2025-12-23 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>TODO</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: 'TODO_TODO_TODO',
  },

  {
    id: 366,
    pos: { x: 2424, y: 903 },
    title: { de: 'Frohe Feiertage!', en: 'Happy Holidays!' },
    date: '2025-12-24',
    deps: [360, 363],
    noScore: true,
    releaseTs: new Date('2025-12-24 15:00:00 GMT+0100').getTime(),
    author: 'Anna',
    enableFeedback: true,
    color: '#c30f16',
    html: {
      de: `
        <p>Wie, du hast vergessen mir den Adventskalender zu schenken!?!?!</p>

        <p>Und was soll es heißen, ich hätte die Türchen öffnen sollen bis heute??</p>

        <p>Urgh, ok, dann fange ich mal an: <a href="/adventskalender/1" target="_blank">Tür 1</a></p>
      `,
      en: `
        <p>Wait, you forgot to give me the Advent calendar!?!?!</p>

        <p>And what is that supposed to mean, I should have opened the doors up until today??</p>

        <p>Ugh, okay, then I'll start: <a href="/adventskalender/1" target="_blank">Door 1</a></p>
      `,
    },
    solution: secrets('chal_366'),
  },
]
