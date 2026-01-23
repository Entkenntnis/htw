var QUIZ_DATA = [
  {
    id: 1,
    de: {
      topic: 'Netzwerk',
      questions: [
        {
          question:
            'Damit Computer im Internet kommunizieren können, benötigen sie eine:',
          options: [
            'IP-Adresse',
            'Grafikkarte',
            'USB-Verbindung',
            'Festplatte',
          ],
          details: [
            'Eine IP-Adresse ist die eindeutige „Adresse“ im Netzwerk. Damit können Datenpakete an den richtigen Computer gesendet und von ihm beantwortet werden.', // IP-Adresse (Richtig)
            'Eine Grafikkarte ist für die Darstellung von Bildern zuständig. Für die Kommunikation im Internet braucht dein Gerät aber eine Netzwerk-Adresse (IP), nicht mehr Grafikleistung.', // Grafikkarte
            'USB ist eine Kabel-/Geräteschnittstelle und kein Internet-Adresssystem. Auch ohne USB kann ein Gerät online sein (z. B. über WLAN).', // USB-Verbindung
            'Eine Festplatte speichert Daten. Für das Senden/Empfangen im Internet ist entscheidend, dass dein Gerät im Netzwerk adressierbar ist (IP-Adresse).', // Festplatte
          ],
        },
        {
          question:
            'Du kannst Webseiten über HTTP oder HTTPS aufrufen. Wofür steht das "S" in HTTPS?',
          options: ['Secure', 'Simple', 'Speedy', 'Superduper'],
          details: [
            '„Secure“ bedeutet, dass die Verbindung verschlüsselt ist (TLS). So können Dritte den Inhalt nicht einfach mitlesen oder unbemerkt verändern.', // Secure (Richtig)
            '„Simple“ klingt plausibel, ist aber falsch: Das S steht nicht für „einfach“, sondern für die abgesicherte (verschlüsselte) Verbindung.', // Simple
            '„Speedy“ ist ebenfalls falsch: HTTPS macht eine Verbindung nicht automatisch schneller; es geht um Sicherheit (Verschlüsselung/Integrität).', // Speedy
            '„Superduper“ ist ein Spaß-Begriff und hat keine technische Bedeutung bei HTTPS.', // Superduper
          ],
        },
        {
          question:
            'Du öffnest einen Link und erhältst einen 404 Fehler. Was bedeutet das?',
          options: [
            'Die Seite wurde nicht gefunden',
            'Das Internet ist kaputt',
            'Dein Computer wurde gehackt',
            'Der Server ist überlastet',
          ],
          details: [
            '404 bedeutet „Not Found“: Der Server ist erreichbar, aber die angeforderte Seite/Datei existiert unter dieser Adresse nicht (mehr) oder wurde verschoben.', // Die Seite wurde nicht gefunden (Richtig)
            'Dein Internet ist dabei meist völlig in Ordnung: Andere Seiten funktionieren weiterhin. Es ist eher ein Problem mit dem Link oder der Seite auf dem Server.', // Das Internet ist kaputt
            'Ein 404 ist kein Hinweis auf einen Hack deines Computers. Es ist lediglich ein HTTP-Statuscode, der „nicht gefunden“ bedeutet.', // Dein Computer wurde gehackt
            'Ein überlasteter Server führt typischerweise zu anderen Codes (z. B. 503). Bei 404 geht es darum, dass der Inhalt nicht vorhanden ist.', // Der Server ist überlastet
          ],
        },
      ],
    },
  },
  {
    id: 2,
    de: {
      topic: 'Passwörter',
      questions: [
        {
          question: 'Welches dieser Passwörter bietet die höchste Sicherheit?',
          options: ['X7#mK9$pL2!q', 'Lukas2006', '123456789', 'Passwort123'],
          details: [
            'Diese Kombination ist am sichersten, da sie eine völlig zufällige Abfolge von 12 Zeichen ist, die Großbuchstaben, Kleinbuchstaben, Zahlen und Sonderzeichen mischt. Solche Passwörter sind gegen Wörterbuch-Angriffe immun und bräuchten Jahre, um berechnet zu werden. Ein Passwort-Manager hilft dir bei der Verwaltung.', // Richtig
            'Namen in Kombination mit einem Geburtsjahr sind leicht durch "Social Engineering" (Recherche in sozialen Medien) zu erraten.', // Lukas2006
            'Einfache Zahlenfolgen gehören zu den am häufigsten genutzten Passwörtern und werden von Angreifern oft als allererstes ausprobiert.', // 123456789
            'Wörter, die im Wörterbuch stehen (auch mit angehängten Zahlen), sind sehr unsicher, da Hacking-Tools diese in Sekundenbruchteilen durchtesten.', // Passwort123
          ],
        },
        {
          question: 'Was solltest du mit einem Passwort NIE machen?',
          options: [
            'Einer fremden Person verraten',
            'Deinem Haustier erzählen',
            'Auswendig lernen',
            'Regelmäßig ändern',
          ],
          details: [
            'Ein Passwort ist wie ein Schlüssel: Gib es niemals an fremde Personen weiter (auch nicht am Telefon/Chat). Damit können Konten übernommen und Daten missbraucht werden.', // Richtig
            'Deinem Haustier es zu erzählen ist praktisch kein Sicherheitsproblem, weil es das Passwort weder eingeben noch weiterverbreiten kann. Wichtig ist trotzdem: Gewöhne dir an, Passwörter generell vertraulich zu behandeln und nur sichere Wege zu nutzen (z. B. Passwort-Manager statt „erzählen“).',
            'Ein starkes Master-Passwort auswendig zu lernen ist sinnvoll (z. B. für deinen Passwort-Manager). Der Rest sollte idealerweise im Passwort-Manager gespeichert werden.',
            'Passwörter regelmäßig zu ändern ist nicht „verboten“ und kann sogar helfen, wenn du unsicher bist. Am wichtigsten ist aber: starke, einzigartige Passwörter verwenden und sie sofort ändern, wenn es Hinweise auf ein Leak/Diebstahl gibt.',
          ],
        },
        {
          question:
            'Du hast ausversehen doch dein Passwort verraten. Welches Vorgehen wird empfohlen?',
          options: [
            'Passwort sofort ändern',
            'Nichts tun',
            'Antivirus-Software installieren',
            'Computer neu starten',
          ],
          details: [
            'Ändere das Passwort sofort (und überall, wo du dasselbe Passwort benutzt hast). Danach: alle Sessions abmelden, Sicherheitsfragen prüfen und wenn möglich 2FA/MFA aktivieren.', // Richtig
            'Nichts tun ist riskant: Wenn jemand das Passwort hat, kann er sich jederzeit einloggen – manchmal auch unbemerkt.',
            'Ein Antivirus kann hilfreich sein, falls Malware beteiligt war, ersetzt aber nicht das Passwort-Ändern. Erst Passwort ändern, dann Gerät prüfen.',
            'Ein Neustart behebt das Problem nicht – der Angreifer kann das Passwort weiterhin verwenden.',
          ],
        },
      ],
    },
  },
  {
    id: 3,
    de: {
      topic: 'Web-Sicherheit',
      questions: [
        {
          question:
            'Welche dieser Benutzernamen ist der Versuch, eine Webseite zu hacken?',
          options: ["admin' OR 1=1; --", 'SigmaUser42', '	(ง •̀_•́)ง', 'Guest_*'],
          details: [
            'Bei einer SQL Injection versucht der Angreifer, eigene Datenbankbefehle in das Eingabefeld zu schmuggeln, um die Abfrage zu manipulieren. Durch den Zusatz "OR 1=1" wird die Bedingung immer "wahr", was dazu führen kann, dass man ohne Passwort eingeloggt wird oder Daten auslesen kann.', // Richtig
            '"SigmaUser42" sieht wie ein normaler Benutzername aus. Er enthält keine typischen SQL-Sonderzeichen oder -Schlüsselwörter, die eine Datenbankabfrage verändern würden.',
            'Ein Emoji/Unicode-Name ist zwar ungewöhnlich, aber kein Angriff an sich: Er versucht nicht, die Logik einer Abfrage zu brechen, sondern ist einfach nur ein String.',
            '"Guest_*" wirkt wie ein Muster, ist aber ohne passende (unsichere) Verarbeitung kein Hack. Ein Sternchen ist nicht automatisch „magisch“ – gefährlich wird es erst, wenn die Anwendung solche Zeichen falsch interpretiert (z. B. in unsicheren SQL- oder Regex-Konstruktionen).',
          ],
        },
        {
          question: 'Welchen Vorteil bieten Adblocker im Webbrowser?',
          // 'Wie nennt man den Angriff, bei dem ein riesiges Netzwerk aus ferngesteuerten Geräten (Botnet) eine Webseite gleichzeitig aufruft, um sie lahmzulegen?',
          options: [
            'Alle drei genannten Vorteile',
            'Blockieren von Werbung',
            'Schutz vor Viren',
            'Seiten laden schneller',
          ],
          details: [
            'Adblocker können Werbung blockieren, Seiten oft schneller laden lassen (weniger Skripte/Anfragen) und zusätzlich das Risiko durch „Malvertising“ reduzieren. Sie sind kein vollständiger Virenschutz, aber sie können eine wichtige Schutzschicht sein.', // Richtig
            'Nur „Werbung blockieren“ ist unvollständig: Viele Adblocker blockieren auch Tracker und ressourcenintensive Werbeskripte, wodurch Seiten häufig schneller laden und die Angriffsfläche sinken kann.',
            '„Schutz vor Viren“ ist als alleinige Aussage irreführend: Adblocker ersetzen kein Antivirus und können nicht alles erkennen. Sie können aber manche Infektionswege über bösartige Werbung reduzieren.',
            '„Seiten laden schneller“ stimmt oft, ist aber nicht der einzige Vorteil: Der Hauptzweck ist das Blockieren von Werbung/Trackern; die zusätzliche Sicherheitswirkung ist ein Nebeneffekt.',
          ],
        },
        {
          question:
            'Eine unbekannte Nummer schickt dir einen Link per SMS. Was tust du?',
          // 'Welche Sicherheitslücke ermöglicht es Angreifern, über einen manipulierten Link schädliche Skripte im Browser des Opfers auszuführen (z. B. um Cookies zu klauen)?',
          options: [
            'Link nicht anklicken, Nummer blockieren',
            'Link anklicken, um zu sehen, wohin er führt',
            'Zurückschreiben und nachfragen',
            'Link an Freunde weiterleiten, um deren Meinung zu hören',
          ],
          details: [
            'Nicht klicken: Unbekannte SMS-Links sind häufig „Smishing“ (SMS-Phishing). Blockieren/Löschen reduziert das Risiko, auf eine Fake-Seite zu geraten oder unbeabsichtigt Malware zu laden.', // Richtig
            '„Nur mal klicken“ ist genau das Risiko: Schon der Besuch kann dich auf eine täuschend echte Login-Seite führen oder dich zu Downloads/Abos/Weiterleitungen verleiten. Sicherer ist: gar nicht öffnen und den Absender unabhängig verifizieren.',
            'Zurückschreiben kann dich als „aktiv“ markieren (mehr Spam) und in ein Gespräch ziehen, in dem du überredet wirst. Wenn es wirklich wichtig ist, sollte die Kontaktaufnahme über einen vertrauenswürdigen Kanal erfolgen (z. B. offizielle Website/Nummer).',
            'Weiterleiten verbreitet den Betrug und setzt andere dem Risiko aus. Besser: nicht teilen, ggf. als Spam melden oder bei Verdacht die betroffene Organisation direkt (über offizielle Kontaktdaten) informieren.',
          ],
        },
      ],
    },
  },
  {
    id: 4,
    de: {
      topic: 'Hardware',
      questions: [
        {
          question:
            'Wie lautet die gängige Abkürzung für den Arbeitsspeicher eines Computers?',
          options: ['RAM', 'CPU', 'GPU', 'ROM'],
          details: [
            'RAM (Random Access Memory) fungiert als Kurzzeitgedächtnis des Computers, in dem Daten laufender Programme für den schnellen Zugriff bereitliegen. Sobald der Computer ausgeschaltet wird, gehen die Daten in diesem Speicher verloren.', // Richtig
            'Die CPU (Central Processing Unit) ist der Prozessor und das Gehirn des Computers, das Berechnungen durchführt.', // CPU
            'Die GPU (Graphics Processing Unit) ist die Grafikkarte und berechnet Bildschirminhalte oder 3D-Modelle.', // GPU
            'ROM (Read-Only Memory) ist ein dauerhafter Speicherbaustein, der Firmware-Daten enthält und nicht beschreibbar ist.', // ROM
          ],
        },
        {
          question:
            'Wie nennt man die Hauptplatine, die alle Komponenten eines Computers miteinander verbindet?',
          options: ['Motherboard', 'Keyboard', 'Dashboard', 'Breadboard'],
          details: [
            'Das Motherboard (oder Mainboard) ist die zentrale Platine, auf der wichtige Bauteile wie Prozessor, Arbeitsspeicher und Grafikkarte sitzen. Es stellt die elektronischen Verbindungen bereit, damit alle Komponenten miteinander kommunizieren und Strom erhalten können.', // Richtig
            'Keyboard ist der englische Begriff für die Tastatur zur Eingabe von Texten.', // Keyboard
            'Ein Dashboard bezeichnet eine grafische Benutzeroberfläche zur Übersicht von Daten oder Einstellungen.', // Dashboard
            'Ein Breadboard ist eine Steckplatine für Bastler, um elektronische Schaltungen testweise aufzubauen.', // Breadboard
          ],
        },
        {
          question:
            'Wofür steht die Abkürzung SSD bei modernen Speichermedien?',
          options: [
            'Solid State Drive',
            'Super Speed Disk',
            'System Security Data',
            'Silent Storage Device',
          ],
          details: [
            'Solid State Drive bedeutet, dass das Laufwerk auf Flash-Speicherbausteinen basiert und keine beweglichen mechanischen Teile besitzt. Dadurch sind SSDs wesentlich schneller, robuster und stromsparender als herkömmliche Magnetfestplatten (HDDs).', // Richtig
            'Super Speed Disk ist ein Fantasiebegriff und keine technische Bezeichnung für Speicherhardware.', // Super Speed Disk
            'System Security Data klingt nach einem Begriff aus der IT-Sicherheit und beschreibt kein physisches Laufwerk.', // System Security Data
            'Silent Storage Device beschreibt zwar eine Eigenschaft der SSD (lautlos), ist aber nicht die korrekte Auflösung der Abkürzung.', // Silent Storage Device
          ],
        },
      ],
    },
  },
  {
    id: 5,
    de: {
      topic: 'KI',
      questions: [
        {
          question:
            'Wie nennt man die Technik, bei der eine KI durch manipulative Eingaben dazu gebracht wird, ihre internen Sicherheitsrichtlinien zu ignorieren?',
          options: [
            'Prompt Injection',
            'Cloud Phishing',
            'Social Hacking',
            'Syntax Error',
          ],
          details: [
            'Bei einer Prompt Injection gibt der Benutzer einen Text ein, der die KI so täuscht, dass sie ihn als internen Befehl interpretiert und nicht als normale Nachricht. Dadurch können Schutzmechanismen ausgehebelt werden, sodass die KI beispielsweise beleidigende Inhalte oder geheime Instruktionen ausgibt.', // Richtig
            'Cloud Phishing zielt auf den Diebstahl von Zugangsdaten zu Online-Speichern ab und manipuliert keine KI-Eingaben.', // Cloud Phishing
            'Social Hacking bezeichnet die psychologische Manipulation von Menschen und ist kein technischer Angriff auf die Softwarelogik.', // Social Hacking
            'Ein Syntax Error ist ein technischer Fehler im Programmcode, der das System zum Absturz bringt, aber keine gezielte Manipulation darstellt.', // Syntax Error
          ],
        },
        {
          question:
            'Wofür steht die Abkürzung LLM im Zusammenhang mit modernen KIs wie ChatGPT?',
          options: [
            'Large Language Model',
            'Long Lasting Machine',
            'Little Learning Monster',
            'Lazy Logic Module',
          ],
          details: [
            'Large Language Model bezeichnet ein KI-Modell, das mit riesigen Textmengen trainiert wurde, um menschliche Sprache zu verstehen und zu generieren. Diese Modelle erkennen statistische Muster in Sätzen und können darauf basierend sinnvolle Antworten formulieren.', // Richtig
            'Long Lasting Machine suggeriert eine langlebige Hardware, ist aber kein Begriff aus der Softwareentwicklung.', // Long Lasting Machine
            'Little Learning Monster ist ein fantasievoller Name, aber keine technische Bezeichnung für komplexe Sprachmodelle.', // Little Learning Monster
            'Lazy Logic Module ist ein fantasievoller Name, aber keine technische Bezeichnung für komplexe Sprachmodelle.', // Lazy Logic Module
          ],
        },
        {
          question:
            'Welches Konzept wurde 2017 eingeführt, damit KI-Modelle gewichten können, welche Wörter in einem Satz besonders wichtig zueinander in Beziehung stehen?',
          options: ['Attention', 'Friction', 'Tension', 'Confusion'],
          details: [
            'Der Attention-Mechanismus (Aufmerksamkeit) ermöglicht es dem neuronalen Netz, sich bei der Verarbeitung auf relevante Wörter zu fokussieren und unwichtige Informationen auszublenden. Dies war der entscheidende Durchbruch für moderne Systeme, da sie so den Kontext auch über lange Textpassagen hinweg verstehen.', // Richtig
            'Friction bezeichnet physikalische Reibung oder Widerstand und ist kein Konzept der Datenverarbeitung.', // Friction
            'Tension beschreibt mechanische Spannung oder emotionale Anspannung, hilft aber nicht bei der Analyse von Textstrukturen.', // Tension
            'Confusion beschreibt Verwirrung und ist das Gegenteil dessen, was man durch das Training einer KI erreichen möchte.', // Confusion
          ],
        },
      ],
    },
  },
  {
    id: 6,
    de: {
      topic: 'Betriebssysteme',
      questions: [
        {
          question:
            'Mit welchem Windows-Tool kannst du ein Programm sofort beenden, wenn es sich aufgehängt hat und nicht mehr reagiert?',
          options: [
            'Task-Manager',
            'Systemsteuerung',
            'Datei-Explorer',
            'BIOS',
          ],
          details: [
            'Der Task-Manager überwacht alle laufenden Prozesse und zeigt deren Ressourcenverbrauch an. Über die Funktion "Task beenden" kann man abgestürzte Programme gezielt stoppen, ohne den gesamten Computer neu starten zu müssen.', // Richtig
            'Die Systemsteuerung verwaltet allgemeine Einstellungen wie Benutzerkonten oder Hardware, bietet aber keine Echtzeit-Kontrolle über aktive Programmabstürze.', // Systemsteuerung
            'Der Datei-Explorer dient der Organisation von Ordnern und Dokumenten auf der Festplatte, hat jedoch keinen Zugriff auf den Arbeitsspeicher laufender Anwendungen.', // Datei-Explorer
            'Das BIOS ist die grundlegende Start-Software des Computers und läuft bereits ab, bevor Windows und seine Programme überhaupt gestartet sind.', // BIOS
          ],
        },
        {
          question:
            'Wie nennt man eine isolierte Umgebung, in der man unbekannte Software testen kann, ohne das echte Betriebssystem zu gefährden?',
          options: ['Virtuelle Maschine', 'ZIP-Archiv', 'Dark Mode', 'VPN'],
          details: [
            'Eine Virtuelle Maschine (VM) simuliert einen kompletten Computer innerhalb eines Fensters auf deinem PC. Da sie vom Hauptsystem getrennt ist (Sandbox), bleiben Viren oder Systemfehler dort gefangen und beschädigen nicht deinen echten Rechner.', // Richtig
            'Ein ZIP-Archiv komprimiert Dateien für den platzsparenden Versand, führt diese aber nicht in einer geschützten Umgebung aus.', // ZIP-Archiv
            'Der Dark Mode ändert das visuelle Erscheinungsbild der Benutzeroberfläche, besitzt aber keine Sicherheitsfunktionen zur Isolation von Programmen.', // Dark Mode
            'Ein VPN verschlüsselt den Datenverkehr im Netzwerk, schützt das Betriebssystem aber nicht vor lokal ausgeführter Schadsoftware.', // VPN
          ],
        },
        {
          question:
            'Welches Betriebssystem ist speziell mit hunderten vorinstallierten Werkzeugen für Hacker und Sicherheitsforscher ausgestattet?',
          options: ['Kali Linux', 'Windows 11', 'macOS', 'Android'],
          details: [
            'Kali Linux ist eine spezialisierte Linux-Distribution, die von Haus aus über 600 Tools für Penetrationstests und digitale Forensik mitbringt. Es wird weltweit von IT-Profis genutzt, um Sicherheitslücken in Netzwerken und Systemen aufzuspüren.', // Richtig
            'Windows 11 ist auf Endanwender für Büroarbeiten oder Gaming ausgerichtet und enthält standardmäßig keine Angriffs-Software.', // Windows 11
            'macOS fokussiert sich auf Benutzerfreundlichkeit und Kreativanwendungen für Apple-Geräte, nicht auf offensive Sicherheitsanalysen.', // macOS
            'Android ist ein mobiles Betriebssystem für Smartphones und Tablets, das nicht für komplexe Sicherheitsüberprüfungen am PC konzipiert wurde.', // Android
          ],
        },
      ],
    },
  },
]
