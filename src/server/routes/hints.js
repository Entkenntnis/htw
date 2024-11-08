import { Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

/** @type {import('../../data/types.js').HintsData} */
export const hintsData = {
  3: {
    entries: [
      {
        question: 'Was ist die Lösung',
        answer: 'höre dir die Morse-Nachricht an',
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
  15: {
    entries: [
      {
        question: 'Bei mir klappt die aufgabe nicht',
        answer: 'Schau dir den Text bei "... ist falsch" genauer an',
      },
    ],
  },
  16: {
    entries: [
      {
        question: 'was ist die lösung',
        answer: 'deine aktuelle Punktzahl (mit kleiner Veränderung)',
      },
      {
        question: 'Welche veränderung',
        answer: 'wenn ich 1 eingebe, steht dann "-1 ist falsch" da',
      },
    ],
  },
  17: {
    entries: [
      {
        question: 'Ich checks ned - ich hab alles rückwärts eingegeben',
        answer: 'Versuch mal nur die Reihenfolge der Wörter zu verändern',
      },
      {
        question: 'ich verstehe nichts',
        answer:
          'Hast du schon den Slogan von Bex eingegeben und geschaut, was passiert?',
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
      { question: 'der name des emojis', answer: 'grinning face von whatsapp' },
    ],
  },
  39: {
    entries: [
      {
        question: 'Hilfe bitte',
        answer: 'Hast du die Flaggen im Video entdeckt?',
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
  53: {
    entries: [
      {
        question:
          'NICHT AUF DEN ZWEITEN PUNKT KLICKEN!!! ALLES WIRD ZURÜCKGESETZT',
        answer: 'wichtig',
      },
    ],
  },
  56: {
    entries: [
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
  68: {
    entries: [
      {
        question: 'Krieg ich einen Tipp',
        answer: 'Welches Gemälde sieht du? Ist berühmt und hat einen Namen.',
      },
      {
        question: 'Wann wurde die monalisa gemalt',
        answer: 'Ist egal - es geht um das Geburtsjahr des Malers',
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
      { question: 'Wer ist am 23 Juni 1912 geboren', answer: 'Suchmaschine' },
    ],
  },
  78: {
    entries: [
      {
        question: 'Wie funktioniert diese Aufgabe ',
        answer: 'Hast du die Druckvorschau geöffnet?',
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
  88: {
    entries: [
      {
        question: 'wie soll ich das ausrechnen',
        answer: 'Taschenrechner? Excel?',
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
  112: {
    entries: [
      {
        question: 'Wo finde ich die Block ID?',
        answer:
          '<a href="https://minecraftitemids.com/types/redstone" target="_blank">https://minecraftitemids.com/types/redstone</a>',
      },
    ],
  },
  114: {
    entries: [
      { question: 'kan mmir jemand helfen', answer: 'Klick mal auf den Baum' },
      {
        question: 'da passiert nichts ',
        answer: 'Hast du auf das Bild geklickt? Mit der linken Maustaste.',
      },
      {
        question: 'was ist die antwort',
        answer: 'Schaue an wie das Bild heißt.',
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
  116: {
    entries: [
      { question: 'Was ist die Lösung', answer: '15876000 ist die Lösung' },
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
    ],
  },
  337: {
    entries: [
      {
        question: 'wie kann mann das lösen',
        answer: 'Erkennst du ein paar der Blöcke?',
      },
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
        <p><a href="/challenge/${id}">zurück zur Aufgabe</a><span style="display: inline-block; margin-left:8px; margin-right: 8px; color: #313131">•</span><a href="/map">zurück zur Karte</a></p>

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
