const fetch = require('node-fetch')
const crypto = require('crypto')
const secrets = require('./secrets-loader.js')

function stringreverse(s) {
  return s.split('').reverse().join('')
}

function calculatorCheck(a) {
  const str = Buffer.from(a, 'base64').toString()
  const index = str.indexOf('%')
  if (index >= 0 && str.substring(index + 1) == 'secret_word')
    return str.substring(0, index)
  else return a
}

function trinterpreter(str) {
  const stack = []
  const ops = '+-*/'
  let prepare = str.replace(/drop/g, '#')
  prepare = prepare.replace(/dup/g, '@')
  prepare = prepare.replace(/ /g, '')
  const tokens = prepare.split('')
  for (let pc = 0; pc < tokens.length; pc++) {
    const c = tokens[pc]
    if (c.length == 0) continue
    if (c.length == 1 && c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) {
      stack.push(parseInt(c))
    } else if (c == '#') {
      if (stack.length == 0) return 'drop: Stack leer'
      stack.pop()
    } else if (c == '@') {
      if (stack.length == 0) return 'dup: Stack leer'
      stack.push(stack[stack.length - 1])
    } else if (c.length == 1 && ops.indexOf(c) >= 0) {
      if (stack.length <= 1) return c + ': Stack leer'
      if (c == '+') {
        stack.push(stack.pop() + stack.pop())
      } else if (c == '*') {
        stack.push(stack.pop() * stack.pop())
      } else if (c == '-') {
        var e1 = stack.pop()
        var e2 = stack.pop()
        stack.push(e2 - e1)
      } else {
        var e1 = stack.pop()
        var e2 = stack.pop()
        stack.push(Math.floor(e2 / e1))
      }
    } else {
      return 'unbekannter Befehl: ' + c
    }
  }
  if (stack.length == 0) return 'stack leer'
  return stack.pop().toString()
}

function trinterpreterstripped(str) {
  const allowed = '12*- '
  if (str.split('').some((c) => allowed.indexOf(c) < 0))
    return 'ungültiger Befehl'
  return trinterpreter(str)
}

