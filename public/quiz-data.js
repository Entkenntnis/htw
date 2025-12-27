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
            'Welches bekannte Tool wird oft verwendet, um Passwörtern zu knacken?',
          options: ['John the Ripper', 'Wireshark', 'TeamViewer', 'WinRAR'],
          details: [
            'John the Ripper ist ein berühmtes Programm, das darauf spezialisiert ist, schwache Passwörter zu identifizieren, indem es blitzschnell Millionen von Varianten gegen verschlüsselte Passwörter (Hashes) prüft. Es wird sowohl von Sicherheitsforschern als auch von Angreifern genutzt.', // Richtig
            'Wireshark ist ein Analyse-Tool für Netzwerke, mit dem man Datenverkehr sichtbar macht, aber es ist kein Programm zum direkten Knacken von Passwort-Hashes.', // Wireshark
            'TeamViewer ist eine Software für Fernwartung und Support, mit der man Computer aus der Ferne steuern kann, aber kein Hacking-Tool.', // TeamViewer
            'WinRAR ist ein Programm zum Komprimieren und Entpacken von Dateien (wie .zip oder .rar) und kann nicht zum Knacken von Passwörtern genutzt werden.', // WinRAR
          ],
        },
        {
          question:
            'Wie sollten Passwörter idealerweise in einer Datenbank gespeichert werden?',
          options: [
            'Als Hash + Salt',
            'Im Klartext',
            'Als Base64',
            'Nur als Hash',
          ],
          details: [
            'Die sicherste Methode ist das "Hashen" (eine Einbahnstraßen-Verschlüsselung) kombiniert mit einem "Salt" (einer zufälligen Zusatzzeichenfolge). Das Salt sorgt dafür, dass selbst zwei identische Passwörter in der Datenbank völlig unterschiedlich aussehen, was Angriffe mit vorberechneten Tabellen (Rainbow Tables) verhindert.', // Richtig
            'Klartext bedeutet, dass das Passwort lesbar gespeichert wird – wenn die Datenbank gehackt wird, hat der Angreifer sofort Zugriff auf alle Konten.', // Klartext
            'Base64 ist keine Verschlüsselung, sondern eine Kodierung, die jeder innerhalb von Sekunden wieder in das lesbare Passwort zurückübersetzen kann.', // Base64
            'Nur zu hashen (ohne Salt) ist unsicherer, da Angreifer sogenannte Rainbow Tables nutzen können, um häufige Passwörter schnell zu entschlüsseln.', // Nur Hash
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
]
