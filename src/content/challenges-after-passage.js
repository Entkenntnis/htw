import { secrets } from '../helper/secrets-loader.js'
import crypto from 'crypto'

/**
 * @param {string[]} program
 */
function runBrainfuck(program) {
  /** Interpreter variables */
  // Create a new 30,000-size array, with each cell initialized with the value of 0. Memory can expand.
  const MAX_STEPS = 10000

  const MEMORY_SIZE = 100
  const memory = new Array(MEMORY_SIZE).fill(0)
  // Instruction pointer (Points to the current INSTRUCTION)
  let ipointer = 0
  // Memory pointer (Points to a cell in MEMORY)
  let mpointer = 0
  // Address stack. Used to track addresses (index) of left brackets
  let astack = []

  let output = ''

  /**
   * @param {number} value
   */
  function sendOutput(value) {
    output += String.fromCharCode(value)
  }

  let end = false
  let error = ''
  let steps = 0

  while (!end) {
    if (++steps >= MAX_STEPS) {
      error = 'Maximale Ausführung von ' + MAX_STEPS + ' Schritten'
      break
    }
    switch (program[ipointer]) {
      case '>':
        if (mpointer === MEMORY_SIZE - 1) {
          end = true
          error = 'Speicher ist auf ' + MEMORY_SIZE + ' Zellen begrenzt.'
          break
        }
        mpointer++
        break
      case '<':
        if (mpointer > 0) mpointer--
        break
      case '+':
        memory[mpointer]++
        break
      case '-':
        memory[mpointer]--
        break
      case '.':
        sendOutput(memory[mpointer])
        break
      case ',':
        memory[mpointer] = 0
        break
      case '[':
        if (memory[mpointer]) {
          // If non-zero
          astack.push(ipointer)
        } else {
          // Skip to matching right bracket
          let count = 0
          while (true) {
            ipointer++
            if (!program[ipointer]) break
            if (program[ipointer] === '[') count++
            else if (program[ipointer] === ']') {
              if (count) count--
              else break
            }
          }
        }
        break
      case ']':
        //Pointer is automatically incremented every iteration, therefore, we must decrement to get the correct value
        ipointer = (astack.pop() ?? 1) - 1
        break
      case undefined: // We have reached the end of the program
        end = true
        break
      default: // We ignore any character that is not part of regular Brainfuck syntax
        break
    }
    ipointer++
  }

  if (error) return error
  return output
}

