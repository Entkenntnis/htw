var QUIZ_DATA = [
  {
    id: 1,
    de: {
      topic: 'Netzwerk',
      questions: [
        {
          question: 'Welches Protokoll wird verwendet, um Webseiten zu laden?',
          options: ['HTTP', 'FTP', 'SMTP', 'DNS'],
          details:
            'HTTP steht für HyperText Transfer Protocol und ist das grundlegende Protokoll für die Übertragung von Webseiten im Internet. Es definiert, wie Nachrichten formatiert und übertragen werden und wie Webserver und Browser auf verschiedene Befehle reagieren sollen.',
        },
        {
          question:
            'Welches Gerät verbindet verschiedene Netzwerke miteinander?',
          options: ['Router', 'Switch', 'Modem', 'Firewall'],
          details:
            'Ein Router ist ein Netzwerkgerät, das Datenpakete zwischen verschiedenen Netzwerken weiterleitet. Es analysiert die Zieladressen der Pakete und entscheidet, welchen Weg sie nehmen sollen, um ihr Ziel zu erreichen. Router sind entscheidend für die Verbindung von Heimnetzwerken mit dem Internet und für die Kommunikation zwischen verschiedenen Netzwerken.',
        },
        {
          question: 'Welche IP-Version ist die aktuellste?',
          options: ['IPv6', 'IPv4', 'IPX', 'IPV2'],
          details:
            'IPv6 (Internet Protocol Version 6) ist die neueste Version des Internetprotokolls, das entwickelt wurde, um den begrenzten Adressraum von IPv4 zu erweitern. IPv6 verwendet 128-Bit-Adressen, was eine nahezu unbegrenzte Anzahl von eindeutigen IP-Adressen ermöglicht und somit das Wachstum des Internets unterstützt.',
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
