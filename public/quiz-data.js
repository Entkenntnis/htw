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
            'HTTP (bzw. das sichere HTTPS) regelt als Transportprotokoll den Austausch von Daten zwischen Webserver und Browser. Es stellt sicher, dass Anfragen korrekt verstanden und die passenden Webseiteninhalte sicher an deinen Computer zurückgeschickt werden.', // HTTP(S) (Richtig)
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
          question: 'Was bedeutet MFA? ',
          options: [
            'Multi-Faktor-Authentifizierung',
            'Mein-Foto-Album',
            'Mail-Forwarding-Account',
            'Mehrfach-File-Archiv',
          ],
          details:
            'Multi-Faktor-Authentifizierung (MFA) ist eine Sicherheitsmaßnahme, bei der Benutzer mehrere unabhängige Authentifizierungsfaktoren bereitstellen müssen, um Zugriff auf ein System oder eine Anwendung zu erhalten. Dies erhöht die Sicherheit erheblich, da selbst wenn ein Faktor kompromittiert wird, die anderen Faktoren weiterhin Schutz bieten.',
        },
        {
          question: 'Welche Methode ist am sichersten? ',
          options: ['Passphrase', 'Name+Geburtstag', '123456', 'Passwort'],
          details:
            'Eine Passphrase ist eine längere Folge von Wörtern oder Zeichen, die als Passwort verwendet wird. Im Vergleich zu herkömmlichen Passwörtern bietet eine Passphrase aufgrund ihrer Länge und Komplexität eine höhere Sicherheit. Sie ist schwieriger zu erraten oder durch Brute-Force-Angriffe zu knacken, insbesondere wenn sie aus einer Kombination von zufälligen Wörtern besteht.',
        },
        {
          question: 'Was ist ein Passwort-Manager? ',
          options: [
            'Tool zum Speichern/Generieren',
            'Browser-Cache',
            'VPN',
            'Firewall',
          ],
          details:
            'Ein Passwort-Manager ist eine Softwareanwendung, die Benutzern hilft, ihre Passwörter sicher zu speichern und zu verwalten. Passwort-Manager generieren oft auch starke, zufällige Passwörter für verschiedene Konten und füllen diese automatisch in Anmeldeformulare ein. Sie verschlüsseln die gespeicherten Passwörter, um sie vor unbefugtem Zugriff zu schützen.',
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
          question: 'Welche Schwachstelle betrifft ungefilterte Eingaben? ',
          options: ['XSS', 'DDoS', 'DNS', 'NTP'],
          details:
            'XSS (Cross-Site Scripting) ist eine Sicherheitslücke in Webanwendungen, die auftritt, wenn Angreifer bösartigen Code (meistens JavaScript) in Webseiten einschleusen können, die von anderen Benutzern angesehen werden. Dies geschieht oft durch ungefilterte oder unzureichend validierte Benutzereingaben. XSS kann dazu verwendet werden, Cookies zu stehlen, Sitzungen zu übernehmen oder schädliche Aktionen im Namen des Opfers auszuführen.',
        },
        {
          question: 'Wofür steht CSRF? ',
          options: [
            'Cross-Site Request Forgery',
            'Client-Side Render Flow',
            'Cookie Session Reset Flag',
            'Cache State Refresh Function',
          ],
          details:
            'CSRF (Cross-Site Request Forgery) ist eine Art von Angriff, bei dem ein Angreifer einen authentifizierten Benutzer dazu bringt, unerwünschte Aktionen auf einer Webanwendung auszuführen, in der er angemeldet ist. Dies geschieht oft durch das Einbetten von bösartigen Links oder Formularen auf einer anderen Webseite, die der Benutzer besucht. CSRF-Angriffe können dazu führen, dass vertrauliche Daten geändert oder Aktionen im Namen des Benutzers durchgeführt werden, ohne dessen Wissen oder Zustimmung.',
        },
        {
          question: 'Welches Flag schützt Cookies vor JS-Zugriff? ',
          options: ['HttpOnly', 'Readable', 'Public', 'Inline'],
          details:
            'Das HttpOnly-Flag ist eine Sicherheitsmaßnahme, die auf HTTP-Cookies angewendet wird, um den Zugriff auf diese Cookies durch clientseitiges JavaScript zu verhindern. Wenn ein Cookie mit dem HttpOnly-Flag gesetzt ist, kann es nicht über JavaScript (z. B. durch document.cookie) gelesen oder manipuliert werden. Dies hilft, Angriffe wie Cross-Site Scripting (XSS) zu verhindern, bei denen Angreifer versuchen könnten, Cookies zu stehlen oder zu verändern.',
        },
      ],
    },
  },
]
