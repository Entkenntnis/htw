const secrets = require('./secrets-loader.js')
const crypto = require('crypto')

module.exports = [
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
                <td>${App.moment(entry.lastActive).locale('de').fromNow()}</td>
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
      <p>Wenn einem langweilig ist, kommt man doch auf verrückte Ideen. Ich bin zum Beispiel letztens auf die Idee gekommen, die Höhe meines Fensters über der Straße auszumessen. Aber nicht mit einem Messband, das wäre viel zu langweilig. Stattdessen habe ich einen Stein aus meinem Fenster fallen lassen. Nach genau 1,43 Sekunden hat er den Boden berührt.

      <p>Wie hoch ist nun mein Fenster über der Straße? (in Metern auf Zentimeter gerundet, Luftreibung kann vernachlässigt werden, Erdbeschleunigung = 9,81 m/s²)</p>
    `,
    check: (answer) => {
      const prepared = answer.trim().replace('.', ',')
      return {
        answer: prepared,
        correct: prepared === secrets('chal_307'),
      }
    },
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
      <p>Nachdem das Berechnen der Höhe meines Fensters so gut geklappt hat, wollte ich es noch auf einer größeren Skala probieren. An einem trockenen Tag mit 20°C stand ich also an der Kante einer sehr hohen Klippe in den Bergen und ließ wieder einen Stein fallen. Ich hörte nach genau 6,733 Sekunden den Aufprall.</p>

      <p>Wie hoch ist nun die Klippe? (in Metern auf Dezimeter gerundet, Luftreibung kann vernachlässigt werden, Erdbeschleunigung = 9,81 m/s²)</p>

    `,
    check: (answer) => {
      const prepared = answer.trim().replace('.', ',')
      return {
        answer: prepared,
        correct: prepared === secrets('chal_308'),
      }
    },
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
