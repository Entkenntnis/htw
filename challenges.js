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

function runBrainfuck(program) {
  /** Interpreter variables */
  // Create a new 30,000 size array, with each cell initialized with the value of 0. Memory can expand.
  const MAX_STEPS = 10000

  const MEMORY_SIZE = 100
  const memory = new Array(MEMORY_SIZE).fill(0)
  // Instruction pointer (Points to the current INSTRUCTION)
  let ipointer = 0
  // Memory pointer (Points to a cell in MEMORY)
  let mpointer = 0
  // Address stack. Used to track addresses (index) of left brackets
  let astack = []

  let input = ''
  let output = ''

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
        if (mpointer == MEMORY_SIZE - 1) {
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
        //Pointer is automatically incremented every iteration, therefore we must decrement to get the correct value
        ipointer = astack.pop() - 1
        break
      case undefined: // We have reached the end of the program
        end = true
        break
      default: // We ignore any character that are not part of regular Brainfuck syntax
        break
    }
    ipointer++
  }

  if (error) return error
  return output
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
    
      <p>Bei der Bearbeitung der Aufgaben sind ausdrücklich alle Hilfsmittel erlaubt. Du darfst im Internet suchen, einen Taschenrechner oder Chatbot verwenden, mit Stift und Papier Notizen machen... Fühl dich frei und nutze die Tools, die dir bei der Bearbeitung der Aufgaben am meisten helfen.
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
      <p>Du bist eine mutige Person! Du hast dich von den kryptischen Buchstaben im Titel dieser Aufgabe nicht abschrecken lassen.
      </p>
      
      <p>
        Viele Dinge in der Informatik sehen auf dem ersten Blick verwirrend sein. Vor allem, wenn man keine Übersetzungshilfe hat. Aber sobald man weiß,
        wo man Dinge nachschauen kann, werden diese weniger fremd.
      </p>
      
      <p>
        So ist es auch mit dem ASCII-Code. Weil Computer nur mit Zahlen arbeiten können, gibt es zu jedem Schriftzeichen einen einheitlichen Code. Einen Auszug davon
        findest du in dieser Tabelle.
      </p>
      
      <div class="container" style="margin-top:24px;margin-bottom:24px;">
        <div class="row">
          <div class="col">
            <table class="table table-bordered table-hover table-sm table-dark justify-content-between">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Zeichen</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>33</td><td>!</td></tr>
                <tr><td>34</td><td>"</td></tr>
                <tr><td>35</td><td>#</td></tr>
                <tr><td>36</td><td>$</td></tr>
                <tr><td>97</td><td>a</td></tr>
                <tr><td>98</td><td>b</td></tr>
                <tr><td>99</td><td>c</td></tr>
                <tr><td>100</td><td>d</td></tr>
                <tr><td>101</td><td>e</td></tr>
                <tr><td>102</td><td>f</td></tr>
              </tbody>
            </table>
          </div>
          <div class="col">
            <table class="table table-bordered table-hover table-sm table-dark justify-content-between">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Zeichen</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>103</td><td>g</td></tr>
                <tr><td>104</td><td>h</td></tr>
                <tr><td>105</td><td>i</td></tr>
                <tr><td>106</td><td>j</td></tr>
                <tr><td>107</td><td>k</td></tr>
                <tr><td>108</td><td>l</td></tr>
                <tr><td>109</td><td>m</td></tr>
                <tr><td>110</td><td>n</td></tr>
                <tr><td>111</td><td>o</td></tr>
                <tr><td>112</td><td>p</td></tr>
              </tbody>
            </table>
          </div>
          <div class="col">
            <table class="table table-bordered table-hover table-sm table-dark justify-content-between">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Zeichen</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>113</td><td>q</td></tr>
                <tr><td>114</td><td>r</td></tr>
                <tr><td>115</td><td>s</td></tr>
                <tr><td>116</td><td>t</td></tr>
                <tr><td>117</td><td>u</td></tr>
                <tr><td>118</td><td>v</td></tr>
                <tr><td>119</td><td>w</td></tr>
                <tr><td>120</td><td>x</td></tr>
                <tr><td>121</td><td>y</td></tr>
                <tr><td>122</td><td>z</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <p>Ein Beispiel: Das Dollar-Zeichen wird im Computer mit der Zahl 36 gespeichert. Voila, jetzt bist du dran. Deine Antwort in Codes lautet:
      </p>
      
      <p>35 &nbsp; 115 &nbsp; 116 &nbsp; 97 &nbsp; 98 &nbsp; 105 &nbsp; 108
      </p>
    `,
    check: (answer) => {
      const trimmed = answer.toLowerCase().replace(/ /g, '').trim()
      return {
        answer: trimmed,
        correct: trimmed == secrets('chal_4'),
      }
    },
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
      
      <p>Das ganze funktioniert auch digital. Unten findest du ein "präpariertes" Blatt Papier mit der Antwort:
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
      <p>Hallo, Kopfrechen-KünstlerIn! Du löst Aufgaben schneller, als ich sie in den Taschenrechner eingeben kann.
      </p>
      
      <p>Das glaubst du nicht? Hier ein Beispiel: Deine Antwort ist das Ergebnis von 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10.
      </p>
      
      <p>Warte kurz, ich hole schnell meinen Taschenrechner ...
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
      <p>Du bist nicht nur gut im Kopfrechnen, sondern auch zielgerichtet. Eine Aufgabe, die du anfängst, ziehst du durch.
      </p>
      
      <p>Deine Antwort ist das Ergebnis von 1 + 2 + 3 + ... + 98 + 99 + 100.
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
      <p>Kopfrechen-Genius, fokussiert - und dazu ein mathematisches Gespür. Damit löst du auch komplexe Probleme auf deine Art und Weise.
      </p>
      
      <p>Berechne diesmal das Ergebnis von 1 + 2 + 3 + ... + 998 + 999 + 1000.
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
    deps: [24, 110],
    html: `
      <p>Du hast eine verschlüsselte Nachricht erhalten! Sie sieht wie kompletter Nonsens aus. Dein Hacker-Blick ist gefragt! Du siehst wunderbar aus, wenn du scharf nachdenkst.
      </p>
      
      <p>Ziehe den Slider, um die Buchstabe im Alphabet zu verschieben.</p>
      
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
    title: 'Fingerzeig',
    date: '2017-08-25',
    deps: [55, 111],
    html: `
      <p>
        Es ist super cool, hilfsbereite Menschen wie dich zu haben. Das macht den Alltag so viel angenehmer, wenn man mal den Weg nicht weiß oder an der Kasse seinen Geldbeutel vergessen hat :)
      </p>
      
      <p>Gleichzeitig ist es auch kein Problem, um Hilfe zu bitten. Wir alle kommen irgendwann mal nicht weiter.
      </p>
          
      <p>
        <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" width="300px"></a>
      </p>
      
      <p>Auf dem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> von Hack The Web hast du die Möglichkeit, Hinweise zu finden oder selbst Fragen zu stellen. Klicke auf das Logo, um dem Server beizutreten. Im Forum findest du einen Post mit dem Titel dieser Aufgabe. Dort findest du deine Antwort.
      </p>
    `,
    solution: secrets('chal_21'),
  },

  /*{
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
  },*/

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
    deps: [40, 41, 42],
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
      <p>Du siehst aus wie jemand, der sich für Backstories interessiert! Die Entstehungsgeschichte von Hack The Web hat ein paar spannende Aspekte und hier gibt es eine kleine Geschichtsstunde nur für dich.
      </p>
      
      <p>Das Konzept von Aufgaben (<em>Challenges</em>), die in einer Karte angeordnet sind, hat Hack The Web von <a href="https://hacker.org/" target="_blank">Hacker.org</a> übernommen. Diese Seite ist eine großartige Inspiration, aber auch sie ist nicht vom Himmel gefallen. Als die Challenges im Jahr 2008 veröffentlich wurden, fand sich auf der Domain schon viele Jahre ein Projekt, dass als Hacker-Community beschrieben werden könnte.
      </p>
      
      <p>Dank des Internet Archives können wir in der Zeit zurückreisen und du kannst erleben, wie sich diese Community verstanden hat.
      </p>
      
      <p>Hier siehst du eine Version von hacker.org vom <a href="https://web.archive.org/web/19961218220409/http://hacker.org/" target="_blank">18. Dezember 1996</a>.
      </p>
      
      <iframe src="https://web.archive.org/web/19961218220409/http://hacker.org/" style="width:100%;height:800px;"></iframe>
      
      <p>Deine Antwort ist die E-Mail-Adresse des Betreibers.
      </p>
    `,
    solution: secrets('chal_26'),
  },

  {
    id: 27,
    pos: { x: 155, y: 745 },
    title: 'Fingerspitzengefühl',
    date: '2017-08-26',
    deps: [29, 66],
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
    deps: [70],
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
    pos: { x: 430, y: 450 },
    title: 'Taschenrechner III',
    date: '2017-08-26',
    deps: [111],
    html: `
      <p>Es wird Zeit für einen neuen Taschenrechner:
      </p>
      
      <br>
      
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <br>
      
      <p>Dieser Taschenrechner besteht aus einer "Röhre", die rechts offen ist. Mit den Zahlentasten kannst du einzelne Zahlen in diese Röhre schieben.
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
    pos: { x: 550, y: 500 },
    title: 'Taschenrechner IV',
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
    pos: { x: 675, y: 525 },
    title: 'Taschenrechner V',
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

  /*{
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
  },*/

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
        const controller = new AbortController()
        const timeout = setTimeout(() => {
          controller.abort()
        }, 4000)
        try {
          const res = await fetch(answer, {
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
          if (error.message && error.message.includes('aborted')) {
            value = 'Keine Antwort nach 4 Sekunden'
          } else {
            value = error.message
          }
        } finally {
          clearTimeout(timeout)
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
    title: 'Emoji',
    date: '2020-05-20',
    deps: [79],
    html: `
      <p>Nichts auf der Welt ist so schön wie dein Lächeln. Ich könnte es den ganzen Tag anschauen.
      </p>
      
      <p>Schicke mir ein Lächeln. Deine Antwort ist dieser Emoji:
      </p>
      
      <p><img src="/chals/chal37.png" width="80px"/></p>
    `,
    check: (answer) => {
      const withoutWhitespace = answer.replace(/\s+/g, '')
      const encoded = encodeURIComponent(withoutWhitespace)
      const correct = [
        '%F0%9F%98%80',
        '%F0%9F%98%83',
        '%F0%9F%98%84',
        '%F0%9F%99%82',
        '%F0%9F%98%8A',
      ]
      return {
        answer,
        correct: correct.includes(encoded),
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
    pos: { x: 845, y: 725 },
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
      
      <p>Leider gibt es zu dieser Aufgabe kein Eingabefeld. Aber das sollte dich nicht abhalten, der Webseite die Antwort zu schicken!
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
      <p>Der Klügere gibt nach - und du hast kein Problem nachzugeben, wenn es definitiv nicht weitergeht.
      </p>
      
      <p>Dieser Ladebalken dauert sehr lange. Wirst du ihn bist zum Ende abwarten - oder eine andere Lösung finden?
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
    solution: secrets('chal_44'),
  },

  {
    id: 45,
    pos: { x: 415, y: 1005 },
    title: 'Schriftzeichen',
    date: '2020-05-20',
    deps: [50, 78],
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
      <p>Geheime Spuren zu finden ist für dich kein Problem, denn du hast einen scharfen Blick.
      </p>
      
      <p>Wenn du eine Webseite öffnest, passieren hinter den Kulissen viele Dinge, selbst beim Aufruf einer <a href="/chal/chal46">leeren Seite</a>. Doch im Hintergrund wurde bereits die Antwort übertragen.
      </p>
      
      <p>Die Netzwerkanalyse (meist F12) hilft dir, alle Daten im Hintergrund anzuzeigen. Finde darin deine Antwort.
      </p>
      
      <p><img src="/chals/chal46.png" style="max-width:100%" /></p>
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
      <p>Ich könnte nicht wie du geduldig sitzen und warten, bis die Antwort lädt ... ich bin immer ungeduldig und drücke auf der Tastatur herum.
      </p>
      
      <p>Aber kann es sein, dass der Ladebalken dadurch tatsächlich schneller wird?
      </p>
      
      <p>Die Antwort erhälst du, sobald der Ladebalken voll ist.
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
        let steps = 1000
        let x = 3
        
        function transform(x) {
          return (x * 11) % 10000
        }
        
        function work(noTimeout) {
          if (step >= steps) {
            bar.style.width = '100%'
          } else {
            step++
            bar.style.width = ((step/steps) * 98.9 + 1) + '%'
            x = transform(x)
            value.innerHTML = x.toString()
            status.innerHTML = '(' + step + '/' + steps + ')'
            if (!noTimeout) {
              setTimeout(work, 1000)
            }
          }
        }
        
        window.onkeydown = () => {
          work(true)
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
      <p>Zur Ruhe kommen und in sich hineinhören - das brauche ich immer wieder, um mich mit mir selbst zu verbinden und so ausgeglichen sein zu können wie du.
      </p>
      
      <p>Manche Menschen finden es hilfreich, dabei eine akustische Untermalung zu haben.
      </p>
      
      <audio src="/chals/chal48_2.mp3" controls></audio>
      
      <p>Doch du bist nicht alleine. Deine Antwort findet sich zwischen dem Zwischern der Vögel.
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
    title: 'Binär',
    date: '2020-08-01',
    deps: [24],
    html: `
      <p>Du hast sicherlich schon vom Binärsystem gehört. Es ist die Sprache der Computer, welche aus 1 und 0 besteht.
      </p>
      
      <p>Selbst wenn du noch nie damit gearbeitet hast - mit ein wenig logischem Denken findest du schnell den Einstieg.
      </p>
      
      <p>Als Hilfestellung siehst du hier die ersten 6 Zweierpotenzen. Du kannst sie an- oder ausschalten, wenn du sie anklickst. Alle aktiven Zahlen werden zum Ergebnis addiert.
      </p>
      
      <p>Stelle die Zahl 7 ein und schicke sie ab.
      </p>
      
      <p><svg id="binary"></svg></p>
      
      <p class="d-none"><code>Binärzahl: <span id="output">0</span></code></p>
      
      <p style="margin-top:32px;" id="submit"><button onclick="submit()">Abschicken</button></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal51_2.js"></script>
      
      <style>
        .hoverEffect:hover {
          cursor:pointer;
          opacity: 0.9;
        }
      </style>
    `,
    solution: secrets('chal_51'),
    hidesubmit: true,
  },

  {
    id: 52,
    pos: { x: 250, y: 530 },
    title: 'Binär II',
    date: '2020-08-01',
    deps: [51],
    html: `
      <p>Das hast du sehr gut gemacht! Stelle nun die Zahl 45 ein.
      </p>
      
      <p><svg id="binary"></svg></p>
      
      <p class="d-none"><code>Binärzahl: <span id="output">0</span></code></p>
      
      <p style="margin-top:32px;" id="submit"><button onclick="submit()">Abschicken</button></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal51_2.js"></script>
      
      <style>
        .hoverEffect:hover {
          cursor:pointer;
          opacity: 0.9;
        }
      </style>
    `,
    solution: secrets('chal_52'),
    hidesubmit: true,
  },

  {
    id: 53,
    pos: { x: 265, y: 725 },
    title: 'Quiz',
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
      <p>Schön, dass du hier bist und neue Dinge ausprobierst. Das ist immer ziemlich aufregend.
      </p>
      
      <p>Eine solche aufregende Sache ist das Programmieren. Ganz vereinfacht funktioniert Programmieren so: Man schreibt einen Text und der Computer reagiert dann darauf. In dieses Textfeld kannst du Programme einfügen und starten. Ein Beispiel ist bereits eingegeben.
      </p>
      
      <p><code><textarea rows="10" cols="50" id="code-area">alert('Hallo, Welt!')</textarea></code></p>
      
      <p><button class="btn btn-primary btn-sm" onClick="runCode()">Programm starten</button></p>
      
      <script>
        function runCode() {
          const el = document.getElementById('code-area')
          const code = el.value
          try {
            eval(code)
          } catch (e) {
            alert(e)
          }
        }
      </script>
      
      <p>Wenn du folgendes Programm in Form eines Smileys in das Textfeld oben einfügst und ausführst, wird dir die Antwort angezeigt.
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
                 window.alert(e)</code></pre>
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
        const controller = new AbortController()
        const timeout = setTimeout(() => {
          controller.abort()
        }, 4000)
        try {
          const res = await fetch(answer, {
            size: 1024 * 1024,
            redirect: 'manual',
            signal: controller.signal,
          })
          value = await res.text()
          value = value.trim()
          if (!value) value = '[Leere Seite (Status ' + res.status + ')]'
          if (value.includes(req.user.name)) containsUsername = true
          if (value.length > 1000) {
            value = value.substring(0, 1000) + '...'
          }
        } catch (error) {
          if (error.message && error.message.includes('aborted')) {
            value = 'Keine Antwort nach 4 Sekunden'
          } else {
            value = error.message
          }
        } finally {
          clearTimeout(timeout)
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
    title: 'Elemente',
    date: '2020-08-17',
    deps: [52, 69],
    html: `
      <p>Für dich gibt es keine Grenzen, mit welchen Mitteln man einen Geheimtext schreibt. Du kommst mit allen Methoden klar - auch wenn es ein ganz eigener Code ist.
      </p>
      
      <p>Die Anfangsbuchstaben folgender Elemente aus Teyvat ergeben deine Antwort.
      </p>
      
      <p><img src="/chals/chal58_2.png"></p>
      
      <p><small><a href="https://genshin-impact.fandom.com/wiki/Element" target="_blank">Hinweis</a></small></p>
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
      <p>Schon als Kind hat es super viel Spaß gemacht, einen Geheimtext Stück für Stück zu entschlüsseln. Hier kannst das auf interaktive Art nacherleben.
      </p>
      
      <p>Anleitung: Drücke zwei Buchstaben <strong>gleichzeitig</strong> auf der Tastatur, diese werden hervorgehoben und vertauscht.
      </p>
    
      <pre id="output" style="font-size:16px;white-space:pre-wrap;margin-top:48px">
      </pre>
      
      <div id="debug" style="text-align:right"></div>
      
      <script src="/chals/chal59.js"></script>
      
      <div style="height:40px"></div>
      
      <p>Die Antwort ist der Name der Person, die den ersten Satz sagt.
      </p>
    `,
    solution: secrets('chal_59'),
  },

  {
    id: 60,
    pos: { x: 450, y: 600 },
    title: 'Scan Mich',
    date: '2020-08-17',
    deps: [31, 69],
    html: `
      <p><img src="/chals/chal60.png" width=400 height=400></p>
    `,
    solution: secrets('chal_60'),
  },

  /*{
    id: 61,
    pos: { x: 1045, y: 660 },
    title: 'Bunte Blöcke',
    date: '2020-08-17',
    deps: [81],
    html: `
      <p><img src="/chals/chal61.png" width=550></p>
    `,
    solution: secrets('chal_61'),
  },*/

  {
    id: 62,
    pos: { x: 1130, y: 300 },
    title: 'Datei',
    date: '2020-08-17',
    deps: [37, 47],
    html: `
      <p>Ich möchte dir sagen: Du bist wunderbar <3.
      </p>
      
      <p>Mit diesem Prompt habe ich ein Bild generiert, um die Nachricht anschaulicher zu gestalten. Hier kannst du es herunterladen:
      </p>
      
      <p><img src="/chals/chal62_placeholder.png" width="200px" style="background:white"/></p>
      
      <p>Dateiname: <strong id="filename">bild.txt</strong> [<a href="#" onclick="changeName()">ändern</a>]<br><button onclick="download()" style="margin-top:12px;margin-bottom:16px;">Herunterladen</button>
      </p>
    
      <p>Irgendwas stimmt aber nicht mit der Datei-Endung, das musst du vor dem Herunterladen reparieren. Auf dem Bild findest du die Antwort.
      </p>
      
      
      <script>
        const filename = document.getElementById('filename')
        
        function download() {
          fetch('/chals/chal62.data')
            .then(response => response.blob())
            .then(blob => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = filename.innerHTML;
              link.click();
          })
        }
        
        function changeName() {
          const newName = prompt('Neuer Dateiname:', filename.innerHTML)
          filename.innerHTML = newName
        }
      </script>
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
    deps: [25, 86, 87],
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
    deps: [87],
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
    pos: { x: 330, y: 480 },
    title: 'Schattenbilder',
    date: '2021-03-19',
    deps: [18],
    html: `
      <p>Ich könnte nicht so präzise mit der Maus umgehen, denn du hast ein super Feingefühl! Die 6 Bilder lassen sich mit der Maus verschieben. Übereinander gelegt ergeben sie die Antwort.
      </p>
      
      <div style="display:flex;flex-wrap:wrap;">
      <p><img src="/chals/chal69_1.png" width="400" style="border: 1px solid black" class="draggable"></p>
      <p><img src="/chals/chal69_2.png" width="400" style="border: 1px solid black" class="draggable"></p>
      <p><img src="/chals/chal69_3.png" width="400" style="border: 1px solid black" class="draggable"></p>
      <p><img src="/chals/chal69_4.png" width="400" style="border: 1px solid black" class="draggable"></p>
      <p><img src="/chals/chal69_5.png" width="400" style="border: 1px solid black" class="draggable"></p>
      <p><img src="/chals/chal69_6.png" width="400" style="border: 1px solid black" class="draggable"></p>
      </div>
      
      <script src="/jquery-3.6.0.js"></script>
      <script src="/jquery-ui.js"></script>
      
      <style>
        .draggable {
          margin: 12px;
        }
      </style>
      
      <script>
          $( function() {
            $( ".draggable" ).draggable()
          } )
      </script>
    `,
    solution: secrets('chal_69'),
  },

  {
    id: 70,
    pos: { x: 160, y: 485 },
    title: 'Karol',
    date: '2021-03-19',
    deps: [51, 68],
    html: `
      <p>Wenn wir heute in einem LEGO-Wettbewerb gegeneinander antreten würde, dann hätte ich gegen dich keine Chance. Irgendwie war ich kreativer, als ich noch jung war.
      </p>
      
      <p>Zum Glück braucht Programmieren nicht so viel Kreativität, sondern man kann sich mehr auf das Problemlösen konzentrieren. Robot Karol versucht, einen Mittelweg zu finden und an die LEGO-Welt anzuschließen. Hier findest du eine <a href="https://karol.arrrg.de/?id=IaepMRwFW" target="_blank">Online-Version</a> von Robot Karol.
      </p>
      
      <iframe style="width:100%;height:700px;margin-bottom:16px;background-color:white;" src="https://karol.arrrg.de/?id=IaepMRwFW">
      </iframe>
      
      <p>Baue folgenden Code mit Karol und führe das Programm aus.
      </p>
      
      <p><img src="/chals/chal70_2.png"></p>
      
      <p>Die Antwort ist die Anzahl der gelben Marken, die am Ende liegen.</p>
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
    pos: { x: 255, y: 885 },
    title: 'Papier',
    date: '2022-02-09',
    deps: [27],
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
        correct:
          parseInt(answer) ==
            App.challenges.data.filter((data) => !data.noScore).length ||
          parseInt(answer) == App.challenges.data.length,
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
    deps: [30, 33, 60],
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
    pos: { x: 1300, y: 1215 },
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
      
      <p>Beispiel 3 - vier Aufgaben gelöst. Es ist dabei unerheblich, in welcher Reihenfolge die Aufgaben gelöst werden. Solange sie zur gleichen Karte führen, zählen sie als ein Spielstand.
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
            
            run()
          </script>
        `
      }

      if (!req.query.level) {
        return `
          <p>Hast du gestern gut geschlafen? Ich hoffe, dir sind im Traum keine seltsamen Personen begegnet. Anyway, du siehst heute traumhaft gut aus, besser noch als diese Schauspieler hier:</p>
        
          <img src="/chals/chal84_1.jpg" style="width:100%;margin-bottom:16px"></img>
        
          <p>Im Film Inception werden innerhalb von Träumen wieder Träume geschaffen. Was der Film macht, kann die Informatik auch. Man kann innerhalb einer Webseite eine andere Webseite einbetten.
          </p>
          
          <p>Scrolle dich durch alle Seiten, bis du auf der untersten Ebene angekommen bist. Dort findest du die Antwort.
          </p>
          
          ${renderFrame(1110, 700, 1)}
        `
      }

      const level = parseInt(req.query.level)

      if (level == 1) {
        return `
          <img src="/chals/chal84_2.jpg" style="width:100%;margin-bottom:16px"></img>
          
          <p>Eine Webseite innerhalb einer Webseite. Es geht noch mehr, gehe tiefer:</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
          
          ${renderFrame(1000, 500, 2)}
        `
      }

      if (level == 2) {
        return `
           <img src="/chals/chal84_3.jpg" style="width:100%;margin-bottom:16px"></img>
          
          <p>Die Antwort findest du auf der untersten Stufe.</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
          
          ${renderFrame(900, 400, 3)}
        `
      }

      if (level == 3) {
        return `
          <img src="/chals/chal84_5.jpg" style="width:100%;margin-bottom:16px;"></img>
          
          <p>Die Antwort lautet ${secrets('chal_84')}.</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
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

  {
    id: 86,
    pos: { x: 965, y: 766 },
    title: 'Fragil',
    date: '2023-04-02',
    deps: [81],
    html: `
      <p>Diese Seite ist leicht zerbrechlich. Probiere es aus: Du kannst alle Inhalte verändern.</p>
      
      <p>Ein kleiner Auftrag: Ändere den Slogan zu "Schau, was ich alles kann!"
      </p>
      
      <p id="output">&nbsp;</p>
      
      <script>
        document.documentElement.contentEditable = true
          document.body.spellcheck = false
        setTimeout(() => {
          document.getElementById('challenge_form').contentEditable = false
          check()
        }, 100)
        
        function check() {
          const lead = document.querySelector('p[class="lead"]')
          if (lead) {
            if (lead.textContent.trim().toLowerCase() == 'schau, was ich alles kann!') {
              document.getElementById('output').innerHTML = 'Die Antwort lautet ' + atob('${Buffer.from(
                secrets('chal_86')
              ).toString('base64')}') + '.'
              return // don't run check anymore
            }
          }
          setTimeout(check, 500)
        }
      </script>
    `,
    solution: secrets('chal_86'),
  },

  {
    id: 87,
    pos: { x: 1045, y: 660 },
    title: 'Scratch',
    date: '2023-04-02',
    deps: [81],
    html: `
      <p>Du hast eine wunderbar entspannte Aura! Das hat mich inspiriert, dieses kleine entspannte Spiel zu entwickeln.
      </p>
      
      <p>Steuere mit den <code>Pfeiltasten</code>.
      </p>
      
      <iframe src="https://scratch.mit.edu/projects/829930955/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>
      
      <p style="margin-top:12px">Dir ist das zu langsam? Schaue in das Projekt hinein: <a href="https://scratch.mit.edu/projects/829930955/editor/" target="_blank">https://scratch.mit.edu/projects/829930955/editor/</a>
      </p>
    `,
    solution: secrets('chal_87'),
  },

  {
    id: 88,
    pos: { x: 1066, y: 1269 },
    title: 'Summe',
    date: '2023-04-05',
    deps: [82, 85],
    html: `
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
    solution: secrets('chal_88'),
  },

  {
    id: 89,
    pos: { x: 933, y: 1233 },
    title: 'Lesezeichen',
    date: '2023-04-08',
    deps: [82],
    render: () => {
      function generateSection(title, id, letter, next, isBroken) {
        return `
          <div style="margin-top:${Math.round(
            Math.random() * 700 + 700
          )}px;margin-bottom:${Math.round(Math.random() * 700 + 700)}px">
            <h1 id="${id}">${title}</h1>
            <p>${letter}. ${
          isBroken
            ? `&lt;a href="#${next}"&gt;weiter&lt;/a&gt;`
            : `<a href="#${next}">weiter</a>`
        }</p>
          </div>
        `
      }

      return `
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
    },
    solution: secrets('chal_89'),
  },

  {
    id: 90,
    pos: { x: 1415, y: 1310 },
    title: 'Orakel',
    date: '2023-04-12',
    deps: [73, 74, 76],
    html: `
      <p>Ich spüre bei dir so viel Energie! Ich bewundere Menschen, die eine solche Ausstrahlung haben.
      </p>
      
      <p>Mein Orakel, das ich für diese Aufgabe beauftragt habe, strahlt leider nicht vor Energie. Täglich gibt es nur einen Zeitraum von 15 Minuten, in denen das Orakel zu sprechen ist.
      </p>
      
      <p>Sprich mit <a href="/chal/orakel">dem Orakel</a>, um die Antwort zu erfahren.
      </p>
    `,
    solution: secrets('chal_90'),
  },

  {
    id: 91,
    pos: { x: 1115, y: 1330 },
    title: 'Kekse',
    date: '2023-04-15',
    deps: [82, 85],
    html: `
      <p>Es gibt Kekse, frisch aus dem Backofen - nur für dich persönlich gebacken, my dear friend! Sie sind gleich fertig:
      </p>
      
      <p id="countdown"></p>
      
      <div id="backdrop" style="display:none;position:fixed;background-color:rgba(255, 255, 255, 0.5);top:0px;left:0px;right:0px;bottom:0px">
      </div>
      
      <div id="modal" style="display:none;position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background-color:#fff; border-radius:5px; padding:20px; box-shadow:0px 0px 10px rgba(0,0,0,0.5); z-index:9999; color:black; width: 500px;">
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
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("GET", '/chal/chal91', true); // true for asynchronous 
          xmlHttp.send(null);
          document.getElementById('modal').style.display = 'none'
          document.getElementById('backdrop').style.display = 'none'
        }
      </script>
    `,
    solution: secrets('chal_91'),
  },

  {
    id: 92,
    pos: { x: 1225, y: 1410 },
    title: 'Grundgesetz',
    date: '2023-04-19',
    deps: [83, 85, 90],
    html: `
      <p>Erst wenn ich mich sicher fühle, kann ich meine spielerische Seite zum Vorschein bringen. Oft werde ich dafür nur schräg angeschaut. Bei dir muss ich mir keine Sorgen machen. Hier fühle ich mich sicher.
      </p>
      
      <p>Sicherheit soll auch das Grundgesetz geben. Hier siehst du die ersten acht Artikel. Doch worum geht es darin eigentlich? Es gibt ein Wort, das in diesem Text genau 10 Mal vorkommt. Dieses Wort ist deine Antwort.
      </p>
      
      <div class="m-4"></div>
      
      <pre style="height:500px; overflow:auto; white-space: pre-wrap; border:1px gray solid; padding: 8px">
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
    solution: secrets('chal_92'),
  },

  {
    id: 93,
    pos: { x: 1155, y: 1570 },
    title: 'Cipher',
    date: '2023-04-22',
    deps: [91, 92],
    html: `
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
    solution: secrets('chal_93'),
  },

  {
    id: 94,
    pos: { x: 885, y: 1410 },
    title: 'Original',
    date: '2023-04-26',
    deps: [88, 89, 91],
    html: `
      <p>Du bist ein Original und kein Fake. Lasse dich nicht in eine andere Identität drängen, als du bist.
      </p>
      
      <p>Dieses Bild ist kein Original - zumindest nicht von mir. Es findet sich auf hunderten Webseiten. Doch wo kommt das Original her?
      </p>
      
      <p><img src="/chals/chal94.jpg" width="400px" /></p>
      
      <p>Deine Antwort ist der Vorname der ursprünglichen Fotografin.
      </p>
    `,
    solution: secrets('chal_94'),
  },

  {
    id: 95,
    pos: { x: 1059, y: 1530 },
    title: 'Handschrift',
    date: '2023-04-29',
    deps: [91, 92],
    html: `
      <p>Hilfe! Ich brauche deinen technischen Rat. Wie macht man es nochmal, dass man eine Schriftart im Browser einbindet?</p>
      
      <p>&lt;span style=&quot;font:Hack The Web&quot;&gt;ABC DEFGHIJ KLMNOP QRSTUVWXYZ.&lt;/span&gt;</p>
      
      <p>&lt;font src=&quot;/chals/HackTheWeb-Regular.otf&quot; /&gt;</p>
    `,
    solution: secrets('chal_95'),
  },

  {
    id: 96,
    pos: { x: 980, y: 1460 },
    title: 'TikTok',
    date: '2023-05-03',
    deps: [88, 89],
    html: `
      <p>Hast du heute etwas geschafft, worauf du stolz bist? Herzlichen Glückwunsch. Und wenn nicht, halb so wild. Morgen ist auch noch ein Tag.
      </p>
      
      <p>Jetzt ist erstmal Zeit, sich ein wenig zu entspannen und sich unterhalten zu lassen, zum Beispiel mit Videos von <code>@kallmekris</code> auf TikTok.
      </p>
      
      <p>Du möchtest eine Herausforderung? Ok, hier deine Aufgabe: Scrolle runter bis zum ersten Video. Wie lautet die Beschreibung*?
      </p>
      
      <p><small>* 4 Wörter, keine Hashtags</small></p>
    `,
    solution: secrets('chal_96'),
  },

  {
    id: 97,
    pos: { x: 1194, y: 1650 },
    title: 'Cipher II',
    date: '2023-05-06',
    deps: [93],
    html: `
      <p>Deine scharfer Blick und deine Erfahrung als Hacker*in lassen sich nicht täuschen: Viel Sicherheit bringt der Cipher aus der letzten Aufgaben nicht.
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
    solution: secrets('chal_97'),
  },

  {
    id: 98,
    pos: { x: 680, y: 1460 },
    title: 'SQL Tutorial',
    date: '2023-05-10',
    deps: [94, 96],
    html: `
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
    solution: secrets('chal_98'),
  },

  {
    id: 99,
    pos: { x: 790, y: 1540 },
    title: 'Regeln',
    date: '2023-05-13',
    deps: [94, 95],
    html: `
      <p>Ich spüre, dass heute was anders ist: Hast du eine neue Frisur oder einen neuen Pulli? Etwas ist heute anders und das gefällt mir!
      </p>
      
      <p>Schön, dass du so regelmäßig hier vorbei schaust. Tja, Regeln: Sie helfen uns, unser Miteinander besser zu gestalten. Viele Regeln sind wahrscheinlich nicht so sinnvoll, aber es gibt schon einige, die wertvoll sind.
      </p>
      
      <p>Auf unserem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> haben wir nur zwei Regeln. Wie lautet die zweite Regel?
      </p>
    `,
    solution: secrets('chal_99'),
  },

  {
    id: 110,
    pos: { x: 300, y: 310 },
    title: 'Taschenrechner',
    date: '2023-05-13',
    deps: [4],
    html: `
      <p>Schwierigkeiten halten dich nicht von deinen Zielen ab. Im Gegenteil: Du nutzt deine Kreativität, um die Herausforderung zu lösen.
      </p>
      
      <p>Hier ist ein Taschenrechner aus einem Tutorial. Ich bin dem Tutorial gefolgt, muss aber irgendwo einen Fehler gemacht - man kann keine mehrstelligen Zahlen eingeben.
      </p>
      
      <p>Deine Kreativität ist nun gefragt. Berechne die Zahl <strong>256</strong> und schicke das Ergebnis ab.
      </p>
      
      <div class="calculator">
        <div class="calculator__display">0</div>

        <div class="calculator__keys">
          <button class="key--operator" data-action="add">+</button>
          <button class="key--operator" data-action="subtract">-</button>
          <button class="key--operator" data-action="multiply">&times;</button>
          <button class="key--operator" data-action="divide">÷</button>
          <button>7</button>
          <button>8</button>
          <button>9</button>
          <button>4</button>
          <button>5</button>
          <button>6</button>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>0</button>
          <button data-action="decimal">,</button>
          <button data-action="clear">AC</button>
          <button class="key--equal" data-action="calculate">=</button>
        </div>
      </div>
      
      <p style="margin-top:32px;" id="submit"><button>Ergebnis abschicken</button></p>
      
      <link rel="stylesheet" href="/chals/chal110.css">
      
      <script src="/chals/chal110.js"></script>
    `,
    solution: secrets('chal_110'),
    hidesubmit: true,
  },

  {
    id: 111,
    pos: { x: 380, y: 370 },
    title: 'Taschenrechner II',
    date: '2023-05-13',
    deps: [110],
    html: `
      <p>Berechne diesmal die Zahl <strong>10240</strong>.
      </p>
      
      <div class="calculator">
        <div class="calculator__display">0</div>

        <div class="calculator__keys">
          <button class="key--operator" data-action="add">+</button>
          <button class="key--operator" data-action="subtract">-</button>
          <button class="key--operator" data-action="multiply">&times;</button>
          <button class="key--operator" data-action="divide">÷</button>
          <button>7</button>
          <button>8</button>
          <button>9</button>
          <button>4</button>
          <button>5</button>
          <button>6</button>
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>0</button>
          <button data-action="decimal">,</button>
          <button data-action="clear">AC</button>
          <button class="key--equal" data-action="calculate">=</button>
        </div>
      </div>
      
      <p style="margin-top:32px;" id="submit"><button>Ergebnis abschicken</button></p>
      
      <link rel="stylesheet" href="/chals/chal110.css">
      
      <script src="/chals/chal110.js"></script>
    `,
    solution: secrets('chal_111'),
    hidesubmit: true,
  },

  {
    id: 100,
    pos: { x: 920, y: 1590 },
    title: 'Wii',
    date: '2023-05-17',
    deps: [93, 96],
    render: ({ req }) => `
      <p>Lust auf einen kleinen Spiele-Nachmittag mit Mario-Kart? Das wird sicher Spaß machen - auch für mich, selbst wenn ich ständig gegen dich verlieren werden.
      </p>
      
      <p>Mario-Kart hat viele Generationen hinter sich. Ich habe noch mit der Version auf der Nintendo Wii begonnen.
      </p>
      
      <p>Wenn man die Wii mit dem Internet verbindet, dann könnte man damit sogar Hack The Web spielen, denn sie enthält einen Browser. Rufe diese Seite auf der Wii auf (oder täusche das dem Server so vor), um die Antwort zu erhalten.
      </p>
      
      <p><code>${(() => {
        const userAgent = req.headers['user-agent'] || ''
        const isWii = /Nintendo Wii/i.test(userAgent)

        if (isWii) {
          return (
            'Auf gehts mit 150cc auf dem Regenbogen-Boulevard. Die Antwort lautet ' +
            secrets('chal_100') +
            '.'
          )
        } else {
          return 'Das ist keine Wii: ' + userAgent
        }
      })()}</code></p>
      
    `,
    solution: secrets('chal_100'),
  },

  {
    id: 101,
    pos: { x: 950, y: 1700 },
    title: 'Faktoren',
    date: '2023-05-20',
    deps: [93, 95],
    html: `
      <p>Ich weiß, dass Tools wie Wolfram Alpha viel besser geeignet wären für diese Aufgabe. Trotzdem wollte ich mal sehen wie ChatGPT auf diese Frage antwortet. Und das Ergebnis ist ... ernüchternd.
      
      <p><img src="/chals/chal101.png" /></p>
    
      <p>Der Chat geht so viele Zeilen weiter. Das kannst du 100-mal besser! Deine Antwort ist der größte Primfaktor von <code>864186418888888888802470247</code>.
      </p>
    `,
    solution: secrets('chal_101'),
  },

  {
    id: 102,
    pos: { x: 1294, y: 1700 },
    title: 'Cipher III',
    date: '2023-05-24',
    deps: [97],
    html: `
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
bytes = ascii_string_to_bytes(message)
encrypted_bytes = cipher_ii(bytes)
hex_string = convert_bytes_to_hex_string(encrypted_bytes)
print(hex_string)</pre></code>

      <p>Die Schlüssel sind Zahl zwischen 0 und 255. Die Ausgabe dieses Programms siehst so aus:
      </p>
      
      <p><code>59176f2b4e4f377f1a5f7427431631306d294b066e2749062d7f1d523d3c55187226010051056d27491a317901547f2dda2403027c335c5d3f7d1e1f73375e1a31710f486d6c236b05044e017e284c1f60610646386d03567d1c2925030f3a36101c2925030f</code>
      </p>
    `,
    solution: secrets('chal_102'),
  },

  {
    id: 103,
    pos: { x: 698, y: 1671 },
    title: 'Hintergrund',
    date: '2023-05-27',
    deps: [98, 99, 100, 101],
    html: `
      <p>Es gibt Menschen, die sind einfach immer da. Auf diese Menschen kann man sich verlassen.
      </p>
      
      <p>Das ist eine Eigenschaft, die du mit der Antwort auf diese Aufgabe gemeinsam hast: Die Antwort ist schon immer da gewesen. Du findest sie auf der Rückseite des Planetens dieser Aufgabe.
      </p>
    `,
    solution: secrets('chal_103'),
  },

  {
    id: 104,
    pos: { x: 560, y: 1777 },
    title: 'Übergang',
    date: '2023-05-31',
    deps: [103],
    html: `
      <p>Kann es sein, dass du heute etwas braungebrannter aussiehst, als noch bei unserem letzen Treffen? Ha, ich weiß es: du bist gerade von einer Reise zurückgekehrt.
      </p>
      
      <p>Manchmal bekommt man den Eindruck, dass sich ein Übergang an den anderen reiht: Ferien starten, Ferien enden, Schuljahr startet, Schuljahr endet ... und wir mittendrin.
      </p>
      
      <p>In der Informatik können Übergänge mit solchen Diagrammen dargestellt werden. Ein Pfad führt zum Ziel. Dieser zeigt dir die Antwort.
      </p>
      
      <p><img src="/chals/chal104.png" style="background:white;"></img></p>
    `,
    solution: secrets('chal_104'),
  },

  {
    id: 105,
    pos: { x: 560, y: 1710 },
    title: '1337',
    date: '2023-06-03',
    deps: [103],
    html: `
      <p>Was hast du mit dem Isartor in München gemeinsam? Ihr seid beide Elite:
      </p>
      
      <p><img src="/chals/chal105.jpg" />
      </p>
      
      <p>Und deshalb bestimmst du, was die Antwort ist! Jede Antwort ist akzeptiert, wenn sie genau 1337 Zeichen lang ist.
      </p>
    `,
    check: (answer) => {
      const trimmed = answer.trim()
      return {
        answer: trimmed,
        correct: trimmed.length === 1337,
      }
    },
  },

  {
    id: 106,
    pos: { x: 633, y: 1827 },
    title: 'Leet',
    date: '2023-06-07',
    deps: [103],
    html: `
      <p>Wenn du einen Raum betrittst, dann ist für alle klar, dass du was drauf hast. Du musst dich dafür nicht anstrengen.
      </p>
      
      <p>4nd3r3 M3n5ch3n w0ll3n 1hr Könn3n ab3r s1ch7b4r m4ch3n - und schr31b3n d4h3r ihr3 N4chr1ch73n in l337.
      </p>
      
      <p>35 9!|37 \\/3|25(|-|!3|)3|\\|3 57(_)|=3|\\| (_)|\\||) \\/4|2!4|\\|73|\\| \\/0|\\| |_337 - \\/0|\\| |_3!(|-|7 |_35|34|2 |3!5 7074|_ |<|2\`/|D7!5(|-|.
      </p>
      
      <p>|)3!|\\|3 4|\\|+\\|/0|2+ 14|_|+3+ |_|1+!|\\/|4+!\\/.
      </p>
      
      <p><small><a href="https://www.robertecker.com/hp/research/leet-converter.php?lang=de" target="_blank">Hinweis</a></small></p>
    `,
    solution: secrets('chal_106'),
  },

  {
    id: 107,
    pos: { x: 530, y: 1627 },
    title: 'Neuland',
    date: '2023-06-10',
    deps: [103],
    html: `
      <p>Ich sehe, du bist heute gut ausgerüstet und bereit für deine Expedition in unbekanntes Neuland. Ich bewundere deinen Mut.
      </p>
      
      <p>Hier sind deine Koordinaten: Zwischen <a href="http://arrrg.de:40000/" target="_blank">http://arrrg.de:40000/</a> und <a href="http://arrrg.de:41000/" target="_blank">http://arrrg.de:41000/</a> findest du einen geheimen Ort. 
      </p>
      
      <p>Viel Glück auf deiner Suche! Lasse dich nicht von Widrigkeiten des Ödlands abseits gängiger Protokolle abhalten. Sei hartnäckig und wir sehen uns bald wieder.
      </p>
    `,
    solution: secrets('chal_107'),
  },

  {
    id: 108,
    pos: { x: 800, y: 1790 },
    title: 'Sprache',
    date: '2023-06-14',
    deps: [103],
    render: ({ req }) => `
      <p>Dieser Inhalt ist nur für NutzerInnen verfügbar, die Französisch als ihre Sprache eingestellt haben.
      </p>
      
      <p><code>${(() => {
        const acceptLanguage = req.headers['accept-language'] || ''
        const isFrench = /fr-?/i.test(acceptLanguage)

        if (isFrench) {
          return 'La réponse est ' + secrets('chal_108') + '.'
        } else {
          return (
            'Deine Spracheinstellung wird nicht unterstützt: ' + acceptLanguage
          )
        }
      })()}</code></p>
      
    `,
    solution: secrets('chal_108'),
  },

  {
    id: 109,
    pos: { x: 721, y: 1800 },
    title: 'Brainfuck',
    date: '2023-06-17',
    deps: [103],
    html: `
      <p>Oh man, wie nervig sind Diskussionen darüber, welche Programmiersprache besser ist! Zum Glück bist du jemand, der es besser weiß: Alle Programmiersprachen sind im Kern gleich mächtig - eine Erkenntnis, die Turing wesentlich mitentwickelt hat.
      </p>
      
      <p>Jede Programmiersprache hat ihre besondere Schönheit. Die Schönheit von Brainfuck liegt in ihrer Einfachheit: Acht Zeichen sind genug, um alles zu programmieren, was man sich vorstellen kann - auch wenn es teilweise viel Geduld und Leidenschaft braucht, das auch umzusetzen.
      </p>
      
      <p>Schreibe ein Programm in Brainfuck, dass die Antwort <code>alan</code> ausgibt. Du hast 100 Speicherzellen und 10000 Rechenschritte zur Verfügung.
      </p>
    `,
    check: (answer) => {
      const output = runBrainfuck(answer)
      return {
        answer: output,
        correct: output == secrets('chal_109'),
      }
    },
  },

  {
    id: 300,
    pos: { x: 1750, y: 600 },
    title: 'Community-Bereich',
    date: '2023-07-28',
    deps: [57],
    noScore: true,
    render: async ({ App, req }) => {
      const communityChals = App.challenges.data.filter((chal) => chal.noScore)
      const ids = communityChals.map((chal) => chal.id)

      const sols = await App.db.models.Solution.findAll({
        where: { cid: ids },
        raw: true,
      })

      const users = sols.reduce((res, obj) => {
        const key = obj.UserId
        const entry = (res[key] = res[key] || { solved: 0, lastActive: -1 })
        entry.solved++
        const ts = App.moment(new Date(obj.createdAt).getTime()).valueOf()
        if (ts > entry.lastActive) {
          entry.lastActive = ts
        }
        return res
      }, {})

      const userIds = []

      const usersList = Object.entries(users).map((entry) => {
        userIds.push(entry[0])
        return {
          userId: entry[0],
          solved: entry[1].solved,
          lastActive: entry[1].lastActive,
        }
      })

      usersList.sort((a, b) => {
        if (a.solved == b.solved) {
          return a.lastActive - b.lastActive
        } else {
          return b.solved - a.solved
        }
      })

      const userNames = await App.db.models.User.findAll({
        where: { id: userIds },
        raw: true,
      })

      const userNameIndex = userNames.reduce((res, obj) => {
        res[obj.id] = obj.name
        return res
      }, {})

      let rank = 1

      for (let i = 0; i < usersList.length; i++) {
        if (i == 0) {
          usersList[i].rank = rank
        } else {
          if (usersList[i].solved != usersList[i - 1].solved) {
            rank = i + 1
          }
          usersList[i].rank = rank
        }
      }

      return `
        <p>Herzlich Willkommen im Community-Bereich! Wir sind mittlerweile viele Leute auf Hack The Web und haben auch einige kreative Köpfe hier mit guten Ideen für neue Aufgaben. Daher gibt es hier regelmäßig neue Inhalte - von Euch für Euch.
        </p>
        
        <p>Jeder darf mitmachen. Je mehr Ideen wir haben, umso bunter wird es. Die Aufgaben dürfen leicht sein oder sau schwer, witzig oder ernsthaft. Das ist dir überlassen. Falls du eine Idee hast, trete dem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> bei und schreibe mir eine Nachricht.
        </p>
        
        <!-- psst - hey - probiere mal /challenge/1337 -->
        
        <p>Startbereit? Die Antwort ist die Nummer dieser Aufgabe.
        </p>
        
        <form autocomplete="off" method="post" id="challenge_form">
          <input id="challenge_answer" type="text" name="answer" style="height:32px">
          <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
        </form>
        
        <h3 style="margin-top:96px;margin-bottom:24px;">Highscore für den Community-Bereich
        </h3>
        
        <table class="table table-hover">
          <thead>
            <tr>
              
                <th scope="col">Platz</th>
              
              <th scope="col">Benutzername</th>
              <th scope="col">gelöste Aufgaben</th>
              <th scope="col">zuletzt aktiv</th>
            </tr>
          </thead>
          <tbody>
            ${usersList
              .map(
                (entry) => `
              <tr>
                <td>${entry.rank}</td>
                <td>${userNameIndex[entry.userId]}</td>
                <td>${entry.solved}</td>
                <td>${App.moment(entry.lastActive).fromNow()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
    },
    solution: '300',
    hidesubmit: true,
  },

  {
    id: 301,
    pos: { x: 1780, y: 400 },
    title: 'Schnittstelle',
    date: '2023-07-28',
    author: 'cuzimbisonratte',
    deps: [300],
    noScore: true,
    html: `
      <p>Die Antwort findest du, wenn du die <strong>Löschung</strong> von &nbsp;<code>/chal/chal301</code>&nbsp; anforderst.
      </p>
    `,
    solution: secrets('chal_301'),
  },

  {
    id: 302,
    pos: { x: 1750, y: 290 },
    title: 'Schnittstelle II',
    date: '2023-07-28',
    author: 'cuzimbisonratte',
    deps: [301],
    noScore: true,
    render: ({ req }) => {
      const username = req.user.name
      const secretString = username + secrets('chal_302')
      const hash = crypto.createHash('md5').update(secretString).digest('hex')

      return `
        <p>Wie bei der vorherigen Aufgabe versuchst du etwas zu löschen. Lösche &nbsp;<code>/chal/chal302</code>&nbsp; und autorisiere dich dabei mit diesem Header:
        </p>
        
        <pre><code>Authorization: HTW ${encodeURIComponent(
          username + '⚻' + hash
        )}</code></pre>
      `
    },
    solution: secrets('chal_302'),
  },

  {
    id: 303,
    pos: { x: 1950, y: 500 },
    title: 'Rechensport',
    author: 'simonesien',
    date: '2023-07-28',
    deps: [300],
    noScore: true,
    render: ({ App, req }) => {
      function generateTask() {
        let num1 = 0
        let num2 = 0
        let op = ''
        let result = 0
        const r = Math.random()
        if (r < 0.33) {
          op = '+'
          num1 = Math.round(Math.random() * 9 + 1)
          num2 = Math.round(Math.random() * 9 + 1)
          result = num1 + num2
        } else if (r < 0.67) {
          op = '*'
          num1 = Math.floor(Math.random() * 8 + 2)
          num2 = Math.floor(Math.random() * 8 + 2)
          result = num1 * num2
        } else {
          op = '-'
          num1 = Math.floor(Math.random() * 9 + 11)
          num2 = Math.floor(Math.random() * 9 + 1)
          result = num1 - num2
        }
        return { task: `${num1} ${op} ${num2}`, result }
      }
      const data = []
      for (let i = 0; i < 15; i++) {
        data.push(generateTask())
      }

      req.session['chal303_ts'] = new Date().getTime()
      req.session['chal303_result'] = data.map((task) => task.result).join(';')

      return `
        <p>Wie ich dich kenne, bist du bestimmt super im Kopfrechnen. Hier ist eine Herausforderung für dich - du musst 15 Aufgaben in maximal 30 Sekunden lösen. Vielleicht fällt dir ja etwas ein, das dir dabei hilft ...
        </p>
        
        <form class="container" style="margin-top:32px;margin-bottom:24px;" method="post" autocomplete="off">
          <div class="row">
            <div class="col">
              <p><span id="task0" style="width:3.5rem;display:inline-block;">${data[0].task} =</span> <input autofocus name="ans0" id="ans0"/></p>
              <p><span id="task1" style="width:3.5rem;display:inline-block;">${data[1].task} =</span> <input name="ans1" id="ans1"/></p>
              <p><span id="task2" style="width:3.5rem;display:inline-block;">${data[2].task} =</span> <input name="ans2" id="ans2"/></p>
              <p><span id="task3" style="width:3.5rem;display:inline-block;">${data[3].task} =</span> <input name="ans3" id="ans3"/></p>
              <p><span id="task4" style="width:3.5rem;display:inline-block;">${data[4].task} =</span> <input name="ans4" id="ans4"/></p>
            </div>
            <div class="col">
              <p><span id="task5" style="width:3.5rem;display:inline-block;">${data[5].task} =</span> <input name="ans5" id="ans5"/></p>
              <p><span id="task6" style="width:3.5rem;display:inline-block;">${data[6].task} =</span> <input name="ans6" id="ans6"/></p>
              <p><span id="task7" style="width:3.5rem;display:inline-block;">${data[7].task} =</span> <input name="ans7" id="ans7"/></p>
              <p><span id="task8" style="width:3.5rem;display:inline-block;">${data[8].task} =</span> <input name="ans8" id="ans8"/></p>
              <p><span id="task9" style="width:3.5rem;display:inline-block;">${data[9].task} =</span> <input name="ans9" id="ans9"/></p>
            </div>
            <div class="col">
              <p><span id="task10" style="width:3.5rem;display:inline-block;">${data[10].task} =</span> <input name="ans10" id="ans10"/></p>
              <p><span id="task11" style="width:3.5rem;display:inline-block;">${data[11].task} =</span> <input name="ans11" id="ans11"/></p>
              <p><span id="task12" style="width:3.5rem;display:inline-block;">${data[12].task} =</span> <input name="ans12" id="ans12"/></p>
              <p><span id="task13" style="width:3.5rem;display:inline-block;">${data[13].task} =</span> <input name="ans13" id="ans13"/></p>
              <p><span id="task14" style="width:3.5rem;display:inline-block;">${data[14].task} =</span> <input name="ans14" id="ans14"/></p>
            </div>
          </div>
          <input type="hidden" name="answer" value="ok" />
          <p style="margin-top:16px;">Verbleibende Zeit: <span id="timer">30.00</span> Sekunden</p>
          <p><input type="submit" value="Abschicken" style="margin-top:16px;"/></p>
        </form>
        
        <script>
          const startTime = new Date().getTime()
          
          function callback() {
            const remaining = Math.max(0, 1000 * 30 - (new Date().getTime() - startTime))
            document.getElementById('timer').innerHTML = (Math.round(remaining / 10) / 100).toFixed(2)
            if (remaining > 0) {
              requestAnimationFrame(callback)
            }
          }
          callback()
        </script>
      `
    },
    check: (answer, { req }) => {
      if (!req.session.chal303_ts || !req.session.chal303_result) {
        return {
          answer: 'Keine Session gefunden',
          correct: false,
        }
      }

      const ts = new Date().getTime()
      const startTs = parseInt(req.session.chal303_ts)

      if (ts - startTs > 1000 * 32) {
        return {
          answer: 'Zeit abgelaufen',
          correct: false,
        }
      }

      const results = []
      for (let i = 0; i < 15; i++) {
        results.push(req.body[`ans${i}`])
      }

      const resultString = results.join(';')

      return {
        answer: resultString,
        correct: resultString == req.session.chal303_result,
      }
    },
    hidesubmit: true,
  },

  {
    id: 304,
    pos: { x: 1910, y: 730 },
    title: 'Primzahlen',
    author: 'darkstar',
    date: '2023-08-25',
    deps: [300],
    noScore: true,
    html: `
      <p>Entdecke die Primzahlen und ihre Eigenschaften!</p>

      <h4 style="margin-top:24px">Was sind Primzahlen?</h4>

      <p>Primzahlen sind ganze Zahlen größer als 1, die nur zwei positive Teiler haben: 1 und sich selbst. Mit anderen Worten, eine Primzahl kann nicht gleichmäßig durch eine andere Zahl außer 1 und sich selbst geteilt werden. Zum Beispiel sind 2, 3, 5, 7 und 11 Primzahlen.</p>

      <h4 style="margin-top:24px">Wie erkennt man Primzahlen?</h4>

      <p>Um herauszufinden, ob eine Zahl eine Primzahl ist, kannst du die Divisionstestmethode verwenden. Du teilst die zu überprüfende Zahl durch alle Zahlen von 2 bis zur Quadratwurzel dieser Zahl und prüfst, ob eine dieser Divisionen ohne Rest aufgeht. Wenn keine Division ohne Rest möglich ist, handelt es sich um eine Primzahl. Dies liegt daran, dass, wenn eine Zahl n keine Primzahl wäre, sie mindestens einen Teiler haben müsste, der kleiner oder gleich der Quadratwurzel von n ist.</p>

      <h4 style="margin-top:24px">Deine Aufgabe</h4>

      <p>Deine Aufgabe besteht darin, alle Primzahlen von 2 bis 4294967296 zu finden und sie anschließend zu addieren.</p>

      <p>Beispiel: Summe aller Primzahlen im Bereich von 1 bis 42:  2 + 3 + 5 + 7 + 11 + 13 + 17 + 19 + 23 + 29 + 31 + 37 + 41 = 238</p>
    `,
    solution: secrets('chal_304'),
  },

  {
    id: 305,
    pos: { x: 1830, y: 780 },
    title: 'Rätselhafte Kodierung',
    author: 'darkstar',
    date: '2023-08-25',
    deps: [300],
    noScore: true,
    html: `
    
      <p>In der digitalen Welt werden oft raffinierte Methoden verwendet, um Daten zu kodieren und zu übertragen. In dieser Aufgabe werdet ihr einen Blick auf eine mysteriöse Kodierung werfen, die dazu dient, Daten effizient zu speichern und zu übertragen.
      </p>
      
      <pre style="margin-top:24px">${"&lt;~8SoSMDKKH1F(8ltARlp0FWa&quot;ZF(I6d+Eh=:G@bZ&amp;ATT%]@&lt;6!&gt;2'?IEDIjr'Eq\\C%Eb-@ZDL,\n`)C`mn4EcY`(Bk:gdDImhq&gt;%MDXBOu'4+E_ND6&gt;:&gt;uEb&amp;U#ASrW$@&lt;-[:F*(u0Ch7K:+BRW;Eb0\n-!+@9LXAMu@f2DcO[ASGXfASrW6ATE!+DId=#+E_R4$:8S&amp;@r#WuG&amp;M7@1E]#0FCfM9Bl5%M+Bi\n&gt;j@q]Fk+E_OF@;]UeCih3NDKU&amp;IF&lt;EnYF(I&lt;g+?25$&gt;%MDXBOu'(F`(^sCN&quot;*6ATDm,ATDl81bD\n%&gt;FCd$jD&quot;_@SAKY])+&gt;k9FASGXfASs+C6t(-ZD.-pfF&lt;EnYF(I&lt;g+DG^96=kIcB-:W*AftVuAI:\nk&lt;AncR*ASuf:AS,OcCNO96ATAo%Ci^^c@&lt;6!&lt;1b9b[@3B-&amp;+Dk\\'EZd\\_FE8R=DBN`mEdD;;ATA\nnsASGXfASu&gt;FDJ*MfCN!`tATDlD+Eq78+F8/QASH$nEZf&amp;hBOu3qDBM&gt;UFCf?#Bk(guAKYU_BQA\n2I$6T]2@WH0qASuQ?+Co%tDBNS'F*1u+FCfM99_NOMDJ+$7DfTqBBleA=6SN%,CMkt=CGTu`~&gt;"}</pre>
      
    `,
    solution: secrets('chal_305'),
  },

  {
    id: 306,
    pos: { x: 1700, y: 430 },
    title: 'Ticket',
    author: 'cuzimbisonratte',
    date: '2023-08-31',
    deps: [300],
    noScore: true,
    render: ({ req }) => `
      <p>Um Zugang zu dieser Aufgabe zu erhalten, musst du dein Ticket auf folgender Seite vorzeigen.
      </p>
      
      <p><a href="/chal/chal306" target="_blank">Bitte dein Ticket vorzeigen</a>
      </p>
      
      <p>Dein Zugangscode lautet <code>${req.user.id}@Dodo-Airlines</code>. Der Code muss in Form eines QR Codes eingereicht werden. Dann erhältst du die Antwort.
      </p>
    `,
    solution: secrets('chal_306'),
  },

  {
    id: 307,
    pos: { x: 1580, y: 420 },
    title: 'Freier Fall',
    author: 'rkasti u. Satsuma',
    date: '2023-08-31',
    deps: [300],
    noScore: true,
    html: `
      <p>Wenn einem langweilig ist, kommt man doch auf verrückte Ideen. Ich bin zum Beispiel letztens auf die Idee gekommen, die Höhe meines Fensters über der Straße auszumessen. Aber nicht mit einem Messband, das wäre viel zu langweilig. Stattdessen habe ich einen Stein aus meinem Fenster fallen lassen. Nach genau 1,3 Sekunden habe ich den Aufprall gehört.</p>
      
      <p>Wie hoch ist nun mein Fenster über der Straße? (auf ganze Meter gerundet, Luftreibung kann vernachlässigt werden)
      </p>
    `,
    solution: secrets('chal_307'),
  },

  {
    id: 308,
    pos: { x: 1530, y: 320 },
    title: 'Freier Fall II',
    author: 'rkasti u. Satsuma',
    date: '2023-08-31',
    deps: [307],
    noScore: true,
    html: `
      <p>Nachdem das Berechnen der Höhe meines Fensters so gut geklappt hat, wollte ich es noch auf einer größeren Skala probieren. Nach ein paar Stunden Wandern stand ich also an der Kante einer sehr hohen Klippe in den Bergen und ließ wieder einen Stein fallen. Diesmal hörte ich nach genau 6,72 Sekunden den Aufprall.</p>
      
      <p>Wie hoch ist nun die Klippe? (auf ganze Meter gerundet, Luftreibung kann vernachlässigt werden)
      </p>
    `,
    solution: secrets('chal_308'),
  },

  {
    id: 309,
    pos: { x: 2030, y: 700 },
    title: 'Cyperchef', 
    author: 'provn_tq97',
    date: '2023-09-01',
    deps: [300],
    noScore: true,
    html: `
      <p>Mir war ein wenig langweilig, daher habe ich das Lösungswort mehrmals verschlüsselt 😁.</p>
      
      <p><code>&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOSG</code></p>
    `,
    solution: secrets('chal_309'),
  },

  {
    id: 310,
    pos: { x: 1940, y: 370 },
    title: 'RockYou', 
    author: 'virusrpi',
    date: '2023-09-02',
    deps: [300],
    noScore: true,
    html: `
      <p>Manchmal hilft nur noch <a href="https://www.kaggle.com/datasets/wjburns/common-password-list-rockyoutxt" target="_blank">ausprobieren</a>...</p>
      
      <script src="/sha256.js"></script>
      
      <script>
        const salt = '3NL/usjb4vEg'
        const hash = '9bcf0c8289a97d33021b4790659396d9f8af1085210d2186b8ec38efcdc31472'
        
        window.onload = () => {
          document.getElementById('challenge_form').onsubmit = (e) => {
            const value = document.getElementById('challenge_answer').value
            if (sha256(salt + value).hex() !== hash) {
              alert('Passwort falsch.')
              e.preventDefault()
              return false
            }
          }
        }
      </script>
    `,
    solution: secrets('chal_310'),
  },

  {
    id: 311,
    pos: { x: 1520, y: 520 },
    title: 'Brainfuck?', 
    author: 'Lars',
    date: '2023-09-02',
    deps: [300],
    noScore: true,
    html: `
      <p>Einige Programmiersprachen lassen etwas komische Schreibweisen für Code zu. Brainfuck zum Beispiel ist eine Programmiersprache die nur mit 8 Zeichen funktioniert. Folgendes Beispiel macht es noch besser. Mit nur 6 Zeichen kann man ganze Programme schreiben. Wenn du den folgenden Code in der passenden Sprache ausführst, erhältst du die Lösung.</p>
      
      <pre>[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[
]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]
+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(
![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+
[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![
]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+(+[![]]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!
+[]]+(!![]+[])[+[]]])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(!+[]+!+[]+!+[]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+
[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]
+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[]
)[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(
![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[
]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]+[])[+!+[]
]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]
]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[]
)[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+
!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]
+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[!+[]+!+[]])+(![]+[])[+!+[]]+(![]+[])[!+[]+!+
[]])()([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[
])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]
)[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])
[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]
+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[
]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]
+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[
])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!
+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+
[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]()[+!+[]+[!+[]+!+[]]]+((!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+
!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]+(![]+[])
[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+
[]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]+(![]+[])[!+[]+!+[
]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!
+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[+[]]+[!+[]
+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[+[]]+[!+[]+!+[]+!+[]+!+[]]+([![]]+[][[]])[
+!+[]+[+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[+[]]+[+!+[]]+[+!+[]]+[!+[]+!
+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(![]+[])[
!+[]+!+[]+!+[]]+([][[]]+[])[+[]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+
[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+([][[]]+[])[+[]]+(!![]+[])[
+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[
]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[+[]]+[+!+[]]+[+!+
[]]+[!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]]+[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+
[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]+([][[
]]+[])[!+[]+!+[]]+(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[
]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]
+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]])[(![]+[])[!+[]+!+[]+!+[]]+(+(!+[]+!+[]+[+!+[]]+[+!+[]]))[(!![]+[])[+[]]+(!![
]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[
!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]
]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[
+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(
![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]
+[])[+!+[]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(!
[]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]
]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]
+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+
[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[+!+[]])[+!+[]]+(![]+[])[!+[]+!+[]]
+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]]((!![]+[])[+[]])[([][(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]+(!![]+[])[
+[]]+(!![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()+[])[!+[]+!+[]+!+
[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([![]]+[][[]])[+!+[]+[+[]]]
+([][[]]+[])[+!+[]]](([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+
[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+
(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[
]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![
]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[]
)[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+(![]+[+[]])[([![]]+[][[]])[+!+[]+[
+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[
]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]]+![]+(![]+[+[]])[([![]]+[
][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![
]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]])()[([][(![
]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+
!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])
[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]
+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![
]+[+[]])[([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][
(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+
[+[]]])+[])[+!+[]])+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!
+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!
+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+
[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]()[+!+[]+[
!+[]+!+[]]])())</pre>
    `,
    solution: secrets('chal_311'),
  },

  {
    id: 1337,
    pos: { x: 1570, y: 630 },
    title: 'Geheime Aufgabe',
    author: 'darkermask',
    date: '2023-07-29',
    deps: [300],
    noScore: true,
    showAfterSolve: true,
    html: `
      <p>Hallo, du hast mich gefunden :)
      </p>
      
      <p>Wir reden hier gerne über "Elite", aber mal ehrlich: Das wollen wir ja eigentlich nicht wirklich sein.
      </p>
      
      <p>Die Antwort lautet Underdog.
      </p>
    `,
    solution: 'underdog',
  },
]
