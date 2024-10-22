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

function calculator(lng = 'de') {
  return `
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

    <p style="margin-top:32px;" id="submit"><button>${
      lng == 'de' ? 'Ergebnis abschicken' : 'Submit result'
    }</button></p>

    <link rel="stylesheet" href="/chals/chal110.css">

    <script src="/chals/chal110.js"></script>
  `
}

function story(name, intro, task) {
  return `
    <style>
      .story-container {
        display: flex;
        justify-content: start;
        flex-direction: column-reverse;
        align-items:end;
        margin-top: -40px;
      }
      .story-content :last-child {
        margin-bottom:0px
      }
      @media (min-width: 768px) {
        .story-container {
          flex-direction: row;
          align-items:start;
          margin-top: 0px;
        }
        .avatar {
          margin-top: -40px
        }
      }
      .avatar {
        margin-left: 48px;
        padding-bottom: 6px;
      }
    </style>

    <div class="story-container">
      <div style="max-width:65ch" class="story-content">
        ${intro}
        ${task ? `<hr><br>` : ''}
      </div>
      <div class="avatar">
        ${
          name
            ? `<img src="/story/${name.toLowerCase()}.jpg" alt="${name} Avatar" style="height:80px;border-radius:9999px;">
        <div style="text-align:center;">${name}</div>`
            : ''
        }
      </div>
    </div>

    ${task ? task : ''}
`
}

