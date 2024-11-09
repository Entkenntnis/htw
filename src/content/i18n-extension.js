import { secrets } from '../helper/secrets-loader.js'

export function getI18nExtension() {
  const values = []
  values.push({
    lng: 'de',
    key: 'home.slogan',
    value: 'Zeig, was in dir steckt!',
  })
  values.push({
    lng: 'en',
    key: 'home.slogan',
    value: 'Prove your skill.',
  })

  values.push({
    lng: 'de',
    key: 'home.language',
    value: 'Sprache/Language',
  })
  values.push({
    lng: 'en',
    key: 'home.language',
    value: 'Sprache/Language',
  })

  values.push({
    lng: 'de',
    key: 'home.github',
    value: 'Links',
  })
  values.push({
    lng: 'en',
    key: 'home.github',
    value: 'Links',
  })
  values.push({
    lng: 'de',
    key: 'home.top10',
    value: 'HackerInnen des Monats',
  })
  values.push({
    lng: 'en',
    key: 'home.top10',
    value: 'Hackers of the Month',
  })

  values.push({
    lng: 'de',
    key: 'contact.heading',
    value: 'Kontakt / Impressum',
  })
  values.push({
    lng: 'en',
    key: 'contact.heading',
    value: 'Contact / Imprint',
  })

  values.push({
    lng: 'de',
    key: 'contact.content_',
    value: `
      <p class="my-5">
        David Li<br>
        ${secrets('config_address')}<br>
        E-Mail: <a rel="nofollow" href="mailto:hack@arrrg.de">hack@arrrg.de</a>
      </p>
    `,
  })
  values.push({
    lng: 'en',
    key: 'contact.content_',
    value: `
      <p class="my-5">
        David Li<br>
        ${secrets('config_address')}<br>
        Email: <a rel="nofollow" href="mailto:hack@arrrg.de">hack@arrrg.de</a>
      </p>
    `,
  })

  values.push({
    lng: 'de',
    key: 'home.supporter_',
    value: `
      <p>Dieses Projekt wird freundlicherweise unterstützt von der <a href="https://fg-bil.gi.de/">Fachgruppe Bayerische Informatiklehrkräfte</a>.</p>
      <hr class="my-5"/>
    `,
  })
  values.push({
    lng: 'en',
    key: 'home.supporter_',
    value: `
      <p>This project is kindly supported by the <a href="https://fg-bil.gi.de/">Fachgruppe Bayerische Informatiklehrkräfte</a>.</p>
      <hr class="my-5"/>
    `,
  })

  values.push({
    lng: 'de',
    key: 'home.invite_',
    value: `
      <style>
        #hackergirl {
          max-width: 450px;
          width: 100%;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        @media only screen and (min-width: 768px) {
          #hackergirl {
            max-width: 450px;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media only screen and (min-width: 992px) {
          #hackergirl {
            max-width: 430px;
            display: block;
            margin-top: 32px;
          }
        }
        @media only screen and (min-width: 1200px) {
          #hackergirl {
            max-width: 460px;
            display: block;
            margin-top: 6px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      </style>

      <div class="container" style="margin-top:48px;">
        <div class="row">
          <div class="col-lg" style="">
            <div style="padding-top: 12px;">

             <img src="/hacker_girl.jpg" style="border-radius: 8px" id="hackergirl">

            </div>
          </div>
          <div class="col-lg" style="padding:24px;">
            <p>Auf Hack The Web findest du einen spielerischen Einstieg in die Welt des Hackings. In vielfältigen Rätseln kannst du dein Wissen und deine Kreativität unter Beweis stellen. Der kreative Umgang mit Technologie steht im Vordergrund - hier gibt es keine Anleitungen für verbotene Sachen.</p>
            
            <p>Der Einstieg ist ab der 7. Klasse geeignet. Nimm dir am besten 30 - 90 Minuten Zeit. Registriere dich mit Benutzername und Passwort.
            </p>

            <p style="margin-top:32px;margin-bottom:32px;text-align:center;"><a href="/register" class="btn btn-success btn-lg">Jetzt registrieren</a></p>

            <p>Über unseren <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> kommst du mit der Community in Kontakt. Um sofort reinzuschnuppern, nutze die Zugangsdaten <code>demo</code> / <code>1234</code>.</p>
          </div>
        </div>
      </div>
    `,
  })
  values.push({
    lng: 'en',
    key: 'home.invite_',
    value: `
      <div class="container" style="margin-top:48px;">
        <div class="row">
          <div class="col-lg" style="margin-left:-15px;">
            <div style="padding:24px;padding-bottom:1px" class="jumbotron">

              <p>At the age of 13, I decided to become a hacker.</p>

              <p>I admired these people. Those who know a system down to the smallest detail. And those who, with their creativity and perseverance, make even the seemingly impossible possible.</p>

              <p>Great role models showed me the way and accompanied me through many challenges. I learned a lot, and for that, I consider myself lucky.</p>

              <p>So I would like to accompany you a little on your journey. Here you will find things that fascinate me then and now. I hope they will be useful to you.</p>

              <p style="text-align:right;">Anna42</p>

            </div>
          </div>
          <div class="col-lg" style="padding:24px;">
            <p>On Hack The Web, you will find a playful introduction to the world of hacking. In various puzzles, you can demonstrate your knowledge and creativity. The creative use of technology is the focus here - you won't find instructions on how to hack a website.</p>
            
            <p>Entry is possible without prior knowledge and is suitable from the 7th grade. It is best to take 30 - 90 minutes. A self-chosen name and a password are sufficient for registration.</p>

            <p style="margin-top:32px;margin-bottom:32px;text-align:center;"><a href="/register" class="btn btn-success btn-lg">Register now</a></p>

            <p>Through our <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord server</a> you can get in touch with the community. To get a quick look, use the login data <code>demo</code> / <code>1234</code>.</p>
          </div>
        </div>
      </div>

    `,
  })

  values.push({
    lng: 'de',
    key: 'privacy.content_',
    value: `
      <h3 class="my-4">Persönliche Daten</h3>
      
      <p>Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Du kannst das Angebot von Hack The Web nutzen, ohne personenbezogene Daten weiterzugeben. Die Registrierung funktioniert ohne Angabe einer E-Mail-Adresse, stattdessen gibst du ein selbstgewähltes Pseudonym an. Falls du anonym bleiben möchtest, achte darauf, dass man durch das Pseudonym nicht auf deine Person zurückschließen kann.
      </p>
      
      <h3 class="my-4">Accountdaten</h3>
      
      <p>Dein Benutzername wird in der Highscore öffentlich angezeigt und möglicherweise auch auf der Startseite. Es wird der Zeitpunkt der letzten Aktivität auf der Plattform gespeichert und ebenfalls mit angezeigt. Bei jeder Aufgabe ist zudem einsehbar, wie viele Nutzer sie bereits gelöst haben (ohne Rückführung auf einen einzelnen Benutzer). Im Profil lässt sich dein Account jederzeit vollständig löschen. Der Betreiber behält sich das Recht vor, ohne Ankündigung Accounts zu verändern oder zu löschen.
      </p>
      
      <h3 class="my-4">Hosting</h3>
      
      <p>Diese Website wird bei <a href="https://uberspace.de">uberspace.de</a> gehostet. Die Datenverarbeitung findet vollständig in Deutschland statt und unterliegt der DSGVO. Bei der Nutzung der Website werden z.T. Protokolle über Aufrufe und Fehler geführt. Die IP-Adresse wird dabei maskiert.
      </p>
      
      <h3 class="my-4">Protokolle</h3>
      
      <p>Zur Verbesserung der Aufgaben und um mögliche Probleme zu entdecken, werden intern Protokolle geführt und ausgewertet. Diese Protokolle sind nicht öffentlich zugänglich, werden nicht weitergegeben und auch für keine anderen Zwecke gebraucht. Die Protokolle enthalten deine gelösten Aufgaben und die Eingaben für die Aufgaben (ohne Bezug auf einen einzelnen Nutzer). Nach spätestens einem Jahr werden die Protokolle zu den Eingaben gelöscht.
      </p>
      
      <h3 class="my-4">Cookies</h3>
      
      <p>Wenn du dich bei Hack The Web registrierst bzw. einloggst, setzt die Website einen Cookie mit einer Session-ID. Diese wird benötigt, um deinen Login-Status aufrechtzuerhalten. Der Cookie wird beim Schließen des Browserfensters oder nach einem Tag automatisch gelöscht. Ein Tracking findet damit nicht statt. Außerdem wird die eingestellte Sprache für eine Woche in deinem Browser gespeichert.
      </p>
      
      <p>Lokale Accounts werden dauerhaft in deinem Browser gespeichert. Du kannst durch einen Klick <a onclick="resetLocalUsers()" href="#">alle lokale Accounts entfernen</a>.
      </p>
      
      <script>
        function resetLocalUsers() {
          localStorage.removeItem('htw_local_users')
          alert('Accounts erfolgreich entfernt.')
        }
      </script>
    `,
  })

  values.push({
    lng: 'en',
    key: 'privacy.content_',
    value: `
      <h3 class="my-4">Personal data</h3>
        
      <p>We take the protection of your personal data very seriously. You can use Hack The Web without disclosing personal data. Registration works without specifying an e-mail address, instead you enter a self-chosen pseudonym. If you want to remain anonymous, make sure that the pseudonym does not allow conclusions to be drawn about your person.
      </p>
      
      <h3 class="my-4">Account data</h3>
      
      <p>Your username is publicly displayed in the highscore and possibly on the homepage. The timestamp of your last activity on the platform is recorded and also displayed. Additionally, for each task, it is visible how many users have already solved it (without a reference to individual users). You have the option to completely delete your account at any time in your profile. The operator reserves the right to modify or delete accounts without a prior notice.
      </p>
      
      <h3 class="my-4">Hosting</h3>
      
      <p>This website is hosted on <a href="https://uberspace.de">uberspace.de</a>. Data processing takes place entirely in Germany and is subject to the GDPR. When using the website, logs of visits and errors are kept in part. The IP address is masked during this process.
      </p>
      
      <h3 class="my-4">Logs</h3>
      
      <p>To improve the tasks and detect possible issues, internal logs are kept and evaluated. These logs are not publicly accessible, not shared with others, and not used for any other purposes. The logs include your completed tasks and input for tasks (without reference to individual users). Logs related to inputs are deleted after a maximum of one year.
      </p>
      
      <h3 class="my-4">Cookies</h3>
      
      <p>When you register or log in to Hack The Web, the website sets a cookie with a session ID. This is necessary to maintain your login status. The cookie is automatically deleted when you close your browser window or after one day. No tracking takes place with this cookie. Additionally, the selected language is stored in your browser for one week.
      </p>
      
      
      <p>Local accounts are permanently stored in your browser. You can remove all local accounts by clicking <a onclick="resetLocalUsers()" href="#">here</a>.
      </p>
      
      <script>
        function resetLocalUsers() {
          localStorage.removeItem('htw_local_users')
          alert('Accounts erfolgreich entfernt.')
        }
      </script>
    `,
  })

  values.push({
    lng: 'de',
    key: 'finish.heading',
    value: 'Herzlichen Glückwunsch!',
  })
  values.push({
    lng: 'en',
    key: 'finish.heading',
    value: 'Congratulations!',
  })

  values.push({
    lng: 'de',
    key: 'finish.content_',
    value: `
      <p>Du hast die Session erfolgreich absolviert. Deine 30 Minuten sind nun abgelaufen.</p>
      
      <p>Klicke auf OK, um dein Ergebnis in der Highscore zu speichern. Danach wird dein Account in den freien Modus geschaltet. Du kannst an den Aufgaben weiterarbeiten - ganz ohne Zeitdruck</p>
      
      <p>Vielen Dank für die Teilnahme. Wir wünschen dir alles Gute für deine Zukunft als Hacker!</p>
    `,
  })
  values.push({
    lng: 'en',
    key: 'finish.content_',
    value: `
      <p>You have successfully completed the session. Your 30 minutes are now over.</p>
      
      <p>Click OK to save your result in the highscore. After that, your account will be switched to free mode. You can continue working on the tasks without any time pressure.</p>
      
      <p>Thank you for participating. We wish you all the best for your future as a hacker!</p>
    `,
  })

  values.push({
    lng: 'de',
    key: 'news.heading',
    value: 'Neuigkeiten',
  })
  values.push({
    lng: 'en',
    key: 'news.heading',
    value: 'News',
  })

  values.push({
    lng: 'de',
    key: 'news.content_',
    value: `
      <div class="my-5"></div>
      
      <h3>Oktober 2024</h3>
      
      <p>Die Aufgaben von Hack The Web erhalten eine Storyline. Lerne Hacken mit Kiwi, Bex und Josh.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2024</h3>
      
      <p>Es gibt neue Aufgaben! Die Anzahl der Aufgaben erhöht sich auf 111. Die neue Höchstpunktzahl beträgt 1939.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Juli 2024</h3>
      
      <p>In diesem Update wurden zwei Bereiche von Hack The Web neu überarbeitet: Die Startseite erhält mehr informative Texte und ein kleines Vorwort. Außerdem wurde die Karte neu sortiert, um das Spielerlebnis flüssiger zu gestalten.
      </p>

      <p>Es kann daher sein, dass deine Karte etwas durcheinander aussieht nach dem Login - das liegt an der Überarbeitung. Du kannst aber in deinem Spielstand einfach weiterspielen.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Juni 2024</h3>
      
      <p>Kleine Verbesserungen an den Aufgaben.
      </p>
      
      <div class="my-5"></div>
      
      <h3>März 2024</h3>
      
      <p>Das neue Puzzle-Spiel "Mortal Coil" lädt zum Knobeln ein. Wer neben den Challenges nach etwas Abwechslung sucht, findet hier Puzzle von super easy bis super schwer.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Februar 2024</h3>
      
      <p>Kleine Verbesserungen an exisiterenden Aufgaben.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Januar 2024</h3>
      
      <p>Bot-Schreiber aufgepasst: Es gibt ein neues Mini-Spiel "Decode Me!", wo es um die Decodierung geheimer Nachrichten geht. Kann per Hand gespielt werden, aber funktioniert besser mit einem Bot. Ein Starter-Bot steht bereit für den Schnell-Start.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Oktober 2023</h3>
      
      <p>Es war eine schweißtreibende Arbeit, aber nach einigen Wochen intensiver Arbeit sind jetzt alle Inhalte ins Englische übersetzt.</p>

      <p>Auch in Zukunft werden alle neuen Aufgaben sowohl auf deutsch als auch auf englisch verfügbar sein.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2023</h3>
      
      <p>Hinter der Passage befindet sich der neue Community-Bereich. Dort gibt es Aufgaben von Euch für Euch. Jeder kann Ideen vorschlagen und wir setzen diese gemeinsam zu einer spannenden Aufgabe um. Die ersten Aufgaben sind bereit, entdeckt zu werden.
      </p>

      <p>Wenn du eine eigene Idee hast: Schreibe mich dafür am besten privat über Discord an oder nutze den #vorschläge-Channel.
      </p>
      
      <div class="my-5"></div>
      
      <h3>August 2023</h3>
      
      <p>Kleines Update aus der Sommerpause: Ein paar existierende Aufgaben wurden verbessert.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Juli 2023</h3>
      
      <p>Das Ziel ist erreicht! Hack The Web hat nun genau 100 Aufgaben. Damit gehe ich wohlverdient in die Sommerpause.
      </p>
      
      <p>Danke fürs Mitmachen und wir sehen uns bald wieder!
      </p>
      
      <div class="my-5"></div>
      
      <h3>Mai 2023</h3>
        
      <p>Wir starten einen gemeinsamen <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a>. Tausche Dich dort mit anderen SpielerInnen aus, frage nach Hilfe, wenn du nicht weiterkommst und werde benachrichtigt, wenn neue Aufgaben freigeschaltet werden.
      </p>

      <p>Schaue für aktuelle Informationen gerne auf Discord vorbei.
      </p>
    
      <div class="my-5"></div>
      
      <h3>HTW100</h3>
        
      <p>In den nächsten Wochen wird es das erste Mal über einen längeren Zeitraum regelmäßige Updates geben. Jeden Mittwochabend und jeden Samstagabend wird im Bereich nach der Passage eine neue Aufgabe freigeschaltet. Gestartet wird morgen Abend (5. April), das Ziel ist erreicht, wenn die 100. Aufgabe freigeschaltet ist, was ungefähr Mitte Juni sein sollte.
      </p>

      <div class="my-5"></div>
      
      <h3>April 2023</h3>
        
      <p>Ich bin super dankbar über die große Community, die mittlerweile Hack The Web täglich bespielt. Danke an Euch! Ihr motiviert mich, immer wieder an der Plattform zu arbeiten, Bugs zu fixen und neue Aufgaben zu erstellen.
      </p>
      
      <p>Mit dieser Version werde ich nun auch den <a href="https://github.com/Entkenntnis/htw">Quellcode für den Server</a> freigeben. Damit möchte ich sicherstellen, dass auch in Zukunft Hack The Web genutzt werden kann, selbst im Fall, wenn dieser Server nicht mehr erreichbar ist. Eine Anleitung ist beigefügt.
      </p>
      
      <p>Ansonsten wird es in den nächsten Wochen einige Verbesserungen an den bestehenden Aufgaben geben. Die Karte erhält zum ersten Mal ein kleines farbliches Update.
      </p>
    
      <div class="my-5"></div>
      
      <h3>März 2023</h3>
        
      <p>Ein paar alte Aufgaben wurden mit neuen Ideen gefüllt, dabei wurden zwei Aufgaben zu einer zusammengefasst, es kommen zwei neue Aufgaben hinzu.
      </p>
      
      <p>Punktzahlen passen sich ein wenig an, es gibt wieder eine neue Höchstpunktzahl.</p>
    
      <div class="my-5"></div>
      
      <h3>Januar 2023</h3>
        
      <p>Vielen Dank an die vielen Spieler*innen und an die Lehrkräfte, die Hack The Web regelmäßig im Klassenzimmer einsetzen! Am 21. Oktober 2022 ist die Plattform offiziell 5 Jahre alt geworden und in dieser Zeit ordentlich gewachsen. Es ist mir eine große Ehre, euch diese Plattform anzubieten und ich freue mich, euch mit weiteren Updates und neuen Aufgaben in die Welt der Hacker*innen einführen zu dürfen.
      </p>
      
      <p>Zum neuen Jahr gibt es also wieder 3 neue Aufgaben, zwei existierende Aufgaben (darunter das Finale) erhalten ebenfalls einen neuen Anstrich. Frohes Hacken an alle!</p>
      
      <p>Üblicher Hinweis: eine Aufgabe verschiebt sich, daher passen sich die Punktzahlen minimal an. Es gibt wieder eine neue Höchstpunktzahl.
      </p>
    
      <div class="my-5"></div>
      
      <h3>August 2022</h3>
      
      <p>In den letzten Monaten gab es einiges an Feedback zu den Aufgaben. Im Rahmen der regelmäßigen Pflege wurden alle Aufgaben nochmal auf Herz und Niere geprüft und bei fast einem Drittel davon entsprechende Verbesserungen durchgeführt.</p>
    
      <div class="my-5"></div>
      
      <h3>Mai 2022</h3>
      
      <p>Ab diesem Update wird bei Aufgaben nun angezeigt, zu welchem Zeitpunkt sie erstellt wurden. Außerdem gibt es wieder einige Verbesserungen an den bestehenden Aufgaben.</p>
      
      <div class="my-5"></div>
      
      <h3>März 2022</h3>
      
      <p>Als Ergänzung zum vorherigen Update gibt es noch einige Verbesserungen an den bestehenden Aufgaben, inklusive zweier neuer Aufgaben.</p>
      
      <div class="my-5"></div>
      
      <h3>Februar 2022</h3>
      
      <p>Die Reise geht weiter! Hinter dem Finale finden sich nun sechs neue Aufgaben. Erstmals kann damit eine Punktzahl im vierstelligen Bereich erreicht werden.</p>
      
      <p>Auch im Anfangsbereich gibt es zwei neue Aufgaben. Ein paar bestehende Aufgaben wechseln ihre Plätze. Dadurch passen sich die Punktzahlen leicht an.</p>
      
      <div class="my-5"></div>
      
      <h3>Juli 2021</h3>
      
      <p>Dieses Update bringt ein paar Verbesserungen am "Quality of Service". Dazu gehören:
      </p>
      
      <ul>
        <li>Die Highscore lässt sich nun sortieren. Es gibt drei Optionen: nach Punktzahl (wie bisher), nach Punktzahl der aktiven Benutzer des letzten Monats und nach dem Zeitpunkt der letzten Aktivität. Damit bekommt man eine bessere Übersicht, was aktuell auf der Plattform passiert.</li>
        <li>Im Profil wird nun der aktuelle (globale) Platz und die zuletzt gelöste Aufgabe angezeigt.</li>
        <li>Einige Aufgaben wurden überarbeitet und verbessert.</li>
        <li>Auf der Community-Seite sind ein paar neue Hinweise hinzugekommen.</li>
        <li>Ein Bug in der Punkteberechnung wurde behoben, alle Punkte wurden nochmal neuberechnet. Die Platzierung sollte sich dadurch nicht verändert haben.</li>
      </ul>
      
      <div class="my-5"></div>
      
      <h3>April 2021</h3>
      
      <p>Es gibt wieder ein Update mit sechs neuen Aufgaben, vier alte Aufgaben verabschieden sich dafür in den Ruhestand. Die Punktenzahlen wurden darauf angepasst - es gibt nun eine neue mögliche Höchstpunktzahl.
      </p>
      
      <p>Eine weitere Ergänzung: Es gibt nun eine <a href="https://de.serlo.org/200247" target="_blank">Community-Seite</a> mit Hinweisen zu den Aufgaben und weiteren Hintergrundinformationen.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2020</h3>
      
      <p>Sei bereit für das große Finale! Mit diesem Update gibt es sieben neue Aufgaben und die Karte wird damit vervollständigt.
      </p>
      
      <p>Außerdem wird das Punktesystem fairer gemacht: Der Zeitbonus entfällt, dafür werden die Punkte anhand der Schwierigkeit der Aufgaben bestimmt. Je weiter entfernt eine Aufgabe vom Start liegt, umso mehr Punkte gibt es. Es gilt die Formel: Punktzahl = 10 + (minimale Anzahl Kanten zum Start). Damit spiegeln die Punkte besser die Arbeit wider, die man in die Aufgaben gesteckt hat.
      </p>
      
      <div class="my-5"></div>
      
      <h3>August 2020</h3>
      
      <p>Dieses Update enthält einige Verbesserungen an den bestehenden Aufgaben und fünf neue Aufgaben.
      </p>
      
      <div class="my-5"></div>
    
      <h3>Juni 2020</h3>
      
      <p>Nach mehr als einem Jahr Inaktivität gibt es endlich ein Update: neue Aufgaben, neue Funktionen und Open Source! Die Änderungen im Detail:
      </p>
      
      <ul>
        <li>Zu den bestehenden 35 Aufgaben kommen 15 neue Aufgaben und sorgen hoffentlich für noch mehr Spaß und Herausforderung.
        </li>
        <li>Der 30-Minuten-Session-Modus ist nun für alle verfügbar und erleichtert die Teilnahme als Gruppe oder Klasse: Eigenen Raum anlegen und jeweils über den Raumschlüssel beitreten.
        </li>
        <li>Registrierte Benutzer können ihr Passwort ändern. Außerdem können Accounts manuell gelöscht werden.
        </li>
        <li>Die Plattform von Hack The Web ist nun als Open-Source-Projekt auf GitHub verfügbar: <a href="https://github.com/Entkenntnis/challenges-server" target="_blank">github.com/Entkenntnis/challenges-server</a>. Es ist damit möglich, ganz eigene Varianten von Challenge-Webseiten aufzubauen.
        </li>
      </ul>
      
      <p>Ich wünsche allen Hackerinnen und Hackern viel Spaß beim Knobeln!
      </p>
    `,
  })
  values.push({
    lng: 'en',
    key: 'news.content_',
    value: `
      <div class="my-5"></div>
      
      <h3>October 2024</h3>
      
      <p>There is a new storyline in the German version.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2024</h3>
      
      <p>There are new challenges! The number of challenges increases to 111. The new high score is 1939.</p>

      <div class="my-5"></div>

      <h3>July 2024</h3>

      <p>In this update, two areas of Hack The Web have been revised: The homepage now includes more informative texts and a small foreword. Additionally, the map has been reorganized to make the gameplay smoother.
      </p>
      
      <p>As a result, your map may look a bit jumbled after logging in - this is due to the reorganization. However, you can continue playing from your saved game.
      </p>
      
      <div class="my-5"></div>
        
      <h3>June 2024</h3>
            
      <p>Small reworks of existing challenges.
      </p>

      <div class="my-5"></div>
      
      <h3>March 2024</h3>
      
      <p>The new puzzle game "Mortal Coil" invites you to solve riddles. For those looking for some variety alongside the challenges, you will find puzzles ranging from super easy to super hard.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Februar 2024</h3>
      
      <p>Small reworks of existing challenges.
      </p>
      
      <div class="my-5"></div>
      
      <h3>January 2024</h3>
      
      <p>Attention bot writers: There is a new mini-game "Decode Me!" where the goal is to decode secret messages. It can be played manually, but works better with a bot. A starter bot is available for a easier start.
      </p>

      <div class="my-5"></div>
      
      <h3>October 2023</h3>
      
      <p>It was hard work, but after several weeks of intensive effort, all content has now been translated into English.</p>

      <p>In the future, all new tasks will be available in both German and English.
      </p>

      
      <div class="my-5"></div>
            
      <h3>September 2023</h3>
      
      <p>A new community area will be added, which can be accessed after the passage. There you will find new challenges on a regular basis, and you can contribute your own ideas.
      </p>
      
      <div class="my-5"></div>
      
      <h3>August 2023</h3>
      <p>Small update from the summer break: A few existing challenges have been improved.
      </p>
      
      <div class="my-5"></div>
      
      <h3>July 2023</h3>
      <p>The goal is reached! Hack The Web now has exactly 100 challenges. I'm going into a well-deserved summer break.
      </p>
      
      <p>Thanks for playing and see you soon!
      </p>
      
      <div class="my-5"></div>
      
      <h3>May 2023</h3>
        
      <p>We are launching a <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord server</a>. Exchange ideas with other players, ask for help if you get stuck, and get notified when new tasks are unlocked.
      </p>

      <p>Feel free to check Discord for the latest information.
      </p>
    
      <div class="my-5"></div>

      
      <h3>HTW100</h3>
      
      <p>In the next few weeks, there will be regular updates for the first time over a longer period of time. Every Wednesday evening and every Saturday evening a new challenge will be unlocked in the area after the passage. It starts tomorrow evening (April 5th); the goal is reached when the 100th challenge is unlocked, which should be around mid-June.
      </p>
      
      <div class="my-5"></div>
      
      <h3>April 2023</h3>
      
      <p>I am super grateful for the large community that now plays Hack The Web every day. Thank you! You motivate me to keep working on the platform, fixing bugs and creating new challenges.
      </p>
      
      <p>With this version, I will now also release the <a href="https://github.com/Entkenntnis/htw">source code for the server</a>. With this, I want to make sure that Hack The Web can be used in the future, even if this server is no longer available. Instructions are included.
      </p>
      
      <p>Otherwise, there will be some improvements to the existing challenges in the next few weeks. The map gets a small color update for the first time.
      </p>
      
      <div class="my-5"></div>
      
      <h3>March 2023</h3>
      
      <p>A few old challenges have been filled with new ideas, two challenges have been merged into one, two new challenges have been added.
      </p>
      
      <p>Point scores are adjusted a bit, there is a new high score.</p>
      
      <div class="my-5"></div>
      
      <h3>January 2023</h3>
      
      <p>Many thanks to the many players and teachers who regularly use Hack The Web in the classroom! On October 21, 2022, the platform officially turned 5 years old and has grown considerably in that time. It is a great honor for me to offer you this platform, and I am happy to introduce you to the world of hackers with further updates and new challenges.
      </p>
      
      <p>So for the new year, there are three new challenges again, two existing challenges (including the final) also get a new look. Happy hacking to everyone!</p>
      
      <p>Usual note: one challenge is replaced, so the scores change slightly. There is a new high score again.
      </p>
      
      <div class="my-5"></div>
      
      <h3>August 2022</h3>
      
      <p>In the last few months, there has been a lot of feedback on the challenges. As part of the regular maintenance, all challenges were checked again and improved in almost a third of them.
      </p>
      
      <div class="my-5"></div>
      
      <h3>May 2022</h3>
      
      <p>From this update on, the time at which challenges were created will be displayed. There are also some improvements to the existing challenges.</p>
      
      <div class="my-5"></div>    
      
      <h3>March 2022</h3>
      
      <p>As a supplement to the previous update, there are some improvements to the existing challenges, including two new challenges.</p>
      
      <div class="my-5"></div>
      
      <h3>February 2022</h3>
      
      <p>The journey continues! Behind the final, there are now six new challenges. For the first time, a score in the four-digit range can be achieved.
      </p>
      
      <p>There are also two new challenges in the starting area. A few existing challenges change their places. As a result, the scores change slightly.
      </p>
      
      <div class="my-5"></div>
      
      <h3>July 2021</h3>
      
      <p>This update brings some improvements to the "Quality of Service" These include:
      </p>
      
      <ul>
        <li>The high score can now be sorted. There are three options: by score (as before), by score of the active users from the last month and by the time of the last activity. This gives you a better overview of what is currently happening on the platform.</li>
        <li>The profile now shows the current (global) rank and the last solved challenge.</li>
        <li>Some challenges have been revised and improved.</li>
        <li>There are a few new hints on the community page.</li>
        <li>A bug in the score calculation has been fixed, all scores have been recalculated. The placement should not have changed as a result.</li>
      </ul>
      
      <div class="my-5"></div>
      
      <h3>April 2021</h3>
      
      <p>There is another update with six new challenges, four old challenges retire for it. The scores have been adjusted accordingly — there is now a new possible high score.
      </p>
      
      <p>Another addition: There is now a <a href="https://de.serlo.org/200247" target="_blank">community page</a> with hints about the challenges and further background information.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2020</h3>
      
      <p>Be ready for the big finale! With this update, there are seven new challenges and the map is complete.
      </p>
      
      <p>In addition, the scoring system is made fairer: The time bonus is eliminated, instead the points are determined based on the difficulty of the challenges. The further away a challenge is from the start, the more points there are. The formula is: score = 10 + (minimum number of edges to the start). This better reflects the work that has been put into the challenges.
      </p>
      
      <div class="my-5"></div>
      
      <h3>August 2020</h3>
      
      <p>This update contains some improvements to the existing challenges and five new challenges.
      </p>
      
      <div class="my-5"></div>
      
      <h3>June 2020</h3>
      
      <p>After more than a year of inactivity, there is finally an update: new challenges, new features and open source! The changes in detail:
      </p>
      
      <ul>
        <li>Fifteen new challenges are added to the existing 35 challenges and hopefully provide even more fun and challenge.
        </li>
        <li>The 30-minute session mode is now available to everyone and makes it easier to participate as a group or class: create your own room and join via the room key.
        </li>
        <li>Registered users can change their password. Accounts can also be deleted manually.
        </li>
        <li>The platform of Hack The Web is now available as an open-source project on GitHub: <a href="https://github.com/Entkenntnis/challenges-server" target="_blank">github.com/Entkenntnis/challenges-server</a>. This makes it possible to build your own variants of challenge websites.
        </li>
      </ul>
      
      <p>I wish all hackers a lot of fun hacking!
      </p>
    `,
  })

  values.push({
    lng: 'de',
    key: 'links.heading',
    value: 'Externe Links',
  })
  values.push({
    lng: 'en',
    key: 'links.heading',
    value: 'External links',
  })

  values.push({
    lng: 'de',
    key: 'links.content_',
    value: `
      <div class="my-5"></div>
          
      <h3 class="mb-4">Quellcode</h3>
      
      <p>Die Engine hinter dieser Website ist als Open-Source-Projekt verfügbar. Damit gibt es die Möglichkeit, eigene Projekte auf dieser Basis zu entwickeln:</p>
      
      <p><a href="https://github.com/Entkenntnis/challenges-server" target="_blank">GitHub: Entkenntnis/challenges-server</a></p>
      
      <p><a href="https://github.com/Entkenntnis/create-challenges-server" target="_blank">GitHub: Entkenntnis/create-challenges-server</a></p>
      
      <div class="my-4"></div>
      
      <p>Auch der Quellcode von Hack The Web ist frei verfügbar. Falls diese Seite nicht mehr erreichbar ist, kann dadurch eine neue Instanz aufgesetzt werden:</p>
      
      <p><a href="https://github.com/Entkenntnis/htw" target="_blank">GitHub: Entkenntnis/htw</a></p>
      
      <div class="my-5"></div>
      
      <h3 class="mb-4">Robot Karol Online</h3>
      
      <p>Als weiteres Tool für den Informatikunterricht gibt es eine Umsetzung von Robot Karol für den Browser:</p>
      
      <p><a href="https://karol.arrrg.de/" target="_blank">Robot Karol Online (https://karol.arrrg.de/)</a></p>
      
      <p><a href="https://github.com/Entkenntnis/robot-karol-online" target="_blank">GitHub: Entkenntnis/robot-karol-online</a></p>
      
      <div class="my-5"></div>
      
      <h3 class="mb-4">Linksammlungen</h3>
      
      <p>Vielen Dank an die Webseiten, die Hack The Web verlinken! Besuche diese Partner und entdecke weitere Inhalte für den Informatikunterricht:</p>
      
      <p><a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank">Serlo - Hack The Web (offizielle Community-Seite)</a></p>
      
      <p><a href="https://www.herr-rau.de/wordpress/2020/01/hack-the-web-unterrichts-und-fortbildungsformat.htm" target="_blank">Lehrerzimmer - Hack the Web: Unterrichts- und Fortbildungsformat?</a></p>
      
      <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/mint-machen-informatik" target="_blank">Landesmedienzentrum Baden-Württemberg - MINT machen - Informatik</a></p>
      
      <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/3x3-mediendossiers/kryptografie" target="_blank">Landesmedienzentrum Baden-Württemberg - Kryptografie</a></p>
      
      <p><a href="https://www.bildungsserver.de/Informatik-3727-de.html" target="_blank">Deutscher Bildungsserver - Informatik - Arbeitsblätter und weitere Unterrichtsmaterialen für die Sekundarstufe</a></p>
      
      <p><a href="https://onlineuebung.de/informatik" target="_blank">onlineuebung.de - Informatik in der Schule</a></p>
      
      <p><a href="https://suche.wirlernenonline.de/de/search?q=hack%20the%20web" target="_blank">WirLernenOnline - Hack The Web</a></p>
      
      <p><a href="https://informatik.schule.de/comments.php?material_id=503" target="_blank">Informatik.Schule.de - Hack The Web</a></p>
    `,
  })
  values.push({
    lng: 'en',
    key: 'links.content_',
    value: `
      <div class="my-5"></div>
            
      <h3 class="mb-4">Source Code</h3>
      
      <p>The engine behind this website is available as an open-source project. This makes it possible to develop your own projects on this basis:</p>
      
      <p><a href="https://github.com/Entkenntnis/challenges-server" target="_blank">GitHub: Entkenntnis/challenges-server</a></p>
      
      <p><a href="https://github.com/Entkenntnis/create-challenges-server" target="_blank">GitHub: Entkenntnis/create-challenges-server</a></p>
      
      <div class="my-4"></div>
      
      <p>The source code of Hack The Web is also freely available. If this site is no longer available, a new instance can be set up:</p>
      
      <p><a href="https://github.com/Entkenntnis/htw" target="_blank">GitHub: Entkenntnis/htw</a></p>
      
      <div class="my-5"></div>
      
      <h3 class="mb-4">Robot Karol Online</h3>
      
      <p>As another tool for computer science lessons, there is an implementation of Robot Karol for the browser:</p>
      
      <p><a href="https://karol.arrrg.de/" target="_blank">Robot Karol Online (https://karol.arrrg.de/)</a></p>
      
      <p><a href="https://github.com/Entkenntnis/robot-karol-online" target="_blank">GitHub: Entkenntnis/robot-karol-online</a></p>
      
      <div class="my-5"></div>
      
      <h3 class="mb-4">Link Collections</h3>
      
      <p>Many thanks to the websites that link to Hack The Web! Visit these partners and discover more content for computer science lessons:</p>
      
      <p><a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank">Serlo - Hack The Web (official Community-Seite)</a></p>
      <p><a href="https://www.herr-rau.de/wordpress/2020/01/hack-the-web-unterrichts-und-fortbildungsformat.htm" target="_blank">Lehrerzimmer - Hack the Web: Unterrichts- und Fortbildungsformat?</a></p>
      <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/mint-machen-informatik" target="_blank">Landesmedienzentrum Baden-Württemberg - MINT machen - Informatik</a></p>
      <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/3x3-mediendossiers/kryptografie" target="_blank">Landesmedienzentrum Baden-Württemberg - Kryptografie</a></p>
      <p><a href="https://www.bildungsserver.de/Informatik-3727-de.html" target="_blank">Deutscher Bildungsserver - Informatik - Arbeitsblätter und weitere Unterrichtsmaterialien für die Sekundarstufe</a></p>
      <p><a href="https://onlineuebung.de/informatik" target="_blank">onlineuebung.de - Informatik in der Schule</a></p>
      <p><a href="https://suche.wirlernenonline.de/de/search?q=hack%20the%20web" target="_blank">WirLernenOnline - Hack The Web</a></p>
      <p><a href="https://informatik.schule.de/comments.php?material_id=503" target="_blank">Informatik.Schule.de - Hack The Web</a></p>
    `,
  })

  values.push({
    lng: 'de',
    key: 'hints.heading',
    value: 'Hinweise',
  })
  values.push({
    lng: 'en',
    key: 'hints.heading',
    value: 'Hints',
  })

  values.push({
    lng: 'de',
    key: 'hints.content_',
    value: `
      <div class="my-5"></div>
           
      <p>Es gibt verschiedene Möglichkeiten für dich, Hinweise zu den Aufgaben zu erhalten:
      </p>
      
      
      <div class="my-5"></div>
      
      <p>
        <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 300px;margin-left:16px;" alt="discord"></a>
      </p>
      
      <p>Schaue auf unserem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> vorbei. Dort kannst du Fragen stellen und dich mit anderen Hacker*innen austauschen.
      </p>
      
      
      <div class="my-5"></div>
      
      <p>
        <a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank"><img src="/info.png" style="max-width: 400px" alt="info"></a>
      </p>
      
      <p>Auf der <a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank">Info-Seite</a> findest du Antworten auf die häufigsten Fragen.
      </p>
      
      <div class="my-5"></div>
      
      <p>
        <img src="/mail.png" style="margin-left:-12px;" alt="mail">
      </p>
      
      <p>Du kannst mir auch jederzeit direkt per Mail schreiben. Ich antworte auf alle Anfragen.
      </p>
      
      
      
    `,
  })
  values.push({
    lng: 'en',
    key: 'hints.content_',
    value: `
      <div class="my-5"></div>
            
      <p>There are different ways to get hints for the challenges:
      </p>
      
      <div class="my-5"></div>
      
      <p>
          <a href="https://discord.gg/9zDMZP9edd" target="_blank"><img src="/discord.png" style="max-width: 300px;margin-left:16px;" alt="discord"></a>
      </p>
      
      <p>Join our <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord server</a>. There you can ask questions and exchange ideas with other hackers.
      </p>
      
      
      <div class="my-5"></div>
      
      <p>
          <a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank"><img src="/info.png" style="max-width: 400px" alt="info"></a>
      </p>
      
      <p>On the <a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank">info page</a> you will find answers to the most frequently asked questions.
      </p>
      
      <div class="my-5"></div>
      
      <p>
          <img src="/mail.png" style="margin-left:-12px;" alt="mail">
      </p>
      
      <p>You can also write me an email at any time. I will answer all inquiries.
      </p>
      
      
      <div class="my-5"></div>
      
      <p>Other useful pages:
          <ul>
              <li><a href="/contact">Contact / Imprint</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/news">News</a></li>
              <li><a href="/links">Links</a></li>
          </ul>
      </p>
    `,
  })
  return values
}
