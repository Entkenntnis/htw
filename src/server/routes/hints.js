import { and, Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

/** @type {import('../../data/types.js').HintsData} */
export const hintsData = {
  1: {
    entries: [
      {
        question: 'was ist die lösung',
        answer: 'Das Ergebnis der Rechnung im letzten Absatz',
      },
      { question: '6 + 4 · 9', answer: 'jetzt noch ausrechnen' },
      {
        question: 'Ich kann kein mathe',
        answer: 'Du hast sicher ein Handy mit Taschenrechner ..',
      },
    ],
  },
  2: {
    entries: [
      {
        question: 'Muss ich jetzt mir die Gebärdensprache angucken?',
        answer:
          'kuck einfach im internet nach geberdensprache und übersetz einfach',
      },
    ],
  },
  3: {
    entries: [
      {
        question: 'Was ist die Lösung',
        answer: 'höre dir die Morse-Nachricht an',
      },
      {
        question: 'was ist das letzte für ein buchstabe',
        answer: 'lang kurz lang lang',
      },
      {
        question: 'Was sind die ersten 3 Buchstaben?',
        answer: 'höre die den Morse-Ton an',
      },
    ],
  },
  4: {
    entries: [
      {
        question: 'hinwie für ASCII',
        answer: 'Alle wichtigen Infos findest du in der Tabelle',
      },
    ],
  },
  5: {
    entries: [
      { question: 'wie denn ?', answer: 'Probier mal mit der Maus' },
      { question: 'wie mit der Maus', answer: 'Markieren!' },
      {
        question: 'wie auf dem I-Pad markieren?',
        answer: 'Mit Finger lange drücken',
      },
      {
        question: 'Ja aber es geht net',
        answer:
          'Hast du das ganze Blatt markiert? Hast du alles genau angeschaut?',
      },
    ],
  },
  6: {
    entries: [
      {
        question: 'ich will die antwort wissen',
        answer: 'Dann schau in den Quellcode',
      },
    ],
  },
  7: {
    entries: [
      {
        question:
          'Hallo! Ich kann leider den Quelltext weder durch die Kombination, noch durch die Anleitungen einsehen. Es geht auch nicht durch die rechte Maustaste. Gibt es noch andere Möglichkeiten? Liebe Grüße, Thomas',
        answer:
          'Probiere [strg]+[u] (firefox, chrome) oder [cmd]+[alt]+[U] (safari)',
      },
      {
        question:
          'Wie öffne ich auf dem iPad den Quelltext eine Webseite in Safari?',
        answer:
          'Ist bisschen umständlich, leider: <a href="https://apple.stackexchange.com/a/417701" target="_blank">https://apple.stackexchange.com/a/417701</a>',
      },
    ],
  },
  10: {
    entries: [
      {
        question: 'Für was stehen die Punkte?',
        answer: 'für die übrigen Zahlen von 4 bis 96.',
      },
      { question: 'was ist das ergebnis', answer: 'Das musst du berechnen.' },
      {
        question: 'muss man da eine zahl oder mehrere zahlen hinschreiben?',
        answer: 'Das Ergebnis ist eine einzelne Zahl',
      },
    ],
  },
  15: {
    entries: [
      {
        question: 'wie soll das gehen?',
        answer: 'Gib deinen Benutzernamen ein.',
      },
      {
        question: 'Bei mir klappt die aufgabe nicht',
        answer: 'Schau dir den Text bei "... ist falsch" genauer an',
      },
      {
        question: 'Was ist das Ergebnis / Was soll man schreiben',
        answer: 'ist ja für jeden anders, weil die Namen anders sind',
      },
      {
        question:
          'Hallo bei der Text ist gar keine Stelle wo ,ist falsch, steht und wie',
        answer: 'Gib eine Antwort ein und klicke auf los, dann erscheint das',
      },
    ],
  },
  16: {
    entries: [
      {
        question: 'was ist die lösung',
        answer: 'deine aktuelle Punktzahl',
      },
      { question: 'was für eine punktzahl', answer: 'Schau oben rechts' },
      {
        question: 'da steht 32 es ist aber angeblich falsch jetzt steht da 33',
        answer: 'Die Anzeige spinnt bisschen',
      },
      {
        question: 'Die zahlen wackeln',
        answer:
          'genau, das ist der &quot;Fehler&quot;, kannst du herausfinden, was die richtige Punktzahl ist?',
      },
    ],
  },
  18: {
    entries: [
      { question: 'wie kann man das finden', answer: 'Verschiebe den Regler' },
      {
        question: 'wie soll ich den Regler schieben?',
        answer:
          'Mit der Maus draufklicken, gedrückt halten und nach links und rechts ziehen',
      },
    ],
  },
  21: {
    entries: [
      {
        question: 'Krieg ich einen Tipp?',
        answer: 'Schaue genauer auf den Screenshot',
      },
    ],
  },
  23: {
    entries: [
      {
        question: 'Pony funktioniert nicht',
        answer: 'Pony ist nicht die Antwort',
      },
      {
        question: 'auf der website steht nicht der name des kleinen bruders',
        answer: 'Klicke auf der Website auf Start',
      },
    ],
  },
  24: {
    entries: [
      {
        question: 'ich verstehe die aufgabe nicht',
        answer: 'Da ist ein Text der kurz erscheint',
      },
      {
        question: 'Wie kann ich den Text in so kurzer Zeit lesen?',
        answer:
          'Schaue genau auf die richtige Stelle und lies Buchstabe für Buchstabe',
      },
      {
        question: 'Was ist die richtige Stelle?',
        answer: 'Das Ende des Satzes.',
      },
    ],
  },
  25: {
    entries: [
      {
        question: 'ich kann die datei nicht öffnen',
        answer:
          'Welches System verwendest du? ist jeweils etwas unterschiedlich',
      },
      { question: 'was ist die antwort', answer: 'Schau in die zip-Datei' },
      {
        question: 'ICH SCHAUE REIN DA BLEIBT DASSELBE',
        answer: 'Weiter, bis zum Ende!',
      },
      {
        question: 'Wie kann ich es zu keiner Zipdatei machen',
        answer:
          'Zipdateien in Zipdateien solange öffnen, bis ein Text erscheint',
      },
      {
        question: 'warm öffnet sich immer ein neues Fenster?',
        answer: 'Jede Zipdatei öffnet ein neues Fenster, mache weiter',
      },
      {
        question: 'Ich kann die Aufgaben Datei nicht Öffnen (Windows)',
        answer:
          'auf Windows öffnet sollte sich ein neues Explorer-Fenster öffnen',
      },
    ],
  },
  29: {
    entries: [
      {
        question: 'wo kann ich die koordinaten eingeben?',
        answer: 'OSM? Google Maps? Wähle selbst.',
      },
    ],
  },
  31: {
    entries: [
      {
        question: 'wie sol ich das machen',
        answer:
          'Klicke mal auf 2, dann auf die 5 und dann auf das Mal-Sternchen (*) und beobachte, was passiert',
      },
    ],
  },
  32: {
    entries: [
      {
        question: 'Kleiner Tipp: Addiere zuerst auf 191 und dann mal 7!',
        answer: 'eine Möglichkeit',
      },
    ],
  },
  36: {
    entries: [
      {
        question:
          'habe jetzt https://pages.github.com/#user-site versucht aber die website möchte sich nicht öffnen<br />die HTML datei funktioniert aber',
        answer:
          'für Benutzername III darf die Seite auch kein HTML enthalten, wirklich nur dein Nutzername als plaintext',
      },
      {
        question: 'Kann man Benutzername III lösen ohne Geld auszugeben?',
        answer: 'Du kannst mit GitHub eine Seite kostenlos hosten.',
      },
      {
        question:
          'Hat jemand eine Ahnung, welchen Anbieter man da verwenden kann? Bei den kostenlosen Hostern, die ich versucht habe, kann man nur bestimmte Vorlagen verwenden. Somit kann die Website nicht nur den Namen beinhalten. Was ist außerde mit "nur" den Namen gemeint? Soll die Website ein html script enthalten, wo einfach nur der Name drin steht? Aber html soll man ja eigentlich nicht verwenden.',
        answer: 'Glitch',
      },
    ],
  },
  37: {
    entries: [
      {
        question: 'wie geht level 37 was muss ich machen das mit dem emoji',
        answer: 'Den emoji in die antwort box eingeben',
      },
      { question: 'der name des emojis', answer: 'grinning face von whatsapp' },
      {
        question: 'wie mache ich das',
        answer: 'z.b mit einer Suchmaschine finden und dann kopieren',
      },
      {
        question: 'wenn das nicht geht',
        answer: 'Probiere auch mal (Windows-Taste) +  (Punkt)',
      },
    ],
  },
  39: {
    entries: [
      {
        question: 'Hilfe bitte',
        answer: 'Hast du die Flaggen im Video entdeckt?',
      },
      {
        question: 'wie soll ich die flaggen antworten nutzen?',
        answer: 'Es gibt ein Alphabet mit diesen Flaggen',
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
  42: {
    entries: [
      {
        question: 'shazam funkioniert nicht',
        answer:
          'shazam hat bei mir noch 5s das richtige Ergebnis, probiere es nochmal und achte darauf, das der Ton gut funktioniert',
      },
    ],
  },
  43: {
    entries: [
      {
        question:
          'ich habe  eine frage bei challenge 43 ich wollte fragen wie ich da vorgehe soll ich nach variablen suchen aber bitte nicht vorsagen',
        answer:
          'Also du suchst nicht nach einer variable. Du willst die Antwort-Box haben',
      },
      {
        question: 'soll ich einfach die antworbox script wieder einfügen?',
        answer: 'versuche es',
      },
      {
        question: 'Kann mir jemand dabei helfen?',
        answer: 'Schau dir einmal curl oder PowerShells Invoke-WebRequest an. ',
      },
      {
        question:
          'Hallöchen 🙂<br />Ich habe einen Weg gefunden die Aufgabe zu lösen, jedoch wurden mir bei meiner Methode keine Punkte gutgeschrieben.. ist das noch jemand anderem auch so gegangen?',
        answer:
          'Glückwunsch zum Lösen 🎉 Nach einer groben Rechnung passt deine Punktzahl zu deinen gelösten Aufgaben. Ich gehe davon aus, dass du die Aufgabe "unbemerkt" bereits gelöst hast (was bei manchen Methoden recht schnell passieren kann, v.a. bei der Aufgabe) und daher beim eigentlichen Versuch anscheinend die Punktzahl nicht verändert wurde.',
      },
      {
        question:
          'Ich frage mich, Wie ich das Rätsel lösen soll. Geht es auch von einem Smartphone?',
        answer: 'Es geht, ist aber anspruchsvoller',
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
      {
        question:
          'ich habe die website kopiert und denn script in schnell laufen lassen es daurt aber trotzdem ein paar stunden kann man das anders machen?',
        answer: 'versuche mal die setTimeout() Funktion komplett zu umgehen.',
      },
      {
        question:
          'Ich habe hier ein Problem. Egal, was ich am Code zwischen script und /script ändere, es ändert sich nichts an der Visualisierung (mit "html ändern" beim Untersuchen). Auch mit lösungsvorschlag von Chatgpt versucht.',
        answer:
          'Bei html-Änderung wird soweit ich weiß das javascript nicht neu ausgeführt. Probiere mal die Website runterzuladen und lokal in der Datei Dinge zu ändern',
      },
    ],
  },
  45: {
    entries: [
      { question: 'was ist die lösung', answer: 'lies die Schriftzeichen' },
      { question: 'welche sprache', answer: 'japanisch' },
    ],
  },
  46: {
    entries: [
      {
        question:
          'Ich bin jetzt seit 2 Stunden an der Aufgabe aber irgendwie funktioniert das bei mir nicht. Kann mir jemand einen Tipp geben?',
        answer: '"Kopfdaten" ist ein Hinweis',
      },
      {
        question: 'Was soll ich tun die Seite ist komplett weiß',
        answer:
          'bei einer Website wird nicht nur das übertragen was man sieht. Recherchiere mal zum Thema http Protocol und GET gequest',
      },
    ],
  },
  48: {
    entries: [
      {
        question:
          'Hey ich habe es mir komplett bis zum Ende angehört aber ich habe ein Siu gehört',
        answer: 'Es ist ein (ausnahmsweise) ein englisches Wort',
      },
      {
        question:
          'hä? ich habe tweet eingegeben aber es klappt nicht wie schreibt man es?',
        answer: 'Du bist nah dran.',
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
  51: {
    entries: [
      {
        question: 'Was soll man tun',
        answer: 'Die Zahl 7 als Binärzahl schreiben',
      },
      {
        question: 'wie soll ich das machen',
        answer: 'Klicke mal auf die Kreise mit den Zahlen',
      },
      {
        question: 'was soll man für Binärzahlen verwenden',
        answer: 'Nur mit 0 und 1',
      },
    ],
  },
  52: {
    entries: [
      {
        question: 'Was soll ich tun',
        answer: 'Die Zahl 45 als Binärzahl schreiben',
      },
    ],
  },
  53: {
    entries: [
      {
        question:
          'NICHT AUF DEN ZWEITEN PUNKT KLICKEN!!! ALLES WIRD ZURÜCKGESETZT',
        answer: 'wichtig',
      },
      {
        question:
          'Ich hab keine Ahnung wie ich das machen soll und ich will die Aufgabe noch nicht mit autoklicker lösen.  Ich hab es geschafft im Quellcode die Zahl zu 2000 zu ändern  , aber es passiert nichts.',
        answer:
          'guck dir mal chal53.js an und überlege wie du dir was du in der konsole ausführen könntest um die aufgabe zu lösen',
      },
      {
        question: 'was muss ich in die konsole eingeben?',
        answer: 'Probiere mal <code>console.log(correct)</code>',
      },
      { question: 'wo in die konsole eingeben', answer: 'F12 -> Konsole' },
      {
        question: 'sag mir die lösung',
        answer:
          'Es gibt keine Lösung. Klicke 2000 mal auf das X, das ist alles.',
      },
      {
        question: 'muss ich 2000mal x drücken',
        answer: 'nein, es gibt auch andere Wege',
      },
      {
        question: 'Welche anderen Wege gibt es?????',
        answer:
          'Es gibt eine Variable <code>correct</code>, diese kannst du über die Konsole auch direkt ändern',
      },
    ],
  },
  55: {
    entries: [
      {
        question: 'Wie heißt diese Farbe?',
        answer: 'klick mal auf den Link, da kannst du in der Liste nachschauen',
      },
      {
        question: 'welche farbe',
        answer: 'Die Hintergrundfarbe des Rechtecks mit den Buchstaben',
      },
      { question: 'keins past da', answer: 'eine Farbe passt' },
      { question: 'also lila', answer: 'ja, eine der lila Töne' },
      {
        question:
          'Ich hab die Farbe gefunden, aber wenn ich es eingebe ist es falsch. Ich habe sogar die Buchstaben in die richtige Reihenfolge gebracht.',
        answer: 'ohne Leerzeichen?',
      },
    ],
  },
  56: {
    entries: [
      {
        question: 'ich checke die aufgabe nicht',
        answer: 'Du brauchst eine Webseite, wo dein Nutzername enthalten ist',
      },
      {
        question: 'ich hab alles ausprobiert',
        answer:
          'hast du schonmal was von pastebin gehört das solltest du dir mal angucken',
      },
      {
        question:
          'wenn ich eine website eintippe und auf Los drücke kommt oft ein langer Text mit &lt;!doctype html&gt; &lt;html lang="en-US"&gt;... wikipedia funktioniert auch nicht',
        answer:
          'Wenn dieser lange  Text kommt dann ist es ein Zeichnen, dass es funktioniert hat - jetzt musst du nur noch eine Website finden, die deinen Benutzernamen enthält',
      },
    ],
  },
  57: {
    entries: [
      {
        question: 'wie findet man die antwort',
        answer: 'Schau dir die Anfangsbuchstaben der Aufgaben an',
      },
      {
        question: 'welche Aufgaben sind das ?',
        answer: 'Klicke auf die Zahlen und du siehst die Aufgaben',
      },
      {
        question: 'Was ist eine Passage?',
        answer: 'eine schmale Stelle zum Durchgehen',
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
      {
        question: 'was ist die antwort',
        answer: 'steht im Text, den du zuerst entschlüsseln musst',
      },
      { question: 'Wie gehts?', answer: 'Gut, und dir?' },
      { question: 'LEBEN IST HART', answer: 'random' },
      {
        question: 'Mögen sie axolotl?',
        answer:
          'ja, erinnern mich an Ohnezahn aus Drachenzähmen leicht gemacht',
      },
    ],
  },
  60: {
    entries: [
      {
        question: 'was ist der 2. Buchstabe ?',
        answer: 'Der zweite Buchstabe der Lösung lautet E',
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
  65: {
    entries: [
      {
        question:
          'Habe jetzt schon vieles versucht kann aber nicht auf greinden drücken könnte mit jemand die Antwort geben, bitte ?',
        answer:
          'wenn du auf "grind me" drückst, sollte ein Text wie "eyJnb2xkIjozNH0=" erscheinen. Das ist der Spielstand und wenn du den decodierst und änderst kannst du ihn als Antwort eingeben.',
      },
      {
        question:
          'Ich habe gerade 3 Stunden versucht den Spielstand und den Grind me! Button zu um gehen bis ich auf die Idee gekommen bin den Quellcode von einer KI analysieren zulassen und Sie gebeten habe mir mögliche Schwachstellen auf zu zeigen. Sie meinte es gibt eine Schwachstelle bei der Verschlüsselung. Da ich mich erst seit zwei tagen mit Quellcodes beschäftige fiel mir das garnicht auf. Muss sagen eine sehr interessante Aufgabe',
        answer: ':)',
      },
      { question: 'Autoclicker macht’s :)', answer: ':)' },
    ],
  },
  66: {
    entries: [
      {
        question: 'Wie löse ich dieses Rätsel',
        answer: 'Genau hinschauen hilft - erkennst du etwas?',
      },
      {
        question:
          'ich habbe viele bilder übereinander geleg aber das ergebniss schtimmt nicht',
        answer:
          'Das ist doch schon mal ein Anfang, ka wo du den letzten Buchstaben gelassen hast, aber wenn du dir den Titel anschaust solltest du auch so drauf kommen.',
      },
      {
        question:
          'Ich erkenne die buchstaben aber kann mir das wort nicht zusammeneimen',
        answer:
          'Es ist ein deutsches Wort, die letzten Buchstaben kann man raten',
      },
    ],
  },
  67: {
    entries: [
      {
        question: 'hä kann mir bitte jemand erklären was ich machen muss?',
        answer:
          'Klick mal auf den Link zu TIA-568B und schaue dir die Reihenfolge der Farben an',
      },
    ],
  },
  68: {
    entries: [
      {
        question: 'Krieg ich einen Tipp',
        answer:
          'Erkennst du das Bild? Schau mal, wer es gemalt hat oder lies den Text genauer',
      },
      {
        question:
          'Was ist die Lösung, Ich habe gegoogelt aber ist trotzdem falsch',
        answer: 'Hast du nur das Jahr eingegeben? Ohne Tag und Monat?',
      },
      {
        question:
          'wir haben sein Geburtstag monat und tag eingegeben und jahr aber es ist trotzdem falsch',
        answer: 'nur das jahr eingeben',
      },
      {
        question:
          'Wann ist <span class="spoiler-text">Leonardo DaVinschi</span> geboren',
        answer: 'Wikipedia existiert',
      },
    ],
  },
  69: {
    entries: [
      {
        question: 'Wie kann ich die Bilder hier auf der Webseite verschieben?',
        answer: 'Probiere mit Maus oder mit dem Finger',
      },
    ],
  },
  71: {
    entries: [
      {
        question:
          'Bei Sag mal, Challenge 71, kenne ich den Bilddateityp. Python half auch schon, aber die Ausgabe ist sehr lang und schmal, ob Dez oder Hex ganz egal, auch Breite und Höhe eingestellt hat nichts verstellt. Sieht aus wie ein EAN-Code, ist aber viel zu lang, kein Scanner das lesen kann. Um Hilfe wird gebeten, ChatGPT schaut schon ähnlich betreten.',
        answer:
          'Welche größe hat den dein PNG? Es sollte PNG image data, 30 x 12, 8-bit/color RGB, non-interlaced  sein. Wenn alle bytes richtig sind, also pngcheck OK zurück gibt, dann kann man die Antwort einfach lesen.',
      },
      {
        question:
          'ich habe die bytes in einem textdocument weis aber nicht wie ich sie wieder zusammensetzen soll. Der andere post hat mir nicht geholfen.',
        answer:
          'gib mal 137 80 78  71 in google ein. Dadurch solltest du herausfinden, welches datei format das ist. Dann musst du nur eine leere Datei anlegen mit dieser Dateiendung und mit einem Hex editor (z.B. HxD) die bytes als hexadezimal zahlen reinschreiben',
      },
      {
        question:
          'ist es schlimm wenn man manche btes falsch hat?<br />oder funktioniert es dann nichtmehr<br />ich schaffe es nicht 😢',
        answer:
          'wenn du Glück hast machen die Fehler nichts aus - wenn du Pech hast lädt das Bild nicht mehr',
      },
      { question: 'wie gross soll die datein sein?', answer: '1-2kb' },
      {
        question: 'sag mal welches programm du benutzt hast',
        answer:
          'also ich habe tatsächlich kein programm benutzt, ich hab mir die datei in 1,75x geschwindigkeit angehört und alles aufgeschrieben',
      },
    ],
  },
  72: {
    entries: [
      {
        question:
          'Weiß jemand zufällig wie man Labyrinth löst ich klicke nur die ganze Zeit durch auf die Hoffnung die Antwort zu bekommen.',
        answer: 'stift und papier helfen hier viel weiter ;)',
      },
      {
        question: 'Kleine Frage: sollte es Karopapier sein?',
        answer: 'muss nicht unbedingt sein, ist aber wohl am sinnvollsten',
      },
      {
        question: 'Ich komme hier auch nicht weiter...',
        answer:
          'hast du es schon mit Stift und Karo-Papier probiert? Dann solltest du zumindest langsam einen besseren Überblick bekommen',
      },
      {
        question:
          'Ja, hab es schon mit Stift und Papier versucht. Aber entweder sterbe ich oder es steht, ich laufe im Kreis',
        answer:
          'an sich sollte sich der richtige Weg finden lassen, wenn man alle Möglichkeiten probiert',
      },
    ],
  },
  74: {
    entries: [
      {
        question:
          'Ich hab mal mein Bestes gegeben und auch Tutorials geschaut, bin auf die Zahl 67931 gekommen und die lösung war nicht richtig, kann mir da jemand weiterhelfen',
        answer:
          '67931 scheint nicht zu passen, md5("hacktheweb67931") = fb132b5447cc3faa0e226ebfa6695e4c.',
      },
      {
        question:
          'ChatGPT gibt hier immer die falsche Zahl raus. Muss ich den Hash auf eine andere Art ermitteln?',
        answer:
          'Frage ChatGPT doch ob es dir ein Script schreiben kann, dass die einzelnen Zahlen ausprobiert...',
      },
      {
        question:
          'Sollte es nicht etwas mehr rechenleistung brauchen, eine blockchain zu manipulieren? Mit multithreading bin ich bei 0.25s.',
        answer:
          'Ja, stimmt. Bitcoin verlangt aktuell einen Hash mit 19 führenden Nullen. Das braucht deutlich mehr Zeit.',
      },
    ],
  },
  75: {
    entries: [
      {
        question: 'Ich weiß einfach nicht wie ich es herausfinden solll',
        answer: 'entweder manuell oder mit einem script',
      },
      {
        question: 'zwischen welchen zahlen liegt es',
        answer: 'zwischen 0 und 999',
      },
    ],
  },
  76: {
    entries: [
      {
        question: 'Wie finde ich es genau heraus oder was muss man tun?',
        answer:
          'Guck dich mal auf der Seite um ob irgendwo Informationen zu deinem Account sind',
      },
      {
        question:
          'Aber was soll ich berechnen. Von Anfang an bis heute oder von Anfang bis zuletzt online',
        answer:
          'Du musst die Zeit zwischen dem Zeitpunkt an dem du dein Profil erstellt hast bis zu genau dem Zeitpunkt an dem du diese Aufgabe löst',
      },
      {
        question:
          'Servus, ich häng da grad auch ein bisschen. Ich habs über ein Python-Script probiert und über diverse Internetseiten. Irgendein Tipp, was ich falsch machen könnte?',
        answer: 'Sommerzeit? +/- ein paar Minuten zur Sicherheit?',
      },
    ],
  },
  77: {
    entries: [
      {
        question: 'Wer ist am 23 Juni geboren',
        answer: 'Nutze die Liste oder suche im Internet',
      },
      {
        question: 'wenn ich [..] [..] eingebe ist es falsch warum',
        answer: 'nur nachname',
      },
      {
        question: 'Ich weiß einfach nicht mehr weiter',
        answer:
          'Klicke auf &quot;Liste bedeutender Personen ...&quot und es öffnet sich eine Aufzählung',
      },
    ],
  },
  78: {
    entries: [
      {
        question: 'Wie funktioniert diese Aufgabe ',
        answer: 'Hast du die Druckvorschau geöffnet?',
      },
      {
        question: 'wie kommt man zur Druckvorschau',
        answer: 'Strg - P, oder über das Menü und dann Drucken',
      },
    ],
  },
  79: {
    entries: [
      {
        question:
          'die antwort geht nicht,die richtige ,hier liegt ein fehler vor!',
        answer:
          'Die Aufgabe wurde soeben überarbeitet und die Antwort hat sich verändert ...',
      },
    ],
  },
  80: {
    entries: [
      {
        question: 'Wie macht man das',
        answer:
          'Ändere die Farben im Stylesheet oder lasse dir die Farben einmal mischen',
      },
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
      {
        question: 'wie kann man das berechnen',
        answer:
          'es gibt keine feste Formel, es braucht ein wenig logisches Denken',
      },
    ],
  },
  84: {
    entries: [
      {
        question: 'Ich checke die Aufgabe nicht',
        answer: 'Finde die Antwort auf der Seite',
      },
    ],
  },
  85: {
    entries: [
      {
        question:
          'Verstehe die Aufgabe nicht idk was ich da machen soll hab schon versucht da irgendwie Metadaten rauszuholen da stand aber nichts',
        answer: 'Guck mal genauer auf dem Bild - vielleicht siehst du dann was',
      },
      { question: 'Was ist die Lösung? ', answer: 'ist im Bild versteckt' },
    ],
  },
  87: {
    entries: [
      { question: 'was muss man tun', answer: 'Spiele das Spiel zu Ende' },
      {
        question: 'Was soll ich ändern',
        answer:
          'Die Geschwindigkeit zum Beispiel, ist mit einem gelben Zettel markiert',
      },
    ],
  },
  88: {
    entries: [
      {
        question: 'wie soll ich das ausrechnen',
        answer: 'Taschenrechner? Excel?',
      },
      {
        question: '1050 ist falsh warum',
        answer:
          'du hast dich irgendwo verrechnet, es kommt eine andere Zahl raus',
      },
      {
        question: 'die antwort ist doch 1290 ?',
        answer: 'Auch das ist (noch) nicht richtig',
      },
    ],
  },
  90: {
    entries: [
      {
        question: 'Wann ist das Orakel den geöffnet',
        answer:
          'ein kleines Script, dass die Seite alle paar Minuten aufruft, kann dir helfen die passende Zeit zu finden',
      },
      {
        question: 'weiss echt jemand wann man das orakel befragen kann?',
        answer:
          'Wenn man nicht warten möchte, hilft vielleicht auch ein educated guess.',
      },
      {
        question: 'ich habe 15 min gewartet es ist nichts',
        answer:
          'Hast du die Aufgabe richtig gelesen? Die Antwort kommt nicht alle 15 Minuten sondern nur einmal am Tag für 15 Minuten, du musst schon den richtigen Zeitpunkt erwischen, und wenn du Pech hast und das Orakel knapp verpasst hast dann musst du ca 23 Stunden und 45 Minuten warten.',
      },
      {
        question:
          'Ich hatte ziemliches Glück bei der Aufgabe, ich konnte das Orakel direkt beim ersten Versuch erreichen ^^',
        answer:
          'So viel glück muss man erstmal haben 😄 Ich darf jetzt ein script schreiben und 1 tag laufen lassen hahah',
      },
      {
        question: 'man kann es einfach erraten wenn man bisschen googelt',
        answer: 'Pst 🤫 🙂',
      },
      {
        question:
          'Ist der Zeitraum jeden Tag zur gleichen Zeit, oder ändert der sich?',
        answer: 'Sollte gleich bleiben',
      },
    ],
  },
  91: {
    entries: [
      {
        question:
          'Ich verstehe nicht wo die Cookies gespeichert werden sollen kann mir irgendwer helfen',
        answer: 'Im Browser - schau mal in die DevTools',
      },
    ],
  },
  93: {
    entries: [
      {
        question:
          'bei mir funktioniert es nicht und es kommen nur irgendwelche Zeichen heraus',
        answer:
          'schon mal gut, dass überhaupt Zeichen rauskommen. Die Nachricht ist ein deutscher Text und sollte lesbar sein. Hast du alle Teile des Ciphers nochmal überprüft?',
      },
    ],
  },
  95: {
    entries: [
      {
        question:
          'hi, ich habe schon probiert die schriftart einzubinden. Ich weiß aber nicht ob man dafür die Datei Hacktheweb-Regular.otf benötigt und wenn ja, wo sie zu finden ist.',
        answer:
          'Dieser Teil der Challenge sollte dir zeigen, wo du die Schriftart herunterladen kannst. &lt;font src="/chals/HackTheWeb-Regular.otf" /&gt;',
      },
    ],
  },
  96: {
    entries: [
      {
        question:
          'Kleine Frage bin grad bei tiktok beim 1 video von Kallmekris und dort sind keine # mit 4 Wörtern sowie normale Wörter mit 4 Buchstaben',
        answer:
          'Das würde ich bezweifeln, bist du sicher dass du beim allerersten Video bist? ',
      },
      {
        question:
          'Heyho,<br />da ich TikTok nicht nutze und somit keine Ahnung habe, ob eine Möglichkeit existiert nach Veröffentlichungsdatum (Reverse) zu sortieren: Gibt es eine Möglichkeit, das erste Video zu finden, ohne einen Scraper zu programmieren oder zu warten bis der Browser per scrolling beim letzten Video angekommen ist? Bietet TikTok da eine Möglichkeit, die funktioniert ohne einen Account anzulegen (auch ohne iwelche Apps - Einfach nur Browser oder halt API oder so)? Möchte den Datenkraken von TikTok nichts überlassen.<br />Beste Grüße',
        answer:
          'Also einfach mal generell. Man kann die Aufgabe lösen, ohne sich bei TikTok anzumelden/registrieren.',
      },
    ],
  },
  97: {
    entries: [
      {
        question:
          'Hallo zusammen, ich hänge hier bei der Aufgabe fest. Cipher I konnte ich lösen und jetzt habe ich meinen Code so modifiziert, dass er alle Keys zwischen 0 und 255 testet und mir das Ergebnis ausspuckt. Hier konnte ich aber nix brauchbares finden, irgendwelche Ideen?',
        answer:
          'Versuch mal die Ausgabe so zu filtern, dass nur das ausgegeben wird in dem ein echtes Wort vorkommt. Dann sollte es leichter sein die Lösung zu finden.',
      },
      {
        question:
          'Hallo zusammen, gleich mit einer Verständnisfrage: Soll überhaupt der Text aus "Cipher" mit "Cipher 2" entschlüsselbar sein? Ist doch eine ganz andere Verschlüsselung, oder?',
        answer:
          'Cipher 2 ist ne andere Verschlüsselung als Cipher 1. Ebenso wie Cipher 3 auch nochmal ne andere Verschlüsselung als Cipher 2 ist',
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
  100: {
    entries: [
      {
        question: 'Ich weiß nicht was man hier tun soll.',
        answer:
          'du musst die Seite mit dem  Internet explorer öffnen oder es der Website vortäuschen',
      },
      {
        question: 'Und wie ich habe nur Firefox',
        answer: 'das ist genau deine Aufgabe',
      },
    ],
  },
  101: {
    entries: [
      {
        question: 'Es hört einfach nicht auf. Wie kann ich es scneller Lösen',
        answer:
          'Also in Python ohne externe Pakete braucht es je nach Rechner ca. eine Minute, wenn es deutlich länger braucht solltest du dein Programm überprüfen. ',
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
      {
        question: 'wie soll ich nur die richtige antwort herausfiltern',
        answer:
          'bisher hatten alle Antwort Sätze ein bestimmtes Muster. Filter einfach danach ob ein bestimmtes Wort enthalten ist.',
      },
    ],
  },
  103: {
    entries: [
      {
        question: 'Was ist mit Rückseite des Planetens gemeint?',
        answer: 'Schau dich mal da um wo die Aufgabe startet',
      },
      {
        question: 'ich sehe garnichz das da was steht',
        answer:
          'Also wenn man die Objekte die im Weg sind ausblendet, dann steht da auch etwas was man sogar ohne Lupe lesen kann. Allerdings wird man die Lösung schon vorher sehen.',
      },
      {
        question:
          'Hi, Ich sitze jetzt schon mehrere Tage an der Aufgabe. Ist mit Hintergrund etwas im CSS der Website gemeint oder wie kann man das verstehen? ',
        answer:
          'Im HTML findest du zwischen Sternenhimmel und Planeten einen geheimen Text',
      },
    ],
  },
  105: {
    entries: [
      {
        question: 'Gibt mir jemand bitte die lösung',
        answer: 'Es gibt keine "richtige Lösung", sondern viele Wege',
      },
      { question: 'Was ist die Lösung', answer: 'Jedes Wort mit 1337 Zeichen' },
      {
        question:
          'Es gab ja noch einige mehr Challanges mit Leet, war nicht mein Problem. Nur bei Challange 105 1337 verstehe ich den Zusammenhang nicht richtig.',
        answer:
          '1337 ist viel simpler gedacht, es geht nicht um leet, sondern  nur um die Anzahl der Buchstaben.',
      },
    ],
  },
  107: {
    entries: [
      {
        question:
          'Hi, ich bin gerade bei der Neuland Aufgabe, die angegebenen Adressen laden nicht und auch das Script sagt time out. Als ich das vor einem Monat schonmal probiert hatte, war das galube ich noch nicht so. HTTP ist drin',
        answer:
          'Service ist online und funktioniert. Time out ist auch zu erwarten: Solange du nicht den richtigen Port hast, wirst du auch keine normale Antwort erhalten..',
      },
      {
        question:
          'bei den ports der angegblich der richtige ist, bekomme ich bei all meinen geräten einen error<br />SSL hat einen Eintrag erhalten, der die maximal erlaubte Länge überschritten hat. <br />Fehlercode: SSL_ERROR_RX_RECORD_TOO_LONG',
        answer:
          'kannst du nachschauen, ob du http (statt https) nutzt? Der Service unterstützt kein https. Die Links in der Aufgabe sollten eigentlich schon so gesetzt sein, aber viele Browser leiten das automatisch weiter<br />man muss manuell http://... tippen, sonst versucht der Browser automatisch, eine sichere Verbindung aufzubauen',
      },
      {
        question: 'es wird automatisch wieder zu https geändert',
        answer:
          'Es ist tatsächlich das Problem, dass sich der Browser die Umleitung für 24h merkt. Inkognito-Tab hat bei mir geholfen<br />Korrektur: 365 Tage xD kannst du mal schauen, ob der private Tab hilft?',
      },
      {
        question:
          'Komisch, bei mir zeigt er keine offenen Ports im angegebenen Bereich an 🤔',
        answer:
          'Ich habe es gerade selber noch einmal getestet, und die Ports sind offen und der Dienst läuft fehlerfrei.',
      },
      {
        question: 'Wie kann ich es lösen so das ich es schaffe',
        answer:
          'du könntest einen Script schreiben der alles durch probieren - oder vorhandene Tools wie nmap verwenden, die auf so etwas ausgelegt sind',
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
      {
        question: 'Wie funktioniert es? Was muss ich beachten',
        answer: 'Das ist eine Programmiersprache guckt im Internet danach',
      },
    ],
  },
  110: {
    entries: [
      {
        question: 'wie soll man die zahl berechnen',
        answer: 'Du kannst mehrere Rechnungen hintereinander ausführen.',
      },
      {
        question: 'erklär die aufgabe nochmal',
        answer:
          'Du kannst 16 nicht eintippen, aber 4 mal 4 rechnen geht und du erhältst das Ergebnis. So kannst du große Zahlen berechnen.',
      },
      {
        question: 'WIESO KANN ICH NUR EINE ZAHL AUFSCHREIBEN',
        answer:
          'Das ist der Defekt des Taschenrechners, sollte dich aber nicht aufhalten',
      },
      {
        question: 'was sind die faktoren mit denen man 256 berechnen kann',
        answer: '256 ist eine Zweierpotenz',
      },
    ],
  },
  111: {
    entries: [
      {
        question: 'Wie berechnet man 10 000',
        answer: 'mache mehrere kleine Rechnungen',
      },
      {
        question: 'wie kann man das machen',
        answer: 'tippe 2 mal 5 ein, schaue dir das Ergebnis an und überlege',
      },
    ],
  },
  112: {
    entries: [
      {
        question: 'welcher bock ist es',
        answer:
          'Überlege mal, warum die Kürbislaterne nicht leuchtet und wie man das Problem löst',
      },
      {
        question: 'Wo finde ich die Block ID?',
        answer:
          '<a href="https://minecraftitemids.com/types/redstone" target="_blank">https://minecraftitemids.com/types/redstone</a>',
      },
      {
        question: 'Welche Block id hat redstone',
        answer:
          'Es ist kein Redstone-Block (aber ein anderer Block mit Redstone)',
      },
    ],
  },
  113: {
    entries: [
      {
        question: 'was soll des sein',
        answer: 'In Minecraft gibt es Befehle die mit / starten',
      },
      {
        question: 'wie stellt mann in minecraft die uhrzeit auf mitternacht',
        answer: 'Schau mal im Internet',
      },
      {
        question: 'was kommt danach',
        answer: 'Das ist die letzte Minecraft-Aufgabe',
      },
    ],
  },
  114: {
    entries: [
      {
        question: 'Wie heißt der Baum',
        answer: 'Im Bild ist ein Hinweis zu sehen',
      },
      { question: 'kan mmir jemand helfen', answer: 'Klick mal auf den Baum' },
      {
        question: 'da passiert nichts ',
        answer: 'Hast du auf das Bild geklickt? Mit der linken Maustaste.',
      },
      {
        question: 'was ist die antwort',
        answer: 'Schaue an wie das Bild heißt.',
      },
      {
        question: 'wie heißt das bild?',
        answer: 'Siehst du, wenn du auf das Bild klickst',
      },
    ],
  },
  115: {
    entries: [
      {
        question: 'Wie findet man das mit den Koords raus?',
        answer:
          'Die meisten Bildbearbeitungsprogramme zeigen dir die Koordinaten der Maus an',
      },
      {
        question:
          'Also ich komm mir direkt Dumm vor, ich hab den Ausschnitt und weiß nicht welches spiel gemeint ist. Ich hab schon einiges versucht zB. das Spiel von Micro$oft mit 4 Buchstaben und auch das Spiel mit 13 Buchstaben (ohne und mit Leerzeichen) aber ja bin wohl zu blöd xD Hat jemand einen Tipp für mich?',
        answer:
          'Die Antwort sollte 6 Buchstaben lang sein. Hast du den Hinweis zum Koordinatensystem gelesen? Der Ursprung ist nicht oben links, sondern in der Mitte ... ansonsten sollte der Ausschnitt relativ eindeutig sein  - hoffe das hilft weiter',
      },
    ],
  },
  116: {
    entries: [
      { question: 'Was ist die Lösung', answer: '15876000 ist die Lösung' },
      {
        question: 'Wie bekommt man diese Lösung heraus',
        answer:
          'Es geht darum es in den Taschenrechner einzugeben. Schon mal was von Primfaktorzerlegung gehört?',
      },
      {
        question: 'was ist primfaktorzerlegung',
        answer:
          '100 hat zum Beispiel die Primfaktorzerlegung 2 * 2 * 5 * 5 - es gibt Rechner dafür online',
      },
      {
        question: 'primfaktorzerlegung für diese aufgabe',
        answer:
          '<span class="spoiler-text">15876000 = 2*2*2*2*2*3*3*3*3*5*5*5*7*7</span>',
      },
    ],
  },
  117: {
    entries: [
      {
        question:
          'gibt es ein prinzip, das man verfolgen soll, oder ist das einfach wildes ausprobieren?',
        answer:
          'Es gibt ein Prinzip, mit dem du die Aufgabe jedes Mal lösen kannst',
      },
      {
        question: 'Woher weiß ich in welche Tür ich gehen muss',
        answer:
          'Beim Hinweg muss du raten, aber beim Rückweg kannst du clever sein',
      },
    ],
  },
  119: {
    entries: [
      {
        question: 'hilfe bitte bei passwort',
        answer:
          'Schau dir den Text an und die Beispiele. Fallen wir noch weitere Möglichkeiten ein?',
      },
      {
        question: 'sind kommas erlaubt',
        answer: 'Nein, Antwort enthält keine Kommas',
      },
      {
        question:
          'Prämisse 1: Ich verwende Translate. Prämisse 2: Ich weiß nicht viel über Taylor. Ich habe gesehen, dass sie beim Münchner Konzert vor Betty ein gesprochenes Intro gemacht hat. Ich habe es mir angehört, in der Hoffnung, Hinweise zu finden, aber auch dort und im Text konnte ich nichts finden. Bin ich nah dran oder sollte ich meinen Ansatz ändern?',
        answer: 'die Antwort findet sich bereits im Steckbrief',
      },
    ],
  },
  120: {
    entries: [
      {
        question: 'Was deutet auf das Passwort hin?',
        answer: 'die youtuberin',
      },
      {
        question: 'in welcher zeile steht das passwort',
        answer: 'Die Antwort selbst steht nicht im Text',
      },
    ],
  },
  301: {
    entries: [
      {
        question:
          'Ich versuche an der URL den /Chal/chal301/ anzugeben aber wenn ich es auf enter drücke ist es weiß mit dem Englischen Text am oberen Rand links zu seheb',
        answer:
          'Du musst eine Löschanfrage stellen und nicht nur die Seite aufrufen.',
      },
    ],
  },
  303: {
    entries: [
      {
        question: 'was könnte mir da helfen?',
        answer: 'schnell rechnen und tippen? :)',
      },
    ],
  },
  304: {
    entries: [
      {
        question:
          'Gibt es eine einfachere möglichkeit, als ein skript, welches alle zahlen durchgeht und addiert? (Ausser Listen herunterladen und die addieren lassen 😅) Mein Skript wäre nämlich voraussichtlich erst in 14+ Tagen fertig :/',
        answer:
          'Wenn dus dir nicht leicht machen willst, muss wohl ein effizienterer Algorithmus her ;D Eine etwas optimierte Version des Sieb des Eratosthenes hat bei mir als Python Skript etwa 15 Minuten gedauert',
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
      {
        question:
          'Ich kann hier nicht genau ermitteln, was für eine Verschlüsselungmethode hier angewendet wurde. Sieht bisschen nach Base64 aus, Entschlüsselung funktioniert aber leider nicht. Kann mir jemand ein Hinweis geben?',
        answer:
          'wenn du magic nutzt, sagt es dir welche entschlüsselungen ähnlich sind',
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
  308: {
    entries: [
      {
        question:
          'Ich komme hier nicht weiter. Die Berechnungen welche ich gemacht habe stimmen alle überein mit den gegebenen Werten. Jede Rundung ist aber falsch, habe ich hier etwas falsch gemacht? Die 20 Grad Temparatur haben ja keinerlei Einfluss auf den freien Fall. Kann mir jemand weiterhelfen?',
        answer:
          'die 20° sind schon relevant. Lese dir nochmal genau durch wie der Messwert für die Zeit zustande kommt.',
      },
      {
        question:
          'Ich verstehe immer nicht was die 20° für einen Einfluss haben',
        answer: 'Schallgeschwindigkeit',
      },
      {
        question:
          'Jungs und Mädels, ich hab probiert, es selbst zu rechnen und nicht geschafft, vielleicht auch, weil ich komplett müde bin. Dann hab ich ChatGPT gefragt, was ich eigentlich nicht mache und der liefert mir immer ein anderes Ergebnis. Habs mit 343 m/s^2 und 343,2 m/s^2 probiert. Paar Tipps?',
        answer:
          'Paar Denkanstöße: Nimmst du alle Angaben in deine Rechnung auf? Was hat sich denn im Vergleich zur vorherigen Aufgabe an der Aufgabenstellung geändert?',
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
          'Ich habe 50<i>xxx</i> Sekunden raus anscheinend ist es falsch, ich habe es mit mehreren Formeln ausgerechnet, auch ChatGPT habe ich gefragt da kommt dasselbe raus.',
        answer:
          'Du bist nur um eine Sekunde daneben, wahrscheinlich durch das Runden.',
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
      {
        question:
          'Hier komme ich nicht in eine Seite rein weil es sagt das der Server nicht existiert',
        answer: 'Gehst du auch mit dem Tor Browser auf die Seite?',
      },
      {
        question: 'Ich versuche es zu kopieren aber es ist die Warnung',
        answer:
          'du must dir den Tor (The onion router) Browser herunterladen und die website damit aufrufen. Den gibt es für fast jedes OS.',
      },
    ],
  },
  316: {
    entries: [
      {
        question: 'Wie kan ich einfach herausfinden wo die brücke ist',
        answer:
          'Google Bildersuche? Oder nach Details und suchen…und dann Text oder Bildersuche?',
      },
      {
        question: 'bei mir kommen da keine ergebnisse',
        answer:
          'hängt bei mir stark vom Bildausschnitt ab, probiere mal bisschen herum',
      },
      { question: 'wo liegt der fluss', answer: 'das musst du herausfinden' },
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
  318: {
    entries: [
      {
        question:
          'Bräuchte Hilfe bei der Aufgabe, habe mit mehreren Methoden versucht den Text zu enziffern aber da kommt nur Quatsch raus 😄 Kann mir jemand einen Denkanstoss geben?',
        answer:
          'Einige Standard-Methoden sind in https://en.wikipedia.org/wiki/Transposition_cipher beschrieben, für dich als Denkanstoß ganz allgemein 🙂',
      },
    ],
  },
  321: {
    entries: [
      {
        question: 'was ist hier Mehrdeutig?',
        answer: 'Man kann die Anweisung auf zwei Arten verstehen.',
      },
    ],
  },
  323: {
    entries: [
      { question: 'Ist die Lösung in der Aufgabe?', answer: 'Ja, ist sie' },
    ],
  },
  325: {
    entries: [
      {
        question:
          'Was soll man hier genau machen?<br />Ich habe schon versucht den Standort des Brunnen einzugeben und etliche andere sachen wie versteckte Mitteilungen zu finden aber komme hier nicht weiter. <br />Kann mir jemand ein Denkansatz geben? Danke 🙂',
        answer:
          'Etwas konkreter: Die Information ist in den bits der Pixel gespeichert. Wenn man die richtigen bits anschaut, findet sich etwas.',
      },
      {
        question:
          'Gibt es ein gutes Tool, wie man die Bits anschauen kann? Stecke hier leider fest..',
        answer:
          'der Fachjargon lautet stegano, mit image stegano online findest du einige ausgezeichnete Tools',
      },
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
  327: {
    entries: [
      {
        question:
          'Habe mich bei dieser Aufgaben total verfahren. Bin mit ZSteg irgendwelchen OpenPGP Schlüsseln hinterhergerannt, aber das hat mich nirgendwo hingeführt. Auf Aperisolve auch nix Interessantes. Hab das Bild lange angeglotzt und auf ein Stereogramm gehofft. Alle Filter mit Graphic Converter haben nix gebracht. Habe das Bild in Ebenen aufgeteilt und nette Rorschach-Figuren erhalten. Was sehe ich nicht, was vor aller Augen zu sein scheint? Ich glaube ich brauche hier einen Tipp.',
        answer:
          'Du hast das sichtbare Bild, die "Oberfläche" aus dem Hinweis, offenbar nach allen Regeln der Kunst zerlegt. Du brauchst zur Lösung aber noch mehr, was zwar auch enthalten, aber eben nicht sichtbar ist.',
      },
      {
        question:
          'Datei heruntergeladen. Info angeschaut, keine Kommentare oder so. Mit HexEdit geöffnet. Verschiedene Kodierungen ausprobiert: Im Text keine Wörter gefunden. Ich sehe immer noch nix! Wird langsam peinlich',
        answer:
          'Woran hast du denn in HexEdit erkannt, dass du ein PNG vor dir hast? - Die Datei hat verdächtig viele kb für die wenigen Pixel 🙃',
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
  331: {
    entries: [
      {
        question:
          '1)Die ID aller Aufgaben summiert und eingegeben<br />2)Alle Punkte, welche man für das Lösen aller aufgaben bekommt summiert und eingegeben<br />Ein Denkanstoß, ein Wikipedia Artikel o.Ä. wäre sehr hilfreich ',
        answer: 'Jede gelöste Aufgabe erhöht die Zahl um 1',
      },
      {
        question:
          'Also ich habs mit den Hints getestet und ausgerechnet nur leider falsch... o.O und ich dachte Excel lügt nicht ... hat wer eine idee?',
        answer:
          'Probiere immer ein wenig drum herum… meistens ist es etwas größer als du rechnest',
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
        question: 'ich komm einfach nicht darauf',
        answer: 'Suche nach der ID im Internet',
      },
      {
        question: 'Was ist eine ID',
        answer:
          'Das ist wie der Computer den Block speichert. Probiere mal <a href="https://minecraftitemids.com/" target="_blank">https://minecraftitemids.com/</a>',
      },
      {
        question: 'i dont play mincraft. whats the name of this block',
        answer: 'it&apos;s called <span class="spoiler-text">bed rock</span>',
      },
      {
        question:
          'ist das ergebnis nicht <span class="spoiler-text">Bedrock</span> ?????? ',
        answer: 'davon die ID',
      },
      {
        question: 'was für ein block braucht man',
        answer:
          'Fahre mit der Maus über die schwarzen Kästen in den Antworten oben!',
      },
    ],
  },
  337: {
    entries: [
      {
        question: 'wie kann mann das lösen',
        answer: 'Erkennst du ein paar der Blöcke?',
      },
      {
        question: 'wie geht das hab kein minekraft',
        answer:
          'Es gibt auch einen anderen Hinweis für Leute, die kein Minecraft haben',
      },
      {
        question:
          'Ich hab wirklich alles versucht was mir in den Kopf gekommen ist aber ich komm nicht drauf. Hänge schon seit ein paar Wochen an der Aufgabe. Kann mir jemand einen kleinen Tipp geben. 😅',
        answer:
          'Die Antwort ist einfacher als man denkt. Überlege mal zu welcher Block-Kategorie die dargestellten Items gehören',
      },
      {
        question: 'ich spiele kein minekraft wie heist das',
        answer:
          'Bildersuche? Google Lens? Freund fragen? Es gibt viele Möglichkeiten.',
      },
      {
        question:
          'ich habe nach bildern gsucht aber es gibt tausende ich ich kann die lösung nicht herreus finden.',
        answer: 'es geht um die Farbe der Steine',
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
      { question: 'sind mit Schneeflocken die * gemeint?', answer: 'Ja' },
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
        <style>
          .spoiler-text {
            background: #0d0d0d;
            color: transparent;
            cursor: help;
            padding-left: 3px;
            padding-right: 3px;
            margin-left: 3px;
            margin-right: 3px;

            border-radius: 4px;

            transition: background 0.1s ease 0.2s, color 0.2s ease 0.25s;
          }

          .spoiler-text:hover,
          .spoiler-text:focus {
            background: #303030;
            color: inherit;
          }
        </style>
      
        <p><a href="/challenge/${id}">zurück</a><span style="display: inline-block; margin-left:8px; margin-right: 8px; color: #313131">•</span><a href="/map">Karte</a></p>

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
    /** @type {string} */
    const question = req.body.question?.toString()
    const id_ = req.body.id?.toString()

    const id = id_ ? parseInt(id_) : -1

    if (!question || !App.challenges.dataMap[id]) {
      res.redirect('/map')
      return
    }

    const key = `question_${id}_${new Date().getTime()}`

    // hard-code max-length
    App.storage.setItem(key, question.slice(0, 2000))

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
