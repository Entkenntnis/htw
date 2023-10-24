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
    pos: { x: 1780, y: 400 },
    title: { de: 'Schnittstelle', en: 'Interface' },
    date: '2023-07-28',
    author: 'cuzimbisonratte',
    deps: [300],
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
    pos: { x: 1750, y: 290 },
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
    pos: { x: 1950, y: 500 },
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
    pos: { x: 1910, y: 730 },
    title: { de: 'Primzahlen', en: 'Prime numbers' },
    author: 'darkstar',
    date: '2023-08-25',
    deps: [300],
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
    pos: { x: 1830, y: 780 },
    title: { de: 'Rätselhafte Kodierung', en: 'Mysterious encoding' },
    author: 'darkstar',
    date: '2023-08-25',
    deps: [300],
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
    pos: { x: 2030, y: 700 },
    title: { de: 'Cyberchef', en: 'Cyberchef' },
    author: 'provn_tq97',
    date: '2023-09-01',
    deps: [300],
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
    pos: { x: 1940, y: 370 },
    title: { de: 'RockYou', en: 'RockYou' },
    author: 'virusrpi',
    date: '2023-09-02',
    deps: [300],
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
    pos: { x: 1570, y: 630 },
    title: { de: 'Geheime Aufgabe', en: 'Secret Challenge' },
    author: 'darkermask',
    date: '2023-07-29',
    deps: [300],
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
    pos: { x: 1480, y: 680 },
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
    pos: { x: 1960, y: 270 },
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
    pos: { x: 1740, y: 815 },
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
    pos: { x: 1790, y: 915 },
    title: { de: 'OSINT II', en: 'OSINT II' },
    date: '2023-10-19',
    author: 'User0',
    deps: [316],
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
]
