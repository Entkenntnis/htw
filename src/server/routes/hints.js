import { Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

/** @type {import('../../data/types.js').HintsData} */
export const hintsData = {
  17: {
    entries: [
      {
        question: 'Ich checks ned - ich hab alles rückwärts eingegeben',
        answer: 'Versuch mal nur die Reihenfolge der Wörter zu verändern',
      },
    ],
  },
  41: {
    entries: [
      {
        question:
          'Hallo zusammen, ich habe die Schwierigkeiten, den Aufgabentext zu ergreifen. Unter “Querlesen” verstehe ich, dass man den Text diagonal überfliegen soll. Kann jemand mir hinweisen, ob die Antwort mit der Bedeutung vom Gedicht verwandt ist, oder die Buchstaben im Gedicht versteckt sind? Ich habe das Gedicht auf beide Englisch und Deutsch gelesen, habe ich trotzdem gar keine Idee, was ich machen soll. Danke 🙂 (Ich bin kein Deutscher Muttersprachler.',
        answer:
          'Es geht um die Buchstaben, aber sie sind nicht wirklich versteckt, versuch es mal mit einer unüblichen Leserichtung.',
      },
      {
        question: 'Ist die Antwort ein deutsches Wort?',
        answer: 'Normalerweise schon und es ist echt leicht zu erkennen',
      },
    ],
  },
  49: {
    entries: [
      {
        question:
          'Hi! Könnte mir jemand sagen wo ich mich einlesen kann, um zu wissen wie ich die Aufgabe lösen soll? Ich hab versucht online Tools zu benutzen, aber ich finde keine Seite wo ich ein Padding einstelllen kann...',
        answer:
          'Ein Tool, das in der Community gerne genutzt wird, ist <a href="https://github.com/gchq/CyberChef" target="_blank">https://github.com/gchq/CyberChef</a> - dort with automatisch das korrekte Padding gesetzt.',
      },
      {
        question:
          'Ich habe den Spielstand decrypted und bekam einen JSON-String den ich verändert habe um 999999 Gold zu haben. Nun das ganze wieder verschlüsselt und folgenden String erhalten: cc76663b7d1e97ea2455b1c25676f447120eec76d9f72831a45f47d56edd58d065aea737bba41bbf0d368603e6c231c3.<br/>Wenn ich diesen aber eingebe, bekomme ich folgenden Fehler: \'error:1C800064:Provider routines::bad decrypt: {"player":"John","gold":999999}\' ist falsch<br/>Ist das ein fehler im Backend oder warum bekomme ich hier IM WEB einen nodejs-crypto-fehler?',
        answer:
          'Hast du an das Padding gedacht? Und wenn ja, hast du den richtigen Wert verwendet?',
      },
      {
        question:
          'Ich habe ein Problem mit dieser Aufgabe. Egal welches tool ich verwende, es sagt mir, dass der secret key mit AES 128 maximal 16 characters lang sein darf (habe ECB und padding verwendet). Der Key in der Aufgabe ist aber mindestens doppelt so lang. (verstehe nicht viel davon aber würde es trotzdem gerne lösen)',
        answer:
          'Der Key in der Aufgabe hat genau 16 Byte, wenn er dir länger erscheint, dann solltest du ihn dir noch mal genauer anschauen.',
      },
    ],
  },
  59: {
    entries: [
      {
        question: 'Was muss man hier machen hier ist alles durcheinander',
        answer:
          'Schaue mal, ob du das eine oder andere Wort erraten kannst und vertausche dafür ein paar Buchstaben - dann ergeben sich die nächsten Wörter usw',
      },
    ],
  },
  62: {
    entries: [
      {
        question:
          'hey, könnte mir wer ein kleinen Hinweis geben, komme nämlich nicht weiter. danke 🙂',
        answer: 'bild.txt ist doch in sich schon etwas widersprüchlich',
      },
    ],
  },
  98: {
    entries: [
      {
        question:
          'Kann mir irgendwer helfen? Ich weis nicht wie man sowas macht',
        answer:
          'lies dir mal das durch <a href="https://www.w3schools.com/sql/sql_injection.asp" target="_blank">https://www.w3schools.com/sql/sql_injection.asp</a>',
      },
      {
        question: 'Sollte nicht das % alles anzeigen?',
        answer: 'Dafür brauchst du statt = den LIKE-Operator',
      },
    ],
  },
  115: {
    entries: [
      {
        question:
          'Also ich komm mir direkt Dumm vor, ich hab den Ausschnitt und weiß nicht welches spiel gemeint ist. Ich hab schon einiges versucht zB. das Spiel von Micro$oft mit 4 Buchstaben und auch das Spiel mit 13 Buchstaben (ohne und mit Leerzeichen) aber ja bin wohl zu blöd xD Hat jemand einen Tipp für mich?',
        answer:
          'Die Antwort sollte 6 Buchstaben lang sein. Hast du den Hinweis zum Koordinatensystem gelesen? Der Ursprung ist nicht oben links, sondern in der Mitte ... ansonsten sollte der Ausschnitt relativ eindeutig sein  - hoffe das hilft weiter',
      },
    ],
  },
  305: {
    entries: [
      {
        question:
          'Ich komme hier nicht mehr weiter. Ich versuche es zu entschlüsseln aber es kommt keine Antwort raus.',
        answer:
          '<a href="https://gchq.github.io/CyberChef/" target="_blank">https://gchq.github.io/CyberChef/</a> - probier doch mal alles durch, vielleicht findest du ja etwas. Ansonsten gibt es noch "Magic".',
      },
    ],
  },
  311: {
    entries: [
      {
        question:
          'Ich hatte es auch mal mit einer Seite Brainfuck translate aber es kommt ganz anderes raus',
        answer: 'Das ? im Titel hat eine Bedeutung',
      },
      {
        question:
          'Hey Leute, ich habe jetzt schon selbst Brainfuck Interpreter geschrieben und die von anderen ausprobiert, aber nichts funktioniert.',
        answer: 'Guck dir den Aufgaben-Titel noch mal genau an',
      },

      {
        question:
          'Ich glaube, ich habe den korrekten Code herausgefunden, aber jeglicher Decoder dafür kann es nicht "unfucken". Was mache ich noch verkehrt?',
        answer:
          'Du musst den Code nicht "unfucken" damit er funktioniert, der code gibt undefined zurück aber er sollte auch etwas in die Konsole schreiben',
      },

      {
        question: 'Ich verstehe den Code immer noch nicht',
        answer:
          'Als Mensch kann man den Code auch nicht verstehen ;D Sobald du rausgefunden hast um welche Sprache es sich handelt musst du ihn ja einfach in einer entsprechenden Umgebung ausführen',
      },
    ],
  },
  314: {
    entries: [
      {
        question: 'wenn ich mit dem Torbrowser die Seite öffne kommt ein Error',
        answer: 'Ist evtl. der Punkt am Ende deiner URL zuviel?',
      },
    ],
  },
  336: {
    entries: [
      {
        question:
          'Ich hab wirklich alles versucht was mir in den Kopf gekommen ist aber ich komm nicht drauf. Hänge schon seit ein paar Wochen an der Aufgabe. Kann mir jemand einen kleinen Tipp geben. 😅',
        answer:
          'Die Antwort ist einfacher als man denkt. Überlege mal zu welcher Block-Kategorie die dargestellten Items gehören',
      },
    ],
  },
}

const cutoff = '2024-11-01'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupHints(App) {
  App.express.get('/hints/:id', (req, res) => {
    const id_ = req.params.id?.toString()
    const id = id_ ? parseInt(id_) : -1

    const challenge = App.challenges.dataMap[id]
    const hints = hintsData[id]

    if (!challenge) {
      res.redirect('/')
      return
    }

    renderPage(App, req, res, {
      page: 'hints',
      heading: `Hinweise für "${challenge.title['de']}"`,
      backButton: false,
      content: `
        <p><a href="/challenge/${id}">zurück zur Aufgabe</a></p>

        ${
          !hints
            ? `<h4 style="margin-top: 56px; color: #dddddd; margin-bottom: 72px;">Zu dieser Aufgabe wurden noch keine Fragen gestellt.</h4>`
            : hints.entries
                .map(
                  (entry) => `
          <div style=" margin-top: 56px">
            <h3 style="color: #dddddd; font-weight: bold; font-size: 20px;">${entry.question}</h3>
            <div style="color: #c7c7c7; margin-left:20px; margin-top: 16px;">${entry.answer}</div>
          </div>
        `
                )
                .join('')
        }

        <form action="/hints/ask" method="post" style="max-width: 65ch;">
          <input type="hidden" name="id" value="${id}"/>
          <textarea name="question" required style="width: 100%; padding: 10px; margin-top: 10px; color: white; background-color: #303030; border: 1px solid #cccccc; border-radius: 4px; resize: vertical; min-height:100px; margin-bottom: 12px;" placeholder="Stelle eine neue Frage ..."></textarea>
          <input type="submit" value="Frage abschicken" class="btn btn-primary"/>
        </form>

        <p style="margin-top: 48px;">Nutze auch gerne unseren <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a>.</p>
        <p>
          <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 150px; background: #313131; padding-left:8px; padding-right: 8px; border-radius:4px; padding-top:2px; " alt="discord"></a>
        </p>

        <div style="height:150px;"></div>
      `,
    })
  })

  App.express.post('/hints/ask', (req, res) => {
    const question = req.body.question?.toString()
    const id_ = req.body.id?.toString()

    const id = id_ ? parseInt(id_) : -1

    if (!question || !App.challenges.dataMap[id]) {
      res.redirect('/map')
      return
    }

    const key = `question_${id}_${new Date().getTime()}`

    App.storage.setItem(key, question)

    renderPage(App, req, res, {
      page: 'ask',
      heading: `Neue Frage`,
      backButton: false,
      content: `
        <p style="margin-top: 48px;">Vielen Dank! Deine Frage wurde gespeichert und wird demnächst beantwortet - dies kann ein paar Tage dauern 🙏</p>

        <p><a href="/challenge/${id}">zurück zur Aufgabe</a></p>

        <p style="margin-top: 120px;">Nutze auch gerne unseren <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a>.</p>
        <p>
          <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 150px; background: #313131; padding-left:8px; padding-right: 8px; border-radius:4px; padding-top:2px; " alt="discord"></a>
        </p>

        <div style="height:150px;"></div>
      `,
    })
  })

  App.express.get('/questions', async (req, res) => {
    if (!req.user || req.user.name != 'editor') return res.redirect('/')

    const allQuestions = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: 'question_%',
        },
        updatedAt: {
          [Op.gte]: new Date(cutoff),
        },
      },
      raw: true,
    })

    const questions = allQuestions.map((row) => {
      return {
        ts: new Date(row.createdAt).getTime(),
        question: row.value,
        id: parseInt(row.key.split('_')[1]),
      }
    })

    questions.sort((a, b) => b.ts - a.ts)

    renderPage(App, req, res, {
      page: 'internal-question-list',
      heading: `Liste offener Fragen`,
      backButton: false,
      content: `
       ${questions
         .map(
           (q) => `
          <p style="margin-top: 24px;"><strong>${App.challenges.dataMap[q.id].title['de']}</strong> (${new Date(q.ts).toLocaleString('de-DE')})<br />${escapeHTML(q.question)}</p>
        `
         )
         .join('')}
      `,
    })
  })
}
