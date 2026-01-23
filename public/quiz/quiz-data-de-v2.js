var QUIZ_DATA = [
  {
    id: 1,
    de: {
      topic: 'Netzwerk',
      questions: [
        {
          question:
            'Wie nennt man die Zeitspanne, die ein Datenpaket benötigt, um zum Server und wieder zurück zu gelangen?',
          options: ['Ping', 'Lag', 'FPS', 'WLAN'],
          details: [
            'Der Ping wird in Millisekunden gemessen und zeigt an, wie reaktionsschnell die Verbindung zum Server ist. Ein niedriger Wert ist besonders bei Online-Spielen wichtig, damit deine Aktionen ohne spürbare Verzögerung ausgeführt werden.', // Ping (Richtig)
            'Lag ist kein Messwert, sondern bezeichnet lediglich das spürbare Ruckeln oder Hängen, das oft erst als Folge eines zu hohen Pings auftritt.', // Lag
            'FPS (Frames Per Second) misst die Grafikleistung deines Computers (Bilder pro Sekunde), hat aber nichts mit der Geschwindigkeit der Internetverbindung zu tun.', // FPS
            'WLAN bezeichnet nur die drahtlose Funktechnologie zur Übertragung, ist aber nicht der Name für die gemessene Antwortzeit.', // WLAN
          ],
        },
        {
          question:
            'Welches Protokoll ist dafür zuständig, Webseiten vom Server in deinen Browser zu laden?',
          options: ['HTTP(S)', 'HTML', 'USB', 'PDF'],
          details: [
            'HTTP (bzw. das sichere HTTPS) regelt als Anwendungsprotokoll den Austausch von Daten zwischen Webserver und Browser. Es stellt sicher, dass Anfragen korrekt verstanden und die passenden Webseiteninhalte sicher an deinen Computer zurückgeschickt werden.', // HTTP(S) (Richtig)
            'HTML ist die Sprache, die den Aufbau und Inhalt der Webseite beschreibt, aber sie transportiert die Daten nicht selbst über das Netzwerk.', // HTML
            'USB ist eine Hardware-Schnittstelle für Geräte wie Tastaturen oder Speichersticks und kein Netzwerkprotokoll für Webseiten.', // USB
            'PDF ist ein Dateiformat für Dokumente und hat nichts mit der technischen Übertragung von Webseiten zu tun.', // PDF
          ],
        },
        {
          question:
            'Welcher Dienst ist technisch dafür verantwortlich, Domainnamen (wie arrrg.de) in IP-Adressen aufzulösen?',
          options: ['DNS', 'VPN', 'URL', 'SSD'],
          details: [
            'Das Domain Name System (DNS) ist ein weltweit verteiltes Verzeichnis, das menschenlesbare Namen in maschinenlesbare IP-Adressen übersetzt. Ohne DNS müsstest du dir für jede Website eine lange Zahlenreihe merken, statt einfach den Namen einzutippen.', // DNS (Richtig)
            'Ein VPN (Virtual Private Network) verschlüsselt deine Verbindung und verschleiert deinen Standort, ist aber nicht für die Namensauflösung zuständig.', // VPN
            'Die URL ist lediglich die Adressezeile, die du eingibst, aber nicht der Hintergrunddienst, der diese technisch in eine IP-Adresse umwandelt.', // URL
            'Eine SSD ist ein schneller Datenspeicher (Festplatte) in deinem Computer und hat keine Funktion im Netzwerkverkehr.', // SSD
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
          question:
            'Was solltest du mit einem Passwort NIE machen?',
          options: ['Einer fremden Person verraten', 'Deinem Haustier erzählen', 'Auswendig lernen', 'Regelmäßig ändern'],
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
            "Ein Benutzer gibt im Anmeldefeld <code>admin' OR 1=1; --</code> ein. Welcher Angriff wird hier versucht?",
          options: ['SQL Injection', 'Phishing', 'Brute Force', 'Spam'],
          details: [
            'Bei einer SQL Injection versucht der Angreifer, eigene Datenbankbefehle in das Eingabefeld zu schmuggeln, um die Abfrage zu manipulieren. Durch den Zusatz "OR 1=1" wird die Bedingung immer "wahr", was dazu führen kann, dass man ohne Passwort eingeloggt wird oder Daten auslesen kann.', // Richtig
            'Phishing versucht Nutzer über gefälschte E-Mails oder Webseiten zur Dateneingabe zu bewegen und manipuliert nicht den Programmcode der Datenbank.', // Phishing
            'Bei Brute Force werden automatisiert tausende Passwortkombinationen durchprobiert, anstatt logische Fehler in der Datenbankabfrage auszunutzen.', // Brute Force
            'Spam bezeichnet unerwünschte Werbenachrichten im Postfach und ist kein technischer Angriff auf die Datenbankstruktur.', // Spam
          ],
        },
        {
          question:
            'Wie nennt man den Angriff, bei dem ein riesiges Netzwerk aus ferngesteuerten Geräten (Botnet) eine Webseite gleichzeitig aufruft, um sie lahmzulegen?',
          options: ['DDoS', 'Adware', 'VPN-Tunnel', '404 Error'],
          details: [
            'DDoS steht für "Distributed Denial of Service" und zielt darauf ab, den Server durch reine Überlastung in die Knie zu zwingen. Da die Anfragen von vielen verschiedenen Geräten weltweit kommen, kann der Server echte Besucher nicht mehr von den Angreifern unterscheiden und bricht zusammen.', // Richtig
            'Adware ist Software, die Werbung anzeigt, greift aber keine Webserver an, um diese abzuschalten.', // Adware
            'Ein VPN-Tunnel dient der sicheren Verbindung und ist kein Angriffsszenario zur Überlastung von Systemen.', // VPN-Tunnel
            'Ein 404 Error ist der Statuscode für eine nicht gefundene Seite und kein Name für einen Angriff.', // 404 Error
          ],
        },
        {
          question:
            'Welche Sicherheitslücke ermöglicht es Angreifern, über einen manipulierten Link schädliche Skripte im Browser des Opfers auszuführen (z. B. um Cookies zu klauen)?',
          options: ['XSS', 'FTP', 'Ransomware', 'Bluescreen'],
          details: [
            'Cross-Site Scripting (XSS) nutzt aus, dass der Browser dem Link vertraut und darin versteckten Code (meist JavaScript) auf der besuchten Seite ausführt. So können Angreifer im Hintergrund deine Anmeldeinformationen abgreifen, sobald du den Link anklickst.', // Richtig
            'FTP ist ein Standardprotokoll zum Übertragen von Dateien auf einen Server und keine Sicherheitslücke.', // FTP
            'Ransomware verschlüsselt Dateien auf der Festplatte und fordert Lösegeld, zielt aber nicht auf das Auslesen von Browser-Sitzungen ab.', // Ransomware
            'Ein Bluescreen signalisiert einen Systemabsturz von Windows und ist kein Angriff zum Datendiebstahl über einen Link.', // Bluescreen
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