module.exports = [
  {
    id: 1,
    pos: { x: 150, y: 140 },
    title: 'Start',
    date: '2017-03-30',
    deps: [],
    render: ({ req }) => `
      <p>Herzlich Willkommen bei Hack The Web. Hier beginnt deine spannende Reise durch die Welt des Hackings. Es wird eine Reise voller Abenteuer sein. Herausforderungen aus ganz verschiedenen Themenbereichen warten auf dich. An ihnen kannst du dein Können unter Beweis stellen oder dir die Zähne ausbeißen.</p>
    
      <p>Bei den meisten Aufgabe geht es darum, aus den Angaben heraus eine Antwort zu finden. Allerdings findet sich diese meist nur, wenn man die Aufgabe aus der richtigen Perspektive betrachtet - eben aus der Perspektive eines Hackers.</p>
    
      <p>Bei der Bearbeitung der Aufgaben sind ausdrücklich alle Hilfsmittel erlaubt. Du darfst im Internet suchen, einen Taschenrechner verwenden, mit Stift und Papier Notizen machen ... Fühl dich frei und nutze die Tools, die dir bei der Bearbeitung der Aufgaben am meisten helfen.
      </p>
      
      ${
        req.user.RoomId !== null
          ? `<p>Falls du einem Raum beigetreten bist und an einer Hacking-Session teilnimmst: Nach der Bearbeitung dieser Aufgabe starten die 30 Minuten. Innerhalb dieser Zeit ist es dein Ziel, so viele Aufgaben wie möglich zu bearbeiten. Deine Punktzahl für diese 30 Minuten wird in die Highscore des Raums eingetragen.
      </p>`
          : ''
      }
    
      <p>Bist du bereit? Dann lasst uns anfangen! Die Antwort auf diese erste Aufgabe ist das Ergebnis von 6 + 4 * 9.</p>
    `,
    solution: secrets('chal_1'),
  },

  {
    id: 2,
    pos: { x: 585, y: 875 },
    title: 'Finger-Code',
    date: '2017-05-17',
    deps: [26, 50],
    html: `
      <p>Der Inhalt einer Nachricht ist ganz unabhängig von seiner Codierung. Man kann lateinische Buchstaben verwenden - oder seine Finger!
      </p>
      
      <p>Die Antwort zu dieser Aufgabe findet sich im folgenden Bild:
      </p>
      
      <p><img src="/chals/chal2.png"></p>
    `,
    solution: secrets('chal_2'),
  },

  {
    id: 3,
    pos: { x: 825, y: 1025 },
    title: 'Auf hoher See',
    date: '2017-05-17',
    deps: [2, 39, 45],
    html: `
      <p>Wie komfortabel heute die Kommunikation geworden ist! Mit WhatsApp und Facebook kann man weltweit mühelos Nachrichten versenden und empfangen - da vergisst man leicht, dass noch vor hundert Jahren die Situation ganz anders aussah. Damals hatte man, zum Beispiel in der Seefahrt, zur Kommunikation nichts mehr als einen Piepston und das Morse-Alphabet!
      </p>
      
      <p>Aber das sollte auch für dich kein Hindernis sein. Höre dir <a href ="/chals/chal3.wav">diese Datei</a> an. Darin findest du die Antwort zu dieser Aufgabe.
      </p>
      
      <audio src="/chals/chal3.wav" controls></audio>
      
      <p>Dein PC hat keine Lautsprecher? Scanne <a href="/chals/chal3_code.png">diesen QR-Code</a>, um dir die Datei auf dem Handy anzuhören.</p>
    `,
    solution: secrets('chal_3'),
  },

  {
    id: 4,
    pos: { x: 270, y: 220 },
    title: 'ASCII',
    date: '2017-05-17',
    deps: [1],
    html: `
      <p>Was heute mit Text möglich ist: Man kann Emojis einfügen 😀, Flaggen 🏳️‍🌈, ꧁༺ 𝕿𝖊𝖝𝖙 𝖘𝖈𝖍𝖎𝖈𝖐 𝖛𝖊𝖗𝖟𝖎𝖊𝖗𝖊𝖓 ༻꧂ und vieles mehr...
      </p>
      
      <p>Aber noch vor relativ wenigen Jahren war das nicht möglich, sondern man hatte nur 95 Zeichen zur Verfügung:
      </p>
      
      <p><img src="/chals/chal4.png"></p>
      
      <p>That's it. Das ist der harte Kern der Informatik. Der Vorteil: Man kann davon ausgehen, dass diese Zeichen auf jedem System zur Verfügung stehen. Und für die meisten Anwendungen reichen diese Codes auch aus. Auch dieser Text genau hier ist mit diesen Codes gespeichert!
      </p>
    
      <p>Kleines Beispiel wie man die Tabelle liest: Das große H entspricht der Nummer 72, hinter der Zahl 32 verbirgt sich das Leerzeichen.
      </p>
      
      <p>Deine Antwort in Codes lautet:
      </p>
      
      <p>35 &nbsp; 76 &nbsp; 79 &nbsp; 76 &nbsp; 32 &nbsp; 35 &nbsp; 110 &nbsp; 105 &nbsp; 99 &nbsp; 101
      </p>
    `,
    solution: secrets('chal_4'),
  },

  {
    id: 5,
    pos: { x: 300, y: 120 },
    title: 'Zitronentinte',
    date: '2017-05-17',
    deps: [1],
    html: `
      <p>Diese Aufgabe hier funktioniert wie das Schreiben mit Zitronentinte: Man nimmt einen Füller und taucht ihn in den Saft einer frischgepressten Zitrone. Damit schreibt man seine geheime Nachricht auf ein weißes Blatt Papier. Weil der Saft transparent ist, schreibt man sozusagen "weiß auf weiß" und ein Anderer kann die Nachricht nicht lesen. Die Person, die die Nachricht empfängt, hält das Papier über eine Flamme. Durch die Hitze verfärbt sich der Zitronensaft und die Nachricht wird sichtbar.
      </p>
      
      <p>Das ganze funktioniert auch digital. Unten findest du ein "präpariertes" Blatt Papier. Mache die Tinte wieder sichtbar:
      </p>
      
      <br>
      
      <p>--- Hier fängt das Blatt an ---</p>
      
      <p><br><span style="color:#222222;padding-left:150px">Hier ist nichts.</span><br><br><span style="color:#222222">Lalala, das Wetter ist schön</span><br><br><br><br><span style="color:#222222;padding-left:400px">Die Antwort lautet: ${secrets(
        'chal_5'
      )}</span><br><br>
      </p>
      
      <p>--- Hier endet das Blatt ---</p>
    `,
    solution: secrets('chal_5'),
  },

  {
    id: 6,
    pos: { x: 485, y: 150 },
    title: 'HTML',
    date: '2017-05-17',
    deps: [5],
    html: `
      <p>Wenn du dir eine Website am Computer anschaust, dann siehst du eigentlich nur einen kleinen Teil der Website. Hinter den Kulissen aber gibt es noch eine ganze Welt voller Technik zu entdecken.
      </p>
      
      <p>Ähnlich wie die Noten zu einem Musikstück oder das Drehbuch zu einem Film, gibt es auch den Code zu einer Website. Und darin finden sich Informationen, die sonst nicht zu sehen sind. Im Quelltext der Website wird die Antwort in diesem Kasten sichtbar:</p>
      
      <pre>
      
      __________________________________________
      |                                        |
      |<!-- Die Antwort lautet ${secrets(
        'chal_6'
      )}. -->                                        |
      |________________________________________|
      
      </pre>
      
      <p><button onclick="transform()">Quelltext anzeigen</button></p>
      
      <script>
        function transform() {
          const code = document.body.outerHTML
          document.body.outerHTML = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;');
          document.body.style.lineHeight = '1.2'
          document.body.style.fontFamily = 'monospace'
          document.body.style.marginLeft = '4px'
          history.pushState({}, '')
          onpopstate = (event) => { window.location.reload() };
        }
      </script>
    `,
    solution: secrets('chal_6'),
  },

  {
    id: 7,
    pos: { x: 590, y: 230 },
    title: 'HTML II',
    date: '2017-05-17',
    deps: [6],
    html: `
      <p>Auch diesmal braucht es einen Blick in den Quelltext der Seite. Allerdings musst du das Portal selber finden. Die Antwort befindet sich direkt unter dieser Zeile ...
      </p>
      
      <!-- ... und lautet ${secrets('chal_7')}. -->
      
      <p><small><a href="/chals/chal7_hint1.png" target="_blank">Tipp 1</a> / <a href="/chals/chal7_hint2.png" target="_blank">Tipp 2</a></small></p>
    `,
    solution: secrets('chal_7'),
  },

  {
    id: 8,
    pos: { x: 520, y: 280 },
    title: 'Fleißaufgabe',
    date: '2017-05-17',
    deps: [55, 84],
    html: `
      <p>Ein gutes mathematisches Gespür kann bei vielen Problemen helfen, eine elegante Lösung zu finden, ohne dabei viel arbeiten zu müssen. Ein kleiner Junge konnte so folgende Aufgabe in wenigen Minuten lösen - du auch?
      </p>
      
      <p>Die Frage lautet: Wie groß ist die Summe 1 + 2 + 3 + ... + 98 + 99 + 100?
      </p>
    `,
    solution: secrets('chal_8'),
  },

  {
    id: 9,
    pos: { x: 650, y: 370 },
    title: 'Fleißaufgabe II',
    date: '2017-05-17',
    deps: [8],
    html: `
      <p>Mit dem richtigen Trick ist auch diese Aufgabe schnell gelöst: Wie groß ist die Summe 100 - 99 + 98 - 97 + ... + 4 - 3 + 2 - 1?
      </p>
    `,
    solution: secrets('chal_9'),
  },

  {
    id: 10,
    pos: { x: 800, y: 410 },
    title: 'Fleißaufgabe III',
    date: '2017-05-18',
    deps: [9],
    html: `
      <p>Wie groß ist die Summe 1 + 3 + 5 + 7 + ... + 99?
      </p>
    `,
    solution: secrets('chal_10'),
  },

  /*{
    id: 11,
    pos: { x: 100, y: 400 },
    title: 'Fremdwährung',
    deps: [18],
    html: `
      <p>Das Währungssystem in Land Compedia ist anders aufgebaut als wir es so gewohnt sind. Es gibt dort nur Münzen und diese haben die Werte 1, 2, 4, 8, 16, 32, 64, 128, 256 und 512. Das sind die ersten 10 Zweierpotenzen.
      </p>
      
      <p>Damit die Einwohner nicht so viel Geld mit sich schleppen müssen dürfen Preise nur zwischen 1 und 1023 liegen. Zu hohe Preise und Dezimalbrüche sind verboten (und werden per Überweisung bezahlt).
      </p>
      
      <p>Das interessante an diesem System: Jeder Einwohner kann mit einem Satz an Münzen (also von jedem Wert genau eine Münze, insgesamt 10 Münzen) jeden Preis zwischen 1 und 1023 bezahlen. Wir wollen das mal überprüfen: Den Preis von 100 können wir mit den drei Münzen 64, 32 und 4 bezahlen. Klappt.
      </p>
      
      <p>Die Frage lautet: Wie bezahlt ein Compedianer den Preis 85?
      </p>
      
      <p>Gib die einzelnen Münzwerte von groß nach klein mit Leerzeichen getrennt an (z.B. <em>64 32 4</em>).
      </p>
    `,
    solution: '64 16 4 1',
  },*/

  /*{
    id: 12,
    pos: { x: 100, y: 530 },
    title: 'Fremdwährung II',
    deps: [11],
    html: `
      <p>Wie bezahlt ein Compedianer in diesem System den Preis 805?
      </p>
    `,
    solution: '512 256 32 4 1',
  },*/

  /*{
    id: 13,
    pos: { x: 130, y: 670 },
    title: 'Fremdwährung III',
    deps: [12],
    html: `
      <p>Die Compedianer nutzen dieses System der Münzen auch für ihre Zahlen, allerdings in einer abgewandelten Form: Die Münzwerte werden durch die Position der Ziffern bestimmt und diese steigt von rechts nach links auf. Es gibt nur zwei Ziffern. Die Null bedeutet, dass diese Münze nicht benutzt wird, die Eins bedeutet, dass sie benutzt wird. Hier sehen wir ein Beispiel für die Zahl 100110:
      </p>
      
      <p><img src="/chals/chal13.png"></p>
      
      <p>Verwendet werden die Werte 32, 4 und 2 und damit ergibt sich insgesamt die Zahl 38.</p><p>Die Frage lautet nun: Welche Zahl steckt hinter der Folge 110001100100?
      </p>
    `,
    solution: '3172',
  },*/

  /*{
    id: 14,
    pos: { x: 150, y: 820 },
    title: 'Fremdwährung IV',
    deps: [13],
    html: `
      <p>Die Compedianer haben damit ihr Zahlensystem auf das sog. Binärsystem umgestellt. Man könnte fast meinen, dass ein Compedianer den Computer erfunden hätte - denn Computer verstehen auch nur Binärzahlen.
      </p>
      
      <p>Für uns Menschen gibt es noch eine Schwierigkeit: Binärzahlen sind oft sehr lang. Um sie kürzer darzustellen, kann man sie in 4er-Packs zerlegen und mit folgender Tabelle übersetzen:
      </p>
      
      <p>0000 = 0<br>0001 = 1<br>0010 = 2<br>0011 = 3<br>0100 = 4<br>0101 = 5<br>0110 = 6<br>0111 = 7<br>1000 = 8<br>1001 = 9<br>1010 = A<br>1011 = B<br>1100 = C<br>1101 = D<br>1110 = E<br>1111 = F
      </p>
      
      <p>Die Tabelle ist eigentlich sehr systematisch: Auf der linken Seite sind die Zahlen von 0 bis 15 dargestellt und rechts die die passende Zahl oder ein Buchstabe. Die Binärzahl 10100011 wird dann mit A3 abgekürzt. Diese Schreibweise wird Hexadezimalsystem genannt.
      </p>
      
      <p>Wie lautet nun die Binärzahl 11111010011000000100 in hexadezimaler Schreibweise?
      </p>
    `,
    solution: 'fa604',
  },*/

  {
    id: 15,
    pos: { x: 420, y: 90 },
    title: 'Benutzername',
    date: '2017-05-18',
    deps: [5],
    html: `
      <p>Die Antwort zu dieser Aufgabe ist ganz einfach dein Benutzername. Allerdings kann es sein, dass deine Eingabe beim Absenden etwas durcheinander gerät. Findest du heraus, was du eingeben musst?
      </p>
    `,
    check: (answer, { req }) => {
      const reversed = stringreverse(answer)
      return {
        answer: reversed,
        correct: reversed == req.user.name,
      }
    },
  },

  {
    id: 16,
    pos: { x: 550, y: 100 },
    title: 'Benutzername II',
    date: '2017-05-18',
    deps: [15],
    html: `
      <p>In der Informatik dreht sich alles um Datenverarbeitung. Eine <em>Funktion</em> nimmt dabei einen Eingabewert (z.B. deine Antwort) und erzeugt daraus einen Ausgabewert (die Antwort, wie sie hier ankommt).
      </p>
      
      <p>Eine Funktion kann Werte vertauschen, verändern, auslassen, etc. - alles Mögliche, wie man will. Was macht diese Funktion hier mit deiner Eingabe? Die Antwort zu dieser Aufgabe ist wieder dein Benutzername.
      </p>
    `,
    check: (answer, { req }) => {
      const input = answer
      const l = input.length
      let r = ''
      for (let i = 0; i < l; i += 3) {
        if (i + 2 >= l) r += input.substring(i)
        else r += input.charAt(i + 1) + input.charAt(i + 2) + input.charAt(i)
      }
      return {
        answer: r,
        correct: r === req.user.name,
      }
    },
  },

  {
    id: 17,
    pos: { x: 685, y: 70 },
    title: 'Benutzername III',
    date: '2017-05-18',
    deps: [16],
    html: `
      <p>Eine weitere Runde: Die Antwort auf diese Aufgabe ist wieder dein Benutzername. Allerdings wird deine Eingabe vor der Auswertung wieder durcheinander gebracht. Wie muss diesmal die Eingabe lauten?
      </p>
    `,
    check: (answer, { req }) => {
      const input = answer
      const l = answer.length
      let r = ''
      for (let i = 0; i < l; i += 2) {
        r += input.charAt(i)
      }
      return {
        answer: r,
        correct: r === req.user.name,
      }
    },
  },

  {
    id: 18,
    pos: { x: 270, y: 390 },
    title: 'ROT13',
    date: '2017-05-18',
    deps: [24, 31],
    html: `
      <p>Du hast eine verschlüsselte Nachricht erhalten! Sie sieht wie kompletter Nonsens aus. Kannst du damit etwas anfangen?
      </p>
      
      <p style="word-wrap:break-word" class="my-4" id="cipher">
      </p>
      
      <input id="slider" type="range" min="0" max="26" step="1" style="width:500px" value="0" onchange="change()" oninput="change()"/>
      
      <script>
        const message = 'fhcre qh unfg qra grkg resbytervpu ragfpuyhrffryg nyf orybuahat reunryfg qh aha qvr nagjbeg haq fvr ynhgrg fcvrtryovyq'
        
        const slider = document.getElementById('slider')
        
        const cipher = document.getElementById('cipher')
        
        function translate(n) {
          cipher.innerHTML = message.split('').map(c => {
            if (c == ' ') return c
            return String.fromCharCode(((c.charCodeAt() - 97 + n) % 26) + 97)
          }).join('')
        }
        
        function change() {
          translate(parseInt(slider.value))
        }
        
        change()
        
        
      </script>
    `,
    solution: secrets('chal_18'),
  },

  /*{
    id: 19,
    pos: { x: 310, y: 460 },
    title: 'Cäsar',
    date: '2017-05-18',
    deps: [18],
    html: `
      <p>Du hast wieder eine verschlüsselte Nachricht erhalten:
      </p>
      
      <p>Yottss</p>
      
      <p>Diesmal wurde die Nachricht mit dem Cäsarcode verschlüsselt. Bei diesem Code werden die Buchstaben um eine bestimmte Anzahl im Alphabet verschoben. Wenn man zum Beispiel <strong>Maus</strong> nimmt und die Buchstaben um eins weiter verschiebt, kommt der geheime Text <strong>Nbvt</strong> heraus.
      </p>
      
      <p>Die Schwierigkeit liegt darin: Du weißt nicht, um wie viel die geheime Nachricht verschoben wurde. Aber das sollte dich als Hacker nicht abhalten! Die geheime Nachricht (ein deutsches Wort) ist die Antwort zu dieser Aufgabe.
      </p>
    `,
    solution: 'kaffee',
  },*/

  /*{
    id: 20,
    pos: { x: 160, y: 485 },
    title: 'Geheimtext',
    deps: [11, 51],
    html: `
      <p>Unser Freund hat dir eine verschlüsselte Nachricht geschickt. Diese Nachricht hat er auf zwei Briefe aufgeteilt. Der erste Brief enthält folgenden Text:
      </p>
      
      <pre class="my-4">JCD FRUAYMU FEZ JDCRD FEZXFTD OFEUDU SFNNDMSFC</pre>
      
      <p>Der zweite Brief enthält folgenden Hinweis:</p>
      
      <pre class="my-4">Geheim: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nKlar:   W ? I E U ? Z V J D ? X ? M L Y K N ? B T S P G O ?</pre>
      
      <p>Anscheinend kann man mit diesen Angaben die Nachricht entziffern. Leider sind durch den Regen ein paar Buchstaben im zweiten Brief verwischt. Schaffst du es trotzdem, den Brief zu entschlüsseln?
      </p>
    `,
    // Die Antwort auf deine Aufgabe lautet hammerhai
    // JCD FRUAYMU FEZ JDCRD FEZXFTD OFEUDU SFNNDMSFC
    // hidden: A -> F, C -> B, F -> Z, H -> S, R -> M
    solution: 'hammerhai',
  },*/

  {
    id: 21,
    pos: { x: 560, y: 410 },
    title: 'MD5 Reverse',
    date: '2017-08-25',
    deps: [32, 55],
    html: `
      <p>Du hast es fast geschafft: Beim Angriff auf eine Website hast du Zugriff auf die Benutzerdatenbank bekommen und hast für das Passwort des Superadmins folgenden Wert gefunden:
      </p>
      
      <p>412a1ed6d21e55191ee5131f266f5178
      </p>
      
      <p>Kannst du aus diesem Wert das Passwort wiederherstellen? Es wurde mit einer Methode namens <a href="http://reversemd5.com/" target="_blank">MD5</a> verschlüsselt.
      </p>
    `,
    solution: secrets('chal_21'),
  },

  {
    id: 22,
    pos: { x: 845, y: 725 },
    title: 'NoScript',
    date: '2017-08-25',
    deps: [81],
    html: `
      <p>Moderne Websiten enthalten nicht nur viele Texte und Bilder, sondern auch sehr viele interaktive Inhalte wie Animationen, Menüs, Widgets, ...
      </p>
      
      <p>Ermöglicht werden diese interaktiven Inhalte durch JavaScript. Neben vielem Guten kann man damit aber auch einiges an Unsinn betreiben. Nehmen wir mal das Eingabefeld dieser Aufgabe: Das wurde leider mit JavaScript komplett lahmgelegt.
      </p>
      
      <p>Die Antwort auf diese Aufgabe ist der Name für den standardisierten Sprachkern von JavaScript.
      </p>
    
      <script>
        window.addEventListener('load', () => {
          document.getElementById("challenge_submit").disabled = true
          document.getElementById("challenge_form").onsubmit = e => {
            e.preventDefault()
          }
          document.getElementById("challenge_answer").onkeypress = function(e) {
            if (e.which == 13)
              return false
          }
        })
      </script>
    `,
    solution: secrets('chal_22'),
  },

  {
    id: 23,
    pos: { x: 710, y: 300 },
    title: 'Grau auf Grau',
    date: '2017-08-25',
    deps: [7, 8],
    html: `
      <p>Oh je, bei diesem Bild hat jemand den ganzen Kontrast weggenommen! Übrig geblieben ist nur noch grau:
      </p>
      
      <p><a href="/chals/chal23.png"><img src="/chals/chal23.png" width="300"></a>
      </p>
      
      <p>[<a href="/chals/chal23.png" download="grau.png">Bild herunterladen</a>]</p>
      
      <p>Die Informationen sind immer noch im Bild vorhanden - allerdings so schwach, dass sie mit dem Auge nicht mehr zu sehen sind. Mit einer Methode namens <a href="https://threshold.imageonline.co/" target="_blank">Threshold</a> können diese feinen Unterschiede verstärkt und wieder für den Menschen sichtbar gemacht werden.</p>
      
      <p>Wie lautet der Vorname der abgebildeten Person?
      </p>
    `,
    solution: secrets('chal_23'),
  },

  {
    id: 24,
    pos: { x: 140, y: 280 },
    title: 'Nicht blinzeln',
    date: '2017-08-25',
    deps: [1],
    html: `
      <p id="poper">Achtung, nicht blinzeln!
      </p>
      
      <script>
        setTimeout(function(){
          document.getElementById("poper").innerHTML = "Die Antwort auf diese Aufgabe lautet ${secrets(
            'chal_24'
          )}"
          setTimeout(function(){
            document.getElementById("poper").innerHTML = "Ups, das ging schnell."
          }, 150)
        }, 1500)
      </script>
    `,
    solution: secrets('chal_24'),
  },

  {
    id: 25,
    pos: { x: 865, y: 855 },
    title: 'Russische Puppen',
    date: '2017-08-25',
    deps: [22, 41, 42],
    html: `
      <p>Wenn man eine Datei zipt, dann wird sie kleiner und braucht weniger Speicherplatz. Wenn man eine Zip-Datei nochmal zipt, wird sie dann noch kleiner?
      </p>
      
      <p>Warum nicht ausprobieren? Ich habe die Antwort mal ordentlich gezipt: Hier ist die <a href="/chals/antwort25.zip">Datei</a>. Darin findet sich die Lösung zu dieser Aufgabe. Und nein, mehrfaches Zippen bringt nichts und macht die Datei sogar größer.
      </p>
    `,
    solution: secrets('chal_25'),
  },

  {
    id: 26,
    pos: { x: 515, y: 715 },
    title: 'Zeitmaschine',
    date: '2017-08-26',
    deps: [60],
    html: `
      <p>Vor einigen Jahren befand sich unter <a href="https://anagnori.tumblr.com/post/81212017022/if-its-not-too-much-to-ask-could-you-post-the" target="_blank">https://anagnori.tumblr.com/post/81212017022/if-its-not-too-much-to-ask-could-you-post-the</a> ein interessanter Artikel zu einem ganz bestimmten Thema.</p>
      
      <p>Aber leider ist der Blog gelöscht worden! Das ist ziemlich schade. Gäbe es nur eine Möglichkeit, die Zeit zurück zu drehen?</p>
      
      <p>Hold on! Zum Glück gibt es das <a href="http://archive.org/web/" target="_blank">Internet-Archiv</a>, das es sich zur Aufgabe gemacht hat, große Teile des Internet zu archivieren. Gehe in das Internet-Archiv und schlage den Artikel nach.</p>
    
      <p>Die Antwort ist der Name des Konzepts, über den sich in den Artikel beschwert wird (es geht um ein englisches Wort im Singular mit 8 Buchstaben).</p>
    `,
    solution: secrets('chal_26'),
  },

  {
    id: 27,
    pos: { x: 160, y: 485 },
    title: 'Fingerspitzengefühl',
    date: '2017-08-26',
    deps: [51, 68],
    html: `
      <p>Taste vorsichtig über das Feld und lies die Antwort ab:
      </p>
      
      <p><svg id="chal27"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal27.js"></script>
    `,
    solution: secrets('chal_27'),
  },

  {
    id: 28,
    pos: { x: 945, y: 385 },
    title: 'Werbung',
    date: '2017-08-26',
    deps: [10, 23, 79],
    html: `
      <p>Nervige Werbebanner, die einen den Inhalt versperren - wer kennt das nicht? Auch in diesem Fall verdeckt eine Werbung die Antwort auf die Aufgabe.
      </p>
      
      <p>Zum Glück bieten moderne Browser Werkzeuge an, mit denen man eine Website bearbeiten kann und damit auch das eine oder andere nervige Element verschwinden lässt. (Falls diese nicht zur Verfügung stehen: <a href="#" onclick="(function () {var script=document.createElement('script');script.src='https://x-ray-goggles.mouse.org/webxray.js';script.className='webxray';script.setAttribute('data-lang','en-US');script.setAttribute('data-baseuri','https://x-ray-goggles.mouse.org');document.body.appendChild(script);}())">X-Ray laden</a>)
      </p>
      
      <div style="position:absolute;width:1000px;height:1000px;background-color:green" id="banner">
        <span style="font-size:100px" id="text">Herzlichen Glückwunsch! Sie haben gewonnen!</span>
        <div style="margin-top:20px; border: 2px solid black; width: 350px; margin-left: 40px; cursor: pointer; padding: 8px" id="skipp">Überspringe die Werbung in <span id="counter">4568</span> Sekunden ...</div>
      </div>
      
      <p>Die Antwort zu dieser Aufgabe lautet <span id="solution"></span>.
      </p>
      
      <script src="/chals/chal28.js"></script>
      <script>document.getElementById("solution").innerHTML = atob("TGl0ZmHfc+R1bGU=")</script>
    `,
    solution: secrets('chal_28'),
  },

  {
    id: 29,
    pos: { x: 195, y: 615 },
    title: 'GPS-Code',
    date: '2017-08-26',
    deps: [27],
    html: `
      <p>Die Anfangsbuchstaben folgender deutscher Orte ergeben die Antwort:
      </p>
      
      <p>
        52.7073, 8.5031<br>
        48.63253, 12.85515<br>
        50.9761, 8.8677<br>
        53.2724, 12.824<br>
        48.0336, 7.7649<br>
        49.59637, 11.11833<br>
        53.679, 10.6947
      </p>
    `,
    solution: secrets('chal_29'),
  },

  {
    id: 30,
    pos: { x: 715, y: 470 },
    title: 'UNIX Zeitstempel',
    date: '2017-08-26',
    deps: [21],
    html: `
      <p>Im welchen Jahr liegt der Zeitpunkt 817876800?
      </p>
    `,
    solution: secrets('chal_30'),
  },

  {
    id: 31,
    pos: { x: 300, y: 310 },
    title: 'Taschenrechner',
    date: '2017-08-26',
    deps: [4],
    html: `
      <p>Das hier ist der Taschenrechner von Hack the Web:
      </p>
      
      <br>
      
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <br>
      
      <p>Der Taschenrechner besteht aus einer "Röhre", die rechts offen ist. Mit den Zahlentasten kannst du einzelne Zahlen in diese Röhre schieben.
      </p>
      
      <p>Um weitere Zahlen zu erzeugen, musst du rechnen. Dazu gibt es die vier Grundrechenarten. Bei diesen Tasten werden die zwei Zahlen ganz rechts aus der Röhre herausgeholt und miteinander addiert, subtrahiert, multipliziert oder dividert. Probiere das aus und sieh, was passiert!
      </p>
      
      <p>Es gibt zwei Sonderbefehle: <strong>drop</strong> entfernt die letzte Zahl aus der Röhre (also die Zahl ganz rechts), <strong>dup</strong> fügt die letzte Zahl noch einmal hinzu (duplizieren).
      </p>
      
      <p>Berechne das Ergebnis 1000:
      </p>
      
      <p><img src="/chals/chal31_result.png" width="400"></p>
    `,
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val == '1000',
      }
    },
    hidesubmit: true,
  },

  {
    id: 32,
    pos: { x: 380, y: 370 },
    title: 'Taschenrechner II',
    date: '2017-08-26',
    deps: [31],
    html: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <p>Berechne diesmal die Zahl 1337.
      </p>
    `,
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val == '1337',
      }
    },
    hidesubmit: true,
  },

  {
    id: 33,
    pos: { x: 430, y: 450 },
    title: 'Taschenrechner III',
    date: '2017-08-26',
    deps: [32],
    html: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal33.js"></script>
      
      <p>Berechne die Zahl 100. Allerdings fehlen diesmal ein paar Tasten.
      </p>
    `,
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val == '100',
      }
    },
    hidesubmit: true,
  },

  {
    id: 34,
    pos: { x: 550, y: 500 },
    title: 'Taschenrechner IV',
    date: '2017-09-01',
    deps: [33],
    html: `
      <p>Diese Aufgabe basiert wieder auf dem ursprünglichen Taschenrechner von Teil 1 (d.h. mit allen Tasten). Diesmal soll die Zahl nicht von dir berechnet werden, sondern es ist die Reihenfolge der Tasten gesucht, die zum richtigen Ergebnis führt.
      </p>
      
      <p>Schreibe die Tasten, die du am Taschenrechner drücken würdest, von links nach rechts mit Leerzeichen getrennt auf. So liefert z.B. die Eingabe "4 5 *" das Ergebnis 20 (Drücke zuerst 4, dann 5, dann die Maltaste). Entsprechend ergibt die Eingabe "4 dup *" das Ergebnis 16 und "1 2 3 drop +" das Ergebnis 3. Du kannst gerne zurückgehen und deine Eingabe am Rechner ausprobieren.
      </p>
      
      <p>Gesucht ist ein Programm, das die Zahl 386 erzeugt.
      </p>
    `,
    check: (answer) => {
      const val = trinterpreter(answer)
      return {
        answer: val,
        correct: val == '386',
      }
    },
  },

  {
    id: 35,
    pos: { x: 675, y: 525 },
    title: 'Taschenrechner V',
    date: '2017-09-01',
    deps: [34],
    html: `
      <p>Es ist ein Programm gesucht, das die Zahl 24 erzeugt. Diesmal sind allerdings nur die vier Befehle 1, 2, * und - erlaubt.
      </p>
    `,
    check: (answer) => {
      const val = trinterpreterstripped(answer)
      return {
        answer: val,
        correct: val == '24',
      }
    },
  },

  {
    id: 36,
    pos: { x: 1005, y: 50 },
    title: 'Benutzername V',
    date: '2020-05-20',
    deps: [56],
    html: `
      <p>Es war noch nie einfacher gewesen, eine eigene Website zu bauen und diese ins Internet zu stellen. Daher die Aufgabe für dich: Erstelle eine Website, die genau deinen Benutzernamen enthält (kein HTML, keine Leerzeichen, nur dein Benutzername!) und gib die URL als Antwort ein:
      </p>
    `,
    check: async (answer, { req }) => {
      let value = ''
      try {
        if (!answer || !answer.startsWith('http')) {
          return { answer: 'Keine URL: ' + answer, correct: false }
        }
        const res = await fetch(answer, {
          size: 1024 * 1024,
          redirect: 'manual',
        })
        value = await res.text()
        value = value.trim()
        if (value.length > 1000) {
          value = value.substring(0, 1000) + '...'
        }
      } catch (e) {
        value = e.message
      }
      return {
        answer: value,
        correct: value === req.user.name,
      }
    },
  },

  {
    id: 37,
    pos: { x: 935, y: 185 },
    title: 'Emojis',
    date: '2020-05-20',
    deps: [79],
    html: `
      <p>Emojis haben mittlerweile ihren festen Platz in unserer Kommunikation eingenommen. Und es geht sogar soweit, dass man Emojis wie Buchstaben behandelt, d.h. man kann sie kopieren und einfügen, wie ganz normalen Text. Die Antwort besteht aus folgenden drei "Buchstaben":
      </p>
      
      <p><img src="/chals/chal37.png"></p>
      
      <p>Deine Aufgabe ist es nun, sie in das Antwortfeld einzugeben. Beachte, dass die "Buchstaben" je nach Schriftart des Computers z.T. anders aussehen können.</p>
    `,
    check: (answer) => {
      const withoutWhitespace = answer.replace(/\s+/g, '')
      const encoded = encodeURIComponent(withoutWhitespace)
      return {
        answer,
        correct: encoded == '%F0%9F%98%B3%F0%9F%94%A5%F0%9F%90%B1',
      }
    },
  },

  {
    id: 38,
    pos: { x: 1250, y: 520 },
    title: 'Metadaten',
    date: '2020-05-20',
    deps: [48],
    html: `
      <p>Oh wie süß! Schau dir dieses Foto an:
      </p>
      
      <p><img src="/chals/chal38.jpg"></p>
      
      <p>Neben dem, was du auf dem Foto sehen kannst, enthalten viele Bilddateien noch weitere Informationen, wie z.B. das Kameramodell oder die ISO-Zahl. Das sind die sog. <em>EXIF-Tags</em> und diese sind leider nicht sofort sichtbar. Allerdings gibt es einige Tools, die dir dies Tags anzeigen können. Und darin findest sich auch die Antwort.</p>
    `,
    solution: secrets('chal_38'),
  },

  {
    id: 39,
    pos: { x: 565, y: 955 },
    title: 'Flaggen',
    date: '2020-05-20',
    deps: [50],
    html: `
      <p>Flaggen können viele Bedeutungen haben: Es gibt sie für Länder und Gebiete, aber man kann sie auch als Signal und Alphabet nutzen. In der Seefahrt wird dieses Potenzial voll ausgenutzt.
      </p>
      
      <p>Schau dir <a href="/chals/chal39.mp4">dieses Video</a> an. Welches Wort ergeben die Buchstaben der Signalflaggen?
      </p>
    `,
    solution: secrets('chal_39'),
  },

  {
    id: 40,
    pos: { x: 945, y: 766 },
    title: 'Terminal',
    date: '2020-05-20',
    deps: [81],
    html: `
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
    solution: secrets('chal_40'),
  },

  {
    id: 41,
    pos: { x: 655, y: 675 },
    title: 'Querlesen',
    date: '2020-05-20',
    deps: [60],
    html: `
      <p>Ein schnulziges Gedicht ... oder doch eine geheime Botschaft?
      </p>
      
      <p><em>
        <strong>D</strong>ie langen Stunden vor dem Rechner<br>
        <strong>i</strong>m dunklen oder hellen Zimmer,<br>
        <strong>e</strong>rgeben doch einen Sinn<br>
        <strong>a</strong>m Ende der Zeit!<br>
        <br>
        <strong>N</strong>icht verzagen ist das Motto<br>
        <strong>t</strong>reuen Herzens weitergehen!<br>
        "<strong>W</strong>ohin des Wegs", so mancher fragt,<br>
        <strong>O</strong>, es ist ein weiter!<br>
        <br>
        <strong>R</strong>astet nicht, ihr Hackerhelden<br>
        <strong>t</strong>reten nicht dem Rennen aus.<br>
        <strong>L</strong>asst uns gemeinsam durch dieses Feuer:<br>
        <strong>A</strong>lle für einen und einer für alle.<br>
        <br>
        <strong>U</strong>nd wenn uns doch mal Mühsal packt<br>
        <strong>t</strong>raut euch auch im Hilfe zu bitten.<br>
        <strong>E</strong>ine Schande ist es nicht, zu fragen,<br>
        <strong>t</strong>raurig wär's, wenn es das wäre.<br>
        <br>
        <strong>S</strong>o ist das ganze Leben wohl<br>
        <strong>t</strong>rotz all der müßigen Momente<br>
        <strong>e</strong>in Fest des Lebens! Jawohl, das ist es.<br>
        <strong>N</strong>icht zu vergessen,<br>
        <strong>O</strong>stern und Weihnachten.</em>
      </p>
    `,
    solution: secrets('chal_41'),
  },

  {
    id: 42,
    pos: { x: 615, y: 745 },
    title: 'Ohrwurm',
    date: '2020-05-20',
    deps: [60],
    html: `
      <p>Wer kennt ihn nicht: Der Wurm, der uns ins Gehör kriegt und uns Tag und Nacht verfolgt?
      </p>
      
      <p>Hier ein Beispiel dafür:
      </p>
      
      <audio src="/chals/chal_42.mp3" controls loop></audio>
      
      <p>Die Frage ist nun: Wie heißt der Song?
      </p>
    `,
    solution: secrets('chal_42'),
  },

  {
    id: 43,
    pos: { x: 1125, y: 195 },
    title: 'POST it',
    date: '2020-05-20',
    deps: [37, 56],
    html: `
      <p>Diesmal gibt es keine Umschweife: Die Antwort auf diese Aufgabe lautet Klamauk.
      </p>
      
      <p>Leider gibt es zu dieser Aufgabe kein Eingabefeld. Aber das sollte dich nicht abhalten, mir die Antwort zu sagen!
      </p>
    `,
    solution: secrets('chal_43'),
    hidesubmit: true,
  },

  {
    id: 44,
    pos: { x: 1120, y: 355 },
    title: 'Ladebalken II',
    date: '2020-05-20',
    deps: [47],
    html: `
      <p>Deine Antwort wird berechnet. Es dauert nur einen Moment ...
      </p>
      
      <div class="progress my-4">
        <div id="44_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 1%"></div>
      </div>
      
      <p id="value">LIFEISPROGRESS</p>
      
      <p id="status">...</p>
      
      <script>
        const bar = document.getElementById('44_bar')
        const value = document.getElementById('value')
        const status = document.getElementById('status')
        
        let step = 0
        let steps = 100000
        
        function transform(str) {
          const chars = str.split('').map(str => str.charCodeAt(0))
          const output = chars.map((code, i) => {
            const originIndex = ((code * 2 + 3)) % str.length
            const originCode = str.charCodeAt(originIndex)
            const newCode = ((originCode + code * 2 + 1 + i) % 26) + 65
            return String.fromCharCode(newCode)
          }).join('')
          return output
        }
        
        function work() {
          if (step >= steps) {
            bar.style.width = '100%'
          } else {
            step++
            bar.style.width = ((step/steps) * 98.9 + 1) + '%'
            value.innerHTML = transform(value.innerHTML)
            status.innerHTML = '(' + step + '/' + steps + ')'
            setTimeout(work, 1000)
          }
        }
        
        setTimeout(work, 2000)
      </script>
    `,
    solution: secrets('chal_44'),
  },

  {
    id: 45,
    pos: { x: 415, y: 1005 },
    title: 'Schriftzeichen',
    date: '2020-05-20',
    deps: [50, 70],
    html: `
      <p>Wir leben in einer internationalen Welt und auch Hacker sind in vielen Sprachen unterwegs. Manche Sprachen unterscheiden sich dabei stark von unserer Sprache und stellen uns so vor Herausforderungen. Welche Leckerei verbirgt sich nun hinter folgenden Schriftzeichen?
      </p>
      
      <p><img src="/chals/chal45.png"></p>
    `,
    solution: secrets('chal_45'),
  },

  {
    id: 46,
    pos: { x: 1275, y: 405 },
    title: 'Kopfdaten',
    date: '2020-05-20',
    deps: [43, 48, 62],
    html: `
      <p>Die Antwort zu dieser Aufgabe findest du in <a href="/chal/chal46">dieser leeren Seite</a>. Aber kann eine leere Website Informationen enthalten?
      </p>
      
      <p>Sehr wohl! Denn beim Öffnen einer Website zählt nicht nur der Inhalt allein.
      </p>
    `,
    solution: secrets('chal_46'),
  },

  {
    id: 47,
    pos: { x: 970, y: 270 },
    title: 'Ladebalken',
    date: '2020-05-20',
    deps: [79],
    html: `
      <p>Warte, bis diese Seite deine Antwort berechnet hat ...
      </p>
      
      <div class="progress my-4">
        <div id="44_bar" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 1%"></div>
      </div>
      
      <p id="value"></p>
      
      <p id="status"></p>
      
      <script>
        const bar = document.getElementById('44_bar')
        const value = document.getElementById('value')
        const status = document.getElementById('status')
        
        let step = 1
        let steps = 2000
        let x = 3
        
        function transform(x) {
          return (x * 3) % 1000
        }
        
        function work() {
          if (step >= steps) {
            bar.style.width = '100%'
          } else {
            step++
            bar.style.width = ((step/steps) * 98.9 + 1) + '%'
            x = transform(x)
            value.innerHTML = x.toString()
            status.innerHTML = '(' + step + '/' + steps + ')'
            setTimeout(work, 1000)
          }
        }
        
        value.innerHTML = x
        status.innerHTML = '(1/' + steps + ')'
        
        setTimeout(work, 1000)
      </script>
    `,
    solution: secrets('chal_47'),
  },

  {
    id: 48,
    pos: { x: 1111, y: 420 },
    title: 'Stille',
    date: '2020-05-21',
    deps: [28, 47],
    html: `
      <p>Zur Ruhe kommen und in sich hineinhören ... dieser <a href="/chals/chal48.flac">einstündige, fast lautlose Soundtrack</a> ist der perfekte Begleiter für deine Meditation.
      </p>
      
      <audio src="/chals/chal48.flac" controls></audio>
      
      <p>Wer weiß, vielleicht kommt dir während der Meditation eine Eingebung für diese Aufgabe? Einen Versuch ist es alle mal Wert!
      </p>
    `,
    solution: secrets('chal_48'),
  },

  {
    id: 49,
    pos: { x: 1015, y: 575 },
    title: 'Spielstand II',
    date: '2020-05-21',
    deps: [65],
    html: `
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
    check: (input) => {
      let answer = ''
      let state = {}
      try {
        const key = Buffer.from('786d229b0de877774a2f676d5bd895c3', 'hex')
        const encrypted = Buffer.from(input, 'hex')
        decipher = crypto.createDecipheriv('aes-128-ecb', key, '')
        answer = decipher.update(encrypted).toString()
        answer += decipher.final().toString()
        state = JSON.parse(answer)
      } catch (e) {
        answer = e.message + ': ' + answer
      }
      return {
        answer,
        correct: state.gold === 999999,
      }
    },
  },

  {
    id: 50,
    pos: { x: 455, y: 825 },
    title: 'Winkelschrift',
    date: '2020-05-21',
    deps: [53, 58, 60],
    html: `
      <p>Was diese winkeligen Zeichen wohl sagen mögen?
      </p>
      
      <p><img src="/chals/chal50.png"></p>
      
      <p>Zum Glück gibt es folgenden Hinweis:
      </p>
      
      <p><img src="/chals/chal50.gif"></p>
      
      <p>Der erste Buchstabe des Texts wäre damit ein D, der letzte Buchstabe des Texts ein S.
      </p>
    `,
    solution: secrets('chal_50'),
  },

  {
    id: 51,
    pos: { x: 195, y: 405 },
    title: 'Basis 2',
    date: '2020-08-01',
    deps: [24],
    html: `
      <p>Für elektrische Schaltungen ist es einfacher, mit zwei Zuständen (an / aus) umzugehen, als mit zehn Zuständen. Deshalb werden Zahlen am Computer im Binärsystem dargestellt, also nur mit 1 und 0.
      </p>
      
      <p>Zur Grundausstattung einer Hacker*in gehört die Fähigkeit, Zahlen von einer Basis in die andere umzuwandeln. Löse das Quiz, um die Antwort zu erhalten - geschicktes Raten ist erlaubt.
      </p>
      
      <p>&nbsp;</p>
      
      <iframe src="https://app.Lumi.education/api/v1/run/pFLtMk/embed" width="642" height="440" style="background-color:white;padding-left:32px;margin-bottom:12px;padding-top:20px;" frameborder="0">
      </iframe>
    `,
    solution: secrets('chal_51'),
  },

  {
    id: 52,
    pos: { x: 250, y: 530 },
    title: 'Quiz',
    date: '2020-08-01',
    deps: [51],
    html: `
      <p>Eine weitere wichtige Sprache von Computer ist der ASCII Code, den du auf <a href="https://www.torsten-horn.de/techdocs/ascii.htm" target="_blank">dieser Website</a> nachschlagen kannst.
      </p>
      
      <p>Bei der ersten Tabelle interessiert uns nur die letzten beiden Spalten. Die letzte Spalte gibt das Zeichen an, die vorletzte Spalte den Code in dezimal (grüne Schrift). Zum Beispiel hat das kleine <code>a</code> den Zeichencode 97.
      </p>
      
      <p>Auch diesmal hilft dir ein Quiz beim Lernen des ASCII Codes. Aber du musst nicht bei jeder Frage in der Tabelle nachschauen. Findest du das Muster, das dir beim Lösen des Quiz hilft?
      </p>
      
      <hr />
      
      <p>Wandle um in den ASCII-Code:
      </p>
      
      <p class="my-4"><strong><span id="char-value"></span></strong></p>
      
      <p>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans1"></button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans2"></button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans3"></button>
      </p>
      
      <div class="progress my-4">
        <div class="progress-bar" role="progressbar" style="width: 0%;" id="progress"></div>
      </div>
      
      <p id="status"></p>
      
      
      <script src="/chals/chal52.js"></script>
    `,
    check: (answer) => {
      return { answer, correct: answer === '8/8' }
    },
    hidesubmit: true,
  },

  {
    id: 53,
    pos: { x: 265, y: 725 },
    title: 'Quiz II',
    date: '2020-08-01',
    deps: [29, 52],
    html: `
      <p>Bei diesem Quiz ist jemandem doch glatt die Kreativität ausgegangen.
      </p>
      
      <hr />
      
      <p class="my-4">Klicke auf das X:</p>
      
      <p>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans1">X</button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans2">.</button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans3">.</button>
      </p>
      
      <div class="progress my-4">
        <div class="progress-bar" role="progressbar" style="width: 0%;" id="progress"></div>
      </div>
      
      <p id="status"></p>
      
      
      <script src="/chals/chal53.js"></script>
    `,
    check: (answer) => {
      return { answer, correct: answer === '2000/2000' }
    },
    hidesubmit: true,
  },

  /*{
    id: 54,
    pos: { x: 255, y: 895 },
    title: 'Quiz IV',
    deps: [53],
    html: `
      <p>Doch noch nicht bereit dafür ...
      </p>
    `,
    solution: '---',
  },*/

  {
    id: 55,
    pos: { x: 390, y: 280 },
    title: 'Smiley',
    date: '2020-08-01',
    deps: [4],
    html: `
      <p>Wer sagt, dass ein Computerprogramm langweilig aussehen muss? Hier gibt es ein ganz besonderes Programm - und zwar in der Form eines Smileys:
      </p>
      
      <pre class="bg-dark p-3"><code>                  const d = [68,
             105,               101,
         32,                         65,
      110,                             116,
    119,                                 111,
  114,        116,            32,         108,
 97,          117,            116,         101,
116,           32,            75,           111,
114,                                         111,
115,                                         101,
110,     115                          ,      101,
 105      ,46                        ];     const
  e        = d                   .map(       (x 
   )=>       String.fromCharCode(x))      .join
    (''                                    )
      /*                                 x
        x                             x
           xxxxx                xxx*/
                 console.log(e)</code></pre>

      <p>Führe das Programm aus, indem du es auf <a href="https://runjs.co/" target="_blank">RunJS</a> einfügen. In der Ausgabe findest du die gesuchte Anwort.</p>
    `,
    solution: secrets('chal_55'),
  },

  {
    id: 56,
    pos: { x: 865, y: 105 },
    title: 'Benutzername IV',
    date: '2020-08-01',
    deps: [17],
    html: `
      <p>Es ist wieder dein Benutzername gefragt. Aber diesmal soll dein Benutzername auf einer Website enthalten sein. Gib als Antwort den vollständigen Link zu dieser Website ein, z.B. <code>https://www.wikipedia.de</code>. Der Server ruft dann die Website auf und durchsucht sie nach deinem Namen.
      </p>
    `,
    check: async (answer, { req }) => {
      let value = ''
      let containsUsername = false
      try {
        if (!answer || !answer.startsWith('http')) {
          return { answer: 'Keine URL: ' + answer, correct: false }
        }
        const res = await fetch(answer, {
          size: 1024 * 1024 * 2,
          redirect: 'manual',
        })
        value = await res.text()
        value = value.trim()
        if (!value) value = '[Leere Seite (Status ' + res.status + ')]'
        if (value.includes(req.user.name)) containsUsername = true
        if (value.length > 1000) {
          value = value.substring(0, 1000) + '...'
        }
      } catch (e) {
        value = e.message
      }
      return {
        answer: value,
        correct: containsUsername,
      }
    },
  },

  {
    id: 57,
    pos: { x: 1350, y: 950 },
    title: 'Passage',
    date: '2020-08-17',
    deps: [59, 63, 64, 67],
    html: `
          <p><i>Durch dunkle Gänge zieht es mich,<br>
Von Geheimnissen umgeben.<br>
Was sich verbirgt, ich weiß es nicht,<br>
Doch ich spüre tiefes Beben.</i>
          </p>
          
          <p>Hinter dieser Passage findest du den zweiten Teil von Hack The Web - noch mehr Welten zu entdecken und Aufgaben, an denen du dir die Zähne ausbeißen kannst.</p>
          
          <p>24 &nbsp; 37 &nbsp; 30 &nbsp; 68 &nbsp; 84 &nbsp; 64 &nbsp; 18</p>
          
          <p>Jede Zahl entspricht der Nummer einer Aufgabe. Schaue in die Addressleiste. Dort siehst du, dass diese Aufgabe die Nummer 57 hat. Die Anfangsbuchstaben der Aufgaben bilden die Antwort.</p>
    `,
    solution: secrets('chal_57'),
  },

  {
    id: 58,
    pos: { x: 355, y: 665 },
    title: 'Code Royale',
    date: '2020-08-17',
    deps: [52, 78],
    html: `
      <p>Es gibt fast keine Grenzen, mit welchen Mitteln man einen Geheimtext schreiben kann. Hier ist mein bescheidener Versuch, ein bekanntes Spiel einzubringen. Der Code ist nicht perfekt geworden, aber sollte gut genug für dich sein, um das Lösungswort zu entziffern. Es ist ein deutsches Wort mit 6 Buchstaben:
      </p>
      
      <p><img src="/chals/chal58.jpg"></p>
    `,
    solution: secrets('chal_58'),
  },

  {
    id: 59,
    pos: { x: 1075, y: 985 },
    title: 'Geheimtext',
    date: '2020-08-17',
    deps: [3, 25],
    html: `
      <pre id="output" style="font-size:20px;white-space:pre-wrap">
      </pre>
      
      <div id="selections" style="display:flex;text-align:center;flex-wrap:wrap;gap:6px;"></div>
      
      <script src="/chals/chal59.js"></script>
      
      <div style="height:24px"></div>
      
      <p>Jeder Buchstabe wurde mit einem anderen Buchstaben aus dem Alphabet vertauscht. Die Häufigkeit der Buchstaben ist angegeben. Finde ich richtige Zuordnung. Die Antwort ist der Name der Person, die den ersten Satz sagt.
      </p>
    `,
    solution: secrets('chal_59'),
  },

  {
    id: 60,
    pos: { x: 450, y: 600 },
    title: 'Scan Mich',
    date: '2020-08-17',
    deps: [33, 78],
    html: `
      <p><img src="/chals/chal60.png" width=400 height=400></p>
    `,
    solution: secrets('chal_60'),
  },

  {
    id: 61,
    pos: { x: 1045, y: 660 },
    title: 'Bunte Blöcke',
    date: '2020-08-17',
    deps: [81],
    html: `
      <p><img src="/chals/chal61.png" width=550></p>
    `,
    solution: secrets('chal_61'),
  },

  {
    id: 62,
    pos: { x: 1130, y: 300 },
    title: 'Datei X',
    date: '2020-08-17',
    deps: [37, 47],
    html: `
      <p><a href="/chals/chal62.txt">Diese Datei</a> ist definitiv keine Textdatei, auch wenn die Dateiendung das so vorgeben möchte.
      </p>
      
      <p>Meist verrät der Anfang der Datei, um was für einen Typ es sich handelt. Das ist hier der Fall. Kannst du herausfinden, mit welchem Programm sich diese Datei öffnen lässt?
      </p>
    `,
    solution: secrets('chal_62'),
  },

  {
    id: 63,
    pos: { x: 1335, y: 650 },
    title: 'Cheater',
    date: '2020-08-17',
    deps: [38, 46, 80],
    html: `
      <p>Anleitung: Klicke auf das Spielfeld. Steuere den Volleyball mit den Pfeiltasten. Berühre abwechselnd die linke und rechte Wand. Dadurch erhöhst du den Zähler. Du verlierst, wenn der Ball den Boden berührt oder aus dem Spielfeld verschwindet.</p>
      
      <p>Du sieht die Antwort, sobald du 1000 Punkte erreichst. Das Spiel hat keine Cheats eingebaut - du musst es daher selber hacken.
      </p>
      
      <div id="game" tabindex="1"></div>
      
      <script src="/pixi.min.js"></script>
      <script src="/chals/chal63/matter.js"></script>
      
      <button onclick="handleLeft()">Left</button>
      <button onclick="handleUp()">Up</button>
      <button onclick="handleRight()">Right</button>

      <p><button onclick="update()" style="margin-top:20px">Code aktualisieren</button></p>
      
      <p><textarea style="width:100%;height:500px;font-family:monospace" id="code">if (app) app.ticker.stop();
var app = new PIXI.Application(800,600,{backgroundColor:0x1099bb});
document.getElementById('game').innerHTML = ''
document.getElementById('game').appendChild(app.view);

var engine = Matter.Engine.create(),
world = engine.world;

var HOLZ = "/chals/chal63/holz.jpg"
var BALL = "/chals/chal63/ball.png"

PIXI.loader.reset()

PIXI.loader
.add(HOLZ)
.add(BALL)
.load(() => {

  var basicText = app.stage.addChild(new PIXI.Text('Basic text in pixi'))
  window.basicText = basicText
  basicText.x = 30
  basicText.y = 90
  
  var woodTexture = PIXI.loader.resources[HOLZ].texture
  
  function buildWoodBlock(x, y, w, h, id) {
    var block = new PIXI.extras.TilingSprite(woodTexture, w, h)
    app.stage.addChild(block)
    Matter.World.add(world, Matter.Bodies.rectangle(x+w/2, y+h/2, w, h, {isStatic:true, id}))
    block.x = x
    block.y = y
  }
  
  buildWoodBlock(0, 570, 800, 30, 1)
  buildWoodBlock(0, 170, 30, 400, 2)
  buildWoodBlock(770, 170, 30, 400, 3)
  buildWoodBlock(350,50,100,100, 4)
  
  
  var ball = new PIXI.Sprite(PIXI.loader.resources[BALL].texture)
  ball.x = 300
  ball.y = 200
  ball.width = 100
  ball.height = 100
  ball.anchor.set(0.5)
  app.stage.addChild(ball)
  
  var border = undefined
  
  if (window.score === undefined) {
    window.score = 0
    basicText.text = window.score.toString()
  }
  
  var circle = Matter.Bodies.circle(300, 200, 50, { restitution: 1, id: 5 })
  Matter.World.add(world, circle)
  Matter.Events.on(engine, "collisionStart", data => {
    if (data.pairs[0].bodyA.id == 1 && data.pairs[0].bodyB.id == 5) {
      window.score = 0
      basicText.text = window.score.toString()
    }
    else if (data.pairs[0].bodyA.id == 2 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined)
        border = 2
      
      if (data.pairs[0].bodyA.id == border) {
        window.score++
        basicText.text = window.score.toString()
        border = 3
      }
    }
    else if (data.pairs[0].bodyA.id == 3 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined)
        border = 3
      
      if (data.pairs[0].bodyA.id == border) {
        window.score++
        basicText.text = window.score.toString()
        border = 2
      }
    }
  })
  
  function handleUp() {
    var angle = Math.random()*40-20-90
    var r = angle/180*Math.PI
    Matter.Body.applyForce(circle, circle.position, {x:Math.cos(r)*0.24,y:Math.sin(r)*0.24})
  }
  
  function handleLeft() {
    Matter.Body.applyForce(circle, circle.position, {x:-0.2,y:-0.05})
  }
  
  function handleRight() {
    Matter.Body.applyForce(circle, circle.position, {x:+0.2,y:-0.05})
  }
  
  document.handleLeft = handleLeft
  document.handleUp = handleUp
  document.handleRight = handleRight
  
  
  document.getElementById('game').onkeydown = (key) => {
    if (key.keyCode == 38) {
      handleUp()
      key.preventDefault()
    }
    
    if (key.keyCode == 37) {
      handleLeft()
      key.preventDefault()
    }
    
    if (key.keyCode == 39) {
      handleRight()
      key.preventDefault()
    }
  }
  
  app.ticker.add(delta => {
    Matter.Engine.update(engine)
    ball.x = circle.position.x
    ball.y = circle.position.y
  })
})
</textarea></p>
    
    <script>
      function update() {
        eval(document.getElementById('code').value)
      }
      
      function checkDone() {
        if (window.score >= 1000) {
          window.basicText.text = 'Die Antwort lautet ' + (![]+[])[!+[]+!+[]+!+[]]+((+[])[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+(![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]
        }
        setTimeout(checkDone, 10)
      }
      
      window.onload = () => {
        update()
        checkDone()
      }
    </script>

    `,
    solution: secrets('chal_63'),
  },

  {
    id: 64,
    pos: { x: 1155, y: 840 },
    title: 'Eine Zeile Python',
    date: '2020-08-17',
    deps: [25, 40, 61],
    html: `
      <p>Was ist die Ausgabe folgender Zeile?
      </p>
      
      <p><pre><code>print(sum([(x+1)*(x+1) for x in range(10)]))</pre></code></p>
    `,
    solution: secrets('chal_64'),
  },

  {
    id: 65,
    pos: { x: 895, y: 555 },
    title: 'Spielstand',
    date: '2021-03-19',
    deps: [81],
    html: `
      <p>Die meisten Spiele speichern ihre Spielstände in einer verschlüsselten Form. Auch dieses kleine Spiel hier auf der Seite. Erreiche 999999 Gold und gibt deinen Spielstand als Antwort ein. Du kannst das Spiel spielen - oder es austricken.
      </p>
    
      <br /><br />
    
      <p>Dein Gold: <span id="gold-span">0</span><br /><button onclick="update()">Grind me!</button>
      </p>
      <p style="color:gray">Spielstand: <span id="spielstand"></span>
      </p>
      <script>
        function update() {
          var gold = parseInt(document.getElementById('gold-span').innerHTML)
          gold = gold + 1
          document.getElementById('gold-span').innerHTML = gold.toString()
          document.getElementById('spielstand').innerHTML = btoa(JSON.stringify({gold:gold}))
        }
      </script>
    `,
    check: (input) => {
      let answer = input
      let state = {}
      try {
        const data = Buffer.from(input, 'base64').toString('binary')
        state = JSON.parse(data)
        if (state.gold < 999999) {
          return { answer: state.gold + ' Gold', correct: false }
        }
      } catch (e) {
        answer = e.message
      }
      return {
        answer,
        correct: state.gold === 999999,
      }
    },
  },

  {
    id: 66,
    pos: { x: 100, y: 565 },
    title: 'Matrix',
    date: '2021-03-19',
    deps: [68],
    html: `
      <p>Im Hintergrund der <a href="/chals/chal66/index.html" target="_blank">Matrix</a> ist ein Wort versteckt. Schaue genau hin und achte auf die Schatten.
      </p>
    `,
    solution: secrets('chal_66'),
  },

  {
    id: 67,
    pos: { x: 1255, y: 760 },
    title: 'Anschlüsse',
    date: '2021-03-19',
    deps: [61],
    html: `
      <p>Verbinde die Adern in der richten Reihenfolge mit dem Stecker. Nutze dabei den Standard TIA-568B.</p>
    
      <p><img src="/chals/chal67.png" width="500"></p>
    `,
    solution: secrets('chal_67'),
  },

  {
    id: 68,
    pos: { x: 100, y: 400 },
    title: 'Gemälde',
    date: '2021-03-19',
    deps: [24],
    html: `
      <p>Kunst überdauert Jahrhunderte - auch weil sie immer wieder neu interpretiert und überarbeitet wird.</p>
      
      <p>Dein Freund Normand zeigt dir stolz sein neustes Kunstwerk:
      </p>
      
      <pre style="line-height:1.2;font-family: Menlo, Monaco, 'Courier New', monospace">                                  _______
                            _,,ad8888888888bba,_
                         ,ad88888I888888888888888ba,
                       ,88888888I88888888888888888888a,
                     ,d888888888I8888888888888888888888b,
                    d88888PP"""" ""YY88888888888888888888b,
                  ,d88"'__,,--------,,,,.;ZZZY8888888888888,
                 ,8IIl'"                ;;l"ZZZIII8888888888,
                ,I88l;'                  ;lZZZZZ888III8888888,
              ,II88Zl;.                  ;llZZZZZ888888I888888,
             ,II888Zl;.                .;;;;;lllZZZ888888I8888b
            ,II8888Z;;                 \`;;;;;''llZZ8888888I8888,
            II88888Z;'                        .;lZZZ8888888I888b
            II88888Z; _,aaa,      .,aaaaa,__.l;llZZZ88888888I888
            II88888IZZZZZZZZZ,  .ZZZZZZZZZZZZZZ;llZZ88888888I888,
            II88888IZZ<'(@@>Z|  |ZZZ<'(@@>ZZZZ;;llZZ888888888I88I
           ,II88888;   \`""" ;|  |ZZ; \`"""     ;;llZ8888888888I888
           II888888l            \`;;          .;llZZ8888888888I888,
          ,II888888Z;           ;;;        .;;llZZZ8888888888I888I
          III888888Zl;    ..,   \`;;       ,;;lllZZZ88888888888I888
          II88888888Z;;...;(_    _)      ,;;;llZZZZ88888888888I888,
          II88888888Zl;;;;;' \`--'Z;.   .,;;;;llZZZZ88888888888I888b
          ]I888888888Z;;;;'   ";llllll;..;;;lllZZZZ88888888888I8888,
          II888888888Zl.;;"Y88bd888P";;,..;lllZZZZZ88888888888I8888I
          II8888888888Zl;.; \`"PPP";;;,..;lllZZZZZZZ88888888888I88888
          II888888888888Zl;;. \`;;;l;;;;lllZZZZZZZZW88888888888I88888
          \`II8888888888888Zl;.    ,;;lllZZZZZZZZWMZ88888888888I88888
           II8888888888888888ZbaalllZZZZZZZZZWWMZZZ8888888888I888888,
           \`II88888888888888888b"WWZZZZZWWWMMZZZZZZI888888888I888888b
            \`II88888888888888888;ZZMMMMMMZZZZZZZZllI888888888I8888888
             \`II8888888888888888 \`;lZZZZZZZZZZZlllll888888888I8888888,
              II8888888888888888, \`;lllZZZZllllll;;.Y88888888I8888888b,
             ,II8888888888888888b   .;;lllllll;;;.;..88888888I88888888b,
             II888888888888888PZI;.  .\`;;;.;;;..; ...88888888I8888888888,
             II888888888888PZ;;';;.   ;. .;.  .;. .. Y8888888I88888888888b,
            ,II888888888PZ;;'                        \`8888888I8888888888888b,
            II888888888'                              888888I8888888888888888b
           ,II888888888                              ,888888I88888888888888888
          ,d88888888888                              d888888I8888888888ZZZZZZZ
       ,ad888888888888I                              8888888I8888ZZZZZZZZZZZZZ
     ,d888888888888888'                              888888IZZZZZZZZZZZZZZZZZZ
   ,d888888888888P'8P'                               Y888ZZZZZZZZZZZZZZZZZZZZZ
  ,8888888888888,  "                                 ,ZZZZZZZZZZZZZZZZZZZZZZZZ
 d888888888888888,                                ,ZZZZZZZZZZZZZZZZZZZZZZZZZZZ
 888888888888888888a,      _                    ,ZZZZZZZZZZZZZZZZZZZZ888888888
 888888888888888888888ba,_d'                  ,ZZZZZZZZZZZZZZZZZ88888888888888
 8888888888888888888888888888bbbaaa,,,______,ZZZZZZZZZZZZZZZ888888888888888888
 88888888888888888888888888888888888888888ZZZZZZZZZZZZZZZ888888888888888888888
 8888888888888888888888888888888888888888ZZZZZZZZZZZZZZ88888888888888888888888
 888888888888888888888888888888888888888ZZZZZZZZZZZZZZ888888888888888888888888
 8888888888888888888888888888888888888ZZZZZZZZZZZZZZ88888888888888888888888888
 88888888888888888888888888888888888ZZZZZZZZZZZZZZ8888888888888888888888888888
 8888888888888888888888888888888888ZZZZZZZZZZZZZZ88888888888888888 Normand  88
 88888888888888888888888888888888ZZZZZZZZZZZZZZ8888888888888888888 Veilleux 88
 8888888888888888888888888888888ZZZZZZZZZZZZZZ88888888888888888888888888888888</pre>
    
    <p>Die Umsetzung ist kreativ und modern, doch das Motiv selber ist schon sehr alt. In welchem Jahr ist der Maler des ursprünglichen Gemäldes geboren?</p>
    `,
    solution: secrets('chal_68'),
  },

  {
    id: 69,
    pos: { x: 155, y: 745 },
    title: 'Schattenbilder',
    date: '2021-03-19',
    deps: [29, 66],
    html: `
      <p>Lege diese Bilder übereinander...
      </p>
      
      <p><img src="/chals/chal69_1.png" width="500" style="border: 1px solid black"></p>
      <p><img src="/chals/chal69_2.png" width="500" style="border: 1px solid black"></p>
      <p><img src="/chals/chal69_3.png" width="500" style="border: 1px solid black"></p>
      <p><img src="/chals/chal69_4.png" width="500" style="border: 1px solid black"></p>
      <p><img src="/chals/chal69_5.png" width="500" style="border: 1px solid black"></p>
      <p><img src="/chals/chal69_6.png" width="500" style="border: 1px solid black"></p>
      
      <p>... und erhalte die Antwort:</p>
    `,
    solution: secrets('chal_69'),
  },

  {
    id: 70,
    pos: { x: 255, y: 885 },
    title: 'Karol',
    date: '2021-03-19',
    deps: [69],
    html: `
      <p>Lasse <a href="https://karol.arrrg.de/?id=IaepMRwFW" target="_blank">Robot Karol</a> folgenden Code ausführen:
      </p>
      
      <p><img src="/chals/chal70.png"></p>
    `,
    solution: secrets('chal_70'), // link: https://karol.arrrg.de/?id=b5S45y9RF
  },

  {
    id: 71,
    pos: { x: 1550, y: 905 },
    title: 'Sag mal',
    date: '2022-02-09',
    deps: [57],
    html: `
      <p>Manche Missverständnisse sind ärgerlich. Zum Beispiel hast du gefragt, was im Bild zu sehen ist - und hast als Antwort <a href="/chals/sagmal.mp3">diese Sprachnachricht</a> erhalten:</p>
      
      <audio src="/chals/sagmal.mp3" controls>
      </audio>
      
      <p>Dein Gegenüber hat dir also tatsächlich die einzelnen Bytes der Bilddatei vorgelesen - eine Stunde lang! Jetzt liegt es an dir, daraus wieder ein Bild zu bauen. Sage mir, welches Wort auf diesem Bild steht.</p>
    `,
    solution: secrets('chal_71'),
  },

  {
    id: 72,
    pos: { x: 1570, y: 985 },
    title: 'Labyrinth',
    date: '2022-02-09',
    deps: [57],
    html: `
      <p>In den Tiefen dieser Website ist ein <a href="/chal/maze" target="_blank">Labyrinth</a> versteckt. Erforsche es und komme zurück, wenn du den Schatz gefunden hast.</p>
    `,
    solution: secrets('chal_72'),
  },

  {
    id: 73,
    pos: { x: 1510, y: 1055 },
    title: 'Rufnummer',
    date: '2022-02-09',
    deps: [57],
    html: `
      <p>Das Festnetz wird heute nur noch wenig genutzt, andere Technologien haben es verdrängt. Aber halten wir für einen Moment die Zeit an und erinnern uns an <a href="/chals/chal73.wav">diese Töne</a>:</p>
    
      <audio src="/chals/chal73.wav" controls>
      </audio>
      
    `,
    solution: secrets('chal_73'),
  },

  {
    id: 74,
    pos: { x: 1430, y: 1135 },
    title: 'Blockchain',
    date: '2022-02-09',
    deps: [57],
    html: `
      <p>Heute werden Bitcoins meist zur Spekulation verwendet. Dafür gedacht waren sie nicht. Stattdessen sollte das Konzept einer Blockchain dazu beitragen, eine Währung ohne Zentralbank zu ermöglichen. Eine große Herausforderung dabei ist es, Manipulationen durch Einzelne zu verhindern. Wer schreibt sich selber nicht gerne ein paar Euro auf das eigene Konto?</p>
      
      <p>Ein Proof-of-Work, wie diese Aufgabe es von dir erfordert, soll das verhindern. Um diese Aufgabe zu lösen musst du mir erstmal beweisen, dass du hart gearbeitet hast.</p>
      
      <p>Deine Arbeit: Finde mir eine natürliche Zahl n. Der md5-hash von "hacktheweb" und n muss mit 6 Nullen anfangen. Das heißt konkret:</p>
      
      <p>
        n = 1 => md5("hacktheweb1") = 64c8b1f06b096bb17440d60b25c034ae => kein Treffer<br>
        n = 2 => md5("hacktheweb2") = afbab45a805ea5464e6378aaac3ae30f => kein Treffer<br>
        n = 3 => md5("hacktheweb3") = <strong style="color:green">0</strong>e23be04b8f478515df97f09c4751805 => 1 führende Null, du braucht 6<br>
        n = 4 => md5("hacktheweb4") = c0bad2e41a5e1cef51fab232d188d265 => kein Treffer<br>
        u.s.w.
      </p>
      
      <p>Eine passende Zahl n ist deine Antwort:</p>
    `,
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
    pos: { x: 1180, y: 1065 },
    title: 'Verlosung',
    date: '2022-02-09',
    deps: [57],
    html: `
      <p>Bei einer Verlosung gibt es immer viele Nieten und wenige Preise. In <a href="/chals/lostrommel.zip">dieser Lostrommel</a> finden sich 1000 Lose. Eine davon ist dein Hauptgewinn.</p>
    `,
    solution: secrets('chal_75'),
  },

  {
    id: 76,
    pos: { x: 1280, y: 1095 },
    title: 'Zeitraum',
    date: '2022-02-09',
    deps: [57],
    html: `<p>Schön, dass du schon so lange dabei bist. Nun, sage mir: Seit wie vielen Minuten genau bist du auf dieser Seite registriert?</p>`,
    check: (answer, { req, App }) => {
      const str = parseInt(answer)
      const now = App.moment()
      const registered = App.moment(req.user.createdAt)
      const diff = now.diff(registered, 'minutes')
      return {
        answer: str + ' Minuten',
        correct: str === diff,
      }
    },
  },

  {
    id: 77,
    pos: { x: 630, y: 155 },
    title: 'Hell und dunkel',
    date: '2022-02-09',
    deps: [6, 16],
    html: `
      <p>Seit einiger Zeit hast sich der "Dark mode" bei vielen Websiten durchgesetzt. Diese Seite zeigt dir einen unterschiedlichen Inhalt an, je nach dem, welchen Modus du gerade aktiviert hast. Zusammen ergeben die Zeichen die Antwort:</p>
      
      <div style="display: flex">
        <div class="letter"><span class="light">Y</span></div>
        <div class="letter"><span class="dark">I</span></div>
        <div class="letter"><span class="light">N</span></div>
        <div class="letter"><span class="dark">Y</span></div>
        <div class="letter"><span class="light">A</span></div>
        <div class="letter"><span class="dark">N</span></div>
        <div class="letter"><span class="light">G</span></div>
      </div>
      
      <style>
        @media (prefers-color-scheme: dark) {
          .dark {
            display: block;
            background: black;
            color: white;
          }
          .light {
            display: none;
          }
        }
        @media (prefers-color-scheme: light) {
          .dark {
            display: none;
          }
          .light {
            display: block;
            background: white;
            color: black;
          }
        }
        .letter {
          margin: 4px;
          padding: 4px;
          font-size: 3rem;
          border: 1px gray solid;
          width: 90px;
          text-align: center;
        }
      </style>
    `,
    solution: secrets('chal_77'),
  },

  {
    id: 78,
    pos: { x: 330, y: 480 },
    title: 'DIN A4',
    date: '2022-02-09',
    deps: [18],
    html: `
      <p>Die meisten Webseiten können sich an die Größe des Bildschirms anpassen, sei es ein Handy, Tablet oder großer Monitor. In der analogen Welt gibt es diese Möglichkeiten nicht. Dort findet sich häufig nur das Format DIN A4.
      </p>
      
      <p>Eine Webseite lässt sich auch in das DIN-A4-Format bringen, zum Beispiel durch die Druckvorschau. Dort findest du die Antwort zu dieser Aufgabe.
      </p>
      
      <p class="print-only">Die Antwort lautet ${secrets('chal_78')}.</p>
      
      <style>
        .print-only {
          display: none;
        }
        @media print { 
          .print-only {
            display: block;
            font-size: 4em;
          }
        }
      </style>
    `,
    solution: secrets('chal_78'),
  },

  {
    id: 79,
    pos: { x: 755, y: 210 },
    title: 'Google-Fu',
    date: '2022-02-24',
    deps: [7, 77],
    html: `
      <p>In den weiten des Internets lassen sich so manche Informationen sammeln. Der Name für diese Fähigkeit: Google-Fu.</p>
      
      <p>Die Frage an dich lautet:  Wie viele Aufgaben hat Hack The Web insgesamt zum jetzigen Zeitpunkt?</p>
      
      <p>Hole dein ganzes Google-Fu heraus und zeige, was du drauf hast!</p>
    `,
    check: (answer, { App }) => {
      return {
        answer,
        correct: parseInt(answer) == App.challenges.data.length,
      }
    },
  },

  {
    id: 80,
    pos: { x: 1105, y: 535 },
    title: 'Stylesheet',
    date: '2022-02-24',
    deps: [28],
    html: `
      <p>ARRRRG! Irgendeine <a href="/chals/chal80_trash.jpg" target="_blank">trashy</a> Person hat die Farben der Regenbogen-Flagge durcheinander gebracht! Es liegt nun an dir, die Farben wieder in die richtige Reihenfolge zu bringen:</p>
      
      <textarea style="width:400px;height:425px;font-family:monospace;margin-bottom:12px" id="css-input" oninput="update()">#bar1 {
  background-color: green;
}
#bar2 {
  background-color: purple;
}
#bar3 {
  background-color: red;
}
#bar4 {
  background-color: yellow;
}
#bar5 {
  background-color: blue;
}
#bar6 {
  background-color: orange;
}</textarea>
      
      <div style="width:389px;border:1px solid black">
        <div style="height:40px" id="bar1"></div>
        <div style="height:40px" id="bar2"></div>
        <div style="height:40px" id="bar3"></div>
        <div style="height:40px" id="bar4"></div>
        <div style="height:40px" id="bar5"></div>
        <div style="height:40px" id="bar6"></div>
      </div>
      
      <style id="injector"></style>
      
      <div id="result" style="margin-top:10px"></div>
      
      <script src="/chals/chal80_2.js"></script>
    `,
    solution: secrets('chal_80'),
  },

  {
    id: 81,
    pos: { x: 785, y: 615 },
    title: 'Formulare',
    date: '2022-12-28',
    deps: [30, 35, 60],
    html: `
      <p>Unintuitive Formulare sind ein Schrecken für jeden Internetbenutzer. Zum Beispiel findest du die Antwort zu dieser Aufgabe in diesem viel zu kleinen Textfeld:</p>
      
      <p><input size="5" value="-> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> Die Antwort lautet ${secrets(
        'chal_81'
      )}"/>
      </p>
      
      <p>Wir kommen zum witzigen Teil. Nur eines der Eingabefelder funktioniert:</p>
      
      ${(() => {
        let output = ''
        for (let i = 0; i < 25; i++) {
          output += `
            <form autocomplete="off" method="post" id="challenge_form"${
              i != 18 ? ' action="/falsches_Eingabefeld"' : ''
            }>
              <input id="challenge_answer" type="text" name="answer" style="height:32px">
              <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
            </form>
          `
        }
        return output
      })()}
    `,
    hidesubmit: true,
    solution: secrets('chal_81'),
  },

  {
    id: 82,
    pos: { x: 1155, y: 1155 },
    title: 'Wegweiser',
    date: '2022-12-28',
    deps: [75, 76],
    html: `
      <p>Im Internet existiert mit dem DNS ein großes Wegweiser-System, welches dafür sorgt, dass zum Beispiel dein Browser über die Eingabe <code>hack.arrrg.de</code> meinen Server findet.</p>
      
      <p>Diese Wegweiser enthalten nicht nur passende IP-Adressen, sondern man kann dort auch beliebigen Text hinterlegen.
      </p>
      
      <p>Im TXT-Record dieser Domain findest du die Antwort.
      </p>
    `,
    solution: secrets('chal_82'),
  },

  {
    id: 83,
    pos: { x: 1310, y: 1205 },
    title: 'Freiheit',
    date: '2022-12-28',
    deps: [76],
    html: `
      <p>Die Karte von Hack The Web gibt dir die Freiheit, deinen eigenen Weg zu gehen. Und diese Freiheit wird hier auch gerne genutzt. Dadurch entstehen sehr viele individuelle Spielstände, die schön anzuschauen sind.</p>
      
      <p>Berechne bei dieser Aufgabe die genaue Anzahl der unterschiedlichen Spielstände. Beschränke dich dabei auf einen kleinen Ausschnitt von 11 Aufgaben im Anfangsbereich. Die aktuelle Karte kann von der Abbildung abweichen - nutze die hier gezeigte Version. Die Kanten des Graphs sind vom Start aus gerichtet. Wenn man "Taschenrechner" gelöst hat, wird "ROT13" freigeschaltet - aber nicht andersherum:
      </p>
      
      <p><img src="/chals/83_full2.png" ></p>
      
      <p>Beispiel 1 - noch keine Aufgabe gelöst:
      </p>
      
      <p><img src="/chals/83_empty.png"></p>
      
      <p>Beispiel 2 - zwei Aufgaben gelöst:
      </p>
      
      <p><img src="/chals/83_2.png"></p>
      
      <p>Beispiel 3 - vier Aufgaben gelöst. Es ist dabei unerheblich, in welcher Reihenfolge die Aufgaben gelöst werden. Solange sie zur gleichen Karte führen, zählen sie als einen Spielstand.
      </p>
      
      <p><img src="/chals/83_4.png"></p>
      
      <p>Die genaue Anzahl für diesen Anfangsbereich ist deine Antwort.
      </p>
    `,
    solution: secrets('chal_83'),
  },

  {
    id: 84,
    pos: { x: 395, y: 200 },
    title: 'Inception',
    date: '2023-02-26',
    deps: [4, 5],
    render: ({ App, req }) => {
      function renderFrame(w, h, level) {
        return `
          <iframe src="/challenge/84/?level=${level}" width="${w}" height="${h}" id="if" style="display:none"></iframe>
          
          <button onclick="run()" id="bt" style="margin-top:16px">Stufe ${level} betreten</button>
          
          <script>
            function run() {
              document.getElementById('if').style.display = 'block'
              document.getElementById('bt').style.display = 'none'
            }
          </script>
        `
      }

      if (!req.query.level) {
        return `
          <p>Hast du gestern gut geschlafen? Ich hoffe, dir sind im Traum keine seltsamen Personen begegnet... anyway, du siehst heute traumhaft gut aus :)</p>
        
          <img src="/chals/chal84_1.jpg" style="width:100%;margin-bottom:16px"></img>
        
          <p>Im Film Inception werden innerhalb von Träumen wieder Träume geschaffen. Was der Film macht, kann die Informatik auch. Ich kann dir innerhalb einer Webseite eine andere Webseite einbetten.
          </p>
          
          <p>Klicke auf den Button, um zur Stufe 1 zu gelangen.
          </p>
          
          ${renderFrame(1110, 700, 1)}
        `
      }

      const level = parseInt(req.query.level)

      if (level == 1) {
        return `
          <img src="/chals/chal84_2.jpg" style="width:100%;margin-bottom:16px"></img>
          
          <p>Eine Webseite innerhalb einer Webseite. Es geht noch mehr, gehe tiefer:</p>
          
          ${renderFrame(1000, 500, 2)}
        `
      }

      if (level == 2) {
        return `
           <img src="/chals/chal84_3.jpg" style="width:100%;margin-bottom:16px"></img>
          
          <p>Die Antwort findest du auf der untersten Stufe.</p>
          
          ${renderFrame(900, 400, 3)}
        `
      }

      if (level == 3) {
        return `
          <img src="/chals/chal84_5.jpg" style="width:100%;margin-bottom:16px;"></img>
          
          <p>Die Antwort lautet ${secrets('chal_84')}.</p>
        `
      }

      return ''
    },
    solution: secrets('chal_84'),
  },

  {
    id: 85,
    pos: { x: 1185, y: 1230 },
    title: 'Schneehase',
    date: '2023-02-26',
    deps: [76],
    html: `
      <p><img src="/chals/chal85.png"></p>
    `,
    solution: secrets('chal_85'),
  },
]