const part1 = [
  {
    id: 1,
    pos: { x: 150, y: 140 },
    title: { de: 'Start', en: 'Start' },
    // date: '2017-03-30',
    deps: [],
    render: async ({ req, App }) => {
      if (req.lng === 'en') {
        await App.storage.setItem(
          'visit_english_' + new Date().getTime(),
          req.user.name
        )
      }
      return {
        de: story(
          'Kiwi',
          `
<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #000000; color: white; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index:1000;" id="intro-div">
    <img style="width: 500px; margin-bottom: 60px;" id="image-el" src="/story/intro1.jpg">
    <div style="text-align: center; font-size: 1.2rem; max-width: 80%; margin-bottom: 20px; max-width: 65ch;" id="text-div">
    Es ist das Jahr 2077. Der Umgang mit Technologie ist streng reguliert. Jedes technische Gerät besitzt einen festgelegten Zweck und darf nicht für andere Zwecke verwendet werden. Du baust eine Kaffeemaschine zu einem Wecker um? Dafür drohen viele Jahre Gefängnis.
    </div>
    <button style="margin-bottom: 40px;" class="btn btn-success continue-btn" onclick="continueIntro()" id="button-el">
        Weiter
    </button>
    <button style="position: absolute; bottom: 20px; left: 20px; background-color: transparent; color: #888; border: none; font-size: 0.8rem; cursor: pointer;" onClick="skipIntro()" id="skip-button">
        Intro überspringen
    </button>
</div>


<script src="/powerglitch.min.js"></script>

<script>    
  var slide = 0
  
  PowerGlitch.glitch('#image-el')

  function continueIntro() {
    if (slide == 0) {
      slide++
      document.getElementById('text-div').innerHTML = 'Hacken ist streng verboten - selbst wenn dabei niemanden geschadet wird. Die meisten Menschen sind damit glücklich. Doch es regt sich Widerstand. Die Gruppe Hack The Web und ihre Anführerin Kiwi akzeptieren diesen Einschnitt in die persönliche Freiheit nicht und wollen ein Ende des Technik-Dekrets erwirken.'
      document.getElementById('image-el').src = "/story/intro2.jpg"
      PowerGlitch.glitch('#image-el')
    }
    else if (slide == 1) {
      slide++
      document.getElementById('text-div').innerHTML = 'Dafür braucht die Gruppe kreative HackerInnen - die aber in der Gesellschaft schwer zu finden sind.  In einer riskanten Mission befreit Kiwi dich aus einem Jugend-Gefängnis. Sie sieht in dir großes Potenzial und möchte dich zur HackerIn ausbilden.'
      document.getElementById('image-el').src = "/story/intro3.jpg"
      PowerGlitch.glitch('#image-el')
    }
    else if (slide == 2) {
      slide++
      document.getElementById('text-div').innerHTML = 'Du bist jetzt mittendrin im Abenteuer. Zeig, was du drauf hast!'
      document.getElementById('image-el').src = "/story/intro4.jpg"
      document.getElementById('button-el').innerHTML = "Loslegen"
      document.getElementById('skip-button').style.display = "none"
      PowerGlitch.glitch('#image-el')
    }
    else if (slide == 3) {
      skipIntro()
    }
  }

  function skipIntro() {
    document.getElementById('intro-div').style.display = 'none'
  }
</script>
          
          <p>Pssssh, pssh, es ist alles gut, es ist alles gut …</p>

          <p>Deine Gedanken werden neblig sein. Das ist leider normal nach einer so langen Haft. Es ist traurig wie unsere Gesellschaft mit kreativen jungen Menschen umgeht. Ich kämpfe für eine bessere Zukunft, für eine Zukunft mit weniger Unterdrückung!</p>

          <p>Wir können deine Hilfe gut gebrauchen. Doch es ist deine Entscheidung. Wenn du dich bereit fühlst, dann berechne 6 + 4 · 9 und tippe das Ergebnis in das Eingabefeld ein.</p>
        `
        ),
        en: `
          <p>Welcome to Hack The Web! Here begins your exciting journey through the world of hacking. It will be a journey full of adventures. Challenges from very different areas are waiting for you. You can prove your skills or struggle with them.</p>
    
          <p>Most of the challenges are about finding an answer from the information given. However, this can usually only be found if you look at the task from the right perspective — the perspective of a hacker.</p>

          <p>When working on the challenges, all aids are expressly allowed. You may search the Internet, use a calculator or chatbot, make notes with pen and paper... Feel free and use the tools that help you the most when working on the tasks.</p>
          
          <p>Hack The Web started out as a German project. That's the reason why many answers are German words. I hope you enjoy learning some German along the way :)
          </p>
          
          ${
            req.user.RoomId !== null
              ? `<p>If you have joined a room and are participating in a hacking session: After completing this task, the 30 minutes will start. Within this time, it is your goal to work on as many tasks as possible. Your score for these 30 minutes will be entered into the room's highscore.
          </p>`
              : ''
          }

          <p>Are you ready? Then let's go! The answer to this first challenge is the result of 6 + 4 · 9.</p>
        `,
      }
    },
    solution: secrets('chal_1'),
  },

  {
    id: 2,
    pos: { x: 1245, y: 535 },
    title: { de: 'Finger-Code', en: 'Finger code' },
    // date: '2017-05-17',
    deps: [28, 81],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Ich bin Hackerin aus Notwendigkeit. Es ist mein Weg, mich auszudrücken in dieser Gesellschaft. Sich mitteilen zu können ist ein wichtiges Bedürfnis. Wir Menschen haben uns dafür so viele unterschiedliche Methoden einfallen lassen. Ich finde das inspirierend.</p>

        <p>Finger sind alles, was man zum Sprechen braucht. Deine Antwort findest du in diesen Gesten:</p>
        
        <p><img src="/chals/chal2.gif" alt="fingercode"></p>
        
        <small><a href="https://gebaerdenlernen.ch/fingeralphabet" target="_blank">Quelle</a></small>
      `
      ),
      en: `
         <p>The content of a message is completely independent of its encoding. You can use Latin letters — or your fingers!
         </p>
         
         <p>The answer to this challenge can be found in the following picture:
         </p>
        
        <p><img src="/chals/chal2.gif" alt="fingercode"></p>
        
        <small><a href="https://gebaerdenlernen.ch/woerterbuch" target="_blank">Source</a></small>
      `,
    },
    solution: secrets('chal_2'),
  },

  {
    id: 3,
    pos: { x: 430, y: 1085 },
    title: { de: 'Auf hoher See', en: 'At sea' },
    // date: '2017-05-17',
    deps: [42, 50],
    html: {
      de: story(
        'Josh',
        `
        <p>Wie komfortabel heute die Kommunikation geworden ist! Mit einem Messenger kann man weltweit mühelos Nachrichten versenden und empfangen - da vergisst man leicht, dass noch vor wenigen Jahrzehnten die Situation ganz anders aussah. Damals hatte man, zum Beispiel in der Seefahrt, zur Kommunikation nichts mehr als einen Piepston und das Morse-Alphabet!
        </p>

        <details style="margin-top:16px;margin-bottom:24px;">
          <summary>Morse-Alphabet</summary>
          <table style="border-collapse: collapse; width: 100%; text-align: center;">
            <tr>
              <td style="border: 1px solid black; padding: 4px;">A</td>
              <td style="border: 1px solid black; padding: 4px;">• −</td>
              <td style="border: 1px solid black; padding: 4px;">J</td>
              <td style="border: 1px solid black; padding: 4px;">• − − −</td>
              <td style="border: 1px solid black; padding: 4px;">S</td>
              <td style="border: 1px solid black; padding: 4px;">• • •</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">B</td>
              <td style="border: 1px solid black; padding: 4px;">− • • •</td>
              <td style="border: 1px solid black; padding: 4px;">K</td>
              <td style="border: 1px solid black; padding: 4px;">− • −</td>
              <td style="border: 1px solid black; padding: 4px;">T</td>
              <td style="border: 1px solid black; padding: 4px;">−</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">C</td>
              <td style="border: 1px solid black; padding: 4px;">− • − •</td>
              <td style="border: 1px solid black; padding: 4px;">L</td>
              <td style="border: 1px solid black; padding: 4px;">• − • •</td>
              <td style="border: 1px solid black; padding: 4px;">U</td>
              <td style="border: 1px solid black; padding: 4px;">• • −</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">D</td>
              <td style="border: 1px solid black; padding: 4px;">− • •</td>
              <td style="border: 1px solid black; padding: 4px;">M</td>
              <td style="border: 1px solid black; padding: 4px;">− −</td>
              <td style="border: 1px solid black; padding: 4px;">V</td>
              <td style="border: 1px solid black; padding: 4px;">• • • −</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">E</td>
              <td style="border: 1px solid black; padding: 4px;">•</td>
              <td style="border: 1px solid black; padding: 4px;">N</td>
              <td style="border: 1px solid black; padding: 4px;">− •</td>
              <td style="border: 1px solid black; padding: 4px;">W</td>
              <td style="border: 1px solid black; padding: 4px;">• − −</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">F</td>
              <td style="border: 1px solid black; padding: 4px;">• • − •</td>
              <td style="border: 1px solid black; padding: 4px;">O</td>
              <td style="border: 1px solid black; padding: 4px;">− − −</td>
              <td style="border: 1px solid black; padding: 4px;">X</td>
              <td style="border: 1px solid black; padding: 4px;">− • • −</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">G</td>
              <td style="border: 1px solid black; padding: 4px;">− − •</td>
              <td style="border: 1px solid black; padding: 4px;">P</td>
              <td style="border: 1px solid black; padding: 4px;">• − − •</td>
              <td style="border: 1px solid black; padding: 4px;">Y</td>
              <td style="border: 1px solid black; padding: 4px;">− • − −</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">H</td>
              <td style="border: 1px solid black; padding: 4px;">• • • •</td>
              <td style="border: 1px solid black; padding: 4px;">Q</td>
              <td style="border: 1px solid black; padding: 4px;">− − • −</td>
              <td style="border: 1px solid black; padding: 4px;">Z</td>
              <td style="border: 1px solid black; padding: 4px;">− − • •</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; padding: 4px;">I</td>
              <td style="border: 1px solid black; padding: 4px;">• •</td>
              <td style="border: 1px solid black; padding: 4px;">R</td>
              <td style="border: 1px solid black; padding: 4px;">• − •</td>
              <td style="border: 1px solid black; padding: 4px;"> </td>
              <td style="border: 1px solid black; padding: 4px;"> </td>
            </tr>
          </table>

        </details>
        
        <p>Das sollte für uns kein Hindernis sein. Höre dir dieses Audio-Datei an. Darin findest du die Antwort zu dieser Aufgabe.
        </p>
        
        <audio src="/chals/chal3.wav" controls style="margin-bottom:16px;"></audio>
        
        <p>Dein PC hat keine Lautsprecher? Scanne <a href="/chals/chal3_code.png">diesen QR-Code</a>, um dir <a href ="/chals/chal3.wav">die Datei</a> auf dem Handy anzuhören.</p>
      `
      ),
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
    pos: { x: 260, y: 380 },
    title: { de: 'Codes', en: 'Codes' },
    // date: '2017-05-17',
    deps: [15, 24],
    render: () => {
      function renderTable(col1, col2) {
        return `
         <div class="container" style="margin-top:24px;margin-bottom:24px">
          <div class="row">
            <div class="col">
              <table class="table table-bordered table-hover table-sm table-dark justify-content-between" style="text-align:center;">
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
              <table class="table table-bordered table-hover table-sm table-dark justify-content-between" style="text-align:center;">
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
              <table class="table table-bordered table-hover table-sm table-dark justify-content-between" style="text-align:center;">
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
        de: story(
          'Josh',
          `
          <p>Das Technik-Dekret verbietet uns Menschen, die interne Sprache der Computer zu lernen. Den meisten Menschen ist das egal. Aber für mich geht damit etwas sehr wertvolles verloren.</p>
          
          <p>Mache es dir gemütlich, du lernst jetzt das ABC der Informatik, oder besser das 1-2-3.</p>
          
          <p>Schau dir diese Tabelle an. Du findest Zeichen und links daneben ihre Computer-Codes. Ein Beispiel: Das Dollar-Zeichen hat im Computer den Code 36.</p>

          ${renderTable('Code', 'Zeichen')}
          
          <p>Jetzt bist du dran. Deine Antwort in Codes lautet:</p>
          
          <p>35 &nbsp; 115 &nbsp; 116 &nbsp; 97 &nbsp; 98 &nbsp; 105 &nbsp; 108
          </p>
        `
        ),
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
    // date: '2017-05-17',
    deps: [1],
    html: {
      de: story(
        'Kiwi',
        `
          <p>Komm, ich möchte dir was zeigen.</p>

          <p>Siehst du: Eine Zitrone ist eine Frucht, die man als Zutat in einer Speise verwendet. Das ist ihr vorgesehener Zweck. Doch kreative Menschen haben festgestellt, dass man mit Zitronensaft geheime Nachrichten verfassen kann: Schreibe mit dem Saft einen Text. Auf dem ersten Blick ist der Text für das Auge nicht erkennbar. Doch sobald man das Papier über einer Flamme erhitzt, färbt sich der Zitronensaft und die Nachricht wird sichtbar.</p>

          <p>Das ganze funktioniert auch digital. Unten findest du ein "präpariertes" Blatt Papier. Finde die Antwort.</p>
        `,
        `
          <p>--- Hier fängt das Blatt an ---</p>
        
          <p><br><span style="color:#222222;padding-left:150px">Hier ist nichts.</span><br><br><span style="color:#222222">Lalala, das Wetter ist schön</span><br><br><br><br><span style="color:#222222;padding-left:400px">Die Antwort lautet: ${secrets(
            'chal_5'
          )}</span><br><br>
          </p>
          
          <p>--- Hier endet das Blatt ---</p>
        `
      ),
      en: `
        <p>This challenge here works like writing with lemon juice: You take a fountain pen and dip it in the juice of a freshly squeezed lemon. With it, you write your secret message on a white sheet of paper. Because the juice is transparent, you write "white on white" and another person cannot read the message. The person who receives the message holds the paper over a flame. The heat colors the lemon juice and the message becomes visible.
        </p>
        
        <p>The whole thing also works digitally. Below you will find a "prepared" sheet of paper with the answer:
        </p>
        
        <br>
        
        <p>--- Here starts the sheet ---</p>
        
        <p><br><span style="color:#222222;padding-left:150px">Here is nothing.</span><br><br><span style="color:#222222">Lalala, the weather is beautiful.</span><br><br><br><br><span style="color:#222222;padding-left:400px">The answer is: ${secrets(
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
    pos: { x: 111, y: 400 },
    title: { de: 'HTML', en: 'HTML' },
    // date: '2017-05-17',
    deps: [24],
    html: {
      de: story(
        'Josh',
        `
        <p>Höre mir gut zu. Ich zeige dir jetzt eine der wichtigsten Techniken, die du als HackerIn beherrschen solltest.</p>

        <p>Wenn du dir eine Website am Computer anschaust, dann siehst du nur einen kleinen Teil der Website. Hinter den Kulissen versteckt sich eine ganze Welt voller Technik. Wie die Noten zu einem Musikstück oder das Drehbuch zu einem Film, gibt es auch den Quelltext zu einer Website.</p>

        <p>Dieser Quelltext enthält viele Informationen - und Wissen ist Macht. Doch die Informationen können dich auch von der Menge her überfordern.</p>

        <p>Ich biete dir einen Orientierungspunkt. Diesen Kasten wirst du im Quelltext wiederfinden. Innerhalb von diesem Kasten ist deine Antwort versteckt.</p>
        
        <pre>
        
        __________________________________________
        |                                        |
        |<!-- Die Antwort lautet ${secrets(
          'chal_6'
        )}. -->                                        |
        |________________________________________|
        
        </pre>

        <p>Bist du bereit? Dann klicke auf diese Schaltfläche, um den Quelltext dieser Seite zu sehen. Scrolle dort nach unten, um den Kasten zu finden.</p>
        
        <p><button onclick="transform()" class="btn btn-sm btn-primary" style="margin-bottom:24px;">Quelltext anzeigen</button></p>

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
    `
      ),
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
    pos: { x: 130, y: 550 },
    title: { en: 'HTML II', de: 'HTML II' },
    // date: '2017-05-17',
    deps: [6],
    html: {
      de: story(
        'Josh',
        `
        <p>Du machst gute Fortschritte. Jetzt bist du bereit, auch selbstständig den Quelltext der Seite zu öffnen und dich dort zurechtzufinden.</p>

        <p>In den meisten Browser findest du im Kontextmenü (Rechts-Klick) die passende Schaltfläche (<a href="/chals/chal7_hint1.png" target="_blank">Beispiel 1</a> / <a href="/chals/chal7_hint2.png" target="_blank">Beispiel 2</a>). Im Safari geht das über einen <a href="https://www.heise.de/tipps-tricks/Safari-Quelltext-anzeigen-4638280.html" target="_blank">kleinen Umweg</a>. Browser haben sich in den letzten 50 Jahren kaum verändert :)</p> 

        <p>Die Antwort befindet sich direkt unter dieser Zeile ...
        </p>
        
        <!-- ... und lautet ${secrets('chal_7')}. -->
    `
      ),
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
    pos: { x: 720, y: 420 },
    title: { de: 'Fleißaufgabe', en: 'Hard work' },
    // date: '2017-05-17',
    deps: [55, 114],
    html: {
      de: story(
        'Josh',
        `
        <p>Es gibt Menschen, die gut Kopfrechnen können - und es gibt mich: Jemand, der mehr Spaß daran hat, Muster zu finden und mit denen zu spielen. Kurz gesagt: Ich bin sehr langsam im Kopfrechnen, mir macht Mathe trotzdem Spaß.</p>

        <p>Schauen wir uns die Rechnung 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 = ? an.</p>

        <p>Und ich denke: Hey, die 1 und die 9 passen doch gut zusammen! Und die 3 und die 7 sind auch ein gutes Paar ... so könnte ich die ganze Zeit weitermachen ...</p>

        <p>Sei du produktiver. Das Ergebnis der Rechnung ist deine Antwort.</p>
    `
      ),
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
    pos: { x: 890, y: 370 },
    title: { de: 'Fleißaufgabe II', en: 'Hard work II' },
    // date: '2017-05-17',
    deps: [8],
    html: {
      de: story(
        'Josh',
        `
        <p>Es gibt gewöhnliche Muster - und es gibt Zahlen, die einfach nur zusammengehören, wie die 1 und die 99, selbst wenn sie an zwei verschiedenen Enden der Rechnung stehen.</p>

        <p>Mit einem Blick für Muster hast du 1 + 2 + 3 + 4 + 5 + 95 + 96 + 97 + 98 + 99 schnell berechnet.</p>
    `
      ),
      en: `
      <p>You are not only good at mental math but also skilled in pattern recognition. With a bit of skill, you can save a lot of work.</p>

      <p>Your answer is the result of 1 + 2 + 3 + 4 + 5 + 95 + 96 + 97 + 98 + 99.</p>
    `,
    },
    solution: secrets('chal_9'),
  },

  {
    id: 10,
    pos: { x: 990, y: 440 },
    title: { de: 'Fleißaufgabe III', en: 'Hard work III' },
    // date: '2017-05-18',
    deps: [9],
    html: {
      de: story(
        'Josh',
        `
        <p>Es ist am Ende dir überlassen, wie du rechnest, sei es im Kopf, mit dem Computer oder durch geschicktes Zusammenfassen. Am Ende zählt das Ergebnis und jeder Weg dahin hat einen Sinn.</p>
        
        <p>Berechne das Ergebnis von 1 + 2 + 3 + ... + 97 + 98 + 99 + 100.
        </p>
    `
      ),
      en: `
      <p>Mental math genius, skilled - and with a good imagination. With that, you solve complex problems in an elegant manner.</p>

      <p>This time, calculate the result of 1 + 2 + 3 + ... + 98 + 99 + 100.</p>
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
    pos: { x: 270, y: 220 },
    title: { de: 'Benutzername', en: 'Username' },
    // date: '2017-05-18',
    deps: [1],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Die Menschen heute haben verlernt, auf neue, unbekannte Situationen zu reagieren. Wenn etwas nicht so funktioniert, wie sie es erwarten, dann geben sie schnell auf.</p>

        <p>Die Antwort auf diese Aufgabe ist dein Benutzername. Ganz einfach erstmal. Doch eine kleine Sache wird verändert. Kommst du damit klar?</p>
      `
      ),
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
    pos: { x: 340, y: 320 },
    title: { de: 'Punktzahl', en: 'Score' },
    // date: '2017-05-18',
    deps: [15, 24],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Haben dir Bex und Josh schon was gezeigt? Ich hab den beiden gesagt, sie sollen auch ihr Wissen weitergeben. Man kann von jedem Mensch was Neues lernen.</p>

        <p>Die Antwort auf diese Aufgabe ist deine aktuelle Punktzahl. Ähnlich wie zuvor gerät deine Eingabe etwas durcheinander.</p>
    `
      ),
      en: `
      <p>The answer to this task is your current score. Similar to before, your input is a bit jumbled.</p>
    `,
    },
    check: (answer, { req }) => {
      const normalizedAnswer = answer.replace(/[‐−–—]/, '-')
      const input = -parseInt(normalizedAnswer)
      return {
        answer: isNaN(input) ? answer : input.toString(),
        correct: input === req.user.score,
      }
    },
  },

  {
    id: 17,
    pos: { x: 745, y: 310 },
    title: { de: 'Slogan', en: 'Slogan' },
    // date: '2017-05-18',
    deps: [55, 66, 114],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich wollte Kiwi vorschlagen, dass wir uns als Gruppe einen Slogan zulegen. Mein Vorschlag ist &quot;Beweise dein Können!&quot;, weil mich das am meisten mit Hack The Web verbindet. Kiwi ist davon noch nicht ganz überzeugt, sie meint das wäre zu wenig politisch oder so ...</p>

        <p>Hey, hast du mir überhaupt zugehört? Deine Antwort ist mein Vorschlag für einen Slogan. Bei der Eingabe gerät aber etwas durcheinander.</p>
    `
      ),
      en: `
      <p>The answer is the slogan of Hack The Web. Your input is jumbled again.</p>
    `,
    },
    check: (answer, { req }) => {
      const text =
        req.lng == 'de' ? 'Beweise dein Können!' : 'Prove your skill.'
      const input = answer
        .replace(/[^a-zA-ZäöüÄÖÜß ]/g, '')
        .trim()
        .split(' ')
      input.reverse()
      const str = input.join(' ').toLowerCase()
      return {
        answer: str,
        correct: str === text.replace(/[^a-zA-ZäüöÄÜÖß ]/g, '').toLowerCase(),
      }
    },
  },

  {
    id: 18,
    pos: { x: 930, y: 520 },
    title: { de: 'Verschiebung', en: 'ROT13' },
    // date: '2017-05-18',
    deps: [8, 77],
    html: {
      de: story(
        'Josh',
        `
        <p>Was ich dir hier zeige, ist schon Jahrtausende alt. Es ist eine Verschlüsslung aus einer Zeit, wo es keine Computer oder ähnliche Maschinen gab. Lesen und Schreiben war nur einer kleinen Gruppe vorbehalten. Schriftliche Texte waren an sich schon eine Geheimsprache.</p>
        
        <p>Doch selbst dann wollte man vielleicht eine Nachricht im Geheimen übermitteln. Eine pragmatische Lösung bestand darin, die Buchstaben im Alphabet zu verschieben. Es ist eine Verschlüsslung, die für die damalige Zeit ausgereicht hat. Mit dem Blick von heute bietet sie keine ernsthafte Sicherheit mehr.</p>

        <p>Überzeuge dich selbst und entschlüssle die Nachricht. Ziehe den Slider, um die Buchstaben im Alphabet zu verschieben.</p>
        `,
        `
        <p style="word-wrap:break-word" class="my-4" id="cipher">
        </p>

        <p>Verschiebung: <span id="display">0</span></p>
        
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
            document.getElementById('display').innerHTML = slider.value
          }
          
          change()
          
          
        </script>
    `
      ),
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
    pos: { x: 350, y: 665 },
    title: { de: 'Fingerzeig', en: 'Helping hand' },
    // date: '2017-08-25',
    deps: [51, 80],
    html: {
      de: story(
        'Bex',
        `
        <p>Es ist kein Problem, um Hilfe zu bitten. Wir alle kommen irgendwann mal nicht weiter. Ich habe paar harte Jahre gebraucht, das zu lernen.</p>

        <p>Falls wir mal nicht erreichbar, kannst du auf dem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> von Hack The Web Fragen stellen und dir Tipps zu den Aufgaben holen.</p>

        <p>So sieht das Forum aus. In diesem Screenshot findest du die Antwort zu dieser Aufgabe.</p>

        <a href="/chals/21.png" target="_blank"><img src="/chals/21.png" width="500px" style="margin-top:12px;margin-bottom:24px;"/></a>

        <p>Du bist herzlich einladen, dem Server beizutreten!</p>

        <p>
        <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 200px;" alt="discord"></a>
        </p>
    `
      ),
      en: `
       <p>
           It is super cool to have helpful people like you. It makes everyday life so much more pleasant when you don't know the way or forget your wallet at the checkout :)
       </p>
       
       <p> At the same time, it is no problem to ask for help. We all have times when we need help.
       </p>
       
       <p>
       <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 300px;" alt="discord"></a>
       </p>
     
       <p>On the <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> of Hack the Web, you have the possibility to find hints or ask questions yourself. Click on the logo to join the server. In the German forum you will find a post with the title "Fingerzeig". There you will find your answer.
       </p>
       
       <p>
         Note: Hack the Web is a German website, which is why the Discord server is in German. Please write only in German on the server except the channels labeled as english (e.g., forum-en or general-en). But with the help of a translator, you should be able to find the answer anyway ;)
       </p>

       <p style="margin-top:24px;font-size:10px;color:darkgray">It's completely not a problem if you don't have a Discord account or don't want to register on Discord. In this case, you can find the answer <a href="/chals/21.png">here</a>.</p>
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
    pos: { x: 650, y: 660 },
    title: { de: 'Einhorn', en: 'Unicorn' },
    // date: '2017-08-25',
    deps: [51, 69],
    html: {
      de: story(
        'Josh',
        `
        <p>Früher wurde Mathematik viel mehr unterrichtet. Einige sind darin richtig aufgeblüht, für andere war das eher eine lästige Pflicht. Aus dieser Zeit stammt auch ein altes Projekt, das eine Freundin von mir entwickelt hat.</p>
        
        <p>Es heißt <a href="https://einhorn.arrrg.de/" target="_blank">Einhorn der Mathematik</a>. Schaue da mal rein. </p>

        <p><img src="https://einhorn.arrrg.de/einhorn.png" alt="Einhorn" width="150px"></p>

        <p>In der Hauptrolle spielt ein Einhorn-Geschwisterpaar. Deine Antwort ist der Name des kleinen Bruders.</p>
    `
      ),
      en: `
      <p>The <a href="https://einhorn.arrrg.de/" target="_blank">Unicorn of Mathematics</a> is a project similar to Hack The Web, but for mathematics. The main characters are a pair of unicorn siblings.</p>

      <p><img src="https://einhorn.arrrg.de/einhorn.png" alt="Unicorn" width="150px"></p>

      <p>Visit the website. Your answer is the name of the little brother. The website is currently only available in German, but you can of course use a translator.</p>

    `,
    },
    solution: secrets('chal_23'),
  },

  {
    id: 24,
    pos: { x: 140, y: 280 },
    title: { de: 'Nicht blinzeln', en: "Don't blink" },
    // date: '2017-08-25',
    deps: [1],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Weißt du, wenn du die Ausbildung bei uns nicht machen willst, ist das kein Problem. Wir können dich in dein altes Leben zurückbringen, Freispruch vor Gericht, eine leere Akte, ein Neubeginn. Hier können wir dir keine Sicherheit oder Ansehen bieten - dafür aber so manche Abenteuer.</p>

        <p>Ich habe dir etwas mitgebracht. Es ist ein Text, der beim Laden der Seite kurz erscheint und dann verschwindet. Sei kreativ und suche nach einer Methode, den Text zu lesen. Du darfst alle Werkzeuge nutzen, die dir bei diese Abentuer weiterhelfen könnten: Dein scharfer Blick, dein Handy, Programme am Computer, etc...</p>
        `,
        `
        <p id="poper">Achtung, nicht blinzeln!
        </p>
        
        <script>
          setTimeout(function(){
            document.getElementById("poper").innerHTML = "Die Antwort auf diese Aufgabe lautet ${secrets(
              'chal_24'
            )}"
            setTimeout(function(){
              document.getElementById("poper").innerHTML = 'Das ging schnell, <a href="" click="function(){location.reload()}">erneut versuchen</a>'
            }, 300)
          }, 1500)
        </script>
        `
      ),
      en: `
        <p id="poper">Don't blink!</p>
        </p>
        
        <script>
          setTimeout(function(){
            document.getElementById("poper").innerHTML = "The answer is ${secrets(
              'chal_24'
            )}"
            setTimeout(function(){
              document.getElementById("poper").innerHTML = "Oh. This was fast."
            }, 300)
          }, 1500)
        </script>
      `,
    },
    solution: secrets('chal_24'),
  },

  {
    id: 25,
    pos: { x: 535, y: 1045 },
    title: { de: 'Russische Puppen', en: 'Russian dolls' },
    // date: '2017-08-25',
    deps: [42, 50],
    html: {
      de: story(
        'Bex',
        `
        <p>Wenn man eine Datei zipt, dann wird sie kleiner und braucht weniger Speicherplatz. Wenn man eine Zip-Datei nochmal zipt, wird sie dann noch kleiner?
        </p>
        
        <p>Warum nicht ausprobieren? Ich habe die Antwort mal ordentlich gezipt: Hier ist die <a href="/chals/antwort25.zip">Datei</a>. Darin findet sich die Lösung zu dieser Aufgabe. Und nein, mehrfaches Zippen bringt nichts und macht die Datei sogar größer.
        </p>
      `
      ),
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
    pos: { x: 555, y: 925 },
    title: { de: 'Zeitmaschine', en: 'Time machine' },
    // date: '2017-08-26',
    deps: [30, 78],
    html: {
      de: story(
        'Bex',
        `
        <p>Josh meinte, Hacker gab es schon, seitdem das Internet erfunden wurde. Ich habe ihm das nicht geglaubt. Doch als ich in den Archiven gesucht habe, bin ich auf interessante Seiten gestoßen.</p>
        
        <p>Hier ist eine Website vom <a href="https://web.archive.org/web/19961218220409/http://hacker.org/" target="_blank">18. Dezember 1996</a>. Ich muss sagen, sie ist ... speziell. Ich verstehe vielleicht einen Bruchteil der Abkürzungen, doch ich bin erleichtert, dass auch die Hacker damals nicht perfekt waren in englischer Rechtschreibung :)</p>

        <p>Im Begrüßungstext (&quot;Hi every one ...&quot;) gibt es vier fehlerhaft geschriebene Worte. Nutze eines davon deiner Wahl in der fehlerhaften Form als deine Antwort.</p>
        `,
        `
        <iframe src="https://web.archive.org/web/19961218220409/http://hacker.org/" style="width:100%;height:800px;"></iframe>
    `
      ),
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
      
      <p>Your answer is any one of the misspelled words in the greeting text.
      </p>
    `,
    },
    solution: secrets('chal_26').split(','),
  },

  {
    id: 27,
    pos: { x: 1085, y: 905 },
    title: { de: 'Fingerspitzengefühl', en: 'Tactility' },
    // date: '2017-08-26',
    deps: [45, 47, 48, 87],
    html: {
      de: story(
        'Josh',
        `
        <p>Ich werde alt, daran kann keine Technik was verändern. Kein Grund zu verzweifeln. Ich mache, was ich kann. Vor Kurzem habe ich angefangen, die Blindenschrift zu lernen. Das hält meine grauen Zellen auf Trapp.</p>

        <details style="margin-top:24px;margin-bottom:24px">
          <summary>Deutsche Blindenschrift</summary>
          <p style="margin-top:8px"><img src="/chals/27.png" /></p>
          <p style="margin-top:-12px"><small>Quelle: fakoo.de</small></p>
        </details>
        
        <p>Taste vorsichtig über das Feld und lies die Antwort ab:
        </p>
        
        <p><svg id="chal27"></svg></p>
        
        <script src="/svg.min.js"></script>
        <script src="/chals/chal27.js"></script>
    `
      ),
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
    pos: { x: 1105, y: 475 },
    title: { de: 'Werbung', en: 'Ads' },
    // date: '2017-08-26',
    deps: [18, 58],
    html: {
      de: story(
        'Josh',
        `
        <p>Werbung hat eine große Macht auf uns. Durch die konstante Ablenkung wird unsere Aufmerksamkeit manipuliert. Aber wird sind nicht hilflos! Im Browser haben wir die Möglichkeit, gegen Werbung vorzugehen und diese zu blockieren.</p>

        <p>Das geht auch per Hand. Schaue dir diese Seite an. Eine Werbung verdeckt die Aufgabe. Du kannst den Inspektor des Browsers öffnen (meist F12) und das störende Element entfernen. Falls das nicht verfügbar ist: <a href="#" onclick="(function () { const script=document.createElement('script');script.src='/webxray/webxray.js';script.className='webxray';script.setAttribute('data-lang','en-US');script.setAttribute('data-baseuri',document.location.origin + '/webxray');document.body.appendChild(script);}())">die Alternative "X-Ray" laden</a>.</p>
        `,
        `
        <div style="position:absolute;width:1000px;height:1000px;background-color:green;padding-left:16px;" id="banner">
          <span style="font-size:100px;" id="text">Hacken gefährdet unsere Sicherheit! Halten Sie sich an das Technik-Dekret!</span>
          <div style="margin-top:20px; border: 2px solid black; width: 350px; margin-left: 40px; cursor: pointer; padding: 8px" id="skipp">Überspringe die Werbung in <span id="counter">4568</span> Sekunden ...</div>
        </div>
        
        <p>Die Antwort zu dieser Aufgabe lautet <span id="solution"></span>.
        </p>
        
        <script src="/chals/chal28.js"></script>
        <!--suppress JSDeprecatedSymbols -->
        <script>document.getElementById("solution").innerHTML = atob("TGl0ZmHfc+R1bGU=")</script>
     `
      ),
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
    pos: { x: 635, y: 865 },
    title: { de: 'GPS-Code', en: 'GPS code' },
    // date: '2017-08-26',
    deps: [30, 78],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich würde gerne mehr Orte sehen. Als Teil einer Widerstandsgruppe müssen wir leider sehr aufpassen und vermeiden viele Gebiete.</p>

        <p>Für diese Aufgabe habe ich ein paar GPS-Koordinaten herausgesucht. Die Anfangsbuchstaben dieser deutschen Orte ergeben deine Antwort. Das hat leider mein Fernweh nur noch verschlimmert ...</p>
        
        <p>
          52.7073, 8.5031<br>
          48.63253, 12.85515<br>
          50.9761, 8.8677<br>
          53.2724, 12.824<br>
          48.0336, 7.7649<br>
          49.59637, 11.11833<br>
          53.679, 10.6947
        </p>
      `
      ),
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
    pos: { x: 375, y: 840 },
    title: { de: 'UNIX Zeitstempel', en: 'UNIX timestamp' },
    // date: '2017-08-26',
    deps: [21, 63],
    html: {
      de: story(
        'Josh',
        `
        <p>Die meisten Computerprogramme speichern Zeitpunkte nicht als Datum. Stattdessen werden sie eine einzelne Zahl. Wenn man das System dafür kennt - in diesem Fall <a href="https://en.wikipedia.org/wiki/Unix_time" target="_blank">UNIX</a> - kann man das Datum wieder zurückrechnen.</p>
        
        <p>Mein Geburtstag war zum Zeitpunkt 1417499338. In welchem Jahr bin ich geboren?</p>
    `
      ),
      en: `
      <p>In which year is the point in time 1417499338?
      </p>
    `,
    },
    solution: secrets('chal_30'),
  },

  {
    id: 31,
    pos: { x: 780, y: 95 },
    title: { de: 'Röhre', en: 'Tube' },
    // date: '2017-08-26',
    deps: [111],
    html: {
      de: story(
        'Josh',
        `
        <p>Bex hat eine schwere Zeit hinter sind - verzeih ihm, wenn er manchmal etwas ... aufgedreht ist. Er hat ein gutes Herz.</p>

        <p>Aber erstmal zurück zum Taschenrechner. Ich möchte dir auch eine Variante zeigen. Und diese funktioniert mit einer Röhre:</p>
        
        <br>
        
        <p id="op-buttons"></p>
        <p id="num-buttons"></p>
        <p><svg id="stack"></svg></p>
        
        <script src="/svg.min.js"></script>
        <script src="/chals/chal31.js"></script>
        
        <br>
        
        <p>Die Röhre ist rechts offen. Mit den Zahlentasten kannst du einzelne Zahlen in diese Röhre schieben.
        </p>
        
        <p>Dazu gibt es die vier Grundrechenarten. Bei diesen Tasten werden die zwei Zahlen ganz rechts aus der Röhre herausgeholt und miteinander addiert, subtrahiert, multipliziert oder dividert. Probiere das aus und sieh, was passiert!
        </p>
        
        <p>Es gibt zwei Sonderbefehle: <strong>drop</strong> entfernt die letzte Zahl aus der Röhre (also die Zahl ganz rechts), <strong>dup</strong> fügt die letzte Zahl noch einmal hinzu (duplizieren).
        </p>
        
        <p>Berechne das Ergebnis 1000 und klicke submit:
        </p>
        
        <p><img src="/chals/chal31_result.png" style="max-width: 400px" alt="1000"></p>
    `
      ),
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
    pos: { x: 930, y: 77 },
    title: { de: 'Röhre II', en: 'Tube II' },
    // date: '2017-08-26',
    deps: [31],
    html: {
      de: story(
        'Josh',
        `
        <p>Berechne die Zahl 1337.
        </p>
        
        <br>

        <p id="op-buttons"></p>
        <p id="num-buttons"></p>
        <p><svg id="stack"></svg></p>
        
        <script src="/svg.min.js"></script>
        <script src="/chals/chal31.js"></script>
    `
      ),
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
    pos: { x: 1070, y: 100 },
    title: { de: 'Röhre III', en: 'Tube III' },
    // date: '2017-08-26',
    deps: [32],
    html: {
      de: story(
        'Josh',
        `
        <p>Berechne die Zahl 100. Allerdings fehlen ein paar Tasten.
        </p>
        
        <br>

        <p id="op-buttons"></p>
        <p id="num-buttons"></p>
        <p><svg id="stack"></svg></p>
        
        <script src="/svg.min.js"></script>
        <script src="/chals/chal33.js"></script>
    `
      ),
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
    id: 37,
    pos: { x: 935, y: 185 },
    title: { de: 'Emoji', en: 'Emoji' },
    // date: '2020-05-20',
    deps: [17, 31, 53],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich mag Emojis. Selbst wenn ich mal nicht gut drauf bin, kann ich Menschen ein Lächeln schicken. Ich finde das ziemlich praktisch.</p>
        
        <p>Schicke mir ein Lächeln. Deine Antwort ist dieses Emoji:
        </p>
        
        <p><img src="/chals/chal37.png" style="max-width: 80px" alt="smily"/></p>
    `
      ),
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
    id: 39,
    pos: { x: 1305, y: 365 },
    title: { de: 'Flaggen', en: 'Flags' },
    // date: '2020-05-20',
    deps: [81],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Flaggen können viele Bedeutungen haben: Es gibt sie für Länder und Gebiete, aber man kann sie auch als Signal und Alphabet nutzen. Das ist praktisch, wenn man ganz unauffällig eine Nachricht übermitteln möchte. Viele kennen das <a href="https://de.wikipedia.org/wiki/Flaggenalphabet" target="_blank">Flaggenalphabet</a> aus der Seefahrt nicht.
        </p>
        
        <p>Schau dir <a href="/chals/chal39.mp4">dieses Video</a> an. Finde die Antwort.
        </p>
    `
      ),
      en: `
      <p>Flags can have many meanings: They exist for countries and territories, but you can also use them as signals and alphabets. This potential is fully exploited in shipping.
      </p>
      
      <p>Watch <a href="/chals/chal39.mp4">this video</a>. What word do the letters of the signal flags make?
      </p>
      
      <small style="margin-top:48px;display:inline-block">Note: The answer is in German, but you don't need to understand it to solve the challenge.
      </small>
    `,
    },
    solution: secrets('chal_39'),
  },

  {
    id: 41,
    pos: { x: 1305, y: 725 },
    title: { de: 'Querlesen', en: 'Cross Reading' },
    // date: '2020-05-20',
    deps: [2, 47, 79],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Ich habe eine gewisse Schwäche für schnulzige Gedichte. Aber lasse dich davon nicht täuschen! Wenn du jemals ein solches Gedicht von mir erhältst, solltest du immer deine Augen für geheime Botschaften offen halten.
        </p>`,
        `<p><em>
          <strong>D</strong>u fragst mich: Bin ich glücklich?<br>
          <strong>I</strong>mmer auf der Hut, auf Mission,<br>
          <strong>e</strong>in kleiner Fehler und alles ist vorbei -<br>
          <strong>a</strong>m Ende doch vergebens?<br>
          <br>
          <strong>N</strong>ein, es ist nicht vergebens.<br>
          <strong>T</strong>aten sprechen für sich.<br>
          <strong>W</strong>er seinem Herzen folgt wird<br>
          <strong>o</strong>hne Zweifel ein Leuchtturm sein.<br>
          <br>
          <strong>R</strong>uhe ich auch mal? - fragst du mich.<br>
          <strong>T</strong>ag für Tag bin ich unterwegs.<br>
          <strong>L</strong>ache nur noch selten diese Jahre,<br>
          <strong>a</strong>lles ist so kalt geworden.<br>
          <br>
          <strong>U</strong>nd du hast Recht, es ist<br>
          <strong>t</strong>rostlos manchmal, fast verzweifelnd vor<br>
          <strong>e</strong>iner so großeren Herausforderung zu stehen:<br>
          <strong>T</strong>rostlos und erschreckend<br>
          <br>
          <strong>S</strong>chön doch hier zu sein bei dir, wir<br>
          <strong>t</strong>rotzen dem gemeinsam,<br>
          <strong>e</strong>ine kleine Familie, hier die<br>
          <strong>n</strong>iemand erwartet, die uns verbindet.<br>
          <strong>O</strong>h, ich frage mich: Ist das schon Glück?<br>
        </em></p>
    `
      ),
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
    pos: { x: 300, y: 965 },
    title: { de: 'Ohrwurm', en: 'Catchy Tune' },
    // date: '2020-05-20',
    deps: [70],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich habe seit ein paar Tagen diesen Ohrwurm. Ich weiß nicht woher er kommt, doch irgendwie erinnert mich dieser Song an meine Vergangenheit.</p>
        
        <audio src="/chals/chal_42.mp3" controls loop style="margin-bottom:12px;"></audio>
        
        <p>Bitte schaue nach und sage mir den Titel des Songs. Ich traue mich nicht, es selbst zu tun.
        </p>
    `
      ),
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
    id: 45,
    pos: { x: 900, y: 905 },
    title: { de: 'Schriftzeichen', en: 'Characters' },
    // date: '2020-05-20',
    deps: [56, 59, 60, 62],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Wir leben in einer internationalen Welt und auch Hacker sind in vielen Sprachen unterwegs. Manche Sprachen unterscheiden sich dabei stark von unserer Sprache und stellen uns so vor Herausforderungen. Welche Leckerei verbirgt sich hinter folgenden Schriftzeichen?
        </p>
        
        <p><img src="/chals/chal45.png" alt="japanese characters"></p>
    `
      ),
      en: `
      <p>We live in an international world and hackers also speak many languages. Some languages differ greatly from our language and thus present us with challenges. What delicacy is hidden behind the following characters?
      </p>
      
      <p><img src="/chals/chal45.png" alt="schriftzeichen"></p>
    `,
    },
    solution: secrets('chal_45'),
  },

  {
    id: 47,
    pos: { x: 1060, y: 690 },
    title: { de: 'Ladebalken', en: 'Progressbar' },
    // date: '2020-05-20',
    deps: [18, 60, 84],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich verrate dir eine kleine peinliche Geschichte von mir. Erzähle sie ja nicht weiter!</p>

        <p>Aus irgendeinem Grund glaubte ich lange Zeit, dass Ladebalken am Computer schneller laufen, wenn ich auf der Tastatur tippe. Das machte ich also jedes Mal, während ich auf etwas wartete. Einmal fragte mich Kiwi, was ich denn da mache und ich erzählte ihr den Grund. Sie lachte mich einfach aus und mein Kopf lief total rot an als ich meinen Aberglauben bemerkte.</p>

        <p>Um mich besser zu fühlen programmierte ich dann einen Ladebalken, der tatsächlich schneller läuft wenn man auf Tasten drückt. An dem darfst du dich jetzt ausprobieren. Sobald der Balken voll ist, erhältst du deine Antwort.</p>
        `,
        `
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
              if (step == steps) {
                value.innerHTML = 'Die Antwortet lautet: ' + value.innerHTML
              }
              status.innerHTML = '(' + step + '/' + steps + ')'
              if (!noTimeout) {
                setTimeout(work, 1000)
              }
            }
          }
          
          window.onkeydown = (e) => {
            if (e.repeat) return
            work(true)
          }
          
          value.innerHTML = x
          status.innerHTML = '(1/' + steps + ')'
          
          setTimeout(work, 1000)
        </script>
    `
      ),
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
    pos: { x: 890, y: 1000 },
    title: { de: 'Meditation', en: 'Silence' },
    // date: '2020-05-21',
    deps: [56, 62],
    html: {
      de: story(
        'Bex',
        `
        <p>Komm zur Ruhe und höre in dich hinein. Verbinde dich mit dir selbst und sei ausgeglichen ...</p>

        <p>Haha, kleiner Spaß. Ich bin die letzte Person auf dieser Welt, die meditieren würde. Was ich viel lieber mache ist es, Menschen zu erschrecken. Ich habe in diesem Meditationstrack eine kleine Überraschung vorbereitet. Diese ist deine Antwort.</p>
        
        <audio src="/chals/chal48_2.mp3" controls></audio>
    `
      ),
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
    id: 50,
    pos: { x: 425, y: 935 },
    title: { de: 'Winkelschrift', en: 'Pigpen Cipher' },
    // date: '2020-05-21',
    deps: [30, 70],
    html: {
      de: story(
        'Josh',
        `
        <p>Ich schmeiße dich ins kalte Wasser. Mach dich einmal mit dieser Anleitung vertraut. Du siehst die Buchstaben des Alphabets an verschiedenen Orten untergebracht, mal mit Punkt und mal ohne Punkte.</p>

        <p><img src="/chals/chal50.gif" alt="winkelschrift hint"></p>

        <p>Hier ist deine Nachricht. Du erkennst sicherlich gewisse Ähnlichkeiten: Die Punkte sind wieder da, einige bekannte Formen ... das ist deine Antwort in der Winkelschrift, entschlüssle sie!
        </p>
        
        <p class="my-4"><img src="/chals/chal50.png" alt="winkelschrift"></p>
    `
      ),
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
    pos: { x: 395, y: 535 },
    title: { de: 'Binär', en: 'Binary' },
    // date: '2020-08-01',
    deps: [4, 16],
    html: {
      de: story(
        'Josh',
        `
        <p>Unsere gesamte Technik ist gebaut von Menschen, die über den Tellerrand geblickt haben. Menschen, die sich gefragt haben: Wir haben Schalter (AN/AUS) - wie können wir damit Zahlen darstellen?</p>
        
        <p>Ich weise dir die Richtung: Es hat was mit Zweierpotenzen zu tun. Hier findest du die ersten sechs Zweierpotenzen. Jede Zweierpotenz ist ein Schalter. Klicke auf die Zahl, um den Schalter an- und auszuschalten. Rechts siehst du die Zahl, die du gerade darstellt.</p>

        <p>Jetzt bist du dran. Selbst wenn du noch nichts vom Binärsystem gehört hast - mit bisschen Logik wirst du schnell den Einstieg finden.</p>
        
        <p>Stelle die Zahl 7 ein und schicke sie ab.
        </p>
        
        <p style="margin-top:24px;"><svg id="binary"></svg></p>
        
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
    `
      ),
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
    pos: { x: 460, y: 680 },
    title: { de: 'Binär II', en: 'Binary II' },
    // date: '2020-08-01',
    deps: [51],
    html: {
      de: story(
        'Josh',
        `
        <p>Dein Kopf ist jetzt warm. Stelle die Zahl 45 ein.
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
    `
      ),
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
    pos: { x: 760, y: 190 },
    title: { de: 'Quiz', en: 'Quiz' },
    // date: '2020-08-01',
    deps: [66, 111],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich möchte noch ganz gerne meine Base fertig bauen. Beschäftige dich doch in der Zwischenzeit mit diesem Quiz. In ungefähr einer Stunde bin ich bei dir.</p>
        
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
    `
      ),
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
    pos: { x: 540, y: 370 },
    title: { de: 'Farbe', en: 'Color' },
    // date: '2020-08-01',
    deps: [16, 68],
    html: {
      de: story(
        'Josh',
        `
        <p>Die Welt ist voller Farben. Doch im Internet gibt es nur für <a href="https://www.w3schools.com/tags/ref_colornames.asp" target="_blank">140 Farben</a> einen offiziellen Name.</p>

        <div style="height:80px;width:250px;background-color:#663399;position:relative;margin-bottom:16px;"><div style="position:absolute;right:4px;bottom:2px;"><small style="color:gray;">#663399</small></div></div>

        <p>Der Name dieser Farbe ist deine Antwort.</p>
    `
      ),
      en: `
      <p>The world is full of colors. On the internet, there are fixed names for <a href="https://www.w3schools.com/tags/ref_colornames.asp" target="_blank">140 colors</a>.</p>

      <p>Your answer is the name of this color.</p>
      
      <div style="height:80px;width:250px;background-color:#663399;position:relative"><div style="position:absolute;right:4px;bottom:2px;"><small style="color:gray;">#663399</small></div></div>
      `,
    },
    solution: secrets('chal_55'),
  },

  {
    id: 56,
    pos: { x: 705, y: 1015 },
    title: { de: 'Benutzername II', en: 'Username II' },
    // date: '2020-08-01',
    deps: [25, 26],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Es ist wieder dein Benutzername gefragt. Diesmal soll dein Benutzername auf einer Website enthalten sein. Gib als Antwort den vollständigen Link zu dieser Website ein, z.B. <code>https://www.wikipedia.de</code>. Der Server ruft dann die Website auf und durchsucht sie nach deinem Namen.
        </p>
    `
      ),
      en: `
        <p>It's your username again. This time your username should be contained on a website. As an answer, enter the complete link to this website, e.g. <code>https://www.wikipedia.de</code>. The server then calls up the website and searches it for your name.
        </p>
    `,
    },
    check: async (answer, { req }) => {
      let value = ''
      let containsUsername = false
      try {
        if (!answer || !answer.startsWith('http')) {
          if (req.lng.startsWith('de')) {
            return {
              answer: 'Keine URL: ' + answer,
              correct: false,
              rawAnswer: true,
            }
          } else {
            return {
              answer: 'No URL: ' + answer,
              correct: false,
              rawAnswer: true,
            }
          }
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
          if (!value)
            value = req.lng.startsWith('de')
              ? '[Leere Seite (Status ' + res.status + ')]'
              : '[Empty page (status ' + res.status + ')]'
          if (value.includes(req.user.name)) containsUsername = true
          if (value.length > 1000) {
            value = value.substring(0, 1000) + '...'
          }
          if (!containsUsername) {
            value =
              (req.lng.startsWith('de')
                ? 'Benutzername nicht gefunden: '
                : 'Username not found: ') + value
          }
        } catch (error) {
          if (error.message && error.message.includes('aborted')) {
            value = req.lng.startsWith('de')
              ? 'Keine Antwort nach 4 Sekunden'
              : 'No response after 4 seconds'
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
        rawAnswer: !containsUsername,
      }
    },
  },

  {
    id: 57,
    pos: { x: 1350, y: 950 },
    title: { de: 'Passage', en: 'Passage' },
    // date: '2020-08-17',
    deps: [27, 41, 64],
    html: {
      de: story(
        'Bex',
        `
        <p>Scheiße. Scheiße hoch Scheiße. Kiwi und Josh wurden in eine Falle gelockt. Sie sind von der letzten Mission nicht zurückgekehrt.</p>

        <p>Ich habe sie gebeten, vorsichtig zu sein! Sie sind alles, was ich habe. Ich kann sie nicht in Stich lassen. Ich werde sie befreien.</p>

        <p>Bleib du erstmal hier, dieser Ort ist für dich sicher. Auf diesem Stick findest du deine weitere Ausbildung - arbeite dich soweit vor wie du kannst, wir brauchen jede Hilfe. Das Passwort für den Stick sind die Anfangsbuchstaben dieser verlinkten Aufgaben. Als Backup findest du die Antwort im Quelltext dieser Seite.</p>
        
        <p><a href="/challenge/24" target="_blank">24</a> &nbsp; <a href="/challenge/37" target="_blank">37</a> &nbsp; <a href="/challenge/30" target="_blank">30</a> &nbsp; <a href="/challenge/68" target="_blank">68</a> &nbsp; <a href="/challenge/84" target="_blank">84</a> &nbsp; <a href="/challenge/58" target="_blank">58</a> &nbsp; <a href="/challenge/18" target="_blank">18</a></p>

        <!-- Die Antwort lautet ${secrets('chal_57')}. -->

        <p>Pass auf dich auf! Wir sehen uns bald wieder.</p>
    `
      ),
      en: `
            <p>Behind this passage you will find the second part of Hack The Web - even more worlds to discover and challenges that will make you bite your teeth.</p>
            <p>24 &nbsp; 37 &nbsp; 30 &nbsp; 68 &nbsp; 84 &nbsp; 58 &nbsp; 18</p>
            <p>Each number corresponds to the number of a challenge. Look at the address bar. There you can see that this challenge has the number 57.</p>
            <p>The first letters of the <strong>German</strong> challenge names form the answer. Please switch to the German version for this challenge.</p>
    `,
    },
    solution: secrets('chal_57'),
  },

  {
    id: 58,
    pos: { x: 965, y: 285 },
    title: { de: 'Elemente', en: 'Elements' },
    // date: '2020-08-17',
    deps: [17, 53],
    html: {
      de: story(
        'Bex',
        `
        <p>Es könnte der Eindruck entstehen, dass ich außer Minecraft nichts anderes spiele. Aber das stimmt nicht. Früher habe ich auch viel Zeit in der Welt von Teyvat verbracht.</p>

        <p>Ich beweise es dir. Hier ist ein Geheimtext. Die Anfangsbuchstaben folgender Elemente ergeben deine Antwort.</p>
        
        <p><img src="/chals/chal58_2.png" alt="genshin" width="540"></p>
        
        <p><small><a href="https://game8.co/games/Genshin-Impact/archives/384388" target="_blank">Hinweis</a></small></p>
    `
      ),
      en: `
        <p>There are no limits for you when it comes to writing a secret text. You can handle all methods — even if it is a very special code.
        </p>

        <p>The first letters of the following elements from Teyvat form your answer.
        
        <p><img src="/chals/chal58_2.png" alt="genshin"></p>
        
        <p><small><a href="https://genshin-impact.fandom.com/wiki/Element" target="_blank">Hint</a></small></p>
    `,
    },
    solution: secrets('chal_58'),
  },

  {
    id: 59,
    pos: { x: 745, y: 795 },
    title: { de: 'Geheimtext', en: 'Secret Text' },
    // date: '2020-08-17',
    deps: [23, 78],
    html: {
      de: story(
        'Bex',
        `
        <p>Geheimtexte haben eine magische Anziehung auf mich. Hier kannst das auf interaktive Art nacherleben.
        </p>
        
        <p>Anleitung: Drücke zwei Buchstaben <strong>gleichzeitig</strong> auf der Tastatur, diese werden hervorgehoben und vertauscht.
        </p>
        
        <p>Du kannst immer wieder Worte erraten. Hangle dich an diesen entlang, bis zu den gesamten Text entschlüsselt hast.</p>`,
        `
        <pre id="output" style="font-size:16px;white-space:pre-wrap;margin-top:48px">
        </pre>
        
        <div id="debug" style="text-align:right"></div>
        
        
        <script>
          window.htw_locale = 'de'
        </script>
        <script src="/chals/chal59.js"></script>
        
        <div style="height:40px"></div>
        
        <p>Die Antwort ist der Name der Person, die den ersten Satz sagt.
        </p>
    `
      ),
      en: `
        <p>Even as a child, it was a lot of fun to decipher a secret text piece by piece. Here you can relive this in an interactive way.
        </p>
        
        <p>Instructions: Press two letters <strong>at the same time</strong> on the keyboard, they will be highlighted and swapped.
        
        <pre id="output" style="font-size:16px;white-space:pre-wrap;margin-top:48px">
        </pre>
        
        <div id="debug" style="text-align:right"></div>
          
        <script>
          window.htw_locale = 'en'
        </script>
        <script src="/chals/chal59.js"></script>
        
        <div style="height:40px"></div>
        
        <p>The answer is the name of the person who says the first sentence.
        </p>
    `,
    },
    solution: secrets('chal_59'),
  },

  {
    id: 60,
    pos: { x: 790, y: 690 },
    title: { de: 'Scan Mich', en: 'Scan Me' },
    // date: '2020-08-17',
    deps: [23],
    html: {
      de: story(
        'Kiwi',
        `
        <p>QR Codes werden meist verwendet, um eine Webseite zu verlinken. Doch es gibt keinen Grund, sie nicht auch für andere Dinge zu verwenden.</p>

        <p>In diesem Code ist ein Rätsel gespeichert, das dir den Weg zur Antwort weist.</p>

        <p><img src="/chals/chal60-2.png" style="max-width: 400px; max-height: 400px; margin-top: 16px;" alt="qr"></p>
    `
      ),
      en: `
        <p><img src="/chals/chal60-en-2.png" style="max-width: 400px; max-height: 400px" alt="qr"></p>
    `,
    },
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
    pos: { x: 740, y: 930 },
    title: { de: 'Datei', en: 'File' },
    // date: '2020-08-17',
    deps: [26, 29],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Hacker geben nicht auf, wenn sie vor einer Herausforderung stehen. Als ich mir deine Strafakte durchgelesen habe, war mir sofort klar: Du bist ein wunderbar. Dich möchte ich ausbilden.</p>

        <p>Auf zur nächsten Lektion. Ich habe ein unspektakuläres Bild generiert. Lade es herunter:</p>
        
        <p><img src="/chals/chal62_placeholder.png" style="background:white; max-width: 200px" alt="placeholder"/></p>
        
        <p>Dateiname: <strong id="filename">bild.txt</strong> [<a href="#" onclick="changeName()">ändern</a>]<br><button onclick="download()" style="margin-top:12px;margin-bottom:16px;">Herunterladen</button>
        </p>
      
        <p>Eine Kleinigkeit habe ich dir in den Weg gestellt - die Dateiendung ist falsch. Korrigiere sie und das Bild wird sichtbar. Auf dem Bild findest du die Antwort.
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
    `
      ),
      en: `
      <p>I want to tell you: you are wonderful <3.
      </p>
      
      <p>With this prompt I generated an image to make the message more clear. You can download it here:
      </p>
      
      <p><img src="/chals/chal62_placeholder.png" style="background:white; max-width: 200px" alt="placeholder"/></p>
      
      <p>File name:<strong id="filename">picture.txt</strong> [<a href="#" onclick="changeName()">change</a>]<br><button onclick="download()" style="margin-top:12px;margin-bottom:16px;">Download</button>
      </p>
    
      <p>There is something wrong with the file extension, you need to fix it before downloading. You can find the answer in the picture.
      </p>
      
      
      <script>
        const filename = document.getElementById('filename')
        
        function download() {
          fetch('/chals/chal62-en.data')
            .then(response => response.blob())
            .then(blob => {
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = filename.innerHTML;
              link.click();
          })
        }
        
        function changeName() {
          filename.innerHTML = prompt('New file name:', filename.innerHTML)
        }
      </script>
    `,
    },
    solution: secrets('chal_62'),
  },

  {
    id: 63,
    pos: { x: 230, y: 690 },
    title: { de: 'Cheater', en: 'Cheater' },
    // date: '2020-08-17',
    deps: [7, 80],
    html: {
      de: story(
        'Kiwi',
        `
        <p>So ist das Spiel gedacht: Steuere den Volleyball mit den Pfeiltasten. Berühre abwechselnd die linke und rechte Wand. Dadurch erhöhst du den Zähler. Du verlierst, wenn der Ball den Boden berührt oder aus dem Spielfeld verschwindet. Du siehst die Antwort, sobald du 100 Punkte erreichst.</p>

        <p>Wie man das Spiel auch gewinnen kann: Unter dem Spiel findest du den Quellcode. Diesen kannst du verändern und das Spiel aktualiseren. In der Funktion <code>initGame()</code> wird ziemlich am Anfang <code>updateScore(0)</code> ausgeführt. Ändere diese Zeile zu einer hohen Zahl und gewinne das Spiel sofort.</p>
        
        <p>Wähle deinen Weg.</p>`,
        `
        <div id="game" tabindex="1" style="outline:none;"></div>
        
        <script src="/pixi.min.js"></script>
        <script src="/chals/chal63/matter.js"></script>
        
        <button onclick="handleLeft()">Left</button>
        <button onclick="handleUp()">Up</button>
        <button onclick="handleRight()">Right</button>

        <p><button onclick="update()" style="margin-top:20px">Spiel aktualisieren</button></p>
        
        <p><textarea style="width:100%;height:500px;font-family:monospace" id="code">const HOLZ = '/chals/chal63/holz.jpg'
const BALL = '/chals/chal63/ball.png'

const gameEl = document.getElementById('game')

if (window.app) app.ticker.stop()
window.app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb })
gameEl.innerHTML = ''
gameEl.appendChild(app.view)

const engine = Matter.Engine.create()
const world = engine.world

function initGame() {
  const basicText = app.stage.addChild(new PIXI.Text('Basic text in pixi'))
  window.basicText = basicText
  basicText.x = 30
  basicText.y = 90

  function updateScore(newScore) {
    window.score = newScore
    basicText.text = window.score.toString()
  }

  updateScore(0)

  const woodTexture = PIXI.loader.resources[HOLZ].texture

  function buildWoodBlock(x, y, w, h, id) {
    var block = new PIXI.extras.TilingSprite(woodTexture, w, h)
    app.stage.addChild(block)
    Matter.World.add(
      world,
      Matter.Bodies.rectangle(x + w / 2, y + h / 2, w, h, {
        isStatic: true,
        id,
      })
    )
    block.x = x
    block.y = y
  }

  buildWoodBlock(0, 570, 800, 30, 1)
  buildWoodBlock(0, 170, 30, 400, 2)
  buildWoodBlock(770, 170, 30, 400, 3)
  buildWoodBlock(350, 50, 100, 100, 4)

  const ball = new PIXI.Sprite(PIXI.loader.resources[BALL].texture)
  ball.x = 300
  ball.y = 200
  ball.width = 100
  ball.height = 100
  ball.anchor.set(0.5)
  app.stage.addChild(ball)

  let border = undefined

  const circle = Matter.Bodies.circle(300, 200, 50, { restitution: 1, id: 5 })
  Matter.World.add(world, circle)
  Matter.Events.on(engine, 'collisionStart', (data) => {
    if (data.pairs[0].bodyA.id == 1 && data.pairs[0].bodyB.id == 5) {
      updateScore(0)
    } else if (data.pairs[0].bodyA.id == 2 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined) border = 2

      if (data.pairs[0].bodyA.id == border) {
        updateScore(window.score + 1)
        border = 3
      }
    } else if (data.pairs[0].bodyA.id == 3 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined) border = 3

      if (data.pairs[0].bodyA.id == border) {
        updateScore(window.score + 1)
        border = 2
      }
    }
  })

  function handleUp() {
    const angle = Math.random() * 40 - 20 - 90
    const r = (angle / 180) * Math.PI
    Matter.Body.applyForce(circle, circle.position, {
      x: Math.cos(r) * 0.24,
      y: Math.sin(r) * 0.24,
    })
  }

  function handleLeft() {
    Matter.Body.applyForce(circle, circle.position, { x: -0.2, y: -0.05 })
  }

  function handleRight() {
    Matter.Body.applyForce(circle, circle.position, { x: +0.2, y: -0.05 })
  }

  document.handleLeft = handleLeft
  document.handleUp = handleUp
  document.handleRight = handleRight

  document.getElementById('game').onkeydown = (key) => {
    if (key.code == 'ArrowUp') {
      handleUp()
      key.preventDefault()
    }

    if (key.code == 'ArrowLeft') {
      handleLeft()
      key.preventDefault()
    }

    if (key.code == 'ArrowRight') {
      handleRight()
      key.preventDefault()
    }
  }

  gameEl.focus()

  app.ticker.add(() => {
    Matter.Engine.update(engine)
    ball.x = circle.position.x
    ball.y = circle.position.y
  })
}

PIXI.loader.reset().add(HOLZ).add(BALL).load(initGame)
</textarea></p>
    
      <script>
        function update() {
          eval(document.getElementById('code').value)
        }
        
        function checkDone() {
          if (window.score >= 100) {
            window.basicText.text = 'Die Antwort lautet ' + ((+[]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+(![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]) + '.'
          }
          setTimeout(checkDone, 10)
        }
        
        window.onload = () => {
          update()
          checkDone()
        }
      </script>

    `
      ),
      en: `
      <p>Instructions: Click on the game. Control the volleyball with the arrow keys. Touch the left and right walls alternately. This will increase the counter. You lose if the ball hits the ground or goes out of bounds.</p>
      
      <p>You will see the answer as soon as you reach 1000 points. The game doesn't have any cheats built in - so you have to hack it yourself.
      </p>
      
      <div id="game" tabindex="1"></div>
      
      <script src="/pixi.min.js"></script>
      <script src="/chals/chal63/matter.js"></script>
      
      <button onclick="handleLeft()">Left</button>
      <button onclick="handleUp()">Up</button>
      <button onclick="handleRight()">Right</button>

      <p><button onclick="update()" style="margin-top:20px">Update code</button></p>
      
      <p><textarea style="width:100%;height:500px;font-family:monospace" id="code">if (app) app.ticker.stop();
var app = new PIXI.Application(800,600,{backgroundColor:0x1099bb});
document.getElementById('game').innerHTML = ''
document.getElementById('game').appendChild(app.view);

var engine = Matter.Engine.create(),
world = engine.world;

var WOOD = "/chals/chal63/holz.jpg"
var BALL = "/chals/chal63/ball.png"

PIXI.loader.reset()

PIXI.loader
.add(WOOD)
.add(BALL)
.load(() => {

  var basicText = app.stage.addChild(new PIXI.Text('Basic text in pixi'))
  window.basicText = basicText
  basicText.x = 30
  basicText.y = 90
  
  var woodTexture = PIXI.loader.resources[WOOD].texture
  
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
          window.basicText.text = 'The answer is ' + (![]+[])[!+[]+!+[]+!+[]]+((+[])[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+(![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]
        }
        setTimeout(checkDone, 10)
      }
      
      window.onload = () => {
        update()
        checkDone()
      }
    </script>

    `,
    },
    solution: secrets('chal_63'),
  },

  {
    id: 64,
    pos: { x: 1155, y: 840 },
    title: { de: 'Smiley', en: 'Smiley' },
    // date: '2020-08-17',
    deps: [47, 79, 87],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Wenn wir genug Zeit haben, würde ich dir auch unbedingt Programmieren beibringen wollen. Ausnahmsweise ist das keine verbotene Aktivität, denn solange man sich an den Auftrag hält, sieht das Technik-Dekret kein Problem.</p>

        <p>Aber sei dir bewusst, mein Unterricht wird nicht so ganz orthodox sein. Ich schreibe meine Programme auf eine etwas ... kreativere Art.</p>

        <p>Dieser Smiley ist ein Programm, das dir die Antwort sagt. Kopiere es auf eine Webseite wie <a href="https://runjs.co/" target="_blank">RunJS</a> oder in die Browser-Konsole und führe es aus.</p>`,
        `
        <pre class="bg-dark p-3" style="width:420px;"><code>                  const d = [68,
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
    `
      ),
      en: `
      <p>You're already very close to the passage! Here is a small gift for you.
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
                 
      <p>Run the smiley as a program and you will receive your answer. A website like <a href="https://runjs.co/" target="_blank">RunJS</a> is helpful.</p>
    `,
    },
    solution: secrets('chal_64'),
  },

  {
    id: 66,
    pos: { x: 595, y: 225 },
    title: { de: 'Matrix', en: 'Matrix' },
    // date: '2021-03-19',
    deps: [68, 110],
    html: {
      de: story(
        'Bex',
        `
        <p>Im Hintergrund der <a href="/chals/chal66/index.html" target="_blank">Matrix</a> ist ein Wort versteckt. Schaue genau hin und achte auf die Schatten.
        </p>
    `
      ),
      en: `
      <p>There is a word hidden in the background of the <a href="/chals/chal66/index.html" target="_blank">Matrix</a>. Look closely and pay attention to the shadows.
      </p>
    `,
    },
    solution: secrets('chal_66'),
  },

  {
    id: 67,
    pos: { x: 1105, y: 210 },
    title: { de: 'Anschlüsse', en: 'Ports' },
    // date: '2021-03-19',
    deps: [37],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Hacken kann man wirklich alles, sei es Software, Hardware oder andere Systeme. Der menschlichen Kreativität sind keine Grenzen gesetzt, zumindest nicht so enge, wie die Regierung es uns vorschreiben möchte.</p>
        
        <p>Es kann passieren, dass du auch mal eine Internet-Leitung selber bauen musst. Nutze den Standard <a href="https://de.wikipedia.org/wiki/TIA-568A/B" target="_blank">TIA-568B</a> und verbinde die Adern. Die Buchstaben ergeben deine Antwort.</p>
      
        <p><img src="/chals/chal67.png" style="max-width: 500px" alt="lan kable"></p>
    `
      ),
      en: `
      <p>Connect the wires in the right order with the plug. Use the TIA-568B standard.</p>
      
      <p><img src="/chals/chal67.png" style="max-width: 500px" alt="lan kable"></p>
    `,
    },
    solution: secrets('chal_67'),
  },

  {
    id: 68,
    pos: { x: 430, y: 260 },
    title: { de: 'Gemälde', en: 'Painting' },
    // date: '2021-03-19',
    deps: [5, 15],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Kunst überdauert Jahrhunderte - weil sie immer wieder neu interpretiert und überarbeitet wird. Wenn mir das alles zu viel ist, mit dem Widerstand und all den anderen Sorgen - dann tröste ich mich mit Kunst.</p>

        <p>Schau dir dieses Kunstwerk an. Es ist eine moderne Umsetzung eines sehr alten Motivs. Normand würde für die Zweckentfremdung der Buchstaben und Satzzeichen sicherlich im Gefängnis landen.</p>

        <p>Sag mir: In welchem Jahr ist der Maler des ursprünglichen Gemäldes geboren? Du darfst für alle Aufgaben auf Hack The Web eine Suchmaschine verwenden.</p>
        `,
        `
        
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
    `
      ),
      en: `
      <p>Art lasts for centuries — also because it is constantly reinterpreted and revised.</p>
      
      <p>Your friend Normand proudly shows you his latest work of art:
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
    
    <p>The implementation is creative and modern, but the motif itself is very old. What year was the artist of the original painting born?</p>
    `,
    },
    solution: secrets('chal_68'),
  },

  {
    id: 69,
    pos: { x: 475, y: 460 },
    title: { de: 'Schattenbilder', en: 'Shadow Pictures' },
    // date: '2021-03-19',
    deps: [4, 16, 68],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich habe schon früh verstanden, dass einige Dinge um uns herum nicht stimmen. Das ist ja nicht so schwer, man muss nur die einzelnen Teile übereinander legen und sieht dann das Muster.</p>

        <p>Probier das aus. Schiebe die sechs Bilder übereinander und erhalte deine Antwort.</p>
        `,
        `
        
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
      `
      ),
      en: `
      <p>I couldn't be so precise with the mouse because you have great sensitivity! The 6 images can be moved with the mouse. When placed one on top of the other, they provide the answer.
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
    },
    solution: secrets('chal_69'),
  },

  {
    id: 70,
    pos: { x: 190, y: 850 },
    title: { de: 'Karol', en: 'Karol' },
    // date: '2021-03-19',
    deps: [63, 86],
    html: {
      de: story(
        'Josh',
        `
        <p>Aus scheinbar einfachen Systemen können komplexe und schöne Strukturen entstehen, die man gar nicht erwartet hätte. So ist es mit Algorithmen. Diese bestehen aus ein paar wenigen Bausteinen, doch erlauben erstaunlich viele Kombinationen. Sich mit solchen Systemen auszukennen ist sehr mächtig. Denn dann kannst du überall mit ganz wenigen Mitteln deine eigenen Systeme bauen ...</p>

        <p>So weit sind wir noch nicht. Nimm dir erstmal eine <a href="https://karol.arrrg.de/?id=IaepMRwFW" target="_blank">3x9-Welt</a> und schaue dir dieses Programm an:</p>

        <p><img src="/chals/chal70_2.png" alt="blockly"></p>

        <p>Schwer vorherzusagen, was das Ergebnis ist. Baue es nach und starte das Programm. Deine Antwort ist die Anzahl der gelben Marken, die am Ende liegen.</p>`,
        `
        <iframe style="width:100%;height:700px;margin-bottom:16px;background-color:white;" src="https://karol.arrrg.de/?id=IaepMRwFW">
        </iframe>
    `
      ),
      en: `
      <p>If we competed against each other in a LEGO competition today, I wouldn't stand a chance against you. Somehow, I was more creative when I was young.
      </p>
      
      <p>Luckily, programming doesn't require so much creativity, and you can focus more on problem-solving. Robot Karol tries to find a middle ground and connect to the LEGO world. You can find an online version of Robot Karol <a href="https://karol.arrrg.de/?id=IaepMRwFW" target="_blank">here</a>.
      </p>
      
      <iframe style="width:100%;height:700px;margin-bottom:16px;background-color:white;" src="https://karol.arrrg.de/?id=IaepMRwFW">
      </iframe>
      
      <p>Build the following code with Karol and run the program.
      </p>
      
      
      <p>The answer is the number of yellow tokens at the end.</p>
      
      <br />
      <p>Note:</p>
      <p>wiederhohle ... mal ≙ repeat ... times</p>
      <p>schritt ≙ step</p>
      <p>markeSetzen ≙ setMarker</p>
      <p>wenn ... dann ≙ if ... than</p>
      <p>istWand ≙ isWall</p>
      <p>linksDrehen ≙ turnLeft</p>
      <p>markeLöschen ≙ removeMarker</p>
    `,
    },
    solution: secrets('chal_70'), // link: https://karol.arrrg.de/?id=b5S45y9RF
  },

  {
    id: 77,
    pos: { x: 680, y: 555 },
    title: { de: 'Geburtstag', en: 'Birthday' },
    // date: '2022-02-09',
    deps: [51, 55, 69],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Selbst Menschen, die aus einer ganz anderen Zeit stammen, können auch heute inspirieren. Ein solcher Mensch wurde am 23. Juni 1912 geboren und führte ein brilliantes und sogleich tragisches Leben.</p>

        <p>Ich möchte, dass du diesen Menschen kennenlernst. Wie lautet dessen Nachname?</p>
    `
      ),
      en: `
        <p>Even people from a completely different era can inspire us today.</p>

        <p>Such an individual was born on June 23, 1912, and led a brilliant yet tragic life.</p>

        <p>Your answer is the last name of this person.</p>
    `,
    },
    solution: secrets('chal_77'),
  },

  {
    id: 78,
    pos: { x: 535, y: 785 },
    title: { de: 'Papier', en: 'Paper' },
    // date: '2022-02-09',
    deps: [21, 63],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Es gibt super viele Möglichkeiten, Nachrichten zu verstecken. Kaum jemand druckt heute noch Webseiten aus. Und das ist eine Chance, eine geheime Nachricht in der Druckvorschau zu verstecken.</p>

        <p>In der Druckvorschau zu dieser Seite findest du deine Antwort.</p>
        
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
    `
      ),
      en: `
      <p>Most websites can adapt to the size of the screen, be it a mobile phone, tablet or large monitor. In the analog world, these options do not exist. There you will often only find the DIN A4 format.
      </p>
      
      <p>A website can also be converted to DIN A4 format, for example, using the print preview. There you will find the answer to this task.
      </p>
      
      <p class="print-only">The answer is ${secrets('chal_78')}.</p>
      
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
    },
    solution: secrets('chal_78'),
  },

  {
    id: 79,
    pos: { x: 1095, y: 620 },
    title: { de: 'Recherche', en: 'Research' },
    // date: '2022-02-24',
    deps: [18, 84],
    html: {
      de: story(
        'Josh',
        `
        <p>Weißt du noch, wie ich dir den HTML-Quellcode gezeigt habe? Vor ganz vielen Jahren gab es in den USA einen Governor, der einen Journalist wegen &quot;Hacking&quot; anklagen wollte. Der Journalist hat sich den Quellcode einer Regierungswebsite angeschaut hat und dort persönliche Informationen vieler Lehrkräfte gefunden.</p>
        
        <p>Ganz wilde Geschichte, denn im Grund hat der Staats selbst ausversehen persönliche Informationen in der Website mitgeliefert, die jeder mit bisschen technischen Wissen herauslesen konnte. Es gab dazu ein <a href="https://pbs.twimg.com/media/FBrT2wWX0AQ4zkQ?format=jpg&name=small" target="_blank">nettes Meme</a>. Wenn die Leute nur wüssten, ich schlecht dieser Witz gealtert ist ...</p>

        <p>Wann war das nochmal? Ich glaube das war 2021. Kannst du mir bitte heraussuchen, in welchem US-Bundesstaat das passierte?
        </p>
    `
      ),
      en: `
        <p>Do you remember when the HTML source code was shown? Many years ago, there was a case in the USA where a governor wanted to charge a journalist with "hacking." The journalist had looked at the source code of a government website and found personal information about many teachers.</p>

        <p>It was quite a wild situation, because essentially, the state had accidentally included personal information in the website, which anyone with some technical knowledge could access.</p>

        <p>When did this happen again? I believe it was in 2021. Could you look up in which US state this took place?</p>

    `,
    },
    solution: secrets('chal_79'),
  },

  {
    id: 80,
    pos: { x: 250, y: 535 },
    title: { de: 'Stylesheet', en: 'Stylesheet' },
    // date: '2022-02-24',
    deps: [4, 6],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Das Technik-Dekret war auch ein großer Rückschlag für queere Menschen. Die Gesellschaft ist hartherziger geworden. Und darunter leiden die, die eh schon mehr Last zu tragen haben.</p>

        <p>Ich möchte in solchen Zeiten wieder bisschen Farbe reinbringen. Ändere die Reihenfolge der einzelnen Farben so, dass sie eine Regenbogenflagge bilden. Verwende die Farben in der Reihenfolge <code>red</code>, <code>orange</code>, <code>yellow</code>, <code>green</code>, <code>blue</code> und <code>purple</code>.</p>`,
        `
      <div class="container">
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <textarea class="form-control" style="height:425px;font-family:monospace;" id="css-input" oninput="update()">#bar1 {
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
          </div>

          <div class="col-lg-6 col-md-12">
            <div style="max-width:390px;border:1px solid black">
              <div style="height:40px" id="bar1"></div>
              <div style="height:40px" id="bar2"></div>
              <div style="height:40px" id="bar3"></div>
              <div style="height:40px" id="bar4"></div>
              <div style="height:40px" id="bar5"></div>
              <div style="height:40px" id="bar6"></div>
            </div>
            <style id="injector"></style>
            
            <div id="result" style="margin-top:10px"></div>
          </div>
        </div>
      </div>
          
      
      <script>lng='de'</script>
      <script src="/chals/chal80_2.js"></script>
    `
      ),
      en: `
      <p>ARRRRG! Some <a href="/chals/chal80_trash.jpg" target="_blank">trashy</a> person messed up the colors of the rainbow flag! It's now up to you to put the colors back in the correct order:</p>
      
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
      
      <script>lng='en'</script>
      <script src="/chals/chal80_2.js"></script>
    `,
    },
    solution: secrets('chal_80'),
  },

  {
    id: 81,
    pos: { x: 1145, y: 345 },
    title: { de: 'Formulare', en: 'Forms' },
    // date: '2022-12-28',
    deps: [9, 37, 58],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Willkommen zum Hindernislauf von Hack The Web mit zwei Hürden 🏃‍♀️. Mache dich bereit für nervige Formulare im Internet.</p>
        
        <p>Finde als erstes deine Antwort in diesem viel zu kleinen Textfeld:</p>
        
        <p><input size="5" value="-> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> scroll weiter -> -> -> -> -> -> -> -> -> -> -> -> Die Antwort lautet ${secrets(
          'chal_81'
        )}"/>
        </p>
        
        <p>Schicke jetzt die Antwort ab. Nur eines der Eingabefelder funktioniert:</p>
        
        ${(() => {
          let output = ''
          for (let i = 0; i < 15; i++) {
            output += `
              <form autocomplete="off" method="post" id="challenge_form"${
                i !== 11 ? ' action="/falsches_Eingabefeld"' : ''
              }>
                <input id="challenge_answer" type="text" name="answer" style="height:32px">
                <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
              </form>
            `
          }
          return output
        })()}
    `
      ),
      en: `
      <p>Unintuitive forms are a nightmare for every internet user. For example, you can find the answer to this task in this much too small text field:</p>
      
      <p><input size="5" value="-> -> -> -> scroll further -> -> -> -> -> -> -> -> -> -> -> -> scroll further -> -> -> -> -> -> -> -> -> -> -> -> scroll further -> -> -> -> -> -> -> -> -> -> -> -> scroll further -> -> -> -> -> -> -> -> -> -> -> -> scroll further -> -> -> -> -> -> -> -> The answer is ${secrets(
        'chal_81'
      )}"/>
      </p>
      
      <p>Now we're getting to the fun part. Only one of the input fields works:</p>
      
      ${(() => {
        let output = ''
        for (let i = 0; i < 25; i++) {
          output += `
            <form autocomplete="off" method="post" id="challenge_form"${
              i !== 18 ? ' action="/wrong_submit"' : ''
            }>
              <input id="challenge_answer" type="text" name="answer" style="height:32px">
              <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
            </form>
          `
        }
        return output
      })()}
    `,
    },
    hidesubmit: true,
    solution: secrets('chal_81'),
  },

  {
    id: 84,
    pos: { x: 860, y: 580 },
    title: { de: 'Inception', en: 'Inception' },
    // date: '2023-02-26',
    deps: [8, 23, 77],
    render: ({ req }) => {
      function renderFrame(w, h, level, lang) {
        return `
          <iframe src="/challenge/84/?level=${level}" width="${w}" height="${h}" id="if" style="display:none"></iframe>
          
          ${
            lang === 'de'
              ? `<button onclick="run()" id="bt" style="margin-top:16px">Stufe ${level} betreten</button>`
              : `<button onclick="run()" id="bt" style="margin-top:16px">Entered ${level} level</button>`
          }
          
          <script>
            function run() {
              document.getElementById('if').style.display = 'block'
              document.getElementById('bt').style.display = 'none'
            }
            
            run()
          </script>
        `
      }
      if (req.lng === 'de') {
        if (!req.query.level) {
          return story(
            'Kiwi',
            `
            <p>Hat dir der Film gestern gefallen? Ich finde ihn inspirierend. Wobei ich zugeben muss: Manchmal habe ich wie im Film die Angst nicht zu wissen, ob ich mich in der Realität befinde oder nur in einem Traum. Vor allem wenn man lange Zeit so isoliert lebt.</p>
            
            <p>Im Computer kann man relativ leicht Realitäten ineinander verschachteln. Ich kann auf dieser Seite nochmal die selbe Seite einbinden. Du findest hier drei Ebenen. Auf der untersten Ebene findest du die Antwort.</p>
        `,
            renderFrame(500, 700, 1)
          )
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
          
          ${renderFrame(450, 500, 3)}
        `
        }

        if (level === 3) {
          return `
          <img src="/chals/chal84_5.jpg" style="width:100%;margin-bottom:16px;" alt="inception">
          
          <p style="margin-top:150px">Die Antwort lautet ${secrets(
            'chal_84'
          )}.</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
        `
        }

        return ''
      } else {
        if (!req.query.level) {
          return `
          <p>Did you sleep well yesterday? I hope you didn't encounter any strange people in your dream like in the movie Inception.</p>

          <p>This page is inspired by Inception. Scroll through all the levels. On the lowest level, you'll find the answer.</p>

          
          ${renderFrame(1110, 700, 1)}
        `
        }

        const level = parseInt(req.query.level)

        if (level === 1) {
          return `
          <img src="/chals/chal84_2.jpg" style="width:100%;margin-bottom:16px" alt="inception">
          
          <p>A website within a website. There's more, go deeper:</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
          
          ${renderFrame(1000, 500, 3)}
        `
        }

        if (level === 3) {
          return `
          <img src="/chals/chal84_5.jpg" style="width:100%;margin-bottom:16px;" alt="inception">
          
          <p>The answer is ${secrets('chal_84')}.</p>
          
          <script>
            setTimeout(() => {
              document.getElementById('challenge_form').style.display = 'none'
            }, 100)
          </script>
        `
        }

        return ''
      }
    },
    solution: secrets('chal_84'),
  },

  {
    id: 86,
    pos: { x: 90, y: 706 },
    title: { de: 'Fragil', en: 'Fragile' },
    // date: '2023-04-02',
    deps: [7, 80],
    html: {
      de: story(
        'Josh',
        `
        <p>Nicht viele Menschen wissen, dass es für Webseiten einen Bearbeitungsmodus gibt. Ein Schalter genügt und und schon kann man die Seite nach Belieben verändern. Ich bin immer wieder erstaunt, was für geheime Funktion es zu entdecken gibt.</p>

        <p>Den Schalter habe ich hier aktiviert. Probiere es aus. Du kannst an jeder Stelle deinen Cursor setzen und den Inhalt verändern.</p>
        
        <p>Ein kleiner Auftrag: Ändere meinen Namen zu "Yoshi" und erhalte die Antwort.
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
            const lead = document.querySelector('.avatar > div')
            if (lead) {
              if (lead.textContent.trim().toLowerCase() === 'yoshi') {
                document.getElementById('output').innerHTML = 'Die Antwort lautet ' + atob('${Buffer.from(
                  secrets('chal_86')
                ).toString('base64')}') + '.'
                return // don't run check anymore
              }
            }
            setTimeout(check, 500)
          }
        </script>
    `
      ),
      en: `
      <p>This site is easily fragile. Try it out: You can edit all content.</p>
      
      <p>A small task: change the slogan to "Look what I can do!"
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
            if (lead.textContent.trim().toLowerCase() === 'look what i can do!') {
              document.getElementById('output').innerHTML = 'The answer is ' + atob('${Buffer.from(
                secrets('chal_86')
              ).toString('base64')}') + '.'
              return // don't run check anymore
            }
          }
          setTimeout(check, 500)
        }
      </script>
    `,
    },
    solution: secrets('chal_86'),
  },

  {
    id: 87,
    pos: { x: 945, y: 760 },
    title: { de: 'Scratch', en: 'Scratch' },
    // date: '2023-04-02',
    deps: [59, 60, 84],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich finde, du hast eine wunderbar entspannte Aura :) Das hat mich zu diesem sehr entspannten kleinen Spiel inspiriert.</p>

        <p>Steuere mit den <code>Pfeiltasten</code>.</p>
        `,
        `
        
        <iframe src="https://scratch.mit.edu/projects/829930955/embed" allowtransparency="true" width="485" height="402" allowfullscreen style="border: 0; overflow:hidden;"></iframe>
        
        <p style="margin-top:12px">Dir ist das zu langsam? Schaue in das Projekt hinein: <a href="https://scratch.mit.edu/projects/829930955/editor/" target="_blank">https://scratch.mit.edu/projects/829930955/editor/</a>
        </p>
    `
      ),
      en: `
        <p>You have a wonderfully relaxed aura! That inspired me to develop this little relaxed game.
        </p>
        
        <p>Control with the <code>arrow keys</code>.
        </p>
        
        <iframe src="https://scratch.mit.edu/projects/898484613/embed" allowtransparency="true" width="485" height="402" allowfullscreen style="border: 0; overflow:hidden;"></iframe>
        
        <p style="margin-top:12px">Is it too slow for you? Look into the project: <a href="https://scratch.mit.edu/projects/898484613/editor/" target="_blank">https://scratch.mit.edu/projects/829930955/editor/</a>
        </p>
    `,
    },
    solution: secrets('chal_87'),
  },

  {
    id: 110,
    pos: { x: 440, y: 90 },
    title: { de: 'Taschenrechner', en: 'Calculator' },
    // date: '2023-05-13',
    deps: [5],
    html: {
      de: story(
        'Bex',
        `
        <p>Du bist also neu hier. Nett. Erwarte nicht, dass du deshalb besonders behandelt wirst. Jeder trägt seinen Teil bei und für dich gilt keine Ausnahme.</p>

        <p>Ich möchte sehen, wie du mit Herausforderungen umgehst. Das ist ein defekter Taschenrechner. Berechne die Zahl <strong>256</strong> und schicke das Ergebnis ab.</p>

        ${calculator()}
    `
      ),
      en: `
      <p>Difficulties don't stop you from your goals. On the contrary: you use your creativity to solve the challenge.
      </p>
      
      <p>Here is a calculator from a tutorial. I followed the tutorial, but I must have made a mistake somewhere — you can't enter multi-digit numbers.
      </p>
      
      <p>Your creativity is now required. Calculate the number <strong>256</strong> and submit the result.
      </p>
      
      
      ${calculator('en')}
    `,
    },
    solution: '256',
    hidesubmit: true,
  },

  {
    id: 111,
    pos: { x: 600, y: 80 },
    title: { de: 'Taschenrechner II', en: 'Calculator II' },
    // date: '2023-05-13',
    deps: [110],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich sehe, du bist nicht ganz unbeholfen. Nicht schlecht. Aber ich will, ehm, noch mehr Beweise sehen. </p>


        <p>Berechne diesmal die Zahl <strong>10240</strong>.
        </p>
        
        ${calculator()}
    `
      ),
      en: `
      <p>This time calculate the number <strong>10240</strong>.
      </p>
      
      
      ${calculator('en')}
    `,
    },
    solution: '10240',
    hidesubmit: true,
  },

  {
    id: 112,
    pos: { x: 747, y: 249 },
    title: { de: 'Minecraft III', en: 'Minecraft III' },
    deps: [337],
    html: {
      de: story(
        'Bex',
        `
        <p>Nehmen wir mal an, ich baue eine Schaltung, die nicht funktioniert. Das passiert in der Realität natürlich nicht. Schaue dir diese Situation an:</p>

        <p><img src="/chals/chal112.jpg" alt="Blick auf Redstone-Schaltung" style="max-width:65ch"></p>
        
        <p>Ich möchte mit einem Schalter die Lampe an- und ausschalten, doch die Lampe leuchtet nicht. Mit nur einen Block kann ich die Schaltung reparieren. Diese Block-ID ist deine Antwort.</p>
      `
      ),
      en: `
        <p>I want to turn the lamp on and off with a switch, but the circuit isn't working.</p>

        <p><img src="/chals/chal112.jpg" alt="View of Redstone circuit" style="max-width:100%"></p>

        <p>My buddy immediately spots the problem: "You just need to add a block!" This block ID is your answer.</p>

      `,
    },
    solution: secrets('chal_112'),
  },

  {
    id: 113,
    pos: { x: 797, y: 144 },
    title: { de: 'Minecraft IV', en: 'Minecraft IV' },
    deps: [337],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich liebe den Mond bei Mitternacht. Der Mond hat etwas trauriges und einsames an sich, mit dem ich mich ...</p>

        <p><img src="/chals/chal113.png" alt="Mond bei Mitternacht" style="max-width:65ch"></p>
        
        <p>Was rede ich da für einen Unsinn! Vergiss sofort, was ich gerade gesagt habe. Wir gehen jetzt zur nächsten Aufgabe.</p>
        
        <p>In Minecraft ist es möglich, die Zeit zu ändern. Deine Antwort ist der Befehl, um die Zeit auf Mitternacht zu setzen.</p>
      `
      ),
      en: `
        <p>I love the moon at midnight. I wish I could jump to that moment whenever I want.</p>

        <p><img src="/chals/chal113.png" alt="Moon at midnight" style="max-width:100%"></p>

        <p>The appropriate command for this is your answer.</p>

      `,
    },
    solution: [secrets('chal_113_1'), secrets('chal_113_2')],
  },

  {
    id: 114,
    pos: { x: 588, y: 313 },
    title: { de: 'Baum', en: 'Tree' },
    deps: [68, 336],
    html: {
      de: story(
        'Kiwi',
        `
        <p>Josh wollte dir unbedingt beibringen, wie man Baumarten erkennt. Aus meiner Sicht ist das in der aktuellen Lage nicht die höchste Priorität. Aber ich habe ihm versprochen, etwas mit Natur einzubauen.</p>

        <p>Also dann, schaue dir diesen Baum an. Deine Antwort ist der wissenschaftlichen Name dieser Baumgattung. Und pssst, ich habe dir einen Tipp versteckt.</p>

        <p><a href="/chals/chal114_rosskastanie_aesculus.jpg" target="_blank"><img src="/chals/chal114_rosskastanie_aesculus.jpg" alt="Baumgattung bestimmen" style="max-height:500px"></a></p>
      `
      ),
      en: `
        <p>Computers and nature are two different worlds. I enjoy spending time in both. And both can enrich each other.</p>

        <p><img src="/chals/chal114_rosskastanie_aesculus.jpg" alt="Identify tree genus" style="max-width:500px"></p>

        <p>The scientific name of this tree genus is your answer. Don't worry if you're not familiar with trees: there are hints here and there in the source code.</p>

      `,
    },
    solution: secrets('chal_114'),
  },

  {
    id: 116,
    pos: { x: 740, y: 52 },
    title: { de: 'Taschenrechner III', en: 'Calculator III' },
    deps: [111],
    html: {
      de: story(
        'Bex',
        `
        <p>Ich gebe zu, du hast mehr Ausdauer als ich dachte. Lasse mich kurz überlegen. Hier ist noch eine Aufgabe, die viel schwieriger ist. Ich habe damals sehr lange gebraucht, sie zu lösen.</p>
        
        <p>Josh meinte, wenn ich die Primfaktorzerlegung genutzt hätte, wäre ich in wenigen Minuten fertig gewesen. Keine Ahnung, was er damit sagen wollte.</p>

        <p>Berechne die Zahl <strong>15876000</strong>.</p>
      
        <div class="calculator">
          <div class="calculator__display">0</div>

          <div class="calculator__keys">
            <button class="key--operator invisible" data-action="add">+</button>
            <button class="key--operator invisible" data-action="subtract">-</button>
            <button class="key--operator" data-action="multiply">&times;</button>
            <button class="key--operator invisible" data-action="divide">÷</button>
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
      `
      ),
      en: `
        <p>Blind guessing will not lead you to success here. Choose a wise strategy.</p>

        <p>Calculate the number <strong>15876000</strong>.</p>

        <div class="calculator">
          <div class="calculator__display">0</div>

          <div class="calculator__keys">
            <button class="key--operator invisible" data-action="add">+</button>
            <button class="key--operator invisible" data-action="subtract">-</button>
            <button class="key--operator" data-action="multiply">&times;</button>
            <button class="key--operator invisible" data-action="divide">÷</button>
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
        
        <p style="margin-top:32px;" id="submit"><button>Submit result</button></p>
        
        <link rel="stylesheet" href="/chals/chal110.css">
        
        <script src="/chals/chal110.js"></script>
      `,
    },
    solution: '15876000',
    hidesubmit: true,
  },

  {
    id: 118,
    pos: { x: 668, y: 480 },
    title: { de: ' [Umfrage]', en: '[Survey]' },
    deps: [51, 55, 69],
    render: () => {
      const reverse = Math.random() < 0.5
      function buildLikert5(lower, higher, name) {
        const values = [
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-1" value="1" required="required">
            <label class="form-check-label" for="${name}-1">1 - ${lower}</label>
          </div>
          `,
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-2" value="2">
            <label class="form-check-label" for="${name}-2">2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </div>
          `,
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-3" value="3">
            <label class="form-check-label" for="${name}-3">3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </div>
          `,
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-4" value="4">
            <label class="form-check-label" for="${name}-4">4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </div>
          `,
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-5" value="5">
            <label class="form-check-label" for="${name}-5">5 - ${higher}</label>
          </div>
          `,
        ]
        if (reverse) values.reverse()
        return values.join('')
      }
      function buildYesNo(name) {
        const values = [
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-yes" value="yes" required="required">
            <label class="form-check-label" for="${name}-yes">Ja&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </div>
          `,
          `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="${name}" id="${name}-no" value="no" required="required">
            <label class="form-check-label" for="${name}-no">Nein&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          </div>
          `,
        ]
        if (reverse) values.reverse()
        return values.join('')
      }
      return {
        de: `
        <p>Ich weiß: eine Umfrage ist nicht das spannenste Abenteuer auf dieser Welt (ja, ja, keiner liebt sie), aber hey ... diese hier dauert nur 3 Minuten, versprochen. Deine Meinung hilft sehr, Hack The Web noch besser zu machen. Unsere Zeit ist wertvoll und ich möchte diese Zeit daher auch wirklich nur mit den besten Inhalten füllen.</p>

        <details>
          <summary>
              <span><strong>Umfrage starten</strong></span>
          </summary>
          <hr />
          <form autocomplete="off" method="post">

            <p>Auf einer Skala von 1 bis 5: Wie sehr hat Hack The Web dein Interesse am Thema Hacking und Technologie geweckt?</p>
            ${buildLikert5(
              'kein Interesse geweckt',
              'sehr viel Interesse geweckt',
              'interest'
            )}

            <p style="margin-top:32px;">Auf einer Skala von 1 bis 5: Wie herausfordernd fandest du die Aufgaben auf Hack The Web?</p>
            ${buildLikert5(
              'nicht herausfordernd',
              'sehr herausfordernd',
              'challenge'
            )}

            <p style="margin-top:32px;">Auf einer Skala von 1 bis 5: Wie viel Spaß hattest du beim Lösen der Aufgaben auf Hack The Web?</p>
            ${buildLikert5('kein Spaß', 'sehr viel Spaß', 'fun')}

            <p style="margin-top:32px;">Würdest du nach dieser Erfahrung mehr über Hacking und IT-Sicherheit lernen wollen?</p>
            ${buildYesNo('learnmore')}

            <p style="margin-top:32px;">Hast du das Gefühl, dass du durch die Rätsel kreativer geworden bist oder deine Problemlösungsfähigkeiten verbessert hast?</p>
            ${buildYesNo('morecreative')}

            <p style="margin-top:32px;">Hattest du das Gefühl, dass du die Aufgaben auch ohne Vorwissen lösen konntest?</p>
            ${buildYesNo('easystart')}

            <p style="margin-top:32px;">Würdest du Hack The Web weiterempfehlen?</p>
            ${buildYesNo('recommend')}

            <p style="margin-top:32px;">Was hat dir an Hack The Web besonders gut gefallen und warum? (optional, max. 300 Zeichen)</p>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" maxlength="300" name="good"></textarea>

            <p style="margin-top:32px;">Was würdest du an Hack The Web verbessern oder anders machen? (optional, max. 300 Zeichen)</p>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" maxlength="300" name="improve"></textarea>

            <p style="margin-top:32px;">Ich willige ein, dass meine Antworten in der Auswertung berücksichtigt werden.</p>
            ${buildYesNo('agree')}
            <p style="margin-top:10px;"><small>Wähle Nein, wenn du die Aufgabe lösen willst, aber deine Antworten nicht in die anonyme Auswertung einfließen lassen möchtest.</small></p>

            <p style="margin-top:32px;"><button type="submit" class="btn btn-primary">Abschicken</button></p>
            
            <input type="hidden" name="answer" value="_">
          </form>
        </details>
      `,
        en: `
        <p>The survey is currently only available in German.</p>
        <form autocomplete="off" method="post">
          <input type="hidden" name="answer" value="skip">
          <button type="submit" class="btn btn-primary">Skip</button>
        </form>
      `,
      }
    },
    check: async (answer, { App, req }) => {
      if (answer == 'skip') {
        return {
          answer: 'skip',
          correct: true,
        }
      }
      const result = JSON.stringify(req.body).slice(0, 10000)
      await App.storage.setItem(
        'survey_v1_' + req.user.id + '_' + new Date().getTime(),
        result
      )
      if (!req.body.agree) {
        return {
          answer: 'Keine Formulardaten erhalten',
          correct: false,
          rawAnswer: true,
        }
      }
      return {
        answer: 'Vielen Dank für die Teilnahme an der Umfrage.',
        correct: true,
        rawAnswer: true,
      }
    },
    hidesubmit: true,
  },

  {
    id: 336,
    pos: { x: 455, y: 175 },
    title: { de: 'Minecraft', en: 'Minecraft' },
    // date: '2024-02-01',
    deps: [5, 15],
    // author: 'QWERTZ',
    html: {
      de: story(
        'Bex',
        `
        <p>Kiwi hat mich beordert, dir paar Dinge zu zeigen. Hey: nur weil ich jung bin heißt es nicht, dass ich nicht ordentlich was drauf habe!</p>

        <p>Meine Eltern waren schockiert, dass ich ein so altes Spiel wie Minecraft spiele - und noch dazu ein Spiel, das offiziell verboten ist. Aber es ist gut und man kann da sehr viele kreative Dinge machen.</p>

        <p>Ich habe eine Aufgabe für dich. Kiwi könnte viel besser erklären, warum das eine sinnvolle Aufgabe ist, das spare ich mir. Mach und zeig mir, dass Kiwi mit der Entscheidung, dich auszubilden, Recht hatte.</p>
      `,
        `
        <p>Was ist die Block-ID von diesem Block?</p>
        
        <p><img src="/chals/chal336.png" alt="block in minecraft" style="max-width:65ch;"></p>
      `
      ),
      en: `
        <p>What is the block-ID for this block?</p>
          
        <p><img src="/chals/chal336.png" alt="block in minecraft"></p>
      `,
    },
    solution: secrets('chal_336'),
  },

  {
    id: 337,
    pos: { x: 611, y: 165 },
    title: { de: 'Minecraft II', en: 'Minecraft II' },
    // date: '2024-02-01',
    deps: [336],
    // author: 'QWERTZ',
    html: {
      de: story(
        'Bex',
        `
        <p>Die erste Aufgabe hast du gemeistert. Anscheinend hast du doch was auf dem Kasten.</p>

        <p>Ich frage dich als nächstes: Welches Konzept wird hier dargestellt?

        <p><img src="/chals/chal337.png" alt="block in minecraft" style="max-width:65ch"></p>
        `
      ),
      en: `
        <p>Which concept is presented here?</p>
            
        <p><img src="/chals/chal337.png" alt="block in minecraft"></p>
      `,
    },
    solution: secrets('chal_337'),
  },
]

module.exports = [
  ...part1,
  ...require('./challenges-after-passage'),
  ...require('./community'),
]