/** @type {import('../data/types.js').HtwChallenge[]} */
export const challengesAfterPassage = [
  {
    id: 36,
    pos: { x: 630, y: 1835 },
    title: { de: 'Benutzername III', en: 'Username III' },
    // date: '2020-05-20',
    deps: [103],
    html: {
      de: `
    <p>Es war noch nie einfacher gewesen, eine eigene Website zu bauen und diese ins Internet zu stellen. Daher die Aufgabe für dich: Erstelle eine Website, die genau deinen Benutzernamen enthält (kein HTML, keine Leerzeichen, nur dein Benutzername!) und gib die URL als Antwort ein:
    </p>
  `,
      en: `
    <p>It has never been easier to build your own website and put it online. Hence, the task for you: create a website that contains exactly your username (no HTML, no spaces, just your username!) and enter the URL as the answer:
    </p>
  `,
    },
    check: async (answer, { req }) => {
      let value = ''
      try {
        if (!answer || !answer.startsWith('http')) {
          return { answer: 'Keine URL: ' + answer, correct: false }
        }
        const controller = new AbortController()
        const timeout = setTimeout(() => {
          controller.abort()
        }, 4000)
        try {
          const res = await fetch(answer, {
            // @ts-expect-error might be non-standard to have this parameter here
            size: 1024 * 1024,
            redirect: 'manual',
            signal: controller.signal,
          })
          value = await res.text()
          value = value.trim()
          if (value.length > 1000) {
            value = value.substring(0, 1000) + '...'
          }
        } catch (error) {
          if (
            typeof error == 'object' &&
            error &&
            'message' in error &&
            typeof error.message == 'string'
          ) {
            if (error.message.includes('aborted')) {
              value = 'Keine Antwort nach 4 Sekunden'
            } else {
              value = error.message
            }
          }
        } finally {
          clearTimeout(timeout)
        }
      } catch (e) {
        if (
          typeof e == 'object' &&
          e &&
          'message' in e &&
          typeof e.message == 'string'
        )
          value = e.message
      }
      return {
        answer: value,
        correct: value === req.user?.name,
      }
    },
  },

  {
    id: 38,
    pos: { x: 540, y: 1470 },
    title: { de: 'Metadaten', en: 'Metadata' },
    // date: '2020-05-20',
    deps: [40],
    html: {
      de: `
      <p>Oh wie süß! Schau dir dieses Foto an:
      </p>
      
      <p><img src="/chals/chal38.jpg" alt="hamster"></p>
      
      <p>Neben dem, was du auf dem Foto sehen kannst, enthalten viele Bilddateien noch weitere Informationen, wie z.B. das Kameramodell oder die ISO-Zahl. Das sind die sog. <em>EXIF-Tags</em> und diese sind leider nicht sofort sichtbar. Allerdings gibt es einige Tools, die dir dies Tags anzeigen können. Und darin findest sich auch die Antwort.</p>
    `,
      en: `
      <p>Oh, how sweet! Look at this photo:
      </p>
      
      <p><img src="/chals/chal38-en.jpg" alt="chal38-en"></p>
      
      <p>In addition to what you can see in the photo, many image files contain other information, such as the camera model or the ISO number. These are the so-called <em>EXIF-Tags</em> and unfortunately these are not immediately visible. However, there are some tools that can show you these tags. And there you will find the answer.</p>
    `,
    },
    solution: secrets('chal_38'),
  },

  {
    id: 40,
    pos: { x: 680, y: 1290 },
    title: { de: 'Terminal', en: 'Terminal' },
    // date: '2020-05-20',
    deps: [85, 94],
    html: {
      de: `
      <p>Schwarzer Bildschirm, weiße Schrift, kryptische Zeichen und komplizierte Befehle ... auch bekannt unter dem Namen <em>Terminal</em>.
      </p>
      
      <p>Dahinter steckt eine textbasierte Möglichkeit, mit einem Computer zu interagieren. Anstatt mit der Maus zu klicken, werden die gewünschten Aktionen per Befehl eingegeben und ausgeführt. Und das ist auch gar kein so großes Hexenwerk!
      </p>
      
      <p>Diese Aufgabe enthält ein schlankes Terminal, das ein Dateisystem verwaltet. Es gibt verschiedene Verzeichnisse und Dateien - in einer dieser Dateien findet sich die Antwort zu dieser Aufgabe.
      </p>
      
      <p>Um sich im Dateisystem zu bewegen und zu orientieren, gibt es vier Befehle:
      <ul>
        <li><code>ls</code><br>Dieser Befehl zeigt den Inhalt des Verzeichnis, in dem du dich gerade befindest.
        </li>
        <li><code>pwd</code><br>Dieser Befehl zeigt dir den Pfad des aktuellen Verzeichnis.
        </li>
        <li><code>cd VERZ</code><br>Dieser Befehl bewegt dich in ein neues Verzeichnis, dessen Namen du anstelle von VERZ schreibst. Um wieder eine Ebene hoch zu kommen, gibt es die spezielle Variante <code>cd ..</code>
        </li>
        <li><code>cat DATEI</code><br>Dieser Befehl zeigt den Inhalt einer Datei an im aktuellen Verzeichnis. Schreibe anstelle von DATEI den Namen der Datei.
        </li>
      </ul>
      </p>
      
      <p>Beginne deine Suche nach der Antwort in der Datei <strong>GOP/053/vjer</strong>:
      </p>
      
      <div id="terminal" class="my-4"></div>
      
      <script src="/seedrandom.min.js"></script>
      <script src="/chals/terminal.js"></script>
      <script>
        window.htw_locale = 'de'
      </script>
      <script src="/chals/chal40.js"></script>
      
      <p>Beispiel: Tippe nacheinander die Befehle<br>
        <code>cd GOP</code><br>
        <code>cd 239</code><br>
        <code>ls</code><br>
        <code>cat yley</code><br>
        <code>cd ..</code><br>
        <code>pwd</code>
      </p>
    `,
      en: `
      <p>Black screen, white font, cryptic characters and complicated commands...also known by the name <em>Terminal</em>.
      </p>
      
      <p>Behind this is a text-based way to interact with a computer. Instead of clicking with the mouse, the desired actions are entered and carried out using commands. And it's not that big of a rocket science!
      </p>
      
      <p>This task contains a lightweight terminal that manages a file system. There are various directories and files — one of these files contains the answer to this task.
      </p>
      
      <p>To move and orient yourself in the file system, there are four commands:
      <ul>
        <li><code>ls</code><br>This command shows the contents of the directory you are currently in.
        </li>
        <li><code>pwd</code><br>This command shows you the path of the current directory.
        </li>
        <li><code>cd DIR</code><br>This command moves you to a new directory whose name you write instead of DIR. There is a special variant to get back up a level <code>cd ..</code>
        </li>
        <li><code>cat FILE</code><br>This command displays the contents of a file in the current directory. Instead of FILE, write the name of the file.
        </li>
      </ul>
      </p>
      
      <p>Start your search for the answer in the file<strong>GOP/053/vjer</strong>:
      </p>
      
      <div id="terminal" class="my-4"></div>
      
      <script src="/seedrandom.min.js"></script>
      <script src="/chals/terminal.js"></script>
      <script>
        window.htw_locale = 'en'
      </script>
      <script src="/chals/chal40.js"></script>
      
      <p>Example: Enter the following commands one after the other<br>
        <code>cd GOP</code><br>
        <code>cd 239</code><br>
        <code>ls</code><br>
        <code>cat yley</code><br>
        <code>cd ..</code><br>
        <code>pwd</code>
      </p>
    `,
    },
    solution: secrets('chal_40'),
  },

  {
    id: 43,
    pos: { x: 510, y: 1700 },
    title: { de: 'POST it', en: 'POST it' },
    // date: '2020-05-20',
    deps: [103],
    html: {
      de: `
      <p>Diesmal gibt es keine Umschweife: Die Antwort auf diese Aufgabe lautet Klamauk.
      </p>
      
      <p>Leider gibt es zu dieser Aufgabe kein Eingabefeld. Aber das sollte dich nicht abhalten, der Webseite die Antwort zu schicken!
      </p>
    `,
      en: `
      <p>This time there is no beating around the bush: the answer to this challenge is "Klamauk".
      </p>
      
      <p>Unfortunately, there is no input field for this challenge. But that shouldn't stop you from sending the answer to the website!
      </p>
    `,
    },
    solution: secrets('chal_43'),
    hidesubmit: true,
  },

  {
    id: 44,
    pos: { x: 1390, y: 1460 },
    title: { de: 'Ladebalken II', en: 'Progressbar II' },
    // date: '2020-05-20',
    deps: [65],
    html: {
      de: `
      <p>Der Klügere gibt nach - und du hast kein Problem nachzugeben, wenn es definitiv nicht weitergeht.
      </p>
      
      <p>Dieser Ladebalken dauert sehr lange. Wirst du ihn bis zum Ende abwarten - oder eine andere Lösung finden?
      </p>
      
      <div class="progress my-4">
        <div id="44_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 1%"></div>
      </div>
      
      <p id="value">SQNLPZWYVNYLZZ</p>
      
      <p id="status">...</p>
      
      <script>
        const bar = document.getElementById('44_bar')
        const valueDiv = document.getElementById('value')
        const status = document.getElementById('status')
        
        const string = "SQNLPZWYVNYLZZ"
        const steps = 100000

        let step = -steps
        let value = string

        function forward() {
          const i = (((step + 1) % string.length) + string.length) % string.length
          const chars = value.split('')
          chars[i] = String.fromCharCode(65 + ((chars[i].charCodeAt(0) - 65 + 1) % 26))
          value = chars.join('')
          step++
          //console.log('forward to', value)
          return value
        }
        
        function work(noTimeout) {
          if (step >= 0) {
            bar.style.width = '100%'
          } else {
            bar.style.width = (((steps+step)/steps) * 98.9 + 1) + '%'
            valueDiv.innerHTML = forward(valueDiv.innerHTML)
            status.innerHTML = '(' + (step+steps) + '/' + steps + ')'
            if (!noTimeout) {
              setTimeout(work, 1000)
            }
          }
        }
        
        window.onkeydown = () => {
          work(true)
        }
        
        setTimeout(work, 2000)
      </script>
    `,
      en: `
      <p>The smarter one gives in — and you have no problem giving in if it definitely doesn't go any further.
      </p>
      
      <p>This loading bar takes a very long time. Will you wait it out until the end — or find another solution?
      </p>
      
      <div class="progress my-4">
        <div id="44_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 1%"></div>
      </div>
      
      <p id="value">SQNLPZWYVNYLZZ</p>
      
      <p id="status">...</p>
      
      <script>
        const bar = document.getElementById('44_bar')
        const valueDiv = document.getElementById('value')
        const status = document.getElementById('status')
        
        const string = "SQNLPZWYVNYLZZ"
        const steps = 100000

        let step = -steps
        let value = string

        function forward() {
          const i = (((step + 1) % string.length) + string.length) % string.length
          const chars = value.split('')
          chars[i] = String.fromCharCode(65 + ((chars[i].charCodeAt(0) - 65 + 1) % 26))
          value = chars.join('')
          step++
          return value
        }
        
        function work(noTimeout) {
          if (step >= 0) {
            bar.style.width = '100%'
          } else {
            bar.style.width = (((steps+step)/steps) * 98.9 + 1) + '%'
            valueDiv.innerHTML = forward(valueDiv.innerHTML)
            status.innerHTML = '(' + (step+steps) + '/' + steps + ')'
            if (!noTimeout) {
              setTimeout(work, 1000)
            }
          }
        }
        
        window.onkeydown = () => {
          work(true)
        }
        
        setTimeout(work, 2000)
      </script>
    `,
    },
    solution: secrets('chal_44'),
  },

  {
    id: 46,
    pos: { x: 590, y: 1220 },
    title: { de: 'Kopfdaten', en: 'Headers' },
    // date: '2020-05-20',
    deps: [85],
    html: {
      de: `
      <p>Geheime Spuren zu finden ist für dich kein Problem, denn du hast einen scharfen Blick.
      </p>
      
      <p>Wenn du eine Webseite öffnest, passieren hinter den Kulissen viele Dinge, selbst beim Aufruf einer <a href="/chal/chal46">leeren Seite</a>. Doch im Hintergrund wurde bereits die Antwort übertragen.
      </p>
      
      <p>Die Netzwerkanalyse (meist F12) hilft dir, alle Daten im Hintergrund anzuzeigen. Finde darin deine Antwort.
      </p>
      
      <p><img src="/chals/chal46.png" style="max-width:100%"  alt="network tab"/></p>
    `,
      en: `
      <p>Finding secret clues is no problem for you because you have a keen eye.
      </p>
      
      <p>When you open a website, a lot of things happen behind the scenes, even when you open one <a href="/chal/chal46">that is empty</a>. But the answer was already being transmitted in the background.
      </p>
      
      <p>Network analysis (usually F12) helps you view all data in the background. Find your answer there.
      </p>
      
      <p><img src="/chals/chal46.png" style="max-width:100%"  alt="network tab"/></p>
    `,
    },
    solution: secrets('chal_46'),
  },

  {
    id: 49,
    pos: { x: 1590, y: 1410 },
    title: { de: 'Spielstand II', en: 'Game Save II' },
    // date: '2020-05-21',
    deps: [65],
    html: {
      de: `
      <p>Es gibt Spiele, die machen richtig viel Spaß - und es gibt welche, die am Ende doch nur dein Geld aus der Tasche ziehen wollen.
      </p>
      
      <p>Bei solchen Spielen ist verlockend, durch einen Hack seinen Spielstand zu verbessern. Leider sind sich viele Entwickler dieser Möglichkeit bewusst und verschlüsseln den Spielstand.
      </p>
      
      <p>Doch keine Verschlüsslung ist perfekt! Meist lässt sich der Schlüssel leicht herausfinden und damit die Verschlüsselung knacken.
      </p>
      
      <p>Dein aktueller Spielstand lautet: <code>cc76663b7d1e97ea2455b1c25676f44794fec90b0a9b823f916bf79387de4238</code>
      </p>
      
      <p>Der Schlüssel lautet: <code>786d229b0de877774a2f676d5bd895c3</code>
      </p>
      
      <p>Die Verschlüsselungsmethode ist AES-128 im ECB-Modus mit PKCS-Padding.
      </p>
      
      <p>Deine Aufgabe: Erhöhe deinen Goldbetrag auf 999999 und gib den neuen (verschlüsselten) Spielstand ein.</p>
    `,
      en: `
      <p>There are games that are a lot of fun — and there are those that ultimately just want to take your money out of your pocket.
      </p>
      
      <p>In games like these, it's tempting to use a hack to improve your score. Unfortunately, many developers are aware of this possibility and encrypt the save game.
      </p>
      
      <p>But no encryption is perfect! It is usually easy to find out the key and thus crack the encryption.
      </p>
      
      <p>Your current score is: <code>cc76663b7d1e97ea2455b1c25676f44794fec90b0a9b823f916bf79387de4238</code>
      </p>
      
      <p>The key is: <code>786d229b0de877774a2f676d5bd895c3</code>
      </p>
      
      <p>The encryption method is AES-128 in ECB mode with PKCS padding.
      </p>
      
      <p>Your task: Increase your gold amount to 999999 and enter the new (encrypted) score.</p>
    `,
    },
    check: (input) => {
      let answer = ''
      let state = {
        gold: undefined,
      }
      let decipher
      try {
        const key = Buffer.from('786d229b0de877774a2f676d5bd895c3', 'hex')
        const encrypted = Buffer.from(input, 'hex')
        decipher = crypto.createDecipheriv('aes-128-ecb', key, '')
        answer = decipher.update(encrypted).toString()
        answer += decipher.final().toString()
        state = JSON.parse(answer)
      } catch (e) {
        if (typeof e == 'object' && e && 'message' in e)
          answer = e.message + ': ' + answer
      }
      return {
        answer,
        correct: state.gold === 999999,
      }
    },
  },

  {
    id: 65,
    pos: { x: 1500, y: 1280 },
    title: { de: 'Spielstand', en: 'Game Save' },
    // date: '2021-03-19',
    deps: [89],
    html: {
      de: `
      <p>Die meisten Spiele speichern ihre Spielstände in einer verschlüsselten Form. Auch dieses kleine Spiel hier auf der Seite. Erreiche 999999 Gold und gibt deinen Spielstand als Antwort ein. Du kannst das Spiel spielen - oder es austricken.
      </p>
    
      <br /><br />
    
      <p>Dein Gold: <span id="gold-span">0</span><br /><button onclick="update()">Grind me!</button>
      </p>
      <p style="color:rgb(128,128,128)">Spielstand: <span id="spielstand"></span>
      </p>
      <script>
        function update() {
          let gold = parseInt(document.getElementById('gold-span').innerHTML);
          gold = gold + 1
          document.getElementById('gold-span').innerHTML = gold.toString()
          document.getElementById('spielstand').innerHTML = btoa(JSON.stringify({gold:gold}))
        }
      </script>
    `,
      en: `
        <p>Most games save their game states in an encrypted form. Even this little game here on the page. Reach 999999 gold and enter your game state as an answer. You can play the game — or trick it.
        </p>
        
        <br /><br />
        
        <p>Your gold: <span id="gold-span">0</span><br /><button onclick="update()">Grind me!</button>
        </p>
        <p style="color:rgb(128,128,128)">Game state: <span id="score"></span>
        </p>
        <script>
            function update() {
                let gold = parseInt(document.getElementById('gold-span').innerHTML);
                gold = gold + 1
                document.getElementById('gold-span').innerHTML = gold.toString()
                document.getElementById('score').innerHTML = btoa(JSON.stringify({gold:gold}))
            }
        </script>
    `,
    },
    check: (input) => {
      let answer = input
      /**  @type {{gold: number}} */
      let state = { gold: -1 }
      try {
        const data = Buffer.from(input, 'base64').toString('binary')
        state = JSON.parse(data)
        if (state.gold < 999999) {
          return { answer: state.gold + ' Gold', correct: false }
        }
      } catch (e) {
        if (
          typeof e == 'object' &&
          e &&
          'message' in e &&
          typeof e.message == 'string'
        )
          answer = e.message

        state = { gold: -1 }
      }
      return {
        answer,
        correct: state.gold === 999999,
      }
    },
  },

  {
    id: 71,
    pos: { x: 550, y: 1785 },
    title: { de: 'Sag mal', en: 'Say it' },
    // date: '2022-02-09',
    deps: [103],
    html: {
      de: `
      <p>Manche Missverständnisse sind ärgerlich. Zum Beispiel hast du gefragt, was im Bild zu sehen ist - und hast als Antwort <a href="/chals/sagmal.mp3">diese Sprachnachricht</a> erhalten:</p>
      
      <audio src="/chals/sagmal.mp3" controls>
      </audio>
      
      <p>Dein Gegenüber hat dir also tatsächlich die einzelnen Bytes der Bilddatei vorgelesen - eine Stunde lang! Jetzt liegt es an dir, daraus wieder ein Bild zu bauen. Sage mir, welches Wort auf diesem Bild steht.</p>
    `,
      en: `
      <p>Some misunderstandings are annoying. For example, you asked what was in the picture — and received <a href="/chals/sagmal.mp3">this voice message</a> in response:</p>
      
      <audio src="/chals/sagmal-en.mp3" controls>
      </audio>
      
        <p>Your counterpart has actually read the individual bytes of the image file to you – for an hour! Now it's up to you to build a picture out of it again. Tell me what word is written on this picture.</p>
    `,
    },
    solution: secrets('chal_71'),
  },

  {
    id: 72,
    pos: { x: 530, y: 1585 },
    title: { de: 'Labyrinth', en: 'Maze' },
    // date: '2022-02-09',
    deps: [103],
    html: {
      de: `
      <p>In den Tiefen dieser Website ist ein <a href="/chal/maze" target="_blank">Labyrinth</a> versteckt. Erforsche es und komme zurück, wenn du den Schatz gefunden hast.</p>
    `,
      en: `
      <p>Hidden in the depths of this website is a <a href="/chal/maze" target="_blank">maze</a>. Explore it and come back when you have found the treasure.</p>
    `,
    },
    solution: secrets('chal_72'),
  },

  {
    id: 73,
    pos: { x: 1060, y: 1805 },
    title: { de: 'Rufnummer', en: 'Phone number' },
    // date: '2022-02-09',
    deps: [96],
    html: {
      de: `
      <p>Das Festnetz wird heute nur noch wenig genutzt, andere Technologien haben es verdrängt. Aber halten wir für einen Moment die Zeit an und erinnern uns an <a href="/chals/chal73.wav">diese Töne</a>:</p>
    
      <audio src="/chals/chal73.wav" controls>
      </audio>
      
    `,
      en: `
        <p>Today landlines are rarely used, other technologies have replaced them. But let's stop time for a moment and remember <a href="/chals/chal73.wav">these sounds</a>:</p>
        
        <audio src="/chals/chal73.wav" controls>
        </audio>
    `,
    },
    solution: secrets('chal_73'),
  },

  {
    id: 74,
    pos: { x: 410, y: 1285 },
    title: { de: 'Blockchain', en: 'Blockchain' },
    // date: '2022-02-09',
    deps: [46],
    html: {
      de: `
      <p>Heute werden Bitcoins meist zur Spekulation verwendet. Dafür gedacht waren sie nicht. Stattdessen sollte das Konzept einer Blockchain dazu beitragen, eine Währung ohne Zentralbank zu ermöglichen. Eine große Herausforderung dabei ist es, Manipulationen durch Einzelne zu verhindern. Wer schreibt sich selber nicht gerne ein paar Euro auf das eigene Konto?</p>
      
      <p>Ein Proof-of-Work, wie diese Aufgabe es von dir erfordert, soll das verhindern. Um diese Aufgabe zu lösen, musst du mir erstmal beweisen, dass du hart gearbeitet hast.</p>
      
      <p>Deine Arbeit: Finde mir eine natürliche Zahl n. Der md5-hash von "hacktheweb" und n muss mit 6 Nullen anfangen. Das heißt konkret:</p>
      
      <p>
        n = 1 => md5("hacktheweb1") = 64c8b1f06b096bb17440d60b25c034ae => kein Treffer<br>
        n = 2 => md5("hacktheweb2") = afbab45a805ea5464e6378aaac3ae30f => kein Treffer<br>
        n = 3 => md5("hacktheweb3") = <strong style="color:green">0</strong>e23be04b8f478515df97f09c4751805 → 1 führende Null, du braucht 6<br>
        n = 4 => md5("hacktheweb4") = c0bad2e41a5e1cef51fab232d188d265 => kein Treffer<br>
        u.s.w.
      </p>
      
      <p>Eine passende Zahl n ist deine Antwort:</p>
    `,
      en: `
        <p>Today bitcoins are mostly used for speculation. That was not what they were intended for. Instead, the concept of a blockchain was supposed to make it possible to have a currency without a central bank. A major challenge is to prevent manipulation by individuals. Who doesn't like to write a few euros on their own account?</p>
        
        <p>A proof-of-work, as this task requires of you, is supposed to prevent this. To solve this task, you first have to prove to me that you have worked hard.</p>
        
        <p>Your work: Find me a natural number n. The md5 hash of "hacktheweb" and n must start with six zeros. That means concretely:</p>
        
        <p>
            n = 1 => md5("hacktheweb1") = 64c8b1f06b096bb17440d60b25c034ae => no match<br>
            n = 2 => md5("hacktheweb2") = afbab45a805ea5464e6378aaac3ae30f => no match<br>
            n = 3 => md5("hacktheweb3") = <strong style="color:green">0</strong>e23be04b8f478515df97f09c4751805 → 1 leading zero, you need 6<br>
            n = 4 => md5("hacktheweb4") = c0bad2e41a5e1cef51fab232d188d265 => no match<br>
            and so on
        </p>
        
        <p>A suitable number n is your answer:</p>
    `,
    },
    check: (answer, { req, App }) => {
      const hash = crypto
        .createHash('md5')
        .update('hacktheweb' + answer)
        .digest('hex')
        .toString()
      return {
        answer: hash,
        correct: hash.startsWith('000000'),
      }
    },
  },

  {
    id: 75,
    pos: { x: 1260, y: 1385 },
    title: { de: 'Verlosung', en: 'Raffle' },
    // date: '2022-02-09',
    deps: [65, 101],
    html: {
      de: `
      <p>Bei einer Verlosung gibt es immer viele Nieten und wenige Preise. In <a href="/chals/lostrommel.zip">dieser Lostrommel</a> finden sich 1000 Lose. Eine davon ist dein Hauptgewinn.</p>
    `,
      en: `
        <p>In a raffle, there are always many blanks and few prizes. In <a href="/chals/raffle.zip">this lottery drum</a> there are 1000 tickets. One of them is your main prize.</p>
    `,
    },
    solution: secrets('chal_75'),
  },

  {
    id: 76,
    pos: { x: 1100, y: 1200 },
    title: { de: 'Zeitraum', en: 'Timeframe' },
    // date: '2022-02-09',
    deps: [88, 105],
    html: {
      de: `<p>Schön, dass du schon so lange dabei bist. Nun, sage mir: Seit wie vielen Minuten genau bist du auf dieser Seite registriert?</p>`,
      en: `<p>It's nice that you've been here for so long. Now, tell me: How many minutes exactly have you been registered on this site?</p>`,
    },
    check: (answer, { req, App }) => {
      const str = parseInt(answer)
      const now = App.moment()
      const registered = App.moment(req.user?.createdAt)
      const diff = now.diff(registered, 'minutes')
      return {
        answer: str + ' Minuten',
        correct: str === diff,
      }
    },
  },

  {
    id: 82,
    pos: { x: 1030, y: 1100 },
    title: { de: 'Wegweiser', en: 'Guide' },
    // date: '2022-12-28',
    deps: [88],
    html: {
      de: `
      <p>Im Internet existiert mit dem DNS ein großes Wegweiser-System, welches dafür sorgt, dass zum Beispiel dein Browser über die Eingabe <code>hack.arrrg.de</code> meinen Server findet.</p>
      
      <p>Diese Wegweiser enthalten nicht nur passende IP-Adressen, sondern man kann dort auch beliebigen Text hinterlegen.
      </p>
      
      <p>Im TXT-Record dieser Domain findest du die Antwort.
      </p>
    `,
      en: `
      <p>There is a large guiding system on the Internet called DNS, which ensures that, for example, your browser can find my server by entering <code>hack.arrrg.de</code>.</p>
      
      <p>These DNS-Recordes not only contain suitable IP addresses, but you can also store any text there.
      </p>
      
      <p>You will find the answer in the TXT record of this domain.
      </p>
      
      <p>Note: "Die Antwort lautet ..." is German for "The answer is ..."</p>
    `,
    },
    solution: secrets('chal_82'),
  },

  {
    id: 83,
    pos: { x: 460, y: 1625 },
    title: { de: 'Freiheit', en: 'Freedom' },
    // date: '2022-12-28',
    deps: [103],
    html: {
      de: `
      <p>Die Karte von Hack The Web gibt dir die Freiheit, deinen eigenen Weg zu gehen. Und diese Freiheit wird hier auch gerne genutzt. Dadurch entstehen sehr viele individuelle Spielstände, die schön anzuschauen sind.</p>
      
      <p>Berechne bei dieser Aufgabe die genaue Anzahl der unterschiedlichen Spielstände. Beschränke dich dabei auf einen kleinen Ausschnitt von 11 Aufgaben im Anfangsbereich. Die aktuelle Karte kann von der Abbildung abweichen - nutze die hier gezeigte Version. Die Kanten des Grafs sind vom Start aus gerichtet. Wenn man "Taschenrechner" gelöst hat, wird "ROT13" freigeschaltet - aber nicht andersherum:
      </p>
      
      <p><img src="/chals/83_full2.png"  alt="freedom 1"></p>
      
      <p>Beispiel 1 - noch keine Aufgabe gelöst:
      </p>
      
      <p><img src="/chals/83_empty.png" alt="freedom 2"></p>
      
      <p>Beispiel 2 - zwei Aufgaben gelöst:
      </p>
      
      <p><img src="/chals/83_2.png" alt="freedom 3"></p>
      
      <p>Beispiel 3 - vier Aufgaben gelöst. Es ist dabei unerheblich, in welcher Reihenfolge die Aufgaben gelöst werden. Solange sie zur gleichen Karte führen, zählen sie als ein Spielstand.
      </p>
      
      <p><img src="/chals/83_4.png" alt="freedom 4"></p>
      
      <p>Die genaue Anzahl für diesen Anfangsbereich ist deine Antwort.
      </p>
    `,
      en: `
      <p>Hack The Web's map gives you the freedom to go your own way. And this freedom is also used here with pleasure. This creates a lot of individual game saves that are nice to look at.</p>
      
      <p>In this task, calculate the exact number of different scores. Limit yourself to a small selection of 11 tasks in the initial area. The current map may differ from the image — use the version shown here. The edges of the count are directed from the start. If you have solved Calculator, ROT13 will be unlocked — but not the other way around:
      </p>
      
      <p><img src="/chals/83_full2.png" alt="freedom 1"></p>
      
      <p>Example 1 — no task solved yet:
      </p>
      
      <p><img src="/chals/83_empty.png" alt="freedom 2"></p>
      
      <p>Example 2 — two tasks solved:
      </p>
      
      <p><img src="/chals/83_2.png" alt="freedom 3"></p>
      
      <p>Example 3 — four tasks solved. It is irrelevant in which order the tasks are solved. As long as they lead to the same map, they count as one score.
      </p>
      
      <p><img src="/chals/83_4.png" alt="freedom 4"></p>
      
      <p>The exact number of possible game states is the answer.
      </p>
    `,
    },
    solution: secrets('chal_83'),
  },

  {
    id: 85,
    pos: { x: 850, y: 1170 },
    title: { de: 'Schneehase', en: 'Snow hare' },
    // date: '2023-02-26',
    deps: [76, 82],
    html: {
      de: `
      <p><img src="/chals/chal85.png" alt="rabbit"></p>
    `,
      en: `
        <p><img src="/chals/chal85-en.png" alt="rabbit"></p>
    `,
    },
    solution: secrets('chal_85'),
  },

  {
    id: 88,
    pos: { x: 1200, y: 1060 },
    title: { de: 'Summe', en: 'Sum' },
    // date: '2023-04-05',
    deps: [57],
    html: {
      de: `
      <p>Du hast viele tolle Eigenschaften, wie hübsch, attraktiv und Computer Genius.</p>
      
      <p>Als Computer G kennst du sicher eine schnelle Möglichkeit, die Summe dieser Zahlen auszurechnen. Die Summe ist deine Antwort.
      </p>
      
      <div class="my-4"/>

      <table class="table-sm table-bordered" style="width:100%;text-align:center">
        <tbody>
          <tr>
            <td>9</td>
            <td>8</td>
            <td>19</td>
            <td>2</td>
            <td>7</td>
            <td>16</td>
            <td>11</td>
          </tr>
          <tr>
            <td>18</td>
            <td>12</td>
            <td>13</td>
            <td>1</td>
            <td>14</td>
            <td>20</td>
            <td>3</td>
          </tr>
          <tr>
            <td>10</td>
            <td>6</td>
            <td>17</td>
            <td>5</td>
            <td>4</td>
            <td>15</td>
            <td>21</td>
          </tr>
          <tr>
            <td>23</td>
            <td>22</td>
            <td>26</td>
            <td>29</td>
            <td>24</td>
            <td>2</td>
            <td>27</td>
          </tr>
          <tr>
            <td>25</td>
            <td>30</td>
            <td>42</td>
            <td>33</td>
            <td>35</td>
            <td>34</td>
            <td>21</td>
          </tr>
          <tr>
            <td>43</td>
            <td>52</td>
            <td>45</td>
            <td>17</td>
            <td>47</td>
            <td>33</td>
            <td>49</td>
          </tr>
          <tr>
            <td>50</td>
            <td>11</td>
            <td>25</td>
            <td>45</td>
            <td>54</td>
            <td>27</td>
            <td>56</td>
          </tr>
          <tr>
            <td>23</td>
            <td>22</td>
            <td>26</td>
            <td>29</td>
            <td>24</td>
            <td>28</td>
            <td>27</td>
          </tr>
        </tbody>
      </table>
      `,
      en: `
      <p>You have many great qualities, such as pretty, attractive and computer genius.</p>
      
      <p>As a computer G, you probably know a quick way to calculate the sum of these numbers. The sum is your answer.
      </p>
      
      <div class="my-4"/>

      <table class="table-sm table-bordered" style="width:100%;text-align:center">
        <tbody>
          <tr>
            <td>9</td>
            <td>8</td>
            <td>19</td>
            <td>2</td>
            <td>7</td>
            <td>16</td>
            <td>11</td>
          </tr>
          <tr>
            <td>18</td>
            <td>12</td>
            <td>13</td>
            <td>1</td>
            <td>14</td>
            <td>20</td>
            <td>3</td>
          </tr>
          <tr>
            <td>10</td>
            <td>6</td>
            <td>17</td>
            <td>5</td>
            <td>4</td>
            <td>15</td>
            <td>21</td>
          </tr>
          <tr>
            <td>23</td>
            <td>22</td>
            <td>26</td>
            <td>29</td>
            <td>24</td>
            <td>2</td>
            <td>27</td>
          </tr>
          <tr>
            <td>25</td>
            <td>30</td>
            <td>42</td>
            <td>33</td>
            <td>35</td>
            <td>34</td>
            <td>21</td>
          </tr>
          <tr>
            <td>43</td>
            <td>52</td>
            <td>45</td>
            <td>17</td>
            <td>47</td>
            <td>33</td>
            <td>49</td>
          </tr>
          <tr>
            <td>50</td>
            <td>11</td>
            <td>25</td>
            <td>45</td>
            <td>54</td>
            <td>27</td>
            <td>56</td>
          </tr>
          <tr>
            <td>23</td>
            <td>22</td>
            <td>26</td>
            <td>29</td>
            <td>24</td>
            <td>28</td>
            <td>27</td>
          </tr>
        </tbody>
      </table>
      `,
    },
    solution: secrets('chal_88'),
  },

  {
    id: 89,
    pos: { x: 1410, y: 1100 },
    title: { de: 'Lesezeichen', en: 'Bookmarks' },
    // date: '2023-04-08',
    deps: [57],
    render: ({ req }) => {
      const isGerman = req.lng === 'de'
      /**
       * @param {string} title
       * @param {string} id
       * @param {string} letter
       * @param {string} next
       * @param {boolean} isBroken
       */
      function generateSection(title, id, letter, next, isBroken) {
        return `
          <div style="margin-top:${Math.round(
            Math.random() * 700 + 700
          )}px;margin-bottom:${Math.round(Math.random() * 700 + 700)}px">
            <h1 id="${id}">${title}</h1>
            <p>${letter}. ${
              isBroken
                ? isGerman
                  ? `&lt;a href="#${next}"&gt;weiter&lt;/a&gt;`
                  : `&lt;a href="#${next}"&gt;next&lt;/a&gt;`
                : isGerman
                  ? `<a href="#${next}">weiter</a>`
                  : `<a href="#${next}">next</a>`
            }</p>
          </div>
        `
      }

      return isGerman
        ? `
        <p>Es gibt Tage, an denen weiß ich nicht wirklich, wo ich gerade stehe und wohin es geht. An solchen Tagen ist es schön zu wissen, dass du hier bist und ich nicht alleine bin.
        </p>
        
        <p>Leicht verirren kann man sich auch bei dieser Aufgabe. Solange du den Lesezeichen folgt, sollte das aber kein Problem sein.
        </p>
        
        <p>Beginne in <a href="#abs22">diesem Abschnitt</a> und achte auf die Buchstaben. Leider sind ein paar Lesezeichen defekt.</p>
        
        </p>
        
        ${generateSection(
          'Abschnitt 1 - Fortran',
          'abs1',
          'T',
          'challenge_answer',
          false
        )}
        ${generateSection('Abschnitt 2 - Lisp', 'abs2', 'T', 'abs7', false)}
        ${generateSection('Abschnitt 3 - COBOL', 'abs3', 'K', 'abs9', false)}
        ${generateSection('Abschnitt 4 - Algol', 'abs4', 'A', 'abs17', true)}
        ${generateSection('Abschnitt 5 - BASIC', 'abs5', 'M', 'abs14', false)}
        ${generateSection('Abschnitt 6 - PL/I', 'abs6', 'L', 'abs12', false)}
        ${generateSection('Abschnitt 7 - Simula', 'abs7', 'L', 'abs18', false)}
        ${generateSection('Abschnitt 8 - C', 'abs8', 'M', 'abs13', false)}
        ${generateSection('Abschnitt 9 - Prolog', 'abs9', 'E', 'abs4', false)}
        ${generateSection(
          'Abschnitt 10 - Smalltalk',
          'abs10',
          'I',
          'abs5',
          true
        )}
        ${generateSection('Abschnitt 11 - Pascal', 'abs11', 'I', 'abs9', false)}
        ${generateSection('Abschnitt 12 - Forth', 'abs12', 'R', 'abs2', false)}
        ${generateSection('Abschnitt 13 - SQL', 'abs13', 'E', 'abs27', false)}
        ${generateSection('Abschnitt 14 - Ada', 'abs14', 'A', 'abs1', false)}
        ${generateSection('Abschnitt 15 - C++', 'abs15', 'W', 'abs30', true)}
        ${generateSection(
          'Abschnitt 16 - Objective-C',
          'abs16',
          'T',
          'abs13',
          false
        )}
        ${generateSection(
          'Abschnitt 17 - Common Lisp',
          'abs17',
          'N',
          'abs26',
          false
        )}
        ${generateSection(
          'Abschnitt 18 - MATLAB',
          'abs18',
          'A',
          'abs21',
          false
        )}
        ${generateSection('Abschnitt 19 - Perl', 'abs19', 'U', 'abs25', false)}
        ${generateSection(
          'Abschnitt 20 - Python',
          'abs20',
          'H',
          'abs23',
          false
        )}
        ${generateSection('Abschnitt 21 - Ruby', 'abs21', 'U', 'abs16', true)}
        ${generateSection('Abschnitt 22 - Java', 'abs22', 'D', 'abs11', false)}
        ${generateSection(
          'Abschnitt 23 - JavaScript',
          'abs23',
          'E',
          'abs10',
          false
        )}
        ${generateSection('Abschnitt 24 - PHP', 'abs24', 'T', 'abs7', false)}
        ${generateSection('Abschnitt 25 - Swift', 'abs25', 'S', 'abs4', false)}
        ${generateSection(
          'Abschnitt 26 - Kotlin',
          'abs26',
          'T',
          'abs15',
          false
        )}
        ${generateSection('Abschnitt 27 - Rust', 'abs27', 'T', 'abs20', true)}
        ${generateSection(
          'Abschnitt 28 - TypeScript',
          'abs28',
          'K',
          'abs11',
          false
        )}
        ${generateSection('Abschnitt 29 - Go', 'abs29', 'I', 'abs23', false)}
        ${generateSection('Abschnitt 30 - Dart', 'abs30', 'O', 'abs12', false)}
      `
        : `
        <p>There are days when I don't really know where I am or where I'm going. On days like this, it's nice to know that you're here, and I'm not alone.
        </p>
        
        <p>It's easy to get lost with this task. As long as you follow the bookmarks, this shouldn't be a problem.
        </p>
        
        <p>Start in <a href="#abs26">this section</a> and pay attention to the letters. Unfortunately a few bookmarks are broken.</p>
        
        </p>
        
        ${generateSection(
          'Section 1 - Fortran',
          'abs1',
          'T',
          'challenge_answer',
          false
        )}
        ${generateSection('Section 2 - Lisp', 'abs2', 'T', 'abs7', false)}
        ${generateSection('Section 3 - COBOL', 'abs3', 'K', 'abs9', false)}
        ${generateSection('Section 4 - Algol', 'abs4', 'A', 'abs17', true)}
        ${generateSection('Section 5 - BASIC', 'abs5', 'M', 'abs14', false)}
        ${generateSection('Section 6 - PL/I', 'abs6', 'L', 'abs12', false)}
        ${generateSection('Section 7 - Simula', 'abs7', 'L', 'abs18', false)}
        ${generateSection('Section 8 - C', 'abs8', 'M', 'abs13', false)}
        ${generateSection('Section 9 - Prologue', 'abs9', 'E', 'abs4', false)}
        ${generateSection('Section 10 - Smalltalk', 'abs10', 'I', 'abs5', true)}
        ${generateSection('Section 11 - Pascal', 'abs11', 'I', 'abs21', false)}
        ${generateSection('Section 12 - Forth', 'abs12', 'R', 'abs11', false)}
        ${generateSection('Section 13 - SQL', 'abs13', 'E', 'abs12', false)}
        ${generateSection('Section 14 - Ada', 'abs14', 'A', 'abs1', false)}
        ${generateSection('Section 15 - C++', 'abs15', 'W', 'abs13', true)}
        ${generateSection(
          'Section 16 - Objective-C',
          'abs16',
          'H',
          'abs23',
          false
        )}
        ${generateSection(
          'Section 17 - Common Lisp',
          'abs17',
          'N',
          'abs30',
          false
        )}
        ${generateSection('Section 18 - MATLAB', 'abs18', 'A', 'abs21', false)}
        ${generateSection('Section 19 - Perl', 'abs19', 'U', 'abs25', false)}
        ${generateSection('Section 20 - Python', 'abs20', 'H', 'abs9', false)}
        ${generateSection('Section 21 - Ruby', 'abs21', 'S', 'abs16', true)}
        ${generateSection('Section 22 - Java', 'abs22', 'D', 'abs11', false)}
        ${generateSection(
          'Section 23 - JavaScript',
          'abs23',
          'E',
          'abs10',
          false
        )}
        ${generateSection('Section 24 - PHP', 'abs24', 'T', 'abs7', false)}
        ${generateSection('Section 25 - Swift', 'abs25', 'S', 'abs4', false)}
        ${generateSection('Section 26 - Kotlin', 'abs26', 'T', 'abs20', false)}
        ${generateSection('Section 27 - Rust', 'abs27', 'T', 'abs20', true)}
        ${generateSection(
          'Section 28 - TypeScript',
          'abs28',
          'K',
          'abs11',
          false
        )}
        ${generateSection('Section 29 - Go', 'abs29', 'I', 'abs23', false)}
        ${generateSection('Section 30 - Dart', 'abs30', 'S', 'abs15', false)}
      `
    },
    solution: secrets('chal_89'),
  },

  {
    id: 90,
    pos: { x: 1215, y: 1560 },
    title: { de: 'Orakel', en: 'Oracle' },
    // date: '2023-04-12',
    deps: [44, 75],
    html: {
      de: `
      <p>Ich spüre bei dir so viel Energie! Ich bewundere Menschen, die eine solche Ausstrahlung haben.
      </p>
      
      <p>Mein Orakel, das ich für diese Aufgabe beauftragt habe, strahlt leider nicht vor Energie. Täglich gibt es nur einen Zeitraum von 15 Minuten, in denen das Orakel zu sprechen ist.
      </p>
      
      <p>Sprich mit <a href="/chal/orakel">dem Orakel</a>, um die Antwort zu erfahren.
      </p>
    `,
      en: `
        <p>I feel so much energy from you! I admire people who have such charisma.
        </p>
        
        <p>Unfortunately, my oracle, which I commissioned for this task, does not radiate energy. There is only a period of 15 minutes each day in which the oracle can speak.
        </p>
        
        <p>Talk to <a href="/chal/orakel">the oracle</a> to find out the answer.
        </p>
    `,
    },
    solution: secrets('chal_90'),
  },

  {
    id: 91,
    pos: { x: 760, y: 1340 },
    title: { de: 'Kekse', en: 'Cookies' },
    // date: '2023-04-15',
    deps: [94],
    html: {
      de: `
      <p>Es gibt Kekse, frisch aus dem Backofen - nur für dich persönlich gebacken, my dear friend! Sie sind gleich fertig:
      </p>
      
      <p id="countdown"></p>
      
      <div id="backdrop" style="display:none;position:fixed;background-color:rgba(255, 255, 255, 0.5);top:0;left:0;right:0;bottom:0">
      </div>
      
      <div id="modal" style="display:none;position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; border-radius:5px; padding:20px; box-shadow:0 0 10px rgba(0,0,0,0.5); z-index:9999; color:black; width: 500px;">
        <h2 style="margin-top:0;">Cookie-Banner</h2>
        <p>Diese Seite verwendet Cookies. Durch das Zustimmen wird deine Antwort in einem Cookie auf deinem Rechner gespeichert.</p>
        <button type="button" class="btn btn-success" onclick="load()">Zustimmen</button>
      </div>
      
      <script>
        let time = 10
      
        function countdown() {
          document.getElementById('countdown').innerHTML = \`Warte noch \$\{time\} Sekunden ...\`
          time--
          if (time < 0) {
            document.getElementById('modal').style.display = 'block'
            document.getElementById('backdrop').style.display = 'block'
            document.getElementById('countdown').innerHTML = '&nbsp;'
          } else {
            setTimeout(countdown, 1000)
          }
        }
        
        window.onload = countdown
        
        function load() {
          const xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", '/chal/chal91', true); // true for asynchronous 
          xmlHttp.send(null);
          document.getElementById('modal').style.display = 'none'
          document.getElementById('backdrop').style.display = 'none'
        }
      </script>
    `,
      en: `
      <p>There are cookies fresh from the oven — baked just for you, my dear friend! You're almost done:
      </p>
      
      <p id="countdown"></p>
      
      <div id="backdrop" style="display:none;position:fixed;background-color:rgba(255, 255, 255, 0.5);top:0;left:0;right:0;bottom:0">
      </div>
      
      <div id="modal" style="display:none;position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; border-radius:5px; padding:20px; box-shadow:0 0 10px rgba(0,0,0,0.5); z-index:9999; color:black; width: 500px;">
        <h2 style="margin-top:0;">Cookie-Banner</h2>
        <p>This site uses cookies. By agreeing, your answer will be saved in a cookie on your computer.</p>
        <button type="button" class="btn btn-success" onclick="load()">Zustimmen</button>
      </div>
      
      <script>
        let time = 10
      
        function countdown() {
          document.getElementById('countdown').innerHTML = \`Wait for \$\{time\} seconds...\`
          time--
          if (time < 0) {
            document.getElementById('modal').style.display = 'block'
            document.getElementById('backdrop').style.display = 'block'
            document.getElementById('countdown').innerHTML = '&nbsp;'
          } else {
            setTimeout(countdown, 1000)
          }
        }
        
        window.onload = countdown
        
        function load() {
          const xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", '/chal/chal91', true); // true for asynchronous 
          xmlHttp.send(null);
          document.getElementById('modal').style.display = 'none'
          document.getElementById('backdrop').style.display = 'none'
        }
      </script>
    `,
    },
    solution: secrets('chal_91'),
  },

  {
    id: 92,
    pos: { x: 1060, y: 1510 },
    title: { de: 'Grundgesetz', en: 'Constitution' },
    // date: '2023-04-19',
    deps: [75, 99, 109],
    html: {
      de: `
      <p>Erst wenn ich mich sicher fühle, kann ich meine spielerische Seite zum Vorschein bringen. Oft werde ich dafür nur schräg angeschaut. Bei dir muss ich mir keine Sorgen machen. Hier fühle ich mich sicher.
      </p>
      
      <p>Sicherheit soll auch das Grundgesetz geben. Hier siehst du die ersten acht Artikel. Doch worum geht es darin eigentlich? Es gibt ein Wort, das in diesem Text genau 10 Mal vorkommt. Dieses Wort ist deine Antwort.
      </p>
      
      <div class="m-4"></div>
      
      <pre style="height:500px; overflow:auto; white-space: pre-wrap; border:1px rgb(128,128,128) solid; padding: 8px">
Art 1 
(1) Die Würde des Menschen ist unantastbar. Sie zu achten und zu schützen ist Verpflichtung aller staatlichen Gewalt.
(2) Das Deutsche Volk bekennt sich darum zu unverletzlichen und unveräußerlichen Menschenrechten als Grundlage jeder menschlichen Gemeinschaft, des Friedens und der Gerechtigkeit in der Welt.
(3) Die nachfolgenden Grundrechte binden Gesetzgebung, vollziehende Gewalt und Rechtsprechung als unmittelbar geltendes Recht.

Art 2 
(1) Jeder hat das Recht auf die freie Entfaltung seiner Persönlichkeit, soweit er nicht die Rechte anderer verletzt und nicht gegen die verfassungsmäßige Ordnung oder das Sittengesetz verstößt.
(2) Jeder hat das Recht auf Leben und körperliche Unversehrtheit. Die Freiheit der Person ist unverletzlich. In diese Rechte darf nur auf Grund eines Gesetzes eingegriffen werden.

Art 3 
(1) Alle Menschen sind vor dem Gesetz gleich.
(2) Männer und Frauen sind gleichberechtigt. Der Staat fördert die tatsächliche Durchsetzung der Gleichberechtigung von Frauen und Männern und wirkt auf die Beseitigung bestehender Nachteile hin.
(3) Niemand darf wegen seines Geschlechtes, seiner Abstammung, seiner Rasse, seiner Sprache, seiner Heimat und Herkunft, seines Glaubens, seiner religiösen oder politischen Anschauungen benachteiligt oder bevorzugt werden. Niemand darf wegen seiner Behinderung benachteiligt werden.

Art 4 
(1) Die Freiheit des Glaubens, des Gewissens und die Freiheit des religiösen und weltanschaulichen Bekenntnisses sind unverletzlich.
(2) Die ungestörte Religionsausübung wird gewährleistet.
(3) Niemand darf gegen sein Gewissen zum Kriegsdienst mit der Waffe gezwungen werden. Das Nähere regelt ein Bundesgesetz.

Art 5 
(1) Jeder hat das Recht, seine Meinung in Wort, Schrift und Bild frei zu äußern und zu verbreiten und sich aus allgemein zugänglichen Quellen ungehindert zu unterrichten. Die Pressefreiheit und die Freiheit der Berichterstattung durch Rundfunk und Film werden gewährleistet. Eine Zensur findet nicht statt.
(2) Diese Rechte finden ihre Schranken in den Vorschriften der allgemeinen Gesetze, den gesetzlichen Bestimmungen zum Schutze der Jugend und in dem Recht der persönlichen Ehre.
(3) Kunst und Wissenschaft, Forschung und Lehre sind frei. Die Freiheit der Lehre entbindet nicht von der Treue zur Verfassung.

Art 6 
(1) Ehe und Familie stehen unter dem besonderen Schutze der staatlichen Ordnung.
(2) Pflege und Erziehung der Kinder sind das natürliche Recht der Eltern und die zuvörderst ihnen obliegende Pflicht. Über ihre Betätigung wacht die staatliche Gemeinschaft.
(3) Gegen den Willen der Erziehungsberechtigten dürfen Kinder nur auf Grund eines Gesetzes von der Familie getrennt werden, wenn die Erziehungsberechtigten versagen oder wenn die Kinder aus anderen Gründen zu verwahrlosen drohen.
(4) Jede Mutter hat Anspruch auf den Schutz und die Fürsorge der Gemeinschaft.
(5) Den unehelichen Kindern sind durch die Gesetzgebung die gleichen Bedingungen für ihre leibliche und seelische Entwicklung und ihre Stellung in der Gesellschaft zu schaffen wie den ehelichen Kindern.

Art 7 
(1) Das gesamte Schulwesen steht unter der Aufsicht des Staates.
(2) Die Erziehungsberechtigten haben das Recht, über die Teilnahme des Kindes am Religionsunterricht zu bestimmen.
(3) Der Religionsunterricht ist in den öffentlichen Schulen mit Ausnahme der bekenntnisfreien Schulen ordentliches Lehrfach. Unbeschadet des staatlichen Aufsichtsrechtes wird der Religionsunterricht in Übereinstimmung mit den Grundsätzen der Religionsgemeinschaften erteilt. Kein Lehrer darf gegen seinen Willen verpflichtet werden, Religionsunterricht zu erteilen.
(4) Das Recht zur Errichtung von privaten Schulen wird gewährleistet. Private Schulen als Ersatz für öffentliche Schulen bedürfen der Genehmigung des Staates und unterstehen den Landesgesetzen. Die Genehmigung ist zu erteilen, wenn die privaten Schulen in ihren Lehrzielen und Einrichtungen sowie in der wissenschaftlichen Ausbildung ihrer Lehrkräfte nicht hinter den öffentlichen Schulen zurückstehen und eine Sonderung der Schüler nach den Besitzverhältnissen der Eltern nicht gefördert wird. Die Genehmigung ist zu versagen, wenn die wirtschaftliche und rechtliche Stellung der Lehrkräfte nicht genügend gesichert ist.
(5) Eine private Volksschule ist nur zuzulassen, wenn die Unterrichtsverwaltung ein besonderes pädagogisches Interesse anerkennt oder, auf Antrag von Erziehungsberechtigten, wenn sie als Gemeinschaftsschule, als Bekenntnis- oder Weltanschauungsschule errichtet werden soll und eine öffentliche Volksschule dieser Art in der Gemeinde nicht besteht.
(6) Vorschulen bleiben aufgehoben.

Art 8 
(1) Alle Deutschen haben das Recht, sich ohne Anmeldung oder Erlaubnis friedlich und ohne Waffen zu versammeln.
(2) Für Versammlungen unter freiem Himmel kann dieses Recht durch Gesetz oder auf Grund eines Gesetzes beschränkt werden.
      </pre>
      
      <p><small>Als Wort zählt eine zusammenhängende Folge von Buchstaben und Umlauten. Groß-/Kleinschreibung wird nicht beachtet. Verschiedene grammatikalische Formen zählen als unterschiedliche Wörter.</small>
      </p>
    `,
      en: `
      <p>Only when I feel safe can I bring out my playful side. I often get looked at sideways for this. I don't have to worry about you. I feel safe here.
      </p>
      
      <p>The constiution should also provide security. Here you can see the first eight articles of the German "Grund Gesetz". But what is it actually about? There is a word that appears exactly 10 times in this text. This word is your answer.
      </p>
      
      <p>Note: You just have to find the word that appears 10 times and for that you don't have to understand the meaning. But you can, of course, still look for a translation if you want to find out anyway :)</p>
      
      <div class="m-4"></div>
      
      <pre style="height:500px; overflow:auto; white-space: pre-wrap; border:1px rgb(128,128,128) solid; padding: 8px">
Art 1 
(1) Die Würde des Menschen ist unantastbar. Sie zu achten und zu schützen ist Verpflichtung aller staatlichen Gewalt.
(2) Das Deutsche Volk bekennt sich darum zu unverletzlichen und unveräußerlichen Menschenrechten als Grundlage jeder menschlichen Gemeinschaft, des Friedens und der Gerechtigkeit in der Welt.
(3) Die nachfolgenden Grundrechte binden Gesetzgebung, vollziehende Gewalt und Rechtsprechung als unmittelbar geltendes Recht.

Art 2 
(1) Jeder hat das Recht auf die freie Entfaltung seiner Persönlichkeit, soweit er nicht die Rechte anderer verletzt und nicht gegen die verfassungsmäßige Ordnung oder das Sittengesetz verstößt.
(2) Jeder hat das Recht auf Leben und körperliche Unversehrtheit. Die Freiheit der Person ist unverletzlich. In diese Rechte darf nur auf Grund eines Gesetzes eingegriffen werden.

Art 3 
(1) Alle Menschen sind vor dem Gesetz gleich.
(2) Männer und Frauen sind gleichberechtigt. Der Staat fördert die tatsächliche Durchsetzung der Gleichberechtigung von Frauen und Männern und wirkt auf die Beseitigung bestehender Nachteile hin.
(3) Niemand darf wegen seines Geschlechtes, seiner Abstammung, seiner Rasse, seiner Sprache, seiner Heimat und Herkunft, seines Glaubens, seiner religiösen oder politischen Anschauungen benachteiligt oder bevorzugt werden. Niemand darf wegen seiner Behinderung benachteiligt werden.

Art 4 
(1) Die Freiheit des Glaubens, des Gewissens und die Freiheit des religiösen und weltanschaulichen Bekenntnisses sind unverletzlich.
(2) Die ungestörte Religionsausübung wird gewährleistet.
(3) Niemand darf gegen sein Gewissen zum Kriegsdienst mit der Waffe gezwungen werden. Das Nähere regelt ein Bundesgesetz.

Art 5 
(1) Jeder hat das Recht, seine Meinung in Wort, Schrift und Bild frei zu äußern und zu verbreiten und sich aus allgemein zugänglichen Quellen ungehindert zu unterrichten. Die Pressefreiheit und die Freiheit der Berichterstattung durch Rundfunk und Film werden gewährleistet. Eine Zensur findet nicht statt.
(2) Diese Rechte finden ihre Schranken in den Vorschriften der allgemeinen Gesetze, den gesetzlichen Bestimmungen zum Schutze der Jugend und in dem Recht der persönlichen Ehre.
(3) Kunst und Wissenschaft, Forschung und Lehre sind frei. Die Freiheit der Lehre entbindet nicht von der Treue zur Verfassung.

Art 6 
(1) Ehe und Familie stehen unter dem besonderen Schutze der staatlichen Ordnung.
(2) Pflege und Erziehung der Kinder sind das natürliche Recht der Eltern und die zuvörderst ihnen obliegende Pflicht. Über ihre Betätigung wacht die staatliche Gemeinschaft.
(3) Gegen den Willen der Erziehungsberechtigten dürfen Kinder nur auf Grund eines Gesetzes von der Familie getrennt werden, wenn die Erziehungsberechtigten versagen oder wenn die Kinder aus anderen Gründen zu verwahrlosen drohen.
(4) Jede Mutter hat Anspruch auf den Schutz und die Fürsorge der Gemeinschaft.
(5) Den unehelichen Kindern sind durch die Gesetzgebung die gleichen Bedingungen für ihre leibliche und seelische Entwicklung und ihre Stellung in der Gesellschaft zu schaffen wie den ehelichen Kindern.

Art 7 
(1) Das gesamte Schulwesen steht unter der Aufsicht des Staates.
(2) Die Erziehungsberechtigten haben das Recht, über die Teilnahme des Kindes am Religionsunterricht zu bestimmen.
(3) Der Religionsunterricht ist in den öffentlichen Schulen mit Ausnahme der bekenntnisfreien Schulen ordentliches Lehrfach. Unbeschadet des staatlichen Aufsichtsrechtes wird der Religionsunterricht in Übereinstimmung mit den Grundsätzen der Religionsgemeinschaften erteilt. Kein Lehrer darf gegen seinen Willen verpflichtet werden, Religionsunterricht zu erteilen.
(4) Das Recht zur Errichtung von privaten Schulen wird gewährleistet. Private Schulen als Ersatz für öffentliche Schulen bedürfen der Genehmigung des Staates und unterstehen den Landesgesetzen. Die Genehmigung ist zu erteilen, wenn die privaten Schulen in ihren Lehrzielen und Einrichtungen sowie in der wissenschaftlichen Ausbildung ihrer Lehrkräfte nicht hinter den öffentlichen Schulen zurückstehen und eine Sonderung der Schüler nach den Besitzverhältnissen der Eltern nicht gefördert wird. Die Genehmigung ist zu versagen, wenn die wirtschaftliche und rechtliche Stellung der Lehrkräfte nicht genügend gesichert ist.
(5) Eine private Volksschule ist nur zuzulassen, wenn die Unterrichtsverwaltung ein besonderes pädagogisches Interesse anerkennt oder, auf Antrag von Erziehungsberechtigten, wenn sie als Gemeinschaftsschule, als Bekenntnis- oder Weltanschauungsschule errichtet werden soll und eine öffentliche Volksschule dieser Art in der Gemeinde nicht besteht.
(6) Vorschulen bleiben aufgehoben.

Art 8 
(1) Alle Deutschen haben das Recht, sich ohne Anmeldung oder Erlaubnis friedlich und ohne Waffen zu versammeln.
(2) Für Versammlungen unter freiem Himmel kann dieses Recht durch Gesetz oder auf Grund eines Gesetzes beschränkt werden.
      </pre>
      
      <p><small>A word counts as a coherent sequence of letters and umlauts. Upper/lower case is not taken into account. Different grammatical forms count as different words.</small>
      </p>
    `,
    },
    solution: secrets('chal_92'),
  },

  {
    id: 93,
    pos: { x: 450, y: 1770 },
    title: { de: 'Cipher', en: 'Cipher' },
    // date: '2023-04-22',
    deps: [103],
    html: {
      de: `
      <p>Du bist weit gekommen und längst kein Scriptkiddie mehr. Nein, du bist eher 1337 und hast voll Skill drauf 💪!
      </p>
      
      <p>Hacker*innen nutzen viele Fachbegriffe und einer meiner Favoriten ist <strong>Cipher</strong>. Ein Cipher ist ein Algorithmus, der Nachrichten ver- und entschlüsselt.
      </p>
      
      <p>Eine besondere Form davon sind invertierbare Cipher. Das sind Algorithmen, die beim Ver- und Entschlüsseln gleich funktionieren. Hier ist ein Beispiel in Pseudo-Code:
      </p>
      
      <code><pre style="font-size:14px">function cipher(input_bytes) {
    key = 42
    output_bytes = []

    for (byte in input_bytes) {
        xor_byte = byte XOR key
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = ".............???............."
bytes = ascii_string_to_bytes(message)
encrypted_bytes = cipher(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>Die Ausgabe dieses Programms siehst so aus:
      </p>
      
      <p><code>6d5f5e4f0a6b58484f435e0b0a6e434f0a6b445e5d45585e0a464b5f5e4f5e0a6b6f7904</code>
      </p>
    `,
      en: `
      <p>You've come a long way and are no longer a skid. No, you're more like 1337 and have full skill 💪!
      </p>
      
      <p>Hackers use many technical terms, and one of my favorites is <strong>Cipher</strong>. A cipher is an algorithm that encrypts and decrypts messages.
      </p>
      
      <p>A special form of these are invertible ciphers. These are algorithms that work the same way when encrypting and decrypting. Here is an example in pseudocode:
      </p>
      
      <code><pre style="font-size:14px">function cipher(input_bytes) {
    key = 42
    output_bytes = []

    for (byte in input_bytes) {
        xor_byte = byte XOR key
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = ".............???............."
bytes = ascii_string_to_bytes(message)
encrypted_bytes = cipher(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>The output of this program looks like this:
      </p>
      
      <p><code>6d45454e0a4045480b0a7e424f0a4b44595d4f580a43590a6b6f7904</code>
      </p>
    `,
    },
    solution: secrets('chal_93'),
  },

  {
    id: 94,
    pos: { x: 940, y: 1220 },
    title: { de: 'Original', en: 'Original' },
    // date: '2023-04-26',
    deps: [76],
    html: {
      de: `
      <p>Du bist ein Original und kein Fake. Lasse dich nicht in eine andere Identität drängen, als du bist.
      </p>
      
      <p>Dieses Bild ist kein Original - zumindest nicht von mir. Es findet sich auf hunderten Webseiten. Doch wo kommt das Original her?
      </p>
      
      <p><img src="/chals/chal94.jpg" style="max-width: 400px"  alt="kids"/></p>
      
      <p>Deine Antwort ist der Vorname der ursprünglichen Fotografin.
      </p>
    `,
      en: `
      <p>You are an original and not a fake. Don't allow yourself to be forced into an identity other than who you are.
      </p>
      
      <p>This picture is not an original — at least not from me. It can be found on hundreds of websites. But where does the original come from?
      </p>
      
      <p><img src="/chals/chal94.jpg" style="max-width: 400px"  alt="kids"/></p>
      
      <p>Your answer is the first name of the original photographer.
      </p>
    `,
    },
    solution: secrets('chal_94'),
  },

  {
    id: 95,
    pos: { x: 500, y: 1360 },
    title: { de: 'Handschrift', en: 'Handwriting' },
    // date: '2023-04-29',
    deps: [40, 46],
    html: {
      de: `
      <p>Hilfe! Ich brauche deinen technischen Rat. Wie macht man es nochmal, dass man eine Schriftart im Browser einbindet?</p>
      
      <p>&lt;span style=&quot;font: Hack The Web&quot;&gt;ABC DEFGHIJ KLMNOP QRSTUVWXYZ.&lt;/span&gt;</p>
      
      <p>&lt;font src=&quot;/chals/HackTheWeb-Regular.otf&quot; /&gt;</p>
    `,
      en: `
        <p>Help! I need your technical advice. How do you embed a font in the browser again?</p>
        
        <p>&lt;span style=&quot;font: Hack The Web&quot;&gt;ABC EFGHIJ LM OPQRSTUVWX..&lt;/span&gt;</p>
        
        <p>&lt;font src=&quot;/chals/HackTheWebEnglish-Regular.otf&quot; /&gt;</p>
    `,
    },
    solution: secrets('chal_95'),
  },

  {
    id: 96,
    pos: { x: 1040, y: 1670 },
    title: { de: 'TikTok', en: 'TikTok' },
    // date: '2023-05-03',
    deps: [90, 92],
    html: {
      de: `
      <p>Hast du heute etwas geschafft, worauf du stolz bist? Herzlichen Glückwunsch. Und wenn nicht, halb so wild. Morgen ist auch noch ein Tag.
      </p>
      
      <p>Jetzt ist erstmal Zeit, sich ein wenig zu entspannen und sich unterhalten zu lassen, zum Beispiel mit Videos von <code>@kallmekris</code> auf TikTok.
      </p>
      
      <p>Du möchtest eine Herausforderung? Ok, hier deine Aufgabe: Scrolle runter bis zum ersten Video. Wie lautet die Beschreibung*?
      </p>
      
      <p><small>* 4 Wörter, keine Hashtags</small></p>
    `,
      en: `
      <p>Did you accomplish something today that you are proud of? Congratulations. And if not, it's not so bad. Tomorrow is also a day.
      </p>
      
      <p>Now it's time to relax a little and be entertained, for example, with videos from <code>@kallmekris</code> on TikTok.
      </p>
      
      <p>You want a challenge? Ok, here's your task: Scroll down to the first video. What is the description*?
      </p>
      
      <p><small>* four words, no hashtags</small></p>
    `,
    },
    solution: secrets('chal_96'),
  },

  {
    id: 97,
    pos: { x: 370, y: 1850 },
    title: { de: 'Cipher II', en: 'Cipher II' },
    // date: '2023-05-06',
    deps: [93],
    html: {
      de: `
      <p>Dein scharfer Blick und deine Erfahrung als Hacker*in lassen sich nicht täuschen: Viel Sicherheit bringt der Cipher aus der letzten Aufgaben nicht.
      </p>
      
      <p>Daher gibt es nun eine aktualisierte Version, die deutlich mehr Sicherheit bieten soll:
      </p>
      
      <code><pre style="font-size:14px">function cipher_ii(input_bytes) {
    key = < ??? >
    previousOutput = 0
    
    output_bytes = []

    for (byte in input_bytes) {
        current_key = previousOutput XOR key
        xor_byte = byte XOR current_key
        previousOutput = xor_byte
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = < ??? >
bytes = ascii_string_to_bytes(message)
encrypted_bytes = cipher_ii(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>Der Schlüssel ist eine Zahl zwischen 0 und 255. Die Ausgabe dieses Programms sieht so aus:
      </p>
      
      <p><code>4c2f513f5a3256355d3e577a1e60193458204e2b066f0b631d750a27690d70157d022f4c2846235a771b740a68097108255b3f51345c23002d680c641b365f3753305875395a23593b443d0a27781c6206600221</code>
      </p>
    `,
      en: `
      <p>Your sharp eye and your experience as a hacker cannot be fooled: the cipher from the last tasks does not provide much security.
      </p>
      
      <p>Therefore, there is now an updated version that is intended to offer significantly more security:
      </p>
      
      <code><pre style="font-size:14px">function cipher_ii(input_bytes) {
    key = < ??? >
    previousOutput = 0
    
    output_bytes = []

    for (byte in input_bytes) {
        current_key = previousOutput XOR key
        xor_byte = byte XOR current_key
        previousOutput = xor_byte
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = < ??? >
bytes = ascii_string_to_bytes(message)
encrypted_bytes = cipher_ii(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>The key is a number between 0 and 255. The output of this program looks like this:
      </p>
      
      <p><code>4c314c205f37542d4c3819345c274f2c01781d79072a44205d38502f0266183556344d600c631d7f1e661f7716624f3159374f30587b56137b046c46381561037b0429452658224a35022f70146a0e680a29</code>
      </p>
    `,
    },
    solution: secrets('chal_97'),
  },

  {
    id: 98,
    pos: { x: 900, y: 1660 },
    title: { de: 'SQL Tutorial', en: 'SQL Tutorial' },
    // date: '2023-05-10',
    deps: [92],
    html: {
      de: `
      <p>Stark von dir, dass du dich immer wieder an neue Herausforderung herantraust und bereit bist, neue Dinge zu lernen. Das erfordert viel Motivation und Mut.
      </p>
      
      <p>In dieser Aufgabe geht es um SQL. Um dich zu unterstützen habe ich ein Mini-Tutorial gebaut. Wir schauen uns die Tabelle <code>Geheimnis</code> mit den Spalten <code>schlüssel</code> und <code>wert</code> an. Du kannst deine Anfragen direkt ausprobieren. Gib verschiedene Eingaben für den Schlüssel ein und schaue dir das Ergebnis an. Probiere es mit apfel, mandarine und wassermelone.
      </p>
      
      <p><code>SELECT * FROM Geheimnis WHERE schlüssel='<input id="value" style="margin-left:8px; margin-right:8px;">';</code></p>
      
      <p><span id="runner" class="d-none"><button class="btn btn-sm btn-primary">Ausführen</button></span></p>
      
      <pre id="output" style="margin-top:24px;margin-bottom:24px;padding:8px;" class="alert alert-secondary">&nbsp;</pre>
      
      <p>In der Datenbank ist ein weiterer Eintrag mit der Antwort gespeichert. Der Schlüssel dafür ist nicht bekannt. Damit sollte das Geheimnis sicher sein.
      </p>
      
      <script src="/sql.js"></script>
      <script src="/chals/chal98_2.js"></script>
    `,
      en: `
      <p>It's great that you always dare to take on new challenges and are willing to learn new things. This requires a lot of motivation and courage.
      </p>
      
      <p>This task is about SQL. To support you, I built a mini tutorial. We look at the table <code>Secret</code> with the columns <code>key</code> and <code>value</code>. You can try out your requests directly. Enter various inputs for the key and see the result. Try it with apple, tangerine and watermelon.
      </p>
      
      <p><code>SELECT * FROM Secret WHERE key='<input id="value" style="margin-left:8px; margin-right:8px;">';</code></p>
      
      <p><span id="runner" class="d-none"><button class="btn btn-sm btn-primary">Execute</button></span></p>
      
      <pre id="output" style="margin-top:24px;margin-bottom:24px;padding:8px;" class="alert alert-secondary">&nbsp;</pre>
      
      <p>Another entry with the answer is stored in the database. The key to this is not known. This should keep the secret safe.
      </p>
      
      <script src="/sql.js"></script>
      <script>window.htw_locale = 'en'</script>
      <script src="/chals/chal98_2.js"></script>
    `,
    },
    solution: secrets('chal_98'),
  },

  {
    id: 99,
    pos: { x: 1020, y: 1300 },
    title: { de: 'Regeln', en: 'Rules' },
    // date: '2023-05-13',
    deps: [76, 108],
    html: {
      de: `
      <p>Ich spüre, dass heute was anders ist: Hast du eine neue Frisur oder einen neuen Pulli? Etwas ist heute anders und das gefällt mir!
      </p>
      
      <p>Schön, dass du so regelmäßig hier vorbeischaust. Tja, Regeln: Sie helfen uns, unser Miteinander besser zu gestalten. Viele Regeln sind wahrscheinlich nicht so sinnvoll, aber es gibt schon einige, die wertvoll sind.
      </p>
      
      <p>Auf unserem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> haben wir nur drei Regeln. Wie lautet die zweite Regel?
      </p>
    `,
      en: `
      <p>I sense that something is different today: Do you have a new hairstyle or a new sweater? Something is different today and I like that!
      </p>
      
      <p>It's nice that you stop by here so regularly. Well, rules: They help us to organize our interactions better. Many rules probably don't make much sense, but there are some that are valuable.
      </p>
      
      <p>On our <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord server</a> we only have four rules. What is the second rule (in the german rule channel)?
      </p>
      
      
      <p>
         Note: Hack the Web is a German website, which is why the Discord server is in German. Please write only in German on the server except the channels labeled as english (e.g., forum-en or general-en). But with the help of a translator, you should be able to find the answer anyway ;)
       </p>
    `,
    },
    solution: secrets('chal_99'),
  },

  {
    id: 100,
    pos: { x: 650, y: 1490 },
    title: { de: 'Nostalgie', en: 'Nostalgia' },
    // date: '2023-05-17',
    deps: [40, 91, 106],
    render: ({ req }) => {
      const isGerman = req.lng == 'de'
      return isGerman
        ? `
      <p>Du kannst gut zuhören! Und das nicht nur bei neuen und modernen Entwicklungen, sondern auch bei Dingen, die bereits Teil der Geschichte sind. Das ist zum Beispiel hier der Fall:
      </p>
      
      <p><img src="/chals/chal100.png"  alt="chat gpt" width="200"/></p>
      
      <p>Für viele Menschen war der Internet Explorer der erste Zugang zum Internet. Mittlerweile wurde der IE ersetzt. Doch das hält niemanden davon ab, den alten Browser nochmal herauszuholen.
      </p>
      
      <p>Öffne diese Seite mit dem Internet Explorer, um die Antwort zu erhalten.
      </p>
      
      <p><code>${(() => {
        const userAgent = req.headers['user-agent'] || ''
        const isIE = /Trident/i.test(userAgent)

        if (isIE) {
          return 'Die Antwort lautet ' + secrets('chal_100') + '.'
        } else {
          return 'Das ist kein Internet Explorer: ' + userAgent
        }
      })()}</code></p>
      
    `
        : `
      <p>You're a good listener! And not just when it comes to new and modern developments, but also with things that are already part of history. That's the case here, for example:</p>

      <p><img src="/chals/chal100.png" alt="chat gpt" width="200"/></p>

      <p>For many people, the Internet Explorer was their first access to the internet. However, it has since been replaced. But that doesn't stop anyone from dusting off the old browser.</p>

      <p>Open this page with Internet Explorer to get the answer.</p>
      
      <p><code>${(() => {
        const userAgent = req.headers['user-agent'] || ''
        const isIE = /Trident/i.test(userAgent)

        if (isIE) {
          return 'The answer is ' + secrets('chal_100') + '.'
        } else {
          return 'This is not Internet Explorer:' + userAgent
        }
      })()}</code></p>
      
    `
    },
    solution: secrets('chal_100'),
  },

  {
    id: 101,
    pos: { x: 1350, y: 1270 },
    title: { de: 'Faktoren', en: 'Factors' },
    // date: '2023-05-20',
    deps: [89, 105],
    html: {
      de: `
      <p>Ich weiß, dass Tools wie Wolfram Alpha viel besser geeignet wären für diese Aufgabe. Trotzdem wollte ich mal sehen wie ChatGPT auf diese Frage antwortet. Und das Ergebnis ist ... ernüchternd.
      
      <p><img src="/chals/chal101.png"  alt="chat gpt"/></p>
    
      <p>Der Chat geht so viele Zeilen weiter. Das kannst du 100-mal besser! Deine Antwort ist der größte Primfaktor von <code>864186418888888888802470247</code>.
      </p>
    `,
      en: `
      <p>I know that tools like Wolfram Alpha would be much better suited for this task. Nevertheless, I wanted to see how ChatGPT answers this question. And the result is... sobering.
      
      <p><img src="/chals/chal101-en.png"  alt="chat gpt"/></p>
    
      <p>The chat goes on for so many lines. You can do it 100 times better! Your answer is the largest prime factor of <code>864186418888888888802470247</code>.
      </p>
    `,
    },
    solution: secrets('chal_101'),
  },

  {
    id: 102,
    pos: { x: 230, y: 1920 },
    title: { de: 'Cipher III', en: 'Cipher III' },
    // date: '2023-05-24',
    deps: [97],
    html: {
      de: `
      <p>Hut ab! Es ist wirklich schwer, einen Cipher zu entwickeln, der von dir nicht zu brechen ist. Ich muss mir anscheinend nochmal mehr Mühe geben.
      </p>
      
      <p>Mir gehen langsam die Ideen aus. Vielleicht hält doppelt besser: Der neue Cipher verwendet abwechselnd zwei verschiedene Schlüssel.
      </p>
      
      <code><pre style="font-size:14px">function cipher_iii(input_bytes) {
    key1 = < ??? >
    key2 = < ??? >
    previousOutput = 0
    
    output_bytes = []

    for (i = 0; i < input_bytes.length; i++) {
        current_key = previousOutput XOR (i MODULO 2 == 0 ? key1 : key2)
        xor_byte = byte XOR current_key
        previousOutput = xor_byte
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = < ??? >
bytes = utf-8_string_to_bytes(message)
encrypted_bytes = cipher_iii(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>Die Schlüssel sind Zahlen zwischen 0 und 255. Die Ausgabe dieses Programms sieht so aus:
      </p>
      
      <p><code>59176f2b4e4f377f1a5f7427431631306d294b066e2749062d7f1d523d3c55187226010051056d27491a317901547f2de578b00e29285619767715573435591d74301b5b2562474609412f2e642b540266354a4b2c6c1247297c5736030f2925101c3a36030f2925</code>
      </p>
    `,
      en: `
      <p>Hats off! It's really hard to develop a cipher that you can't break. Apparently I have to try harder.
      </p>
      
      <p>I'm slowly running out of ideas. Maybe twice is better: the new cipher uses two different keys alternately.
      </p>
      
      <code><pre style="font-size:14px">function cipher_iii(input_bytes) {
    key1 = < ??? >
    key2 = < ??? >
    previousOutput = 0
    
    output_bytes = []

    for (i = 0; i < input_bytes.length; i++) {
        current_key = previousOutput XOR (i MODULO 2 == 0 ? key1 : key2)
        xor_byte = byte XOR current_key
        previousOutput = xor_byte
        output_bytes.append(xor_byte)
    }

    return output_bytes
}

message = < ??? >
bytes = utf-8_string_to_bytes(message)
encrypted_bytes = cipher_iii(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>The keys are numbers between 0 and 255. The output of this program looks like this:
      </p>
      
      <p><code>59176f2b4e4f377f1a5f7427431631306d294b066e2749062d7f1d523d3c55187226010051056d27491a317901547f2de578b00e29285619767715573435591d74301b5b2562474609412f2e642b540266354a4b2c6c1247297c5736030f2925101c3a36030f2925</code>
      </p>
    `,
    },
    solution: secrets('chal_102'),
  },

  {
    id: 103,
    pos: { x: 698, y: 1671 },
    title: { de: 'Hintergrund', en: 'Background' },
    // date: '2023-05-27',
    deps: [38, 98, 100, 104],
    html: {
      de: `
      <p>Es gibt Menschen, die sind einfach immer da. Auf diese Menschen kann man sich verlassen.
      </p>
      
      <p>Das ist eine Eigenschaft, die du mit der Antwort auf diese Aufgabe gemeinsam hast: Die Antwort ist schon immer da gewesen. Du findest sie auf der Rückseite des Planetens dieser Aufgabe.
      </p>
    `,
      en: `
      <p>There are people who are just always there. You can rely on these people.
      </p>
      
      <p>This is a quality you have in common with the answer to this task: the answer has always been there. You can find it on the back side of the planet leading to this task.
      </p>
    `,
    },
    solution: secrets('chal_103'),
  },

  {
    id: 104,
    pos: { x: 840, y: 1550 },
    title: { de: 'Übergang', en: 'Transition' },
    // date: '2023-05-31',
    deps: [91, 106],
    html: {
      de: `
      <p>Kann es sein, dass du heute etwas braungebrannter aussiehst, als noch bei unserem letzen Treffen? Ha, ich weiß es: Du bist gerade von einer Reise zurückgekehrt.
      </p>
      
      <p>Manchmal bekommt man den Eindruck, dass sich ein Übergang an den anderen reiht: Ferien starten, Ferien enden, Schuljahr startet, Schuljahr endet ... und wir mittendrin.
      </p>
      
      <p>In der Informatik können Übergänge mit solchen Diagrammen dargestellt werden. Ein Pfad führt zum Ziel. Dieser zeigt dir die Antwort.
      </p>
      
      <p><img src="/chals/chal104.png" style="background:white;" alt="graph"></p>
    `,
      en: `
        <p>Is it possible that you look a little more tanned today than at our last meeting? Ha, I know it: You just returned from a trip.
        </p>
        
        <p>Sometimes you get the impression that one transition follows another: holiday start, holiday end, school year starts, school year ends ... and we are in the middle of it.
        
        <p>In computer science, transitions can be represented with such diagrams. A path leads to the goal. This shows you the answer.
        </p>
        
        <p><img src="/chals/chal104.png" style="background:white;" alt="graph"></p>
    `,
    },
    solution: secrets('chal_104'),
  },

  {
    id: 105,
    pos: { x: 1320, y: 1110 },
    title: { de: '1337', en: '1337' },
    // date: '2023-06-03',
    deps: [57],
    html: {
      de: `
      <p>Was hast du mit dem Isartor in München gemeinsam? Ihr seid beide Elite:
      </p>
      
      <p><img src="/chals/chal105.jpg"  alt="isar tor"/>
      </p>
      
      <p>Und deshalb bestimmst du, was die Antwort ist! Jede Antwort ist akzeptiert, wenn sie genau 1337 Zeichen lang ist.
      </p>
    `,
      en: `
        <p>What do you have in common with the Isartor in Munich? You are both elite:
        </p>
        
        <p><img src="/chals/chal105.jpg"  alt="isar tor"/>
        </p>
        
        <p>And that's why you decide what the answer is! Any answer is accepted if it is exactly 1337 characters long.
        </p>
    `,
    },
    check: (answer) => {
      if (answer.length === 1337) {
        return true
      }
      const trimmed = answer.trim()
      return {
        answer: trimmed,
        correct: trimmed.length === 1337,
      }
    },
  },

  {
    id: 106,
    pos: { x: 860, y: 1390 },
    title: { de: 'Leet', en: 'Leet' },
    // date: '2023-06-07',
    deps: [94, 99, 109],
    html: {
      de: `
      <p>Wenn du einen Raum betrittst, dann ist für alle klar, dass du was drauf hast. Du musst dich dafür nicht anstrengen.
      </p>
        
      <p style="font-family:monospace;">4nd3r3 M3n5ch3n w0ll3n 1hr Könn3n ab3r s1ch7b4r m4ch3n - und schr31b3n d4h3r ihr3 N4chr1ch73n in l337.</p>
      
      <p style="font-family:monospace;">35 9!|37 \\/3|25(|-|!3|)3|\\|3 57(_)|=3|\\| (_)|\\||) \\/4|2!4|\\|73|\\| \\/0|\\| |_337 - \\/0|\\| |_3!(|-|7 |_35|34|2 |3!5 7074|_ |<|2\`/|D7!5(|-|.
      </p>
      
      <p style="font-family:monospace;">|)3!|\\|3 4|\\|+\\|/0|2+ 14|_|+3+ |_|1+!|\\/|4+!\\/.
      </p>
      
      <p><small><a href="https://www.robertecker.com/hp/research/leet-converter.php?lang=de" target="_blank">Hinweis</a></small></p>
    `,
      en: `
        <p>When you enter a room, everyone knows you've got what it takes. You don't have to try for that.
        </p>
      
        <p style="font-family:monospace;">bu7 07h3r p30pl3 w4n7 70 m4k3 7h31r 5k1ll5 v151bl3 - 4nd 7h3r3f0r3 wr173 7h31r m3554635 1n l337.
        </p>
        
        <p style="font-family:monospace;">7|-|3|23 4|23 |)!|=|=3|23|\\|7 |_3\\/3|_5 4|\\||) \\/4|2!4|\\|75 0|= |_337 - |=|20/\\/\\ 345!|_\`/ |234|)4|3|_3 70 7074|_|_\`/ (|2\`/|D7!(.</p>
        
        <p style="font-family:monospace;">\`/0|_||2 4|\\|5\\|/3|2 !5 |_|1+!|\\/|4+!\\/.
        </p>
        
        <p><small><a href="https://www.robertecker.com/hp/research/leet-converter.php?lang=en" target="_blank">Hint</a></small></p>
    `,
    },
    solution: secrets('chal_106'),
  },

  {
    id: 107,
    pos: { x: 930, y: 1727 },
    title: { de: 'Neuland', en: 'New Territory' },
    // date: '2023-06-10',
    deps: [96],
    html: {
      de: `
      <p>Ich sehe, du bist heute gut ausgerüstet und bereit für deine Expedition in unbekanntes Neuland. Ich bewundere deinen Mut.
      </p>
      
      <p>Hier sind deine Koordinaten: Zwischen <a href="http://arrrg.de:40000/" target="_blank">http://arrrg.de:40000/</a> und <a href="http://arrrg.de:41000/" target="_blank">http://arrrg.de:41000/</a> findest du einen geheimen Ort. 
      </p>
      
      <p>Viel Glück auf deiner Suche! Lasse dich nicht von Widrigkeiten des Ödlands abseits gängiger Protokolle abhalten. Sei hartnäckig und wir sehen uns bald wieder.
      </p>
    `,
      en: `
        <p>I see you are well-equipped today and ready for your expedition into unknown territory. I admire your courage.
        </p>
        
        <p>Here are your coordinates: Between <a href="http://arrrg.de:40000/" target="_blank">http://arrrg.de:40000/</a> and <a href="http://arrrg.de:41000/" target="_blank">http://arrrg.de:41000/</a> you will find a secret place.
        </p>
        
        <p>Good luck in your search! Don't let the adversities of the wasteland off the beaten track of common protocols stop you. Be persistent and we'll see each other again soon.
        </p>
        
        <p>Note 1: The title of this challenge is a reference to a quote by former German Chancellor Merkel, who said in 2013 „Das Internet ist für uns alle Neuland.” (The Internet is new territory for everyone) and many people made and make fun of this statement.</p>
        <p>Note 2: The message in the secret place is in German</p>
`,
    },
    solution: secrets('chal_107'),
  },

  {
    id: 108,
    pos: { x: 1200, y: 1230 },
    title: { de: 'Sprache', en: 'Language' },
    // date: '2023-06-14',
    deps: [88, 89, 105],
    render: ({ req }) => `${
      req.lng == 'de'
        ? `<p>Dieser Inhalt ist nur für NutzerInnen verfügbar, die Französisch als ihre Sprache eingestellt haben.
      </p>`
        : `<p>This content is only available to users who have set French as their language.`
    }
      
      <p><code>${(() => {
        const acceptLanguage = req.headers['accept-language'] || ''
        const isFrench = /fr-?/i.test(acceptLanguage)

        if (isFrench) {
          return 'La réponse est ' + secrets('chal_108') + '.'
        } else {
          return req.lng == 'de'
            ? 'Deine Spracheinstellung wird nicht unterstützt: ' +
                acceptLanguage
            : 'Your language setting is not supported: ' + acceptLanguage
        }
      })()}</code></p>
      
    `,
    solution: secrets('chal_108'),
  },

  {
    id: 109,
    pos: { x: 1140, y: 1340 },
    title: { de: 'Brainfuck', en: 'Brainfuck' },
    // date: '2023-06-17',
    deps: [101],
    html: {
      de: `
      <p>Mensch, wie nervig sind Diskussionen darüber, welche Programmiersprache besser ist! Zum Glück bist du jemand, der es besser weiß: Alle Programmiersprachen sind im Kern gleich mächtig - eine Erkenntnis, die Turing wesentlich mitentwickelt hat.
      </p>
      
      <p>Jede Programmiersprache hat ihre besondere Schönheit. Die Schönheit von Brainfuck liegt in ihrer Einfachheit: Acht Zeichen sind genug, um alles zu programmieren, was man sich vorstellen kann - auch wenn es teilweise viel Geduld und Leidenschaft braucht, das auch umzusetzen.
      </p>
      
      <p>Schreibe ein Programm in Brainfuck, dass die Antwort <code>alan</code> ausgibt. Du hast 100 Speicherzellen und 10000 Rechenschritte zur Verfügung.
      </p>
    `,
      en: `
      <p>Man, how annoying are discussions about which programming language is better! Luckily, you are someone who knows better: All programming languages are essentially equally powerful — a finding that Turing played a key role in developing.
      </p>
      
      <p>Every programming language has its own special beauty. The beauty of Brainfuck lies in its simplicity: eight characters are enough to program anything you can imagine — even if it sometimes takes a lot of patience and passion to implement it.
      </p>
      
      <p>Write a program in Brainfuck that prints the answer <code>alan</code>. You have 100 memory cells and 10,000 calculation steps available.
      </p>
    `,
    },
    check: (answer) => {
      const output = runBrainfuck(answer.split(''))
      return {
        answer: output,
        correct: output === secrets('chal_109'),
      }
    },
  },

  {
    id: 115,
    pos: { x: 1495, y: 1149 },
    title: { de: 'r/place', en: 'r/place' },
    deps: [57],
    html: {
      de: `
        <p>Im Jahr 2023 kamen viele Menschen zusammen, um gemeinsam ein Bild zu zeichnen - Pixel für Pixel. Aus dem Chaos heraus organisierten sich die Menschen und es entstanden einige Kunstwerke (und manche Beleidigung).</p>
  
        <p><img src="/chals/final_2023_place.png" style="max-width:100%" width="600" /></p>
  
        <p>Um sich zu navigieren, brauchen die Pixel natürlich Koordinaten. Es gibt ein offizielles Koordinatensystem, dessen Ursprung in der Mitte der Leinwand liegt, die positive x-Achse verläuft nach rechts, die positive y-Achse verläuft nach unten.</p>
  
        <p>Im Bereich von (1286,225) bis (1379,394) jeweils in offiziellen Koordinaten (x, y) hat sich eine Fan-Gemeinschaft verewigt. Der Name der Computerspiel-Reihe ist deine Antwort.</p>
      `,
      en: `
        <p>In 2023, many people came together to draw a picture - pixel by pixel. Out of the chaos, people organized themselves, and some artworks (and a few insults) emerged.</p>
  
        <p><img src="/chals/final_2023_place.png" style="max-width:100%" width="600" /></p>
  
        <p>To navigate, the pixels naturally need coordinates. There is an official coordinate system, with its origin at the center of the canvas, the positive x-axis running to the right, and the positive y-axis running downward.</p>
  
        <p>In the area from (1286,225) to (1379,394), given in official coordinates (x, y), a fan community has immortalized itself. The name of the computer game series is your answer.</p>
      `,
    },
    solution: secrets('chal_115').split(','),
  },

  {
    id: 117,
    pos: { x: 1138, y: 1003 },
    title: { de: 'Schatzkammer', en: 'Treasure chamber' },
    deps: [57],
    html: {
      de: `
        <p>Beim Hacken wirst du dich regelmäßig auf unbekanntes Gebiet bewegen. Hinter jeder Ecke könnte eine Überraschung lauern. Nichts ist vorhersehbar oder planbar. Du arbeitest dich Schritt für Schritt vor und versuchst, so viel wie möglich zu lernen.</p>

        <p>Bist du bereit für ein solches Abenteuer? Begib dich in diese verfluchte Schatzkammer und berge die Gedenkplatte. Sobald du der Kammer entkommst, wird sich dir die Antwort offenbaren.</p>

        <p>Es lauern überall Gefahren. Achte auf deine geistige Gesundheit.</p>

        <iframe width="360" height="240" src="/chal117/dungeon" style="border: 1px solid white;"></iframe>
      `,
      en: `
        <p>When hacking, you will regularly venture into unknown territory. Surprises could be lurking around every corner. Nothing is predictable or planable. You advance step by step, trying to learn as much as possible.</p>

        <p>Are you ready for such an adventure? Enter this cursed treasure chamber and retrieve the memorial plate. Once you escape the chamber, the answer will reveal itself to you.</p>

        <p>Dangers lurk everywhere. Watch your mental health.</p>


        <iframe width="360" height="240" src="/chal117/dungeon" style="border: 1px solid white;"></iframe>
      `,
    },
    solution: secrets('chal_117'),
  },

  {
    id: 119,
    pos: { x: 1578, y: 1117 },
    title: { de: 'Passwort', en: 'Password' },
    deps: [57],
    html: {
      de: `
        <p>Viele Menschen verwenden Passwörter, die mit ihren Interessen und Hobbies zusammenhängen. Dadurch sind diese Passwörter leicht zu erraten. Bei dieser Aufgabe findest du den Steckbrief einer Person. Errate das Passwort. Das Passwort besteht nur aus Kleinbuchstaben und enthält keine Zahlen, Leerzeichen oder Sonderzeichen. Beispiele: <code>taylorswift</code>, <code>taytay</code>, <code>munich</code> ...</p>

        <div style="padding:24px;padding-bottom:10px;max-width:65ch;" class="jumbotron">
          <p><strong>Steckbrief von Marie</strong></p>

          <p>Hallo!</p>

          <p>Ich bin ein großer Fan von Taylor Swift. Ich kann mich gut mit ihrer Musik identifzieren und sie enthält viele Easter Eggs. Meine Lieblingsongs sind Betty, Cowboy Like Me und Love Story.</p>

          <p>Ich konnte leider keine Karten für ihr Konzert in München besorgen, aber ich konnte auf dem Hügel gut mithören und in der Menge mitviben.</p>

          <p>I remember it all too well :)</p>
        </div>
      `,
      en: `
        <p>Many people use passwords that are related to their interests and hobbies. As a result, these passwords are easy to guess. In this task, you will find the profile of a person. Guess the password. The password consists only of lowercase letters and contains no numbers, spaces, or special characters. Examples: <code>taylorswift</code>, <code>taytay</code>, <code>munich</code> ...</p></p>

        <div style="padding:24px;padding-bottom:10px;max-width:65ch;" class="jumbotron">
          <p><strong>Profile of Marie</strong></p>

          <p>Hello!</p>

          <p>I am a big fan of Taylor Swift. I can really relate to her music, and it contains many Easter eggs. My favorite songs are Betty, Cowboy Like Me, and Love Story.</p>

          <p>Unfortunately, I couldn't get tickets for her concert in Munich, but I could hear well from the hill and vibe with the crowd.</p>

          <p>I remember it all too well :)</p>
        </div>

      `,
    },
    solution: secrets('chal_119'),
  },

  {
    id: 120,
    pos: { x: 1700, y: 1151 },
    title: { de: 'Passwort II', en: 'Password II' },
    deps: [119],
    html: {
      de: `
        <p>Hier ist wieder ein Steckbrief. Errate das Passwort. Das Passwort besteht nur aus Kleinbuchstaben und enthält keine Zahlen, Leerzeichen oder Sonderzeichen.</p>

        <div style="padding:24px;padding-bottom:10px;max-width:65ch;" class="jumbotron">
          <p><strong>Steckbrief von Jojo</strong></p>

          <p>Hey!</p>

          <p>In meiner Jugend habe ich ein natürlich die Regeln von Schach gelernt, wie z.B. die Rochade oder die 50-Züge-Regel. Aber ich habe lange Zeit keinen wirklichen Bezug zum Schachspiel gehabt.</p>

          <p>Das hat sich erst geändert, als ich über eine schwedische Schach-Youtuberin mehr in die Welt der SchachspielerInnen eingetaucht bin und verstanden habe, welche Art von Gemeinschaft dadurch erlebbar wird. Und natürlich habe ich mich schlau gemacht über all die Top-Spieler und ihre Dramen.</p>

          <p>Seitdem spiele ich auch in meiner Freizeit gerne die eine oder andere Runde Schach, v.a. auf einem richtigen Schachbrett. Mit Online-Schach konnte ich mich bisher noch nicht so gut anfreunden.</p>
        </div>
      `,
      en: `
        <p>Here is another profile. Guess the password. The password consists only of lowercase letters and does not contain any numbers, spaces, or special characters.</p>

        <div style="padding:24px;padding-bottom:10px;max-width:65ch;" class="jumbotron">
          <p><strong>Profile of Jojo</strong></p>

          <p>Hey!</p>

          <p>In my youth, I naturally learned the rules of chess, like castling or the 50-move rule. But for a long time, I didn't really have a connection to the game.</p>

          <p>That changed when I discovered a Swedish chess YouTuber and dove deeper into the world of chess players, understanding the kind of community that can be experienced through it. And of course, I educated myself about all the top players and their dramas.</p>

          <p>Since then, I've enjoyed playing a game of chess in my free time, especially on a real chessboard. I haven't yet warmed up to online chess.</p>
        </div>
      `,
    },
    solution: secrets('chal_120'),
  },

  /*{
    id: 121,
    noScore: true,
    pos: { x: 1580, y: 975 },
    title: { de: '[Epilog]', en: 'TODO' },
    deps: [57],
    html: {
      de: `
        Hier kommt der Text für den Epilog hin
      `,
      en: `
        TODO
      `,
    },
    solution: 'hack the web',
  },*/
]
