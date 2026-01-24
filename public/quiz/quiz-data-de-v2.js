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
          question: 'Welcher Gegenstand macht keinen Sinn?',
          options: ['WLAN-Kabel', 'USB-Stick', 'HDMI-Adapter', 'Bluetooth-Box'],
          details: [
            '„WLAN-Kabel“ ist Unsinn: WLAN bedeutet drahtlose Verbindung. Ein Kabel wäre eine Ethernet-/LAN-Verbindung, aber kein WLAN.', // Richtig
            'Ein USB-Stick ist ein legitimes Speichermedium und ergibt Sinn als Gegenstand.',
            'Ein HDMI-Adapter ist ein sinnvolles Zubehör, um Geräte mit unterschiedlichen Videoanschlüssen zu verbinden.',
            'Eine Bluetooth-Box (Lautsprecher) ist ein gängiges Gerät zur drahtlosen Audiowiedergabe und ergibt Sinn.',
          ],
        },
        {
          question:
            'Welche Taste ist auf einer Standardtastatur NICHT zu finden?',
          options: ['F13', 'alt gr', 'Enter', 'Caps Lock'],
          details: [
            'F13 gibt es auf Standardtastaturen nicht (üblich sind F1–F12). Spezialtastaturen können zusätzliche Funktionstasten haben.', // Richtig
            'Alt Gr ist auf vielen deutschsprachigen Tastaturen vorhanden und dient zum Eingeben von Drittbelegungen (z. B. @, €).',
            'Enter ist eine Standardtaste zum Bestätigen/Eingeben von Zeilenumbrüchen.',
            'Caps Lock (Feststelltaste) ist eine Standardtaste zum dauerhaften Großschreiben.',
          ],
        },
        {
          question: 'Wie lässt sich die Akkulaufzeit eines Handys verlängern?',
          options: [
            'Helligkeit reduzieren',
            'Flugmodus ausschalten',
            'Standort aktivieren',
            'Mehr Apps öffnen',
          ],
          details: [
            'Die Bildschirmhelligkeit reduziert den größten Stromverbraucher bei Smartphones. Niedrigere Helligkeit spart spürbar Energie und verlängert die Laufzeit.', // Richtig
            'Flugmodus ausschalten erhöht i. d. R. den Verbrauch (Mobilfunk/WLAN/Bluetooth aktiv). Energiesparen: Funkverbindungen deaktivieren oder Flugmodus einschalten.',
            'Standort aktivieren (GPS) verbraucht je nach Nutzung zusätzliche Energie. Für längere Laufzeit besser nur bei Bedarf aktivieren.',
            'Mehr Apps öffnen erhöht Hintergrundaktivität und CPU-/Speicherlast—das verkürzt die Akkulaufzeit statt sie zu verlängern.',
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
          question: 'Welche Chat-Antwort ist Beispiel für eine Halluzination?',
          options: [
            'Esse jeden Tag ein paar kleine Steine, um deine Verdauung zu verbessern.',
            'Trinke ausreichend Wasser, um hydriert zu bleiben.',
            'Iss Obst und Gemüse für eine ausgewogene Ernährung.',
            'Vermeide übermäßigen Zucker- und Fettkonsum.',
          ],
          details: [
            'Das ist eine klare Halluzination: Es gibt keinen medizinischen Grund, Steine zu essen – im Gegenteil, das ist gefährlich. KI-Modelle können gelegentlich falsche oder erfundene Ratschläge ausgeben.', // Richtig
            'Ausreichend Wasser zu trinken ist eine sinnvolle, evidenzbasierte Gesundheitsempfehlung – keine Halluzination.',
            'Mehr Obst und Gemüse zu essen ist ein bewährter, gesunder Rat und kein Anzeichen für halluzinierte Inhalte.',
            'Zu viel Zucker und Fett zu vermeiden ist ebenfalls vernünftig und belegt – keine Halluzination.',
          ],
        },
        {
          question:
            'Wie nennt man KIs, die neben Text auch Bilder und Videos verarbeiten können?',
          options: ['multi-modal', 'text-only', 'audio-centric', 'data-mining'],
          details: [
            'Multimodal bedeutet: Das Modell kann mehrere Eingabetypen (z. B. Text, Bild, Audio, Video) gleichzeitig verarbeiten bzw. verknüpfen.', // Richtig
            'Text-only beschreibt Modelle, die ausschließlich Text verstehen/generieren – nicht multimodal.',
            'Audio-centric würde auf Audio spezialisieren, deckt aber nicht Bilder/Videos zusätzlich ab und ist kein etablierter Oberbegriff.',
            'Data-Mining ist eine Disziplin zur Mustererkennung in Datenbeständen – kein Modus für Eingabetypen von KI-Modellen.',
          ],
        },
        {
          question:
            'Wie nennt man eine KI, die eigenständig Aktionen ausführt?',
          options: ['Agent', 'Detektiv', 'Sherlock', 'Kommissar'],
          details: [
            'Ein Agent ist ein System, das Ziele verfolgt und eigenständig Aktionen (z. B. Tool-Aufrufe, Web-Requests) plant und ausführt.', // Richtig
            '„Detektiv“ ist eine metaphorische Rollenbezeichnung und kein technischer Begriff für handlungsfähige KI-Systeme.',
            '„Sherlock“ ist ein Eigenname/Spitzname, aber keine fachliche Bezeichnung.',
            '„Kommissar“ ist eine Berufsbezeichnung aus dem menschlichen Kontext, nicht der korrekte Terminus in der KI.',
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
