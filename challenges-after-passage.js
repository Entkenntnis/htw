const secrets = require('./secrets-loader.js')

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
    id: 71,
    pos: { x: 1550, y: 905 },
    title: { de: 'Sag mal', en: 'Say' },
    date: '2022-02-09',
    deps: [57],
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
    pos: { x: 1570, y: 985 },
    title: { de: 'Labyrinth', en: 'Maze' },
    date: '2022-02-09',
    deps: [57],
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
    solution: secrets('chal_83'),
  },

  {
    id: 85,
    pos: { x: 1185, y: 1230 },
    title: 'Schneehase',
    date: '2023-02-26',
    deps: [76],
    html: `
      <p><img src="/chals/chal85.png" alt="rabbit"></p>
    `,
    solution: secrets('chal_85'),
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
      
      <p><img src="/chals/chal94.jpg" style="max-width: 400px"  alt="kids"/></p>
      
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
      
      <p>&lt;span style=&quot;font: Hack The Web&quot;&gt;ABC DEFGHIJ KLMNOP QRSTUVWXYZ.&lt;/span&gt;</p>
      
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
      
      <p>Schön, dass du so regelmäßig hier vorbeischaust. Tja, Regeln: Sie helfen uns, unser Miteinander besser zu gestalten. Viele Regeln sind wahrscheinlich nicht so sinnvoll, aber es gibt schon einige, die wertvoll sind.
      </p>
      
      <p>Auf unserem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> haben wir nur zwei Regeln. Wie lautet die zweite Regel?
      </p>
    `,
    solution: secrets('chal_99'),
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
      
      <p><img src="/chals/chal101.png"  alt="chat gpt"/></p>
    
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
      <p>Kann es sein, dass du heute etwas braungebrannter aussiehst, als noch bei unserem letzen Treffen? Ha, ich weiß es: Du bist gerade von einer Reise zurückgekehrt.
      </p>
      
      <p>Manchmal bekommt man den Eindruck, dass sich ein Übergang an den anderen reiht: Ferien starten, Ferien enden, Schuljahr startet, Schuljahr endet ... und wir mittendrin.
      </p>
      
      <p>In der Informatik können Übergänge mit solchen Diagrammen dargestellt werden. Ein Pfad führt zum Ziel. Dieser zeigt dir die Antwort.
      </p>
      
      <p><img src="/chals/chal104.png" style="background:white;" alt="graph"></p>
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
      
      <p><img src="/chals/chal105.jpg"  alt="isar tor"/>
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
      <p>Mensch, wie nervig sind Diskussionen darüber, welche Programmiersprache besser ist! Zum Glück bist du jemand, der es besser weiß: Alle Programmiersprachen sind im Kern gleich mächtig - eine Erkenntnis, die Turing wesentlich mitentwickelt hat.
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
        correct: output === secrets('chal_109'),
      }
    },
  },
]
