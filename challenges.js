const fetch = require('node-fetch')
const crypto = require('crypto')
const secrets = require('./secrets-loader.js')

function stringreverse(s) {
  return s.split('').reverse().join('')
}

function calculatorCheck(a) {
  const str = Buffer.from(a, 'base64').toString()
  const index = str.indexOf('%')
  if (index >= 0 && str.substring(index + 1) === 'secret_word')
    return str.substring(0, index)
  else return a
}

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
        ipointer = astack.pop() - 1
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

module.exports = [
  {
    id: 1,
    pos: { x: 150, y: 140 },
    title: { de: 'Start', en: 'Start' },
    date: '2017-03-30',
    deps: [],
    render: async ({ req, App }) => {
      if (req.lng === 'en') {
        await App.storage.setItem('visit_english', req.user.name)
      }
      return {
        de: `
          <p>Herzlich willkommen bei Hack The Web. Hier beginnt deine spannende Reise durch die Welt des Hackings. Es wird eine Reise voller Abenteuer sein. Herausforderungen aus ganz verschiedenen Themenbereichen warten auf dich. An ihnen kannst du dein Können unter Beweis stellen oder dir die Zähne ausbeißen.</p>
        
          <p>Bei den meisten Aufgaben geht es darum, aus den Angaben heraus eine Antwort zu finden. Allerdings findet sich diese meist nur, wenn man die Aufgabe aus der richtigen Perspektive betrachtet - eben aus der Perspektive einer Hacker*in.</p>
        
          <p>Bei der Bearbeitung der Aufgaben sind ausdrücklich alle Hilfsmittel erlaubt. Du darfst im Internet suchen, einen Taschenrechner oder Chatbot verwenden, mit Stift und Papier Notizen machen... Fühl dich frei und nutze die Tools, die dir bei der Bearbeitung der Aufgaben am meisten helfen.
          </p>
          
          ${
            req.user.RoomId !== null
              ? `<p>Falls du einem Raum beigetreten bist und an einer Hacking-Session teilnimmst: Nach der Bearbeitung dieser Aufgabe starten die 30 Minuten. Innerhalb dieser Zeit ist es dein Ziel, so viele Aufgaben wie möglich zu bearbeiten. Deine Punktzahl für diese 30 Minuten wird in die Highscore des Raums eingetragen.
          </p>`
              : ''
          }
        
          <p>Bist du bereit? Dann lasst uns anfangen! Die Antwort auf diese erste Aufgabe ist das Ergebnis von 6 + 4 × 9.</p>
        `,
        en: `
          <p>Welcome to Hack The Web. Here begins your exciting journey through the world of hacking. It will be a journey full of adventures. Challenges from very different areas are waiting for you. You can prove your skills or wrestle with them.</p>
    
          <p>Most of the challenges are about finding an answer from the information given. However, this can usually only be found if you look at the task from the right perspective — the perspective of a hacker.</p>

          <p>When working on the challenges, all aids are expressly allowed. You may search the Internet, use a calculator or chatbot, make notes with pen and paper... Feel free and use the tools that help you the most when working on the tasks.</p>
          
          ${
            req.user.RoomId !== null
              ? `<p>If you have joined a room and are participating in a hacking session: After completing this task, the 30 minutes will start. Within this time, it is your goal to work on as many tasks as possible. Your score for these 30 minutes will be entered into the room's highscore.
          </p>`
              : ''
          }

          <p>Are you read? Then let's go! The answer to this first challenge is the result of 6 + 4 × 9.</p>
        `,
      }
    },
    solution: secrets('chal_1'),
  },

  {
    id: 2,
    pos: { x: 585, y: 875 },
    title: { de: 'Finger-Code', en: 'Finger code' },
    date: '2017-05-17',
    deps: [26, 50],
    html: {
      de: `
        <p>Der Inhalt einer Nachricht ist ganz unabhängig von seiner Codierung. Man kann lateinische Buchstaben verwenden - oder seine Finger!
        </p>
        
        <p>Die Antwort zu dieser Aufgabe findet sich im folgenden Bild:
        </p>
        
        <p><img src="/chals/chal2.png" alt="fingercode"></p>
      `,
      en: `
         <p>The content of a message is completely independent of its encoding. You can use Latin letters — or your fingers!
         </p>
         
         <p>The answer to this challenge can be found in the following picture:
         </p>
         
         <p><img src="/chals/chal2.png" alt="fingercode"></p>
      `,
    },
    solution: secrets('chal_2'),
  },

  {
    id: 3,
    pos: { x: 825, y: 1025 },
    title: { de: 'Auf hoher See', en: 'At sea' },
    date: '2017-05-17',
    deps: [2, 39, 45],
    html: {
      de: `
        <p>Wie komfortabel heute die Kommunikation geworden ist! Mit WhatsApp und Facebook kann man weltweit mühelos Nachrichten versenden und empfangen - da vergisst man leicht, dass noch vor hundert Jahren die Situation ganz anders aussah. Damals hatte man, zum Beispiel in der Seefahrt, zur Kommunikation nichts mehr als einen Piepston und das Morse-Alphabet!
        </p>
        
        <p>Aber das sollte auch für dich kein Hindernis sein. Höre dir <a href ="/chals/chal3.wav">diese Datei</a> an. Darin findest du die Antwort zu dieser Aufgabe.
        </p>
        
        <audio src="/chals/chal3.wav" controls></audio>
        
        <p>Dein PC hat keine Lautsprecher? Scanne <a href="/chals/chal3_code.png">diesen QR-Code</a>, um dir die Datei auf dem Handy anzuhören.</p>
      `,
      en: `
        <p>How comfortable communication has become today! With WhatsApp and Facebook, you can easily send and receive messages all over the world — it is easy to forget that a hundred years ago the situation was completely different. At that time, for example, in seafaring, one had nothing more than a beep and the Morse alphabet to communicate!
        </p>
        
        <p>But that should not be an obstacle for you either. Listen to <a href ="/chals/chal3.wav">this file</a>. In it, you will find the answer to this challenge.
        </p>
        
        <audio src="/chals/chal3.wav" controls></audio>
        
        <p>Your PC has no speakers? Scan <a href="/chals/chal3_code.png">this QR code</a> to listen to the file on your mobile phone.</p>
      `,
    },
    solution: secrets('chal_3'),
  },

  {
    id: 4,
    pos: { x: 270, y: 220 },
    title: { de: 'ASCII', en: 'ASCII' },
    date: '2017-05-17',
    deps: [1],
    render: () => {
      function renderTable(col1, col2) {
        return `
         <div class="container" style="margin-top:24px;margin-bottom:24px;">
          <div class="row">
            <div class="col">
              <table class="table table-bordered table-hover table-sm table-dark justify-content-between">
                <thead>
                  <tr>
                    <th scope="col">${col1}</th>
                    <th scope="col">${col2}</th>
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
                    <th scope="col">${col1}</th>
                    <th scope="col">${col2}</th>
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
                    <th scope="col">${col1}</th>
                    <th scope="col">${col2}</th>
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
        `
      }

      return {
        de: `
          <p>Du bist eine mutige Person! Du hast dich von den kryptischen Buchstaben im Titel dieser Aufgabe nicht abschrecken lassen.
          </p>
          
          <p>
            Viele Dinge in der Informatik sehen auf den ersten Blick verwirrend sein. Vor allem, wenn man keine Übersetzungshilfe hat. Aber sobald man weiß,
            wo man Dinge nachschauen kann, werden diese weniger fremd.
          </p>
          
          <p>
            So ist es auch mit dem ASCII-Code. Weil Computer nur mit Zahlen arbeiten können, gibt es zu jedem Schriftzeichen einen einheitlichen Code. Einen Auszug davon
            findest du in dieser Tabelle.
          </p>
          
          ${renderTable('Code', 'Zeichen')}
          
          <p>Ein Beispiel: Das Dollar-Zeichen wird im Computer mit der Zahl 36 gespeichert. Voila, jetzt bist du dran. Deine Antwort in Codes lautet:
          </p>
          
          <p>35 &nbsp; 115 &nbsp; 116 &nbsp; 97 &nbsp; 98 &nbsp; 105 &nbsp; 108
          </p>
        `,
        en: `
          <p>You are a brave person! You were not deterred by the cryptic letters in the title of this challenge.
          </p>
          
          <p>
            Many things in computer science can seem confusing at first glance. Especially if you don't have translation aid. But as soon as you know
            where to look for things, they become less foreign.
          </p>
          
          <p>
            This is also the case with the ASCII code. Because computers can only work with numbers, there is a uniform code for each character.
            You can find an excerpt from this in this table.
          </p>
          
          ${renderTable('Code', 'Character')}
          
          <p>An example: The dollar sign is stored in the computer with the number 36. Voilà, now it's your turn. Your answer in codes is:
          </p>
          
          <p>35 &nbsp; 115 &nbsp; 116 &nbsp; 97 &nbsp; 98 &nbsp; 105 &nbsp; 108
          </p>
        `,
      }
    },
    check: (answer) => {
      const trimmed = answer.toLowerCase().replace(/ /g, '').trim()
      return {
        answer: trimmed,
        correct: trimmed === secrets('chal_4'),
      }
    },
  },

  {
    id: 5,
    pos: { x: 300, y: 120 },
    title: { de: 'Zitronentinte', en: 'Lemon juice' },
    date: '2017-05-17',
    deps: [1],
    html: {
      de: `
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
      en: `
        <p>This challenge here works like writing with lemon juice: You take a fountain pen and dip it in the juice of a freshly squeezed lemon. With it, you write your secret message on a white sheet of paper. Because the juice is transparent, you write "white on white" and another person cannot read the message. The person who receives the message holds the paper over a flame. The heat discolors the lemon juice and the message becomes visible.
        </p>
        
        <p>The whole thing also works digitally. Below you will find a "prepared" sheet of paper with the answer:
        </p>
        
        <br>
        
        <p>--- Here starts the sheet ---</p>
        
        <p><br><span style="color:#222222;padding-left:150px">Hier ist nichts.</span><br><br><span style="color:#222222">Lalala, das Wetter ist schön</span><br><br><br><br><span style="color:#222222;padding-left:400px">Die Antwort lautet: ${secrets(
          'chal_5'
        )}</span><br><br>
        </p>
        
        <p>--- Here ends the sheet ---</p>
      `,
    },
    solution: secrets('chal_5'),
  },

  {
    id: 6,
    pos: { x: 485, y: 150 },
    title: { de: 'HTML', en: 'HTML' },
    date: '2017-05-17',
    deps: [5],
    html: {
      de: `
      <p>Wenn du dir eine Website am Computer anschaust, dann siehst du eigentlich nur einen kleinen Teil der Website. Hinter den Kulissen aber gibt es noch eine ganze Welt voller Technik zu entdecken.
      </p>
      
      <p>Ähnlich wie die Noten zu einem Musikstück oder das Drehbuch zu einem Film gibt es auch den Code zu einer Website. Und darin finden sich Informationen, die sonst nicht zu sehen sind. Im Quelltext der Website wird die Antwort in diesem Kasten sichtbar:</p>
      
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
          onpopstate = (_) => { window.location.reload() };
        }
      </script>
    `,
      en: `
      <p>When you look at a website on your computer, you actually only see a small part of the website. But behind the scenes, there is a whole world full of technology to discover.
      </p>
      
      <p>Similar to the notes to a piece of music or the script to a film, there is also the code to a website. And in it, you can find information that is not visible otherwise. In the source code of the website, the answer is visible in this box:</p>
      
      <pre>
      
      __________________________________________
      |                                        |
      |<!-- The answer is ${secrets(
        'chal_6'
      )}. -->                                        |
      |________________________________________|
                
      </pre>
      
      <p><button onclick="transform()">Show sourcecode</button></p>
      
      <script>
        function transform() {
          const code = document.body.outerHTML
          document.body.outerHTML = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;');
          document.body.style.lineHeight = '1.2';
          document.body.style.fontFamily = 'monospace';
          document.body.style.marginLeft = '4px';
          history.pushState({}, '');
          onpopstate = () => { window.location.reload(); };
        }
      </script>
      `,
    },
    solution: secrets('chal_6'),
  },

  {
    id: 7,
    pos: { x: 590, y: 230 },
    title: { en: 'HTML II', de: 'HTML II' },
    date: '2017-05-17',
    deps: [6],
    html: {
      de: `
      <p>Auch diesmal braucht es einen Blick in den Quelltext der Seite. Allerdings musst du das Portal selber finden. Die Antwort befindet sich direkt unter dieser Zeile ...
      </p>
      
      <!-- ... und lautet ${secrets('chal_7')}. -->
      
      <p><small><a href="/chals/chal7_hint1.png" target="_blank">Tipp 1</a> / <a href="/chals/chal7_hint2.png" target="_blank">Tipp 2</a></small></p>
    `,
      en: `
        <p>This time, too, it takes a look at the source code of the page. However, you have to find the portal yourself. The answer is directly below this line ...
        </p>
        
        <!-- ... and is ${secrets('chal_7')}. -->
        
        <p><small><a href="/chals/chal7_hint_en.png" target="_blank">Hint</a></small></p>
    `,
    },
    solution: secrets('chal_7'),
  },

  {
    id: 8,
    pos: { x: 520, y: 280 },
    title: { de: 'Fleißaufgabe', en: 'Hard work' },
    date: '2017-05-17',
    deps: [55, 84],
    html: {
      de: `
      <p>Hallo, Kopfrechen-KünstlerIn! Du löst Aufgaben schneller, als ich sie in den Taschenrechner eingeben kann.
      </p>
      
      <p>Das glaubst du nicht? Hier ein Beispiel: Deine Antwort ist das Ergebnis von 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10.
      </p>
      
      <p>Warte kurz, ich hole schnell meinen Taschenrechner ...
      </p>
    `,
      en: `
      <p>Hello, mental arithmetic artist! You solve tasks faster than I can enter them in the calculator.
      </p>
      
      <p>You don't believe it? Here is an example: Your answer is the result of 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10.
      </p>
      
      <p>Wait a minute, I'll get my calculator quickly ...
      </p>
    `,
    },
    solution: secrets('chal_8'),
  },

  {
    id: 9,
    pos: { x: 650, y: 370 },
    title: { de: 'Fleißaufgabe II', en: 'Hard work II' },
    date: '2017-05-17',
    deps: [8],
    html: {
      de: `
      <p>Du bist nicht nur gut im Kopfrechnen, sondern auch zielgerichtet. Eine Aufgabe, die du anfängst, ziehst du durch.
      </p>
      
      <p>Deine Antwort ist das Ergebnis von 1 + 2 + 3 + ... + 98 + 99 + 100.
      </p>
    `,
      en: `
      <p>You are not only good at mental arithmetic, but also motivated. A task that you start, you follow through.
      </p>
      
      <p>Your answer is the result of 1 + 2 + 3 + ... + 98 + 99 + 100.
      </p>
    `,
    },
    solution: secrets('chal_9'),
  },

  {
    id: 10,
    pos: { x: 800, y: 410 },
    title: { de: 'Fleißaufgabe III', en: 'Hard work III' },
    date: '2017-05-18',
    deps: [9],
    html: {
      de: `
      <p>Kopfrechen-Genius, fokussiert - und dazu ein mathematisches Gespür. Damit löst du auch komplexe Probleme auf deine Art und Weise.
      </p>
      
      <p>Berechne diesmal das Ergebnis von 1 + 2 + 3 + ... + 998 + 999 + 1000.
      </p>
    `,
      en: `
      <p>Mental arithmetic genius, focused — and also a mathematical sense. With this, you even solve complex problems in your own way.
      </p>
      
      <p>This time, calculate the result of 1 + 2 + 3 + ... + 998 + 999 + 1000.
      </p>
    `,
    },
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
        
        <p>Damit die Einwohner nicht so viel Geld mit sich schleppen müssen, dürfen Preise nur zwischen 1 und 1023 liegen. Zu hohe Preise und Dezimalbrüche sind verboten (und werden per Überweisung bezahlt).
        </p>
        
        <p>Das Interessante an diesem System: Jeder Einwohner kann mit einem Satz an Münzen (also von jedem Wert genau eine Münze, insgesamt 10 Münzen) jeden Preis zwischen 1 und 1023 bezahlen. Wir wollen das mal überprüfen: Den Preis von 100 können wir mit den drei Münzen 64, 32 und 4 bezahlen. Klappt.
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
        
        <p>Die Tabelle ist eigentlich sehr systematisch: Auf der linken Seite sind die Zahlen von 0 bis 15 dargestellt und rechts die passende Zahl oder ein Buchstabe. Die Binärzahl 10100011 wird dann mit A3 abgekürzt. Diese Schreibweise wird Hexadezimalsystem genannt.
        </p>
        
        <p>Wie lautet nun die Binärzahl 11111010011000000100 in hexadezimaler Schreibweise?
        </p>
      `,
      solution: 'fa604',
    },*/

  {
    id: 15,
    pos: { x: 420, y: 90 },
    title: { de: 'Benutzername', en: 'Username' },
    date: '2017-05-18',
    deps: [5],
    html: {
      de: `
      <p>Die Antwort zu dieser Aufgabe ist ganz einfach dein Benutzername. Allerdings kann es sein, dass deine Eingabe beim Absenden etwas durcheinander gerät. Findest du heraus, was du eingeben musst?
      </p>
    `,
      en: `
      <p>The answer to this challenge is simply your username. However, it may be that your input gets a little mixed up when you submit it. Can you find out what you have to enter?
      </p>
    `,
    },
    check: (answer, { req }) => {
      const reversed = stringreverse(answer)
      return {
        answer: reversed,
        correct: reversed === req.user.name,
      }
    },
  },

  {
    id: 16,
    pos: { x: 550, y: 100 },
    title: { de: 'Benutzername II', en: 'Username II' },
    date: '2017-05-18',
    deps: [15],
    html: {
      de: `
      <p>In der Informatik dreht sich alles um Datenverarbeitung. Eine <em>Funktion</em> nimmt dabei einen Eingabewert (z.B. deine Antwort) und erzeugt daraus einen Ausgabewert (die Antwort, wie sie hier ankommt).
      </p>
      
      <p>Eine Funktion kann Werte vertauschen, verändern, auslassen, etc. - alles Mögliche, wie man will. Was macht diese Funktion hier mit deiner Eingabe? Die Antwort zu dieser Aufgabe ist wieder dein Benutzername.
      </p>
    `,
      en: `
      <p>In computer science, everything revolves around data processing. A <em>function</em> takes an input value (e.g. your answer) and generates an output value (the answer as it arrives here).
      </p>
      
      <p>A function can swap, change, omit, etc. values — anything you want. What does this function do to your input? The answer to this challenge is again your username.
      </p>
    `,
    },
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
    title: { de: 'Benutzername III', en: 'Username III' },
    date: '2017-05-18',
    deps: [16],
    html: {
      de: `
      <p>Eine weitere Runde: Die Antwort auf diese Aufgabe ist wieder dein Benutzername. Allerdings wird deine Eingabe vor der Auswertung wieder durcheinander gebracht. Wie muss diesmal die Eingabe lauten?
      </p>
    `,
      en: `
      <p>Another round: The answer to this challenge is again your username. However, your input is again mixed up before the evaluation. What should the input be this time?
      </p>
    `,
    },
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
    title: { de: 'ROT13', en: 'ROT13' },
    date: '2017-05-18',
    deps: [24, 110],
    html: {
      de: `
      <p>Du hast eine verschlüsselte Nachricht erhalten! Sie sieht wie kompletter Nonsens aus. Dein Hacker-Blick ist gefragt! Du siehst wunderbar aus, wenn du scharf nachdenkst.
      </p>
      
      <p>Ziehe den Slider, um die Buchstaben im Alphabet zu verschieben.</p>
      
      <p style="word-wrap:break-word" class="my-4" id="cipher">
      </p>
      
      <input id="slider" type="range" min="0" max="26" step="1" style="width:500px" value="0" onchange="change()" oninput="change()"/>
      
      <script>
        const message = 'fhcre qh unfg qra grkg resbytervpu ragfpuyhrffryg nyf orybuahat reunryfg qh aha qvr nagjbeg haq fvr ynhgrg fcvrtryovyq'
        
        const slider = document.getElementById('slider')
        
        const cipher = document.getElementById('cipher')
        
        function translate(n) {
          cipher.innerHTML = message.split('').map(c => {
            if (c === ' ') return c
            return String.fromCharCode(((c.charCodeAt(0) - 97 + n) % 26) + 97)
          }).join('')
        }
        
        function change() {
          translate(parseInt(slider.value))
        }
        
        change()
        
        
      </script>
    `,
      en: `
      <p>You have received an encrypted message! It looks like complete nonsense. Your hacker's eye is in demand! You look wonderful when you think hard.
      </p>
      
      <p>Drag the slider to shift the letters in the alphabet.</p>
      
      <p style="word-wrap:break-word" class="my-4" id="cipher">
      </p>
      
      <input id="slider" type="range" min="0" max="26" step="1" style="width:500px" value="0" onchange="change()" oninput="change()"/>
      
      <script>
        // noinspection SpellCheckingInspection
        const message = 'terng lbh unir fhpprffshyyl qrpbqrq gur grkg nf n erjneq lbh abj trg gur nafjre naq vg vf fcvrtryovyq    (gur trezna jbeq sbe zveebe vzntr)'
        
        const slider = document.getElementById('slider')
        
        const cipher = document.getElementById('cipher')
        
        function translate(n) {
          cipher.innerHTML = message.split('').map(c => {
            if (c === ' ' || c === '(' || c === ')') return c
            return String.fromCharCode(((c.charCodeAt(0) - 97 + n) % 26) + 97)
          }).join('')
        }
        
        function change() {
          translate(parseInt(slider.value))
        }
        
        change()
        
        
      </script>
    `,
    },
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
        
        <p>Die Schwierigkeit liegt darin: Du weißt nicht, um wie viel die geheime Nachricht verschoben wurde. Aber das sollte Dich als Hacker nicht abhalten! Die geheime Nachricht (ein deutsches Wort) ist die Antwort zu dieser Aufgabe.
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
    title: { de: 'Fingerzeig', en: 'Helping hand' },
    date: '2017-08-25',
    deps: [55, 111],
    html: {
      de: `
      <p>
        Es ist super cool, hilfsbereite Menschen wie dich zu haben. Das macht den Alltag so viel angenehmer, wenn man mal den Weg nicht weiß oder an der Kasse seinen Geldbeutel vergessen hat :)
      </p>
      
      <p>Gleichzeitig ist es auch kein Problem, um Hilfe zu bitten. Wir alle kommen irgendwann mal nicht weiter.
      </p>
          
      <p>
        <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 300px" alt="discord banner"></a>
      </p>
      
      <p>Auf dem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> von Hack The Web hast du die Möglichkeit, Hinweise zu finden oder selbst Fragen zu stellen. Klicke auf das Logo, um dem Server beizutreten. Im Forum findest du einen Post mit dem Titel dieser Aufgabe. Dort findest du deine Antwort.
      </p>
    `,
      en: `
       <p>
           It is super cool to have helpful people like you. It makes everyday life so much more pleasant when you don't know the way or forget your wallet at the checkout :)
       </p>
       
       <p> At the same time, it is no problem to ask for help. We all have times when we need help.
       </p>
       
       <p>
       <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 300px;" alt="discord"></a>
       </p>
     
       <p>On the <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> of Hack the Web, you have the possibility to find hints or ask questions yourself. Click on the logo to join the server. In the forum you will find a post with the title "Fingerzeig". There you will find your answer.
       </p>
       
       <p>
       Note: Hack the Web is a German website, which is why the Discord server is in German. Please write only in German on the server. But with the help of a translator, you should be able to find the answer anyway ;)
       </p>
   `,
    },
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
    title: { de: 'Grau auf Grau', en: 'Grey on grey' },
    date: '2017-08-25',
    deps: [7, 8],
    html: {
      de: `
      <p>Oje, bei diesem Bild hat jemand den ganzen Kontrast weggenommen! Übrig geblieben ist nur noch grau:
      </p>
      
      <p><a href="/chals/chal23.png"><img src="/chals/chal23.png" style="max-width: 300px" alt="grey"></a>
      </p>
      
      <p>[<a href="/chals/chal23.png" download="grau.png">Bild herunterladen</a>]</p>
      
      <p>Die Informationen sind immer noch im Bild vorhanden - allerdings so schwach, dass sie mit dem Auge nicht mehr zu sehen sind. Mit einer Methode namens <a href="https://threshold.imageonline.co/" target="_blank">Threshold</a> können diese feinen Unterschiede verstärkt und wieder für den Menschen sichtbar gemacht werden.</p>
      
      <p>Wie lautet der Vorname der abgebildeten Person?
      </p>
    `,
      en: `
      <p>Oh no, someone has taken away all the contrast in this picture! All that's left is gray:
      </p>
      
      <p><a href="/chals/chal23.png"><img src="/chals/chal23.png" style="max-width: 300px;" alt="challenge 23"></a>
      </p>
      
      <p>[<a href="/chals/chal23.png" download="grau.png">Download picture</a>]</p>
      
      <p>The information is still present in the image — but so faint that it is no longer visible to the eye. With a method called <a href="https://threshold.imageonline.co/" target="_blank">Threshold</a>, these subtle differences can be amplified and made visible to humans again.</p>
      
      <p>What is the first name of the person who is depicted in the picture?</p>
      </p>
    `,
    },
    solution: secrets('chal_23'),
  },

  {
    id: 24,
    pos: { x: 140, y: 280 },
    title: { de: 'Nicht blinzeln', en: "Don't blink" },
    date: '2017-08-25',
    deps: [1],
    html: {
      de: `
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
      en: `
        <p id="poper">Don't blink!</p>
        </p>
        
        <small style="margin-top:48px;display:inline-block">Note: The answer is in German.</small>
        
        <script>
          setTimeout(function(){
            document.getElementById("poper").innerHTML = "The answer is ${secrets(
              'chal_24'
            )}"
            setTimeout(function(){
              document.getElementById("poper").innerHTML = "Oh. This was fast."
            }, 150)
          }, 1500)
        </script>
      `,
    },
    solution: secrets('chal_24'),
  },

  {
    id: 25,
    pos: { x: 865, y: 855 },
    title: { de: 'Russische Puppen', en: 'Russian dolls' },
    date: '2017-08-25',
    deps: [40, 41, 42],
    html: {
      de: `
      <p>Wenn man eine Datei zipt, dann wird sie kleiner und braucht weniger Speicherplatz. Wenn man eine Zip-Datei nochmal zipt, wird sie dann noch kleiner?
      </p>
      
      <p>Warum nicht ausprobieren? Ich habe die Antwort mal ordentlich gezipt: Hier ist die <a href="/chals/antwort25.zip">Datei</a>. Darin findet sich die Lösung zu dieser Aufgabe. Und nein, mehrfaches Zippen bringt nichts und macht die Datei sogar größer.
      </p>
    `,
      en: `
      <p>When you zip a file, it becomes smaller and requires less space. When you zip it again, does it become even smaller?</p>
      </p>
      
      <p>Let's try it! I zipped the answer a bunch of times: This is the <a href="/chals/antwort25.zip">File</a>. In it, there is the answer to this challenge. And no: If you zip a file more than once, it becomes only bigger.
      </p>
      
      <small style="margin-top:48px;display:inline-block">Note: The word "antwort" means "answer" in german</small>
    `,
    },
    solution: secrets('chal_25'),
  },

  {
    id: 26,
    pos: { x: 515, y: 715 },
    title: { de: 'Zeitmaschine', en: 'Time machine' },
    date: '2017-08-26',
    deps: [60],
    html: {
      de: `
      <p>Du siehst aus wie jemand, der sich für Backstories interessiert! Die Entstehungsgeschichte von Hack The Web hat ein paar spannende Aspekte und hier gibt es eine kleine Geschichtsstunde nur für dich.
      </p>
      
      <p>Das Konzept von Aufgaben (<em>Challenges</em>), die in einer Karte angeordnet sind, hat Hack The Web von <a href="https://hacker.org/" target="_blank">Hacker.org</a> übernommen. Diese Seite ist eine großartige Inspiration, aber auch sie ist nicht vom Himmel gefallen. Als die Challenges im Jahr 2008 veröffentlicht wurden, fand sich auf der Domain schon viele Jahre ein Projekt, dass als Hacker-Community beschrieben werden könnte.
      </p>
      
      <p>Dank des Internet Archives können wir in der Zeit zurückreisen und du kannst erleben, wie sich diese Community verstanden hat.
      </p>
      
      <p>Hier siehst du eine Version von hacker.org vom <a href="https://web.archive.org/web/19961218220409/http://hacker.org/" target="_blank">18. Dezember 1996</a>.
      </p>
      
      <iframe src="https://web.archive.org/web/19961218220409/http://hacker.org/" style="width:100%;height:800px;"></iframe>
      
      <p>Deine Antwort ist die E-Mail-Adresse des Betreibers.
      </p>
    `,
      en: `
      <p>You look like someone who is interested in backstories! There are a few exciting aspects to Hack The Web's origin story, and here's a little history lesson just for you.
      </p>
      
      <p>The concept of challenges arranged in a map has been adopted by Hack The Web from <a href="https://hacker.org/" target="_blank">Hacker.org</a>. This site is a great inspiration, but it didn't fall from the sky either. When the Challenges were published in 2008, a project that could be described as a hacker community had been on the domain for many years.
      </p>
      
      <p>Thanks to the Internet Archive, we can travel back in time, and you can experience how this community got along.
      </p>
      
      <p>Here you can see a version of hacker.org from the <a href="https://web.archive.org/web/19961218220409/http://hacker.org/" target="_blank">December 18, 1996</a>.
      </p>
      
      <iframe src="https://web.archive.org/web/19961218220409/http://hacker.org/" style="width:100%;height:800px;"></iframe>
      
      <p>Your answer is the operator's email address.
      </p>
    `,
    },
    solution: secrets('chal_26'),
  },

  {
    id: 27,
    pos: { x: 155, y: 745 },
    title: { de: 'Fingerspitzengefühl', en: 'Tactility' },
    date: '2017-08-26',
    deps: [29, 66],
    html: {
      de: `
      <p>Taste vorsichtig über das Feld und lese die Antwort ab:
      </p>
      
      <p><svg id="chal27"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal27.js"></script>
    `,
      en: `
     <p>Carefully key over the field and read the answer:
     </p>
     
     <p><svg id="chal27"></svg></p>
       
     <script src="/svg.min.js"></script>
     <script src="/chals/chal27.js"></script>
     
     <p>Note: The answer is in German, so don't be confused if the word doesn't make sense to you.</p>
    `,
    },
    solution: secrets('chal_27'),
  },

  {
    id: 28,
    pos: { x: 945, y: 385 },
    title: { de: 'Werbung', en: 'Ads' },
    date: '2017-08-26',
    deps: [10, 23, 79],
    html: {
      de: `
       <p>Nervige Werbebanner, die einen den Inhalt versperren - wer kennt das nicht? Auch in diesem Fall verdeckt eine Werbung die Antwort auf die Aufgabe.
       </p>
       
       <p>Zum Glück bieten moderne Browser Werkzeuge an, mit denen man eine Website bearbeiten kann und damit auch das eine oder andere nervige Element verschwinden lässt. (Falls diese nicht zur Verfügung stehen: <a href="#" onclick="(function () { const script=document.createElement('script');script.src='https://x-ray-goggles.mouse.org/webxray.js';script.className='webxray';script.setAttribute('data-lang','en-US');script.setAttribute('data-baseuri','https://x-ray-goggles.mouse.org');document.body.appendChild(script);}())">X-Ray laden</a>)
       </p>
       
       <div style="position:absolute;width:1000px;height:1000px;background-color:green" id="banner">
         <span style="font-size:100px" id="text">Herzlichen Glückwunsch! Sie haben gewonnen!</span>
         <div style="margin-top:20px; border: 2px solid black; width: 350px; margin-left: 40px; cursor: pointer; padding: 8px" id="skipp">Überspringe die Werbung in <span id="counter">4568</span> Sekunden ...</div>
       </div>
       
       <p>Die Antwort zu dieser Aufgabe lautet <span id="solution"></span>.
       </p>
       
       <script src="/chals/chal28.js"></script>
       <!--suppress JSDeprecatedSymbols -->
       <script>document.getElementById("solution").innerHTML = atob("TGl0ZmHfc+R1bGU=")</script>
     `,
      en: `
      <p>Annoying advertising banners that block the content - who hasn't seen that? In this case too, an advertisement obscures the answer to the challenge.
      </p>
      
      <p>Fortunately, modern browsers offer tools with which you can edit a website and thus remove one or two annoying elements. (If these are not available: <a href="#" onclick="(function () { const script=document.createElement('script');script.src='https://x-ray-goggles.mouse.org/webxray.js';script.className='webxray';script.setAttribute('data-lang','en-US');script.setAttribute('data-baseuri','https://x-ray-goggles.mouse.org');document.body.appendChild(script);}())">Load X-Ray</a>)
      </p>
      
      <div style="position:absolute;width:1000px;height:1000px;background-color:green" id="banner">
        <span style="font-size:100px" id="text">Congratulations! You have won!</span>
        <div style="margin-top:20px; border: 2px solid black; width: 350px; margin-left: 40px; cursor: pointer; padding: 8px" id="skipp">Skip in <span id="counter">4568</span> seconds ...</div>
      </div>
      
      <p>The answer to this challenge is <span id="solution"></span>.
      </p>
      
      <script src="/chals/chal28.js"></script>
      <!--suppress JSDeprecatedSymbols -->
      <script>document.getElementById("solution").innerHTML = atob("TGl0ZmHfc+R1bGU=")</script>
    `,
    },
    solution: secrets('chal_28'),
  },

  {
    id: 29,
    pos: { x: 195, y: 615 },
    title: { de: 'GPS-Code', en: 'GPS code' },
    date: '2017-08-26',
    deps: [70],
    html: {
      de: `
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
      en: `
      <p>The first letters of these towns are the answer to this challenge:  
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
    },
    solution: secrets('chal_29'),
  },

  {
    id: 30,
    pos: { x: 715, y: 470 },
    title: { de: 'UNIX Zeitstempel', en: 'UNIX timestamp' },
    date: '2017-08-26',
    deps: [21],
    html: {
      de: `
      <p>Im welchem Jahr liegt der Zeitpunkt 817876800?
      </p>
    `,
      en: `
      <p>In which year is the point in time 817876800?
      </p>
    `,
    },
    solution: secrets('chal_30'),
  },

  {
    id: 31,
    pos: { x: 430, y: 450 },
    title: { de: 'Taschenrechner III', en: 'Calculator III' },
    date: '2017-08-26',
    deps: [111],
    html: {
      de: `
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
      
      <p><img src="/chals/chal31_result.png" style="max-width: 400px" alt="1000"></p>
    `,
      en: `
      <p>It's time for a new calculator:
      </p>
      
      <br>
      
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <br>
      
      <p>This calculator consists of a "tube" that is open on the right. You can use the number keys to push individual numbers into this tube.
      </p>
      
      <p>To generate more numbers, you have to do math. There are four basic arithmetic operations. With these keys, the two numbers on the far right are taken out of the tube and added, subtracted, multiplied or divided together. Try this and see what happens!
      </p>
      
      <p>There are two special commands: <strong>drop</strong> removes the last number from the tube (i.e. the number on the far right), <strong>dup</strong> adds the last number again (duplicates).
      </p>
      
      <p>Calculate the result 1000:
      </p>
      
      <p><img src="/chals/chal31_result.png" style="max-width: 300px" alt="chal31"></p>
    `,
    },
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val === '1000',
      }
    },
    hidesubmit: true,
  },

  {
    id: 32,
    pos: { x: 550, y: 500 },
    title: { de: 'Taschenrechner IV', en: 'Calculator IV' },
    date: '2017-08-26',
    deps: [31],
    html: {
      de: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <p>Berechne diesmal die Zahl 1337.
      </p>
    `,
      en: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal31.js"></script>
      
      <p>This time, calculate the number 1337.
      </p>
    `,
    },
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val === '1337',
      }
    },
    hidesubmit: true,
  },

  {
    id: 33,
    pos: { x: 675, y: 525 },
    title: { de: 'Taschenrechner V', en: 'Calculator V' },
    date: '2017-08-26',
    deps: [32],
    html: {
      de: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal33.js"></script>
      
      <p>Berechne die Zahl 100. Allerdings fehlen diesmal ein paar Tasten.
      </p>
    `,
      en: `
      <p id="op-buttons"></p>
      <p id="num-buttons"></p>
      <p><svg id="stack"></svg></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal33.js"></script>
      
      <p>Calculate the number 100. However, this time a few keys are missing.
      </p>
    `,
    },
    check: (answer) => {
      const val = calculatorCheck(answer)
      return {
        answer: val,
        correct: val === '100',
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
    title: { de: 'Benutzername V', en: 'Username V' },
    date: '2020-05-20',
    deps: [56],
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
    title: { de: 'Emoji', en: 'Emoji' },
    date: '2020-05-20',
    deps: [79],
    html: {
      de: `
      <p>Nichts auf der Welt ist so schön wie dein Lächeln. Ich könnte es den ganzen Tag anschauen.
      </p>
      
      <p>Schicke mir ein Lächeln. Deine Antwort ist dieses Emoji:
      </p>
      
      <p><img src="/chals/chal37.png" style="max-width: 80px" alt="smily"/></p>
    `,
      en: `
      <p>Nothing in the world is as beautiful as your smile. I could look at it all day.
      </p>
      
      <p>Send me a smile. Your answer is this emoji:
      </p>
      
      <p><img src="/chals/chal37.png" style="max-width: 80px" alt="chal37"/></p>
    `,
    },
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
    title: { de: 'Metadaten', en: 'Metadata' },
    date: '2020-05-20',
    deps: [48],
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
    id: 39,
    pos: { x: 565, y: 955 },
    title: { de: 'Flaggen', en: 'Flags' },
    date: '2020-05-20',
    deps: [50],
    html: {
      de: `
      <p>Flaggen können viele Bedeutungen haben: Es gibt sie für Länder und Gebiete, aber man kann sie auch als Signal und Alphabet nutzen. In der Seefahrt wird dieses Potenzial voll ausgenutzt.
      </p>
      
      <p>Schau dir <a href="/chals/chal39.mp4">dieses Video</a> an. Welches Wort ergeben die Buchstaben der Signalflaggen?
      </p>
    `,
      en: `
      <p>Flags can have many meanings: They exist for countries and territories, but you can also use them as signals and alphabets. This potential is fully exploited in shipping.
      </p>
      
      <p>Watch<a href="/chals/chal39.mp4">this video</a>. What word do the letters of the signal flags make?
      </p>
      
      <small style="margin-top:48px;display:inline-block">Note: The answer is in German, but you don't need to understand it to solve the challenge.
      </small>
    `,
    },
    solution: secrets('chal_39'),
  },

  {
    id: 40,
    pos: { x: 845, y: 725 },
    title: { de: 'Terminal', en: 'Terminal' },
    date: '2020-05-20',
    deps: [81],
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
    id: 41,
    pos: { x: 655, y: 675 },
    title: { de: 'Querlesen', en: 'Cross Reading' },
    date: '2020-05-20',
    deps: [60],
    html: {
      de: `
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
      en: `
       <p>A just a bad poem... or a secret message?
       </p>
       
       <p>
         <!-- noinspection SpellCheckingInspection -->
         <em>
         <strong>T</strong>he hours stretch before the glowing screen.<br>
         <strong>H</strong>uman language is so imprecise.<br>
         <strong>E</strong>verything depends on clarity.<br>
         <strong>A</strong>nd clarity emerges through code's decree.<br>
         <br>
         <strong>N</strong>ow is the moment, a canvas to create,<br>
         <strong>s</strong>culpting worlds in the digital state.<br>
         <strong>W</strong>ith every line, a universe unfurls.<br>
         <strong>E</strong>ager minds contemplate the code's weight.<br>
         <br>
         <strong>R</strong>evealing secrets in each algorithm's dance,<br>
         <strong>i</strong>n the binary, we find our cosmic trance. <br>
         <strong>S</strong>ynchronizing bytes in a digital romance: <br>
         <br>
         <strong>S</strong>eeking clarity, as we advance.<br>
         <strong>T</strong>apping keys, we're bound to transcend,<br>
         <strong>e</strong>levating thought, in this realm we intend,<br>
         <strong>n</strong>urturing ideas, our journey won't end,<br>
         <strong>o</strong>ffline is good, but online is better.
         </em>
       </p>
       
       <small style="margin-top:48px;display:inline-block">Note: This poem may not make sense as it was partly ki generated for the reason that i (the translator) cannot write poetry</small>
    `,
    },
    solution: secrets('chal_41'),
  },

  {
    id: 42,
    pos: { x: 615, y: 745 },
    title: { de: 'Ohrwurm', en: 'Catchy Tune' },
    date: '2020-05-20',
    deps: [60],
    html: {
      de: `
      <p>Wer kennt ihn nicht: Der Wurm, der uns ins Gehör kriegt und uns Tag und Nacht verfolgt?
      </p>
      
      <p>Hier ein Beispiel dafür:
      </p>
      
      <audio src="/chals/chal_42.mp3" controls loop></audio>
      
      <p>Die Frage ist nun: Wie heißt der Song?
      </p>
    `,
      en: `
      <p>Who doesn't know him: the song that gets into our ears and haunts us day and night?
      </p>
      
      <p>Here is an example of this:
      </p>
      
      <audio src="/chals/chal_42.mp3" controls loop></audio>
      
      <p>The question now is: What is the name of the song?
      </p>
    `,
    },
    solution: secrets('chal_42'),
  },

  {
    id: 43,
    pos: { x: 1125, y: 195 },
    title: { de: 'POST it', en: 'POST it' },
    date: '2020-05-20',
    deps: [37, 56],
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
    pos: { x: 1120, y: 355 },
    title: { de: 'Ladebalken II', en: 'Progressbar II' },
    date: '2020-05-20',
    deps: [47],
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
    id: 45,
    pos: { x: 415, y: 1005 },
    title: { de: 'Schriftzeichen', en: 'Characters' },
    date: '2020-05-20',
    deps: [50, 78],
    html: {
      de: `
      <p>Wir leben in einer internationalen Welt und auch Hacker sind in vielen Sprachen unterwegs. Manche Sprachen unterscheiden sich dabei stark von unserer Sprache und stellen uns so vor Herausforderungen. Welche Leckerei verbirgt sich nun hinter folgenden Schriftzeichen?
      </p>
      
      <p><img src="/chals/chal45.png" alt="japanese characters"></p>
    `,
      en: `
      <p>We live in an international world and hackers also speak many languages. Some languages differ greatly from our language and thus present us with challenges. What delicacy is hidden behind the following characters?
      </p>
      
      <p><img src="/chals/chal45.png" alt="schriftzeichen"></p>
    `,
    },
    solution: secrets('chal_45'),
  },

  {
    id: 46,
    pos: { x: 1275, y: 405 },
    title: { de: 'Kopfdaten', en: 'Headers' },
    date: '2020-05-20',
    deps: [43, 48, 62],
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
    id: 47,
    pos: { x: 970, y: 270 },
    title: { de: 'Ladebalken', en: 'Progressbar' },
    date: '2020-05-20',
    deps: [79],
    html: {
      de: `
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
      en: `
      <p>II couldn't sit patiently like you and wait for the answer to load... I'm always impatient and fidgeting on the keyboard.
      </p>
      
      <p>But could it be that this actually makes the loading bar faster?
      </p>
      
      <p>You will receive the answer as soon as the loading bar is full.
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
    },
    solution: secrets('chal_47'),
  },

  {
    id: 48,
    pos: { x: 1111, y: 420 },
    title: { de: 'Stille', en: 'Silence' },
    date: '2020-05-21',
    deps: [28, 47],
    html: {
      de: `
      <p>Zur Ruhe kommen und in sich hineinhören - das brauche ich immer wieder, um mich mit mir selbst zu verbinden und so ausgeglichen sein zu können wie du.
      </p>
      
      <p>Manche Menschen finden es hilfreich, dabei eine akustische Untermalung zu haben.
      </p>
      
      <audio src="/chals/chal48_2.mp3" controls></audio>
      
      <p>Doch du bist nicht alleine. Deine Antwort findet sich zwischen dem Zwischern der Vögel.
      </p>
    `,
      en: `
      <p>Finding peace and listening to yourself - I need that again and again in order to connect with myself and be as balanced as you.
      </p>
      
      <p>Some people find it helpful to have an acoustic background.
      </p>
      
      <audio src="/chals/chal48_2.mp3" controls></audio>
      
      <p>But you are not alone. Your answer can be found among the chirping of the birds.
      </p>
    `,
    },
    solution: secrets('chal_48'),
  },

  {
    id: 49,
    pos: { x: 1015, y: 575 },
    title: { de: 'Spielstand II', en: 'Game Save II' },
    date: '2020-05-21',
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
    title: { de: 'Winkelschrift', en: 'Pigpen Cipher' },
    date: '2020-05-21',
    deps: [53, 58, 60],
    html: {
      de: `
      <p>Was diese winkeligen Zeichen wohl sagen mögen?
      </p>
      
      <p><img src="/chals/chal50.png" alt="winkelschrift"></p>
      
      <p>Zum Glück gibt es folgenden Hinweis:
      </p>
      
      <p><img src="/chals/chal50.gif" alt="winkelschrift hint"></p>
      
      <p>Der erste Buchstabe des Texts wäre damit ein D, der letzte Buchstabe des Texts ein S.
      </p>
    `,
      en: `
      <p>What do these angular signs mean?
      </p>
      
      <p><img src="/chals/chal50-en.png" alt="chal50"></p>
      
      <p>Luckily, there is the following hint:
      </p>
      
      <p><img src="/chals/chal50.gif" alt="chal50"></p>
      
      <p>The first letter of the text would be a T, and the third letter of the text would be an E.
      </p>
    `,
    },
    solution: secrets('chal_50'),
  },

  {
    id: 51,
    pos: { x: 195, y: 405 },
    title: { de: 'Binär', en: 'Binary' },
    date: '2020-08-01',
    deps: [24],
    html: {
      de: `
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
      en: `
      <p>You've probably heard of the binary system. It is the language of computers, which consists of 1s and 0s.
      </p>
      
      <p>Even if you've never worked with it before — with a little logical thinking, you'll quickly get started.
      </p>
      
      <p>To help you, you can see the first six powers of two here. You can turn them on or off when you click on them. All active numbers are added to the result.
      </p>
      
      <p>Enter the number 7 and submit it.
      </p>
      
      <p><svg id="binary"></svg></p>
      
      <p class="d-none"><code>Binary number: <span id="output">0</span></code></p>
      
      <p style="margin-top:32px;" id="submit"><button onclick="submit()">Submit</button></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal51_2.js"></script>
      
      <style>
        .hoverEffect:hover {
          cursor:pointer;
          opacity: 0.9;
        }
      </style>
    `,
    },
    solution: secrets('chal_51'),
    hidesubmit: true,
  },

  {
    id: 52,
    pos: { x: 250, y: 530 },
    title: { de: 'Binär II', en: 'Binary II' },
    date: '2020-08-01',
    deps: [51],
    html: {
      de: `
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
      en: `
      <p>Well done! Now set the number 45.
      </p>
      
      <p><svg id="binary"></svg></p>
      
      <p class="d-none"><code>Binary number: <span id="output">0</span></code></p>
      
      <p style="margin-top:32px;" id="submit"><button onclick="submit()">Submit</button></p>
      
      <script src="/svg.min.js"></script>
      <script src="/chals/chal51_2.js"></script>
      
      <style>
        .hoverEffect:hover {
          cursor:pointer;
          opacity: 0.9;
        }
      </style>
    `,
    },
    solution: secrets('chal_52'),
    hidesubmit: true,
  },

  {
    id: 53,
    pos: { x: 265, y: 725 },
    title: { de: 'Quiz', en: 'Quiz' },
    date: '2020-08-01',
    deps: [29, 52],
    html: {
      de: `
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
        <div class="progress-bar" role="progressbar" style="width: 0;" id="progress"></div>
      </div>
      
      <p id="status"></p>
      
      
      <script src="/chals/chal53.js"></script>
    `,
      en: `
      <p>Someone just ran out of creativity with this quiz.
      </p>
      
      <hr />
      
      <p class="my-4">Click on the X:</p>
      
      <p>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans1">X</button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans2">.</button>
        <button type="button" class="btn btn-secondary mb-2 mr-5" id="ans3">.</button>
      </p>
      
      <div class="progress my-4">
        <div class="progress-bar" role="progressbar" style="width: 0;" id="progress"></div>
      </div>
      
      <p id="status"></p>
      
      
      <script src="/chals/chal53.js"></script>
    `,
    },
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
    title: { de: 'Smiley', en: 'Smiley' },
    date: '2020-08-01',
    deps: [4],
    html: {
      de: `
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
      en: `
          <p>Glad you're here and trying new things. That's always pretty exciting.
          </p>
          
          <p>One such exciting thing is programming. In basic terms, programming works like this: You write a text, and the computer then reacts to it. You can insert and start programs in this text field. An example is already entered.
          </p>
          
          <p><code><textarea rows="10" cols="50" id="code-area">alert('Hello, World!')</textarea></code></p>
          
          <p><button class="btn btn-primary btn-sm" onClick="runCode()">Run</button></p>
          
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
          
          <p>If you paste the following program in the form of a smiley into the text field above and run it, you will see the answer.
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
    },
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
      
      <p><img src="/chals/chal58_2.png" alt="genshin"></p>
      
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
      <p><img src="/chals/chal60.png" style="max-width: 400px; max-height: 400px" alt="qr"></p>
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
      
      <p><img src="/chals/chal62_placeholder.png" style="background:white; max-width: 200px" alt="placeholder"/></p>
      
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
          filename.innerHTML = prompt('Neuer Dateiname:', filename.innerHTML)
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
    
      <p><img src="/chals/chal67.png" style="max-width: 500px" alt="lan kable"></p>
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
      <p><img src="/chals/chal69_1.png" style="border: 1px solid black; max-width: 400px" class="draggable" alt="part 1"></p>
      <p><img src="/chals/chal69_2.png" style="border: 1px solid black; max-width: 400px;" class="draggable" alt="part 2"></p>
      <p><img src="/chals/chal69_3.png" style="border: 1px solid black; max-width: 400px;" class="draggable" alt="part 3"></p>
      <p><img src="/chals/chal69_4.png" style="border: 1px solid black; max-width: 400px;" class="draggable" alt="part 4"></p>
      <p><img src="/chals/chal69_5.png" style="border: 1px solid black; max-width: 400px;" class="draggable" alt="part 5"></p>
      <p><img src="/chals/chal69_6.png" style="border: 1px solid black; max-width: 400px;" class="draggable" alt="part 6"></p>
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
      
      <p><img src="/chals/chal70_2.png" alt="blockly"></p>
      
      <p>Die Antwort ist die Anzahl der gelben Marken, die am Ende liegen.</p>
    `,
    solution: secrets('chal_70'), // link: https://karol.arrrg.de/?id=b5S45y9RF
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
          border: 1px rgb(128,128,128) solid;
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
          parseInt(answer) ===
            App.challenges.data.filter((data) => !data.noScore).length ||
          parseInt(answer) === App.challenges.data.length,
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
              i !== 18 ? ' action="/falsches_Eingabefeld"' : ''
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
    id: 84,
    pos: { x: 395, y: 200 },
    title: 'Inception',
    date: '2023-02-26',
    deps: [4, 5],
    render: ({ req }) => {
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
        
          <img src="/chals/chal84_1.jpg" style="width:100%;margin-bottom:16px" alt="inception">
        
          <p>Im Film Inception werden innerhalb von Träumen wieder Träume geschaffen. Was der Film macht, kann die Informatik auch. Man kann innerhalb einer Webseite eine andere Webseite einbetten.
          </p>
          
          <p>Scrolle dich durch alle Seiten, bis du auf der untersten Ebene angekommen bist. Dort findest du die Antwort.
          </p>
          
          ${renderFrame(1110, 700, 1)}
        `
      }

      const level = parseInt(req.query.level)

      if (level === 1) {
        return `
          <img src="/chals/chal84_2.jpg" style="width:100%;margin-bottom:16px" alt="inception">
          
          <p>Eine Webseite innerhalb einer Webseite. Es geht noch mehr, gehe tiefer:</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
          
          ${renderFrame(1000, 500, 2)}
        `
      }

      if (level === 2) {
        return `
           <img src="/chals/chal84_3.jpg" style="width:100%;margin-bottom:16px" alt="inception">
          
          <p>Die Antwort findest du auf der untersten Stufe.</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
          
          ${renderFrame(900, 400, 3)}
        `
      }

      if (level === 3) {
        return `
          <img src="/chals/chal84_5.jpg" style="width:100%;margin-bottom:16px;" alt="inception">
          
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
            if (lead.textContent.trim().toLowerCase() === 'schau, was ich alles kann!') {
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
      
      <iframe src="https://scratch.mit.edu/projects/829930955/embed" allowtransparency="true" width="485" height="402" allowfullscreen style="border: 0; overflow:hidden;"></iframe>
      
      <p style="margin-top:12px">Dir ist das zu langsam? Schaue in das Projekt hinein: <a href="https://scratch.mit.edu/projects/829930955/editor/" target="_blank">https://scratch.mit.edu/projects/829930955/editor/</a>
      </p>
    `,
    solution: secrets('chal_87'),
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
  ...require('./challenges-after-passage'),
  ...require('./community'),
]
