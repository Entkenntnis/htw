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
  40: {
    entries: [
      { question: 'wie geht das?', answer: 'Lies dir durch was da steht' },
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
  44: {
    entries: [
      {
        question: 'Was kann ich tun ohne lange zu warten?',
        answer:
          'Du musst die den Code zwischen &lt;script&gt; und &lt;/script&gt; anschauen und dir überlegen wie der funktioniert. Wenn du kein Javascript verstehst kannst du dir das auch Zeile für Zeile von ChatGPT erklären lassen',
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
  75: {
    entries: [
      {
        question: 'Ich weiß einfach nicht wie ich es herausfinden solll',
        answer: 'entweder manuell oder mit einem script',
      },
    ],
  },
  80: {
    entries: [
      {
        question: 'ich hab die farben gemacht aber kenn die antwort nicht',
        answer:
          'Wenn du die Farben in die richtige Reihenfolge bringst, dann ändert sich der Text unter den Farben von Farben sind leider nicht in der richtigen Reihenfolge in Die Antwort lautet .... Wenn sich der Text nicht ändert ist entweder die Reihenfolge falsch, oder Javascript deaktiviert.',
      },
    ],
  },
  83: {
    entries: [
      {
        question: 'Ich Check es nicht',
        answer:
          'Es ist eine typische Aufgabe aus der Kombinatorik https://www.mathebibel.de/kombinatorik. Mein Ansatz war eine Überschlagsrechnung und dann habe ich einfach da in der Nähe systematisch geraten. Dies ist in der Mathematik ein allgemein akzeptierter Lösungsweg.',
      },
      {
        question: 'schaft man des mit brute force oder dauert das zu lange',
        answer: 'Brute force ist eine Option',
      },
      {
        question:
          'Ich stecke hier seit fast zwei Wochen fest, ich check nicht genau, was hier gemacht werden muss. Kann mir jemand helfen?',
        answer:
          'Jede der 11 Aufgaben kann man ja entweder gelöst haben oder nicht. Aber nicht jede Kombination funktioniert.<br />Start - Nicht blinzeln - ASCII -> funktioniert<br />Start - Gemälde -> funktioniert nicht.<br />Du musst also alle Kombinationen durchgehen und die zählen, die möglich sind, die Anzahl ist deine Antwort',
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
  102: {
    entries: [
      {
        question:
          'Kann mir hier jemand weiterhelfen? Ich komme hier echt nicht auf einen grünen Zweig',
        answer:
          'Der verschlüsselte Text ist in hex. Daraus musst du erstmal Bits machen. Dann die Schlüssel durchschieben. Die entschlüsselten Bits dann in ascii. Das sind dann 256x256=65536 Zeilen. Einige wenige davon werden lesbar sein. Das ist die Lösung',
      },
    ],
  },
  105: {
    entries: [
      {
        question:
          'Es gab ja noch einige mehr Challanges mit Leet, war nicht mein Problem. Nur bei Challange 105 1337 verstehe ich den Zusammenhang nicht richtig.',
        answer:
          '1337 ist viel simpler gedacht, es geht nicht um leet, sondern  nur um die Anzahl der Buchstaben.',
      },
    ],
  },
  109: {
    entries: [
      {
        question:
          'es geht nicht, was ist die lösung ich habe chat gpt verwendet',
        answer:
          'ChatGPT ist leider nicht gut auf brainfuck trainiert - es gibt andere online tools, die dir solche Programme generieren können',
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
  307: {
    entries: [
      {
        question:
          'Ich komme hier nicht weiter, weil ich keine Ahnung habe ob sich Mathematik handelt. Ob Dreisatz, Pythagoras, und Ähnliches handelt',
        answer: 'Es handelt sich um Physik.',
      },
    ],
  },
  310: {
    entries: [
      {
        question:
          'Hier müsste doch eine Bruteforce Attacke durchgeführt werden oder?',
        answer: 'Ja',
      },
      {
        question: 'Gibt es hier ein gutes Tool, welches du empfehlen könntest?',
        answer:
          '<a href="https://hashcat.net/hashcat/" target="_blank">https://hashcat.net/hashcat/</a>',
      },
      {
        question:
          'Ich habe versucht mit Hashcat den gegebenen Hash aus der Source zu cracken aber es geht irgendwie nicht. Mache ich was falsch?',
        answer: 'Der Hash nutzt noch ein Salt, das musst du hashcat mitgeben',
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
  312: {
    entries: [
      {
        question:
          'Hey Leute, ich scheine hier irgendwas zu übersehen. Ich habe die Standardformel verwendet aber so einfach kann es ja nie sein',
        answer:
          'die Fallbeschleunigung ändert sich mit sehr großer Entfernung zur Erde, deshalb funktioniert diese Formel bei der Aufgabe leider nicht',
      },
      {
        question:
          'Also ich habe jetzt ein Script geschrieben das für jeden Meter die aktuelle Geschwindigkeit und Anziehung berechnet, mein Ergebnis scheint aber falsch zu sein 40528077150 ist das was ich raus habe. Ich weiß aber eben auch nicht ob das realistisch ist (ob das Ergebnis zumindest nah dran ist)',
        answer:
          'dein ergebnis liegt nicht in der richtigen größenordnung, da muss irgendwo ein fehler im code sein. Du kannst deinen Code zur Kontrolle auch mit den Werten Von Freier Fall 1 und 2 Testen, da sollte er auch funktionieren',
      },
    ],
  },
  313: {
    entries: [
      {
        question:
          'Moin Leute, ich habe mal meinen Code von Freier Fall 3 recycelt und auf Sekunden umgestellt, aber wie genau muss man jetzt mit den Sekunden sein? Ich mache aktuell 0,001 Sekunden Schritte und das dauert natürlich schon Ewigkeiten..',
        answer:
          'du könntest entweder eine schnellere programmier sprache verwenden, oder eine Formel verwenden, um die Schritt weite zu berechen, sodass sie am anfang groß und gegen ende immer kleiner wird<br /><br />Ich habe alles nach der Zeit umgestellt und bin dann im Meterschritt gegangen. Hat den Vorteil, das bei den ersten Schritten der Iteration, wo die  Zeiten länger sind, der Fehler kleiner ist. Andersherum kumuliert sich am Ende des Falls ein größerer Fehler, die Zeiten auf die einzelnen Meter sind aber so gering, dass es nix mehr ändert.',
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
  317: {
    entries: [
      {
        question: 'Woher krieg ich den Login Namen des Administrators?',
        answer:
          'Der name des admins ist nur teil des szenarios und ist für die aufgabe nicht relevant',
      },
      {
        question: 'Ich verstehe nicht was ich machen soll',
        answer:
          'du must herausfinden wie der ort heißt, an dem das Video aufgenommen wurde.',
      },
      {
        question:
          'kannst du mir irgend ein tipp geben ich lande immer nur auf webseiten für ferienwohnungen und immobielien',
        answer:
          'Versuche mal einzelne Frames zu googeln, irgendwann fangen die Treffer an sich zu überschneiden. Aus dem Text kannst Du auch entnehmen, dass Ferienwohnungen und Reiseberichte in die richtige Richtung gehen 👍',
      },
      { question: 'ist die lösung ein Stad/Ortsname?', answer: 'Yep' },
    ],
  },
  326: {
    entries: [
      {
        question:
          'Hallo zusammen, ich hab bei der Challenge ganz leichte Probleme hab schon StegOnline , Hex, Aperi, durch und keinen plan was ich übersehe 😖  vl. hat wer einen Tipp für mich...',
        answer:
          'ein wichtiger Tipp sind die "4%". Nur 4% der Pixel sind für dich interessant. Jetzt ist es deine Aufgabe dir zu überlegen, welche Pixel das sein könnten',
      },
    ],
  },
  330: {
    entries: [
      {
        question:
          'Ich habe alle Alben identifiziert aber weiß nicht weiter. Hat es was mit den charts zu tun(Wegen der Nummern)?',
        answer:
          'Hat nichts mit den Charts zu tun, aber die Nummern sind der nächste Schritt. Wenn du ein Album hast, was könnte dann die Nummer bedeuten? 🙂',
      },
    ],
  },
  333: {
    entries: [
      {
        question:
          'Egal was ich eingebe ist falsch. Kann jemand helfen was die nutzer-id ist? weil der Name war falsch, sein ehemaliger Name war falsch dann auch beide zahlen normal probiert auch falsch.',
        answer:
          'Google ist dein bester Freund 😁 - In #regeln  findest du einen Post von dem User. Zusammen mit einer Google-Suche hast du alles, um die ID rauszufinden.',
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
  339: {
    entries: [
      {
        question:
          'Was muss man hier machen, sitze hier seid 8 Stunden dran und komme nicht weiter',
        answer:
          'Hallo, Mr. Plow ist eine Cipher Challenge. Das meiste was du benötigst ist im Rätsel schon erklärt. Ich muss schon fast aufpassen dir nicht zu viel zu verraten 😉. Hast du schon eine Idee oder einen Lösungsansatz?',
      },
      {
        question:
          'Da ich auch gerade dadran sitze... Hat SNOW etwas mit den Himmelsrichtungen zu tun?',
        answer:
          'Nein, wie erklär ich das ohne zuviel zu verraten 😂... vl. ist Snow ja gar kein Schnee und hat nichts mit Winter zu tun? Zusammen mit meinem ersten Kommentar ist es mit ganz kleinen Aufwand möglich es bereits zu lösen 😄',
      },
      {
        question:
          'hat es was mit den leerzeichen zwischen den * dingern zu tun?',
        answer: 'heiße Spur',
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
        <p><a href="/map">zurück</a></p>

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

        <form action="/hints/ask" method="post" style="max-width: 65ch; margin-top: 100px;">
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

        <p><a href="/map">zurück</a></p>

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
