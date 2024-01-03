const secrets = require('./secrets-loader.js')
const crypto = require('crypto')

module.exports = [
  {
    id: 300,
    pos: { x: 1750, y: 600 },
    title: { de: 'Community-Bereich', en: 'Community Area' },
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
        if (a.solved === b.solved) {
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
        if (i === 0) {
          usersList[i].rank = rank
        } else {
          if (usersList[i].solved !== usersList[i - 1].solved) {
            rank = i + 1
          }
          usersList[i].rank = rank
        }
      }

      return req.lng.startsWith('de')
        ? `
        <p>Herzlich willkommen im Community-Bereich! Wir sind mittlerweile viele Leute auf Hack The Web und haben auch einige kreative Köpfe hier mit guten Ideen für neue Aufgaben. Daher gibt es hier regelmäßig neue Inhalte - von Euch für Euch.
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
        
        <p style="text-align:right;"><label><input type="checkbox" onclick="handleClick(this)"> zeige nur aktiv in letzten 24 Stunden</label></p>
        
        <table class="table table-hover" id="highscore-table">
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
              .map((entry) => {
                const lastActive = App.moment(entry.lastActive)
                const days =
                  (new Date().getTime() - lastActive.valueOf()) /
                  (1000 * 60 * 60 * 24)
                return `
              <tr class="${days > 1 ? 'old' : ''}">
                <td>${entry.rank}</td>
                <td>${userNameIndex[entry.userId]}</td>
                <td>${entry.solved}</td>
                <td>${lastActive.locale('de').fromNow()}</td>
              </tr>
            `
              })
              .join('')}
          </tbody>
        </table>
        
        <script>
          function handleClick(e) {
            const table = document.getElementById('highscore-table')
            if (e.checked) {
              table.classList.add('hide-old')
            } else {
              table.classList.remove('hide-old')
            }
          }
        </script>
        
        <style>
          table.hide-old .old {
            display: none;
          }
        </style>
      `
        : `
        <p>Welcome to the community area! There are now a lot of people on Hack The Web, and we also have some creative minds here with good ideas for new tasks. That's why there is new content here regularly — from you for you.
        </p>
        
        <p>Everyone can take part. The more ideas we have, the more colorful it becomes. The tasks can be easy or extremely difficult, funny or serious. That's up to you. If you have an idea, join the <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord server</a> and write me a message.
        </p>
        
        <!-- psst - hey - try /challenge/1337 -->
        
        <p>Ready to start? The answer is the number of this challenge.
        </p>
        
        <form autocomplete="off" method="post" id="challenge_form">
          <input id="challenge_answer" type="text" name="answer" style="height:32px">
          <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
        </form>
        
        <h3 style="margin-top:96px;margin-bottom:24px;">High score for the community area
        </h3>
        
        <table class="table table-hover">
          <thead>
            <tr>
              
                <th scope="col">Place</th>
              
              <th scope="col">Username</th>
              <th scope="col">Solved challenges</th>
              <th scope="col">Last active</th>
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
                <td>${App.moment(entry.lastActive).locale('en').fromNow()}</td>
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
    pos: { x: 750, y: 2000 },
    title: { de: 'Schnittstelle', en: 'Interface' },
    date: '2023-07-28',
    author: 'cuzimbisonratte',
    deps: [328],
    noScore: true,
    html: {
      de: `
      <p>Die Antwort findest du, wenn du die <strong>Löschung</strong> von &nbsp;<code>/chal/chal301</code>&nbsp; anforderst.
      </p>
    `,
      en: `<p>The answer can be found if you request the <strong>deletion</strong> of &nbsp;<code>/chal/chal301</code>&nbsp;.
          </p>`,
    },
    solution: secrets('chal_301'),
  },

  {
    id: 302,
    pos: { x: 550, y: 2000 },
    title: { de: 'Schnittstelle II', en: 'Interface II' },
    date: '2023-07-28',
    author: 'cuzimbisonratte',
    deps: [301],
    noScore: true,
    render: ({ req }) => {
      const username = req.user.name
      const secretString = username + secrets('chal_302')
      const hash = crypto.createHash('md5').update(secretString).digest('hex')
      const isGerman = req.lng.startsWith('de')

      return isGerman
        ? `
        <p>Wie bei der vorherigen Aufgabe versuchst du etwas zu löschen. Lösche &nbsp;<code>/chal/chal302</code>&nbsp; und autorisiere dich dabei mit diesem Header:
        </p>
        
        <pre><code>Authorization: HTW ${encodeURIComponent(
          username + '⚻' + hash
        )}</code></pre>
      `
        : `
        <p>As with the previous task, you are trying to delete something. Delete &nbsp;<code>/chal/chal302</code>&nbsp; and authorize yourself with this header:
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
    pos: { x: 2000, y: 630 },
    title: { de: 'Rechensport', en: 'Mental arithmetic' },
    author: 'simonesien',
    date: '2023-07-28',
    deps: [300],
    noScore: true,
    render: ({ req }) => {
      const isGerman = req.lng.startsWith('de')

      function generateTask() {
        let num1
        let num2
        let op
        let result
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

      return isGerman
        ? `
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
        : `
        <p>Knowing you, you're definitely great at mental arithmetic. Here's a challenge for you — you have to solve 15 tasks in 30 seconds or less. Maybe you can think of something that will help you...
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
          <p style="margin-top:16px;">Remaining time: <span id="timer">30.00</span> Seconds</p>
          <p><input type="submit" value="Submit" style="margin-top:16px;"/></p>
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
      const isGerman = req.lng.startsWith('de')
      if (!req.session.chal303_ts || !req.session.chal303_result) {
        return {
          answer: isGerman ? 'Keine Session gefunden' : 'No session found',
          correct: false,
        }
      }

      const ts = new Date().getTime()
      const startTs = parseInt(req.session.chal303_ts)

      if (ts - startTs > 1000 * 32) {
        return {
          answer: isGerman ? 'Zeit abgelaufen' : 'Time ended',
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
        correct: resultString === req.session.chal303_result,
      }
    },
    hidesubmit: true,
  },

  {
    id: 304,
    pos: { x: 750, y: 2150 },
    title: { de: 'Primzahlen', en: 'Prime numbers' },
    author: 'darkstar',
    date: '2023-08-25',
    deps: [328],
    noScore: true,
    html: {
      de: `
      <p>Entdecke die Primzahlen und ihre Eigenschaften!</p>

      <h4 style="margin-top:24px">Was sind Primzahlen?</h4>

      <p>Primzahlen sind ganze Zahlen größer als 1, die nur zwei positive Teiler haben: 1 und sich selbst. Mit anderen Worten, eine Primzahl kann nicht gleichmäßig durch eine andere Zahl außer 1 und sich selbst geteilt werden. Zum Beispiel sind 2, 3, 5, 7 und 11 Primzahlen.</p>

      <h4 style="margin-top:24px">Wie erkennt man Primzahlen?</h4>

      <p>Um herauszufinden, ob eine Zahl eine Primzahl ist, kannst du die Divisionstestmethode verwenden. Du teilst die zu überprüfende Zahl durch alle Zahlen von 2 bis zur Quadratwurzel dieser Zahl und prüfst, ob eine dieser Divisionen ohne Rest aufgeht. Wenn keine Division ohne Rest möglich ist, handelt es sich um eine Primzahl. Dies liegt daran, dass, wenn eine Zahl n keine Primzahl wäre, sie mindestens einen Teiler haben müsste, der kleiner oder gleich der Quadratwurzel von n ist.</p>

      <h4 style="margin-top:24px">Deine Aufgabe</h4>

      <p>Deine Aufgabe besteht darin, alle Primzahlen von 2 bis 4294967296 zu finden und sie anschließend zu addieren.</p>

      <p>Beispiel: Summe aller Primzahlen im Bereich von 1 bis 42:  2 + 3 + 5 + 7 + 11 + 13 + 17 + 19 + 23 + 29 + 31 + 37 + 41 = 238</p>
    `,
      en: `
        <p>Discover the prime numbers and their properties!</p>
        
        <h4 style="margin-top:24px">What are prime numbers?</h4>
        
        <p>Prime numbers are whole numbers greater than 1 that have only two positive divisors: 1 and itself. In other words, a prime number can only be divided evenly by one and itself. For example, 2, 3, 5, 7, and 11 are prime numbers.</p>
        
        <h4 style="margin-top:24px">How to recognize prime numbers?</h4>
        
        <p>To find out if a number is a prime number, you can use the division test method. You divide the number to be checked by all numbers from 2 to the square root of that number and check if any of these divisions are without a remainder. If no division is possible without a remainder, it is a prime number. This is because if a number n were not a prime number, it would have to have at least one divisor that is less than or equal to the square root of n.</p>
        
        <h4 style="margin-top:24px">Your task</h4>
        
        <p>Your task is to find all prime numbers from 2 to 4294967296 and then add them up.</p>
        
        <p>Example: Sum of all prime numbers in the range from 1 to 42: 2 + 3 + 5 + 7 + 11 + 13 + 17 + 19 + 23 + 29 + 31 + 37 + 41 = 238</p>
        `,
    },
    solution: secrets('chal_304'),
  },

  {
    id: 305,
    pos: { x: 750, y: 2200 },
    title: { de: 'Rätselhafte Kodierung', en: 'Mysterious encoding' },
    author: 'darkstar',
    date: '2023-08-25',
    deps: [328],
    noScore: true,
    html: {
      de: `
    
      <p>In der digitalen Welt werden oft raffinierte Methoden verwendet, um Daten zu kodieren und zu übertragen. In dieser Aufgabe werdet ihr einen Blick auf eine mysteriöse Kodierung werfen, die dazu dient, Daten effizient zu speichern und zu übertragen.
      </p>
      
      <pre style="margin-top:24px">${"&lt;~8SoSMDKKH1F(8ltARlp0FWa&quot;ZF(I6d+Eh=:G@bZ&amp;ATT%]@&lt;6!&gt;2'?IEDIjr'Eq\\C%Eb-@ZDL,\n`)C`mn4EcY`(Bk:gdDImhq&gt;%MDXBOu'4+E_ND6&gt;:&gt;uEb&amp;U#ASrW$@&lt;-[:F*(u0Ch7K:+BRW;Eb0\n-!+@9LXAMu@f2DcO[ASGXfASrW6ATE!+DId=#+E_R4$:8S&amp;@r#WuG&amp;M7@1E]#0FCfM9Bl5%M+Bi\n&gt;j@q]Fk+E_OF@;]UeCih3NDKU&amp;IF&lt;EnYF(I&lt;g+?25$&gt;%MDXBOu'(F`(^sCN&quot;*6ATDm,ATDl81bD\n%&gt;FCd$jD&quot;_@SAKY])+&gt;k9FASGXfASs+C6t(-ZD.-pfF&lt;EnYF(I&lt;g+DG^96=kIcB-:W*AftVuAI:\nk&lt;AncR*ASuf:AS,OcCNO96ATAo%Ci^^c@&lt;6!&lt;1b9b[@3B-&amp;+Dk\\'EZd\\_FE8R=DBN`mEdD;;ATA\nnsASGXfASu&gt;FDJ*MfCN!`tATDlD+Eq78+F8/QASH$nEZf&amp;hBOu3qDBM&gt;UFCf?#Bk(guAKYU_BQA\n2I$6T]2@WH0qASuQ?+Co%tDBNS'F*1u+FCfM99_NOMDJ+$7DfTqBBleA=6SN%,CMkt=CGTu`~&gt;"}</pre>
      
    `,
      en: `
        <p>In the digital world, sophisticated methods are often used to encode and transmit data. In this challenge, you will take a look at a mysterious encoding that is used to store and transmit data efficiently.
        </p>
        
        <pre style="margin-top:24px">${'&lt;~&lt;GlVeCLnVT@&lt;6!&lt;1b9b9@&lt;6!&gt;2&#39;@$_ATJu&amp;+DbJ,B4Z*+DKTf*ATAo3AftVuAnGU\npASuT4@q]:k@:OCjEcW@FD]j(3E,oN2ASuT4@VK^gEd8d&lt;@&lt;&gt;p1%16TY@&lt;,ddFCfK6\n+EVNEEb031ATMF#F&lt;G%,DIIR2+Cno&amp;@4i[(BPD9o+@9LXAMu@fF`V,8+&gt;u&amp;!@q]:k@\n:OCjEcW@3DIa1`@rH7.ATDm6+C]/*@r$-.De:+J+C]V&lt;ATJu.DKKe&gt;1a$:A@&lt;,ddFC\nfK6/0I8fF(I&lt;g+E_a:F!*G&quot;+Cf(nEa`I&quot;ATDi7@;]Tu@rH7.ATDm6%16T`DK]T3FE8\nR6Ci&lt;g!F!,C5+&gt;b3MH$!V=+DG_8D]gn[@q]:k@:OCjEcWiU&lt;+oue+DkP&amp;ATJt\\@&lt;6!\n&gt;2&#39;?aSEb-A)AnGUaFD5o0+EV:*DBM8SF(I6d+DG^9FCfK0F!,C5%16ZYAnbahASu&quot;&#39;\n+EV:*DBM8SF(I6d/0JAB+DGp?ASu!rA7]g)D/XH++C]&amp;,F!,17+CQC6BQ%p5ATAo&#39;B\nOPpi@ru:&amp;+DbV,B67f&lt;+ED%7F_l/6DJ()+DBNV,B4tjs%17;mBk(g!Ch7$cF!,RC+C\nQC+BkM*jEZen$FC?;&amp;ASuR&#39;FEoJJ$6Tcb6?s\\qBOr&lt;1@&lt;jCHH#IhG+EM+&amp;EarcoA0\n&gt;r3Cisi6Df-\\ADfTA2BlbCa0OutTDDYj=1NG)~&gt;'}</pre>
      
    `,
    },
    solution: secrets('chal_305'),
  },

  {
    id: 306,
    pos: { x: 1700, y: 430 },
    title: { de: 'Ticket', en: 'Ticket' },
    author: 'cuzimbisonratte',
    date: '2023-08-31',
    deps: [300],
    noScore: true,
    render: ({ req }) => {
      const isGerman = req.lng.startsWith('de')
      return isGerman
        ? `
      <p>Um Zugang zu dieser Aufgabe zu erhalten, musst du dein Ticket auf folgender Seite vorzeigen.
      </p>
      
      <p><a href="/chal/chal306" target="_blank">Bitte dein Ticket vorzeigen</a>
      </p>
      
      <p>Dein Zugangscode lautet <code>${req.user.id}@Dodo-Airlines</code>. Der Code muss in Form eines QR-Codes eingereicht werden. Dann erhältst du die Antwort.
      </p>
    `
        : `
        <p>To access this task, you have to show your ticket on the following page.
        </p>
        
        <p><a href="/chal/chal306" target="_blank">Please show your ticket</a>
        </p>
        
        <p>Your access code is <code>${req.user.id}@Dodo-Airlines</code>. The code must be submitted in the form of a QR code. Then you will receive the answer.
        </p>
        `
    },
    solution: secrets('chal_306'),
  },

  {
    id: 307,
    pos: { x: 1580, y: 420 },
    title: { de: 'Freier Fall', en: 'Free fall' },
    author: 'rkasti u. Satsuma',
    date: '2023-08-31',
    deps: [300],
    noScore: true,
    html: {
      de: `      
      <p>Wenn einem langweilig ist, kommt man doch auf verrückte Ideen. Ich bin zum Beispiel letztens auf die Idee gekommen, die Höhe meines Fensters über der Straße auszumessen. Aber nicht mit einem Messband, das wäre viel zu langweilig. Stattdessen habe ich einen Stein aus meinem Fenster fallen lassen. Nach genau 1,43 Sekunden hat er den Boden berührt.

      <p>Wie hoch ist nun mein Fenster über der Straße? (in Metern auf Zentimeter gerundet, Luftreibung kann vernachlässigt werden, Erdbeschleunigung = 9,81 m/s²)</p>
    `,
      en: `
        <p>When you're bored, you come up with crazy ideas. For example, I recently came up with the idea of measuring the height of my window above the street. But not with a tape measure, that would be way too boring. Instead, I dropped a stone out of my window. After exactly 1.43 seconds it touched the ground.
        
        <p>How high is my window above the street? (In meters rounded to centimeters, air friction can be neglected, acceleration due to gravity = 9.81 m/s²)</p>
        `,
    },
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
    pos: { x: 1550, y: 320 },
    title: { de: 'Freier Fall II', en: 'Free fall II' },
    author: 'rkasti u. Satsuma',
    date: '2023-08-31',
    deps: [307],
    noScore: true,
    html: {
      de: `
      <p>Nachdem das Berechnen der Höhe meines Fensters so gut geklappt hat, wollte ich es noch auf einer größeren Skala probieren. An einem trockenen Tag mit 20 °C stand ich also an der Kante einer sehr hohen Klippe in den Bergen und ließ wieder einen Stein fallen. Ich hörte nach genau 6,733 Sekunden den Aufprall.</p>

      <p>Wie hoch ist nun die Klippe? (in Metern auf Dezimeter gerundet, Luftreibung kann vernachlässigt werden, Erdbeschleunigung = 9,81 m/s²)</p>

    `,
      en: `
        <p>After calculating the height of my window worked so well, I wanted to try it on a larger scale. So on a dry day at 20 °C, I stood at the edge of a very high cliff in the mountains and dropped another stone. After exactly 6.733 seconds, I heard the impact.</p>
        
        <p>How high is the cliff? (In meters rounded to decimeters, air friction can be neglected, acceleration due to gravity = 9.81 m/s²)</p>
        
        `,
    },
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
    pos: { x: 750, y: 2100 },
    title: { de: 'Cyberchef', en: 'Cyberchef' },
    author: 'provn_tq97',
    date: '2023-09-01',
    deps: [328],
    noScore: true,
    html: {
      de: `
      <p>Mir war ein wenig langweilig, daher habe ich das Lösungswort mehrmals verschlüsselt 😁.</p>
      
      <p><code>&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOSG</code></p>
    `,
      en: `
      <p>I was a little bored, so I encrypted the answer several times 😁.</p>
      
      <p><code>&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FO&amp;m&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=R;-7@(&lt;^fJq&lt;)lg_AOS=R;-7@(;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOW(&lt;)lg_AOS=B;-7@(;FO&amp;m&lt;)lg_AOS=R;-7L,&lt;^g&amp;,&lt;)lg_AOS=R;-7L,;FOSG</code></p>
    `,
    },
    solution: secrets('chal_309'),
  },

  {
    id: 310,
    pos: { x: 750, y: 2050 },
    title: { de: 'RockYou', en: 'RockYou' },
    author: 'virusrpi',
    date: '2023-09-02',
    deps: [328],
    noScore: true,
    html: {
      de: `
      <p>Manchmal hilft nur noch <a href="https://www.kaggle.com/datasets/wjburns/common-password-list-rockyoutxt" target="_blank">ausprobieren </a>...</p>
      
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
      en: `
        <p>Sometimes you just have to <a href="https://www.kaggle.com/datasets/wjburns/common-password-list-rockyoutxt" target="_blank">try </a>...</p>
        
        <script src="/sha256.js"></script>
        
        <script>
          const salt = '3NL/usjb4vEg'
          const hash = '9bcf0c8289a97d33021b4790659396d9f8af1085210d2186b8ec38efcdc31472'
          
          window.onload = () => {
              document.getElementById('challenge_form').onsubmit = (e) => {
                  const value = document.getElementById('challenge_answer').value
                  if (sha256(salt + value).hex() !== hash) {
                      alert('Wrong password.')
                      e.preventDefault()
                      return false
                  }
              }
          }
        </script>
    `,
    },
    solution: secrets('chal_310'),
  },

  {
    id: 311,
    pos: { x: 1520, y: 520 },
    title: { de: 'Brainfuck?', en: 'Brainfuck?' },
    author: 'Lars',
    date: '2023-09-02',
    deps: [300],
    noScore: true,
    html: {
      de: `
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
      en: `
      <p>Some programming languages allow somewhat strange spellings for code. Brainfuck, for example, is a programming language that only works with eight characters. The following example makes it even better. You can write entire programs with just six characters. If you run the following code in the appropriate language, you will get the solution.</p>
      
      <pre>[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]
+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+
[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+
[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[
])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!
+[]]+([][[]]+[])[+!+[]]+(+[![]]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+!+[]]]+(!![]+[])[!
+[]+!+[]+!+[]]+(+(!+[]+!+[]+!+[]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+
[]]])[+!+[]+[+[]]]+([]+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(!
[]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+
[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!
+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][(
[][[]]+[])[+!+[]]+(![]+[])[+!+[]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[
]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[
]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[
])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]
+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[!+[]+!+[]])+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]])()([
][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+
[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[
])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[
])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[]
)[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+
[]]+([][[]]+[])[+!+[]]+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[
+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]
]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])
[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]()[+!+[]+[!+[]+!+[]]]+((!![]+[])[+[]]+[
+!+[]]+[!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!
+[]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[
]+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]+(
![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]
+[!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[+[]]+[!+[]
+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+
!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+(![]+[])[+!+[]]+([][
[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+
[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!
+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[+[]]+(!![]+[])[+[]]+[+!+[]]+[+!+[]]+[!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[
]+!+[]]+[!+[]+!+[]+!+[]]+[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[+!+[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]
]+[!+[]+!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]+([][[]]+[])[!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]]+[!+[
]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+(!![]+[])[+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]]+[+!+[]])[(![]+[])[!+[]+!+[]+!+[]]+(+(!+[]+!+[]+[+!+[]
]+[+!+[]]))[(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([]+[])[([][
(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]
+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[
]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(!
[]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]][([][[]]+[])[+!+[]]+(![]+[])[+!+[
]]+((+[])[([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+
[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[]
)[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[
]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]
+(!![]+[])[!+[]+!+[]+!+[]]]](!+[]+!+[]+!+[]+[+!+[]])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]]((!![
]+[])[+[]])[([][(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[
])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!
![]+[])[+[]]])[+!+[]+[+[]]]+([![]]+[][[]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]](([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]
]+(!![]+[])[+[]]][([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[
]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+
(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![
]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((!![]+[])[
+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+(![]+[+[]])[([![]]+[][[]])[
+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]
]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]]+![]+(![]+[+[]])[([![]]+[][[]])[+!
+[]+[+[]]]+(!![]+[])[+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+
(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]])()[([][(![]+[])[+[]]+(![]+[])[!+[]+
!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+
[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]
]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+
[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[+[]])[([![]]+[][[]])[+!+[]+[+[]]]+(!![]+[])[+[]]+(![]+
[])[+!+[]]+(![]+[])[!+[]+!+[]]+([![]]+[][[]])[+!+[]+[+[]]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]
+[])[!+[]+!+[]+!+[]]+(![]+[])[!+[]+!+[]+!+[]]]()[+!+[]+[+[]]])+[])[+!+[]])+([]+[])[(![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])
[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(!![]+[])[+[]]+([][(![]+[])[+[]]+(![]+[])[!+[]+!+[]
]+(![]+[])[+!+[]]+(!![]+[])[+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]]
)[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]+(!![]+[])[+[]]])[+!+[]+[+[]]]+(!![
]+[])[+!+[]]]()[+!+[]+[!+[]+!+[]]])())</pre>
    `,
    },
    solution: secrets('chal_311'),
  },

  {
    id: parseInt(secrets('secret_chal_1_id')),
    pos: { x: 750, y: 1950 },
    title: { de: 'Geheime Aufgabe', en: 'Secret Challenge' },
    author: 'darkermask',
    date: '2023-07-29',
    deps: [328],
    noScore: true,
    showAfterSolve: true,
    html: {
      de: `
      <p>Hallo, du hast mich gefunden :)
      </p>
      
      <p>Wir reden hier gerne über "Elite", aber mal ehrlich: Das wollen wir ja nicht wirklich sein.
      </p>
      
      <p>Die Antwort lautet Underdog.
      </p>
      
      <div style="position:absolute;bottom:0;right:0;color:rgb(128,128,128)"><small>Pst! Hier gibt's noch was: 0x&lt;span style=&quot;font-family:HackTheWeb&quot;&gt;lolo&lt;/span&gt;</small>
      </div>
      
      <style>
        body {
          height: 3000px;
          position:relative;
          
        }
        @font-face {
          font-family: 'HackTheWeb';
          src: url('/chals/HackTheWeb-Regular.otf');
        }
      </style>
    `,
      en: `
        <p>Hello, you found me :)
        </p>
        
        <p>We like to talk about "elite" here, but let's be honest: We don't really want to be that.
        </p>
        
        <p>The answer is underdog.
        </p>
        
        <div style="position:absolute;bottom:0;right:0;color:rgb(128,128,128)"><small>Shh! Here's something else: 0x&lt;span style=&quot;font-family:HackTheWeb&quot;&gt;lolo&lt;/span&gt;</small>
        </div>
       
        <style>
        body {
          height: 3000px;
          position:relative;
          
        }
        @font-face {
          font-family: 'HackTheWeb';
          src: url('/chals/HackTheWeb-Regular.otf');
        }
      </style>
    `,
    },
    solution: 'underdog',
  },

  {
    id: parseInt(secrets('secret_chal_2_id')),
    pos: { x: 550, y: 1950 },
    title: { de: 'Geheime Aufgabe II', en: 'Secret Challenge II' },
    author: 'darkermask',
    date: '2023-10-01',
    deps: [parseInt(secrets('secret_chal_1_id'))],
    noScore: true,
    showAfterSolve: true,
    html: {
      de: `
      <p>Hurra! Du hast mich wieder gefunden!</p>
      
      <p>Die Antwort lautet Detektiv.
      </p>
    `,
      en: `
        <p>Hurrah! You found me again!</p>
        <p>The answer is Detektiv (the German word for a detective)</p>
    `,
    },
    solution: 'detektiv',
  },

  {
    id: 312,
    pos: { x: 1460, y: 250 },
    title: { de: 'Freier Fall III', en: 'Free fall III' },
    author: 'rkasti u. Satsuma',
    date: '2023-10-01',
    deps: [308],
    noScore: true,
    html: {
      de: `
      <p>Ja, ich weiß, ich hab es übertrieben. Denn ich hab es geschafft, mich mit einer selbstgebauten Rakete in den Weltraum zu schießen,
        um dort das nächste Experiment durchzuführen. Der Plan besteht darin, eine Metallkugel von meiner Rakete aus auf die Erde fallen zu lassen.
        Ich befinde mich aktuell genau 87654321 Meter über der Erdoberfläche und lasse von dort die Kugel fallen.
        Kannst du mir sagen, wie lange die Kugel braucht, um auf der Erde einzuschlagen?</p>

      <p style="margin-bottom:4px;">Bedingungen:
      </p>
      <ul>
      <li>konstanter Erdradius von 6374,34 km (dort gilt g = 9,81 m/s²)</li>
      <li>Weitere Konstanten findest du hier: <a href="https://de.wikipedia.org/wiki/Physikalische_Konstante" target="_blank">https://de.wikipedia.org/wiki/Physikalische_Konstante</a></li>
      <li>jegliche Effekte der Atmosphäre sowie relativistische Effekte können vernachlässigt werden</li>
      <li>die Kugel wird nur von der Erde beeinflusst</li>
      <li>Angabe in ganzen Sekunden</li>
      </ul>

    `,
      en: `
        <p>Yes, I know, I overdid it. Because I managed to shoot myself into space with a self-made rocket,
        to carry out the next experiment there. The plan is to drop a metal ball to Earth from my rocket.
        I am currently exactly 87654321 meters above the earth's surface, and I let the ball fall from there.
        Can you tell me how long it takes for the bullet to hit the earth?</p>
        
        <p style="margin-bottom:4px;">Conditions:
        </p>
        
        <ul>
        <li>constant earth radius of 6374.34 km (there g = 9.81 m/s²)</li>
        <li>You can find more constants here: <a href="https://en.wikipedia.org/wiki/Physical_constant" target="_blank">https://en.wikipedia.org/wiki/Physical_constant</a></li>
        <li>any effects of the atmosphere as well as relativistic effects can be neglected</li>
        <li>the ball is only influenced by the earth</li>
        <li>answer in whole seconds</li>
        </ul>
        `,
    },
    check: (answer) => {
      const prepared = answer.trim().replace('.', ',')
      return {
        answer: prepared,
        correct: prepared === secrets('chal_312'),
      }
    },
  },

  {
    id: 313,
    pos: { x: 1480, y: 130 },
    title: { de: 'Freier Fall IV', en: 'Free fall IV' },
    author: 'rkasti u. Satsuma',
    date: '2023-10-01',
    deps: [312],
    noScore: true,
    html: {
      de: `
      <p>Ich befinde mich immer noch in meiner selbstgebauten Rakete und habe vor, das mögliche Finale dieses Experimentes durchzuführen.
Dafür habe ich die Metallkugel mit ein wenig Elektronik ausgestattet,
damit sie beim Aufprall auf die Erdoberfläche ein Radiosignal an einen Computer in der Rakete schickt.
Dieser misst die Zeit zwischen Loslassen der Kugel und empfangen des Radiosignales exakt.
Nachdem ich die Kugel fallen gelassen habe, hat der Computer folgende Zeit ausgegeben: 755367,5351298475669 s.
Wie hoch war ich nun mit meiner Rakete über der Erdoberfläche?</p>

      <p style="margin-bottom:4px;">Bedingungen:
      </p>
      <ul>
      <li>konstanter Erdradius von 6374,3400000 km (dort gilt g = 9,8100000000 m/s²), leite daraus die Erdmasse ab</li>
      <li>Weitere Konstanten findest du hier: <a href="https://de.wikipedia.org/wiki/Physikalische_Konstante" target="_blank">https://de.wikipedia.org/wiki/Physikalische_Konstante</a></li>
      <li>jegliche Effekte der Atmosphäre sowie relativistische Effekte können vernachlässigt werden</li>
      <li>die Kugel wird nur von der Erde beeinflusst</li>
      <li>Angabe in ganzen Metern</li>
      </ul>

    `,
      en: `
        <p>I am still in my self-made rocket and plan to carry out the possible finale of this experiment.
        For this I equipped the metal ball with a little electronics,
        so that it sends a radio signal to a computer in the rocket when it hits the earth's surface.
        This measures the time between releasing the ball and receiving the radio signal exactly.
        After I dropped the ball, the computer output the following time: 755367.5351298475669 s.
        How high was I with my rocket above the earth's surface?</p>
        
        <p style="margin-bottom:4px;">Conditions:
        </p>
        <ul>
        <li>constant earth radius of 6374.3400000 km (there g = 9.8100000000 m/s²), derive the earth mass from it</li>
        <li>You can find more constants here: <a href="https://en.wikipedia.org/wiki/Physical_constant" target="_blank">https://en.wikipedia.org/wiki/Physical_constant</a></li>
        <li>any effects of the atmosphere as well as relativistic effects can be neglected</li>
        <li>the ball is only influenced by the earth</li>
        <li>answer in whole meters</li>
        </ul>
        
        `,
    },
    check: (answer) => {
      const prepared = answer.trim().replace('.', ',')
      return {
        answer: prepared,
        correct: prepared === secrets('chal_313'),
      }
    },
  },

  {
    id: 314,
    pos: { x: 1860, y: 370 },
    title: { de: 'Tor', en: 'Tor' },
    date: '2023-10-01',
    author: 'virusrpi',
    deps: [300],
    noScore: true,
    html: {
      de: `
      <p>Finde die Antwort durch einen Besuch auf <code>arrrg.ahcbagldgzdpa74g2mh74fvk5zjzpfjbvgqin6g3mfuu66tynv2gkiid.onion/htw/chal314.txt</code>.
      </p>
    `,
      en: `
      <p>You can find the answer on <code>arrrg.ahcbagldgzdpa74g2mh74fvk5zjzpfjbvgqin6g3mfuu66tynv2gkiid.onion/htw/chal314.txt</code>.</p>
    `,
    },
    solution: secrets('chal_314'),
  },

  {
    id: 315,
    pos: { x: 550, y: 2050 },
    title: { de: 'Mentalist', en: 'Mentalist' },
    date: '2023-10-01',
    author: 'virusrpi',
    deps: [310],
    noScore: true,
    html: {
      de: `
      <p>
      Manchmal lässt sich ein Passwort auch erraten, wenn man genug Informationen über eine Person hat.
      </p>
      <p>
      Vorname: Max<br>
      Nachname: Musterman<br>
      Geburtstag: 18. Juni 2001<br>
      Katze: Felix<br>
      Lieblingsspiel: Minecraft<br>
      (zuffällig generierte Informationen)
      </p>
      
      <p><a href="https://null-byte.wonderhowto.com/how-to/create-custom-wordlists-for-password-cracking-using-mentalist-0183992/" target="_blank">Mentalist</a></p>
      
      <script src="/sha256.js"></script>
      
      <script>
        const salt = '3NL/usjb4vEg'
        const hash = '47fde76c898053a9db963df844bb936c26ab54867663f4d1505858d6c346eacc'
        
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
      en: `
        <p>
        Sometimes you can guess a password if you have enough information about a person.
        </p>
        <p>
        First name: Max<br>
        Last name: Musterman<br>
        Birthday: 18. June 2001<br>
        Cat: Felix<br>
        Favorite game: Minecraft<br>
        (randomly generated information)
        </p>
          
        <p><a href="https://null-byte.wonderhowto.com/how-to/create-custom-wordlists-for-password-cracking-using-mentalist-0183992/" target="_blank">Mentalist</a></p>
      
        <script src="/sha256.js"></script>
        
        <script>
          const salt = '3NL/usjb4vEg'
          const hash = '47fde76c898053a9db963df844bb936c26ab54867663f4d1505858d6c346eacc'
          
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
    },
    solution: secrets('chal_315'),
  },

  {
    id: 316,
    pos: { x: 1830, y: 815 },
    title: { de: 'OSINT', en: 'OSINT' },
    date: '2023-10-19',
    author: 'User0',
    deps: [300],
    noScore: true,
    html: {
      de: `
      <p>Ein guter Hacker muss auch Detektivarbeit leisten. Zeig, dass du das Zeug dazu hast! Welcher Fluss ist hier abgebildet?
      </p>
      
      <p><img src="/chals/chal316.jpg" alt="Fluss"></p>
    `,
      en: `
      <p>A good hacker also needs to do detective work. Show that you have what it takes! Which river is depicted here?</p>

      <p><img src="/chals/chal316.jpg" alt="River"></p>
    `,
    },
    solution: secrets('chal_316'),
  },

  {
    id: 317,
    pos: { x: 1810, y: 1035 },
    title: { de: 'OSINT III', en: 'OSINT III' },
    date: '2023-10-19',
    author: 'User0',
    deps: [324],
    noScore: true,
    html: {
      de: `
      <p>Schon lange versuchst du diese Webseite zu hacken. Den Login-Namen des Administrators hast Du bereits. Die Sicherheitsfrage, um das Passwort zu ändern lautet: “Traumhafter Urlaubsort”. Auf dem Instagram-Account seiner Freundin findest du dieses alte Video. Ist das der Ort?
      </p>
      
      <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ks3kxAc3nSo?si=Qz3Tr3hAfy9Nh-5t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `,
      en: `
      <p>You've been trying to hack this website for a long time. You already have the administrator's login name. The security question to change the password is: "Dreamy vacation spot." On his girlfriend's Instagram account, you find this old video. Is that the place?</p>

      <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ks3kxAc3nSo?si=Qz3Tr3hAfy9Nh-5t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `,
    },
    solution: secrets('chal_317'),
  },

  {
    id: 318,
    pos: { x: 2150, y: 395 },
    title: { de: 'Transponiert', en: 'Transposed' },
    date: '2023-10-28',
    author: 'dpw',
    deps: [322],
    noScore: true,
    html: {
      de: `
      <p><img src="/chals/chal318.png" alt="Zaun"></p>
      
      <p>Ein Wink mit dem Zaunpfahl: bestimmte Zeichen durch andere Zeichen zu ersetzen ist nur eine Art, Text zu verschlüsseln (Substitution), denn man kann einen Text auch unkenntlich machen, in dem man die Zeichen nicht verändert, sondern nur verschiebt (Transposition).</p>
      
      <pre style="white-space: pre-wrap;"><code>Tonfithsln i Teü,tnvns atikSwiwä tn a nrpsosfrsnaüc  iolennaecdv evrlst i  i oe htnadsr le a o ädetonmhdk en.Slu:Gez.asiicie dnrinrnv,w aurhnilx shsldmmnctndBcaeu  oshßnn.ntr  nr lcieekbri ttatannthn lun mseetceaah ubfWcenseAtirraeeru</code></pre>
    `,
      en: `
      <p><img src="/chals/chal318.png" alt="Fence"></p>
      
      <p>Sometimes you have to jump to one side of the fence: either you replace certain characters with other characters to encode your secret text (substitution), or you do not replace characters but only move them around (transposition).</p>
      
      <pre style="white-space: pre-wrap;"><code>Orrs r u uduxto'ue tt wyucea i.stnfustaoinceseo slio oeoget hyuntdch df het.Ori ooleoz  nriday i:reu. oe nptoih rnyeufyec nht oa  a eetwrrmelestes,ucdrgitesemetlI  anac,sipalf ne stcd oo rhe  nhwmetGz</code></pre>
    `,
    },
    solution: secrets('chal_318'),
  },

  {
    id: 319,
    pos: { x: 2185, y: 295 },
    title: { de: 'Transponiert II', en: 'Transposed II' },
    date: '2023-10-28',
    author: 'dpw',
    deps: [318],
    noScore: true,
    html: {
      de: `
      <p>Zum Verschlüsseln von Daten ist Transposition alleine nicht sinnvoll, weil zu leicht zu knacken, aber beim Komprimieren von Daten kann sie sehr nützlich sein.
Das Kompressionsprogramm bzip2 benutzt dazu ein Verfahren, mit dem dieser Text zur Kompression vorbereitet wurde:</p>
      
      <pre style="white-space: pre-wrap;"><code>e..eneetrd,rnthetnsnsm:.tneit    ^   $f MnrDdrt rl aiiun nihthntmirlZr tghhdtvirbtsTrstou n coccc  eeeeeDsmesehs gra roeeeaeiiaiuaoiA hKiVfwmeütsofepheooesasn  snaueeuhfrxefsarnus neaazala tetf</code></pre>
      
      <p>Hinweis: <code>^</code> und <code>$</code> markieren Anfang und Ende des Klartexts.</p>
    `,
      en: `
      <pre style="white-space: pre-wrap;">Transposition alone is not useful for encrypting data because it is too easy to crack, but it can be very useful when compressing data.
The compression program bzip2 uses such a method, which this text was prepared for compression with:</p>
      
      <p><code>..rneneuehlseaesrsnaenrdttmle:.ewis  ^$  rerscr  eh hr    aeinhsmerhhtdpmsrtwvvtmhrst st oigctTttT e ht st daaroarioieoaooaa rciciffYrpamoeaaet afpeof eneri e  nseunxaafc s    i ole ose</code></p>
      
      <p>Hint: <code>^</code> and <code>$</code> mark beginning and end of the plaintext.</pre>
    `,
    },
    solution: secrets('chal_319'),
  },

  {
    id: 320,
    pos: { x: 1970, y: 435 },
    title: { de: 'Schnitzeljagd', en: 'Treasure Hunt' },
    date: '2023-10-28',
    author: 'drache1209',
    deps: [300],
    noScore: true,
    html: {
      de: `
      <p>Kannst du meine Schnitzeljagd testen? Ich bin mir nicht sicher, ob sie zu schwer ist. Du musst von jedem gelösten Wort den ersten Buchstaben nehmen.</p>
      
      <ol>
        <li>Die größte Online Enzyklopädie</li>
        <li>Verzögerung, damit Daten von einem Punkt zum anderen reisen können</li>
        <li>Eine endliche, eindeutige Handlungsvorschrift</li>
        <li>Eigenschaft eines Systems um mehrere Berechungen gleichzeitig ausführen zu können</li>
      </ol>
    `,
      en: `
      <p>Can you test my treasure hunt? I'm not sure if it's too difficult. You have to take the first letter of each solved word.</p>

      <ol>
        <li>The largest online encyclopedia</li>
        <li>Delay to allow data to travel from one point to another</li>
        <li>A finite, unambiguous set of instructions</li>
        <li>A machine learning model inspired by the human brain's structure</li>
      </ol>
    `,
    },
    solution: secrets('chal_320'),
  },

  {
    id: 321,
    pos: { x: 1670, y: 835 },
    title: { de: 'Mehrdeutig', en: 'Ambiguous' },
    date: '2023-10-28',
    author: 'm.florian u. Minecraftspielen',
    deps: [300],
    noScore: true,
    html: {
      de: `
      <p>Ziel dieser Aufgabe ist es, 100x die falsche Antwort einzugeben.</p>
    `,
      en: `
      <p>The goal of this challenge is to type the wrong answer 100 times.</p>
    `,
    },
    solution: [secrets('chal_321'), secrets('chal_321_en')],
  },

  {
    id: 322,
    pos: { x: 2050, y: 525 },
    title: { de: 'Hommage', en: 'Hommage' },
    date: '2023-10-29',
    deps: [300],
    noScore: true,
    html: {
      de: `
      <p>Hack The Web ist eine Hommage an eine ältere Rätselseite. Viele der Ideen sind von dort inspiriert. Die Seite beschreibt sich selbst mit diesen Worten:</p>
      
      <p><i>"The hacker explores the intersection of art and science in an insatiable quest to understand and shape the world around them.<br />We guide you on this journey."</i></p>
      
      <p>Deine Antwort ist der Name dieser Rätselseite.</p>
    `,
      en: `
      <p>Hack The Web is an hommage to an older puzzle website. Many of the ideas are inspired by it. That site describes itself with these words:</p>
      
      <p><i>"The hacker explores the intersection of art and science in an insatiable quest to understand and shape the world around them.<br />We guide you on this journey."</i></p>
      
      <p>Your answer is the name of this puzzle website.</p>
    `,
    },
    solution: secrets('chal_322'),
  },

  {
    id: 323,
    pos: { x: 1705, y: 955 },
    title: { de: 'Mehrdeutig II', en: 'Ambiguous II' },
    date: '2023-11-07',
    author: 'Minecraftspielen u. drache1209',
    deps: [321],
    noScore: true,
    html: {
      de: `
      <p>Hier ist <a href="/chals/chal323.txt">eine Textdatei</a>. Irgendwo hier befindet sich die Lösung. Finde sie.</p>
      
      <!-- Die Antwort lautet: 101% richtig -->
    `,
      en: `
      <p>Here is <a href="/chals/chal323.txt">a text file</a>. The answer is somewhere here. Find it.</p>
      
      <!-- The answer is: 101% richtig -->
    `,
    },
    solution: secrets('chal_323'),
  },

  {
    id: 324,
    pos: { x: 1790, y: 915 },
    title: { de: 'OSINT II', en: 'OSINT II' },
    date: '2023-11-07',
    author: 'User0',
    deps: [316],
    noScore: true,
    html: {
      de: `
      <p>Hier hat jemand mit Photoshop den Laden unkenntlich gemacht. Für Dich dürfte es aber kein Problem sein herauszufinden wie er heißt. Ein Wort, ohne "shop", oder "GmbH" oder so.</p>
      
      <p><img src="/chals/chal324.jpg" alt="Laden" style="width:600px;"></p>
    `,
      en: `
      <p>Here, someone has made the store unrecognizable with Photoshop. But for you, it shouldn't be a problem to figure out its name. A word without "shop," "GmbH," or anything like that.</p>
      
      <p><img src="/chals/chal324.jpg" alt="Shop" style="width:600px;"></p>
    `,
    },
    solution: secrets('chal_324'),
  },

  {
    id: 325,
    pos: { x: 2225, y: 450 },
    title: { de: 'Vor aller Augen', en: 'In Plain Sight' },
    date: '2023-11-13',
    author: 'dpw',
    deps: [322],
    noScore: true,
    html: {
      de: `
      <p>Tief im Dunkeln still und leise.</p>
      
      <p><img src="/chals/load_it_check_it_quick_rewrite_it.jpg" alt="Brunnen" ></p>
    `,
      en: `
      <p>Deep in the dark quiet and still.</p>
      
      <p><img src="/chals/load_it_check_it_quick_rewrite_it.jpg" alt="Well" ></p>
    `,
    },
    solution: secrets('chal_325'),
  },

  {
    id: 326,
    pos: { x: 2365, y: 420 },
    title: { de: 'Vor aller Augen II', en: 'In Plain Sight II' },
    date: '2023-11-13',
    author: 'dpw',
    deps: [325],
    noScore: true,
    html: {
      de: `
      <p>Dieses Bild enthält 4% Geheimnisse.</p>
      
      <p><img src="/chals/buy_it_use_it_break_it_fix_it.png" alt="Rauschen"></p>
    `,
      en: `
      <p>This image contains 4% secrets.</p>
      
      <p><img src="/chals/buy_it_use_it_break_it_fix_it.png" alt="Noise"></p>
    `,
    },
    solution: secrets('chal_326'),
  },

  {
    id: 327,
    pos: { x: 2475, y: 340 },
    title: { de: 'Vor aller Augen III', en: 'In Plain Sight III' },
    date: '2023-11-13',
    author: 'dpw',
    deps: [326],
    noScore: true,
    html: {
      de: `
      <p>Nur auf die Oberfläche zu schauen reicht nicht, wenn es danach noch weitergeht.</p>
      
      <p><img src="/chals/write_it_cut_it_paste_it_save_it.png" alt="Buntes Rauschen"></p>
    `,
      en: `
      <p>Just looking at the surface is not enough if there is more to see afterwards.</p>
      
      <p><img src="/chals/write_it_cut_it_paste_it_save_it.png" alt="Colorful noise"></p>
    `,
    },
    solution: secrets('chal_327'),
  },

  {
    id: 328,
    pos: { x: 888, y: 2070 },
    title: { de: 'Community-Archiv', en: 'Community Archive' },
    date: '2023-12-06',
    deps: [103],
    noScore: true,
    render: async ({ App, req }) => {
      const communityArea1Challenges = App.challenges.data
        .filter((c) => c.deps.includes(300))
        .map((c) => c.id)

      const solvedDb = await App.db.models.Solution.findAll({
        where: { UserId: req.user.id },
        raw: true,
      })

      const count = solvedDb.filter((s) =>
        communityArea1Challenges.includes(s.cid)
      ).length
      const target = Math.ceil(communityArea1Challenges.length / 2)

      if (count < target && !solvedDb.some((s) => s.cid == 328)) {
        return {
          de: `
            <p>Löse ${target} Aufgaben, die vom Start des Community-Bereichs direkt erreichbar sind, um das Archiv freizuschalten.</p>
            
            <p>Fortschritt: ${count}/${target}</p>
          `,
          en: `
            <p>Complete ${target} tasks that are directly accessible from the start of the community area to unlock the archive.</p>
            
            <p>Progress: ${count}/${target}</p>
          `,
        }
      }

      return {
        de: `
          <p>Moin Meister! Deine Motivation ist nicht zu stoppen. Als Belohnung erhältst du hiermit Zugang zum Community-Archiv.</p>
          
          <p>Schönheit liegt im Auge der Betrachter. Die Aufgaben im Archiv wurden weniger oft gelöst als die anderen Aufgaben im Community-Bereich. Die Gründe dafür können unterschiedlich sein. Manche Aufgaben sind technisch anspruchsvoll, andere brauchen eine geschickte Intuition.</p>
          
          <p>Doch genau deshalb brauchen die Aufgaben eine Person wie dich, die sie mit Geduld und Liebe betrachtet.</p>
          
          <p>Aber nun genug der Worte. Klicke auf den Button, um das Archiv freizuschalten.</p>
          
          <form method="post"><input type="hidden" name="answer" value="${secrets(
            'chal_328'
          )}"><button class="btn btn-primary btn-sm">Archiv freischalten</button></form>
        `,
        en: `
          <p>Hello Friend! Your motivation is unstoppable. As a reward, you now have access to the community archive.</p>

          <p>Beauty is in the eye of the beholder. Tasks in the archive have been solved less frequently than other tasks in the community area. The reasons for this can vary. Some tasks are technically challenging, while others require clever intuition.</p>

          <p>That's exactly why tasks like these need someone like you to look at them with patience and love.</p>

          <p>But enough words for now. Click the button to unlock the archive.</p>

          <form method="post"><input type="hidden" name="answer" value="${secrets(
            'chal_328'
          )}"><button class="btn btn-primary btn-sm">Unlock Archive</button></form>
        `,
      }
    },
    solution: secrets('chal_328'),
    hidesubmit: true,
  },

  {
    id: 330,
    pos: { x: 1930, y: 750 },
    title: { de: 'Fab Four', en: 'Fab Four' },
    date: '2023-12-06',
    author: 'Ingo',
    deps: [300],
    noScore: true,
    html: {
      de: `
        <p>Meine Oma liebt die Beatles und kennt so gut wie alle Alben und Songs auswendig. Um ihr Computer-Passwort nicht zu vergessen, hat sie sich diese Notiz gemacht:</p>
 
<pre>LIBN#10
PPM#5
BFS#3
RA#16
YSS#1
LATHB#7
L#18
LIB#3
RS#1</pre>
 
        <p>Sicherlich nicht sehr sicher - aber ein schönes Beispiel für ihre Leidenschaft. Stürze dich für einen Moment in die Welt der Beatles und entschlüssle das Passwort.</p>
      `,
      en: `
        <p>My grandma loves the Beatles and knows almost all albums and songs by heart. To remember her computer password, she made this note:</p>

<pre>LIBN#10
PPM#5
BFS#3
RA#16
YSS#1
LATHB#7
L#18
LIB#3
RS#1</pre>

        <p>Certainly not very secure, but a lovely example of her passion. Dive into the world of the Beatles for a moment and decipher the password.</p>

      `,
    },
    solution: secrets('chal_330'),
  },

  {
    id: 329,
    pos: { x: 1535, y: 615 },
    title: { de: 'Hacking Challenges', en: 'Hacking Challenges' },
    date: '2023-12-21',
    deps: [300],
    noScore: true,
    html: {
      de: `
        <p style="margin-bottom:32px;"><em>Ein liebevoll gestaltetes Projekt - empfehlenswert!</em></p>

        <p>Du suchst einen Hacking Challenges Server? Dann ist dieser wahrscheinlich der Richtige für dich. Wir sind eine kleine, noch wachsende Community. Wir haben einen eigenen Bot mit einem coolen Punkte-System, schöne Aufgaben und mehr. Solltest du bei einer Aufgabe nicht weiterkommen kannst du sie auch überspringen. Wir bekommen täglich neue Aufgaben dazu! Worauf wartest du noch? Joine unserem Server und hab Spaß!</p>

        <p><a href="https://discord.gg/ebtePDmYxw" target="_blank">https://discord.gg/ebtePDmYxw</a></p>

        <p style="margin-top:32px;">Deine Antwort ist die Lösung zur <code>challenge-3</code>.</p>
      `,
      en: `
        <p style="margin-bottom:32px;"><em>A lovingly crafted project - highly recommended! Only available in German, so use your translator to get started.</em></p>

        <p>Du suchst einen Hacking Challenges Server? Dann ist dieser wahrscheinlich der Richtige für dich. Wir sind eine kleine, noch wachsende Community. Wir haben einen eigenen Bot mit einem coolen Punkte-System, schöne Aufgaben und mehr. Solltest du bei einer Aufgabe nicht weiterkommen kannst du sie auch überspringen. Wir bekommen täglich neue Aufgaben dazu! Worauf wartest du noch? Joine unserem Server und hab Spaß!</p>

        <p><a href="https://discord.gg/ebtePDmYxw" target="_blank">https://discord.gg/ebtePDmYxw</a></p>
        
        <p style="margin-top:32px;">Your answer is the solution to <code>challenge-3</code>.</p>
      `,
    },
    solution: secrets('chal_329'),
  },

  {
    id: 331,
    pos: { x: 2015, y: 705 },
    title: { de: 'Zusammengesetzt', en: 'Assembled' },
    date: '2023-12-23',
    deps: [300],
    author: 'LakyLuc',
    noScore: true,
    html: {
      de: `
        <p>Auf dieser Website wird dein Geschick beim Lösen verschiedener Rätsel und Probleme auf die Probe gestellt. Jede gelöste Aufgabe trägt dazu bei, eine spezielle Zahl zu generieren, die am Ende als Lösung dieser Aufgabe benötigt wird. Sammle deine Ergebnisse und kombiniere sie, um die ultimative Antwort zu erhalten. Betrachte alle Aufgaben vor der Passage.</p>
      `,
      en: `
        <p>On this website, your skill in solving various puzzles and problems will be put to the test. Each solved challenge contributes to generating a specific number, which is needed as the solution to this challenge. Collect your results and combine them to obtain the ultimate answer. Consider all challenges before the passage.</p>
      `,
    },
    check: async (answer, { App }) => {
      const chals = Object.entries(App.challenges.distance)
        .filter((entry) => entry[1] >= 0 && entry[1] <= 8 && entry[0] != '57')
        .map((entry) => parseInt(entry[0]))
      const num = await App.db.models.Solution.count({
        where: { cid: chals },
      })
      return {
        answer,
        correct: parseInt(answer) === num,
      }
    },
  },

  {
    id: 332,
    pos: { x: 1760, y: 345 },
    title: { de: 'Social Engineer :)', en: 'Social Engineer :)' },
    date: '2024-01-03',
    deps: [300],
    noScore: true,
    author: 'User0',
    html: {
      de: `
        <p>Du bist <a href="/chals/eng_soc" target="_blank">auf einer Pirateninsel gestrandet</a> und hörst von einem Piraten, der viel Gold haben soll. Lass Dir von ihm den Namen der Insel verraten, wo das Gold versteckt ist.</p>
      `,
      en: `
        <p>TODO</p>
      `,
    },
    solution: secrets('chal_332'),
  },
]
