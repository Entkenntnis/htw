const secrets = require('./secrets-loader.js')

module.exports = (config) => {
  config.i18nExtend.push({
    lng: 'de',
    key: 'home.slogan',
    value: 'Zeig, was in dir steckt!',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.slogan',
    value: 'Prove your skill.',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.language',
    value: 'Sprache/Language',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.language',
    value: 'Sprache/Language',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.github',
    value: 'Links',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.github',
    value: 'Links',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.version',
    value:
      'Version: Januar 2024 (<a href="' +
      config.urlPrefix +
      '/news">Neuigkeiten</a>)',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.version',
    value:
      'Version: January 2024 (<a href="' +
      config.urlPrefix +
      '/news">News</a>)',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.top10',
    value: 'Hacker*innen des Monats',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.top10',
    value: 'Hackers of the Month',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'contact.heading',
    value: 'Kontakt / Impressum',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'contact.heading',
    value: 'Contact / Imprint',
  })

  config.i18nExtend.push({
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
  config.i18nExtend.push({
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

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.supporter_',
    value: `
      <p>Dieses Projekt wird freundlicherweise unterstützt von der <a href="https://fg-bil.gi.de/">Fachgruppe Bayerische Informatiklehrkräfte</a>.</p>
      <hr class="my-5"/>
    `,
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.supporter_',
    value: `
      <p>This project is kindly supported by the <a href="https://fg-bil.gi.de/">Fachgruppe Bayerische Informatiklehrkräfte</a>.</p>
      <hr class="my-5"/>
    `,
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.invite_',
    value: `
      </p>
      
      <div class="jumbotron" style="padding-top:24px;margin-top:48px;border:#009670 solid 1px;background-image:url('background.jpg');">
        <p>Neu hier? Starte deine Reise in die Welt des Hacking:
        </p>
        <p class="text-center" style="margin-top:48px;">
          <a href="/register" class="btn btn-success btn-lg">Jetzt loslegen</a>
        </p>
      </div>

      <p>Besuche auch die <a href="https://de.serlo.org/200247" target="_blank">Info-Seite</a> oder schaue auf unserem <a href="https://discord.gg/9zDMZP9edd" target="_blank">Discord-Server</a> vorbei.
    `,
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'home.invite_',
    value: `
      </p>
      
      <div class="jumbotron" style="padding-top:24px;margin-top:48px;border:#009670 solid 1px;background-image:url('background.jpg');">
        <p>New here? Begin your journey into the world of hacking:
        </p>
        <p class="text-center" style="margin-top:48px;">
          <a href="/register" class="btn btn-success btn-lg">Get started</a>
        </p>
      </div>

      <p>Also visit the <a href="https://de.serlo.org/200247" target="_blank">info page</a> or join our <a href="https://discord.gg/9zDMZP9edd" target="_blank">discord server</a>.
    `,
  })

  config.i18nExtend.push({
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
      
      <h3 class="my-4">Google Fonts</h3>
      
      <p>Diese Website verwendet Google Fonts. Für nähere Informationen dazu besuche ihre <a href="https://developers.google.com/fonts/faq" target="_blank">FAQ</a>.
      </p>
      
      <script>
        function resetLocalUsers() {
          localStorage.removeItem('htw_local_users')
          alert('Accounts erfolgreich entfernt.')
        }
      </script>
    `,
  })

  config.i18nExtend.push({
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
      
      <h3 class="my-4">Google Fonts</h3>
      
      <p>This website uses Google Fonts. For more information, please visit their <a href="https://developers.google.com/fonts/faq" target="_blank">FAQ</a>.
      </p>
      
      <script>
        function resetLocalUsers() {
          localStorage.removeItem('htw_local_users')
          alert('Accounts erfolgreich entfernt.')
        }
      </script>
    `,
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'finish.heading',
    value: 'Herzlichen Glückwunsch!',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'finish.heading',
    value: 'Congratulations!',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'finish.content_',
    value: `
      <p>Du hast die Session erfolgreich absolviert. Deine 30 Minuten sind nun abgelaufen.</p>
      
      <p>Klicke auf OK, um dein Ergebnis in der Highscore zu speichern. Danach wird dein Account in den freien Modus geschaltet. Du kannst an den Aufgaben weiterarbeiten - ganz ohne Zeitdruck</p>
      
      <p>Vielen Dank für die Teilnahme. Wir wünschen dir alles Gute für deine Zukunft als Hacker!</p>
    `,
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'finish.content_',
    value: `
      <p>You have successfully completed the session. Your 30 minutes are now over.</p>
      
      <p>Click OK to save your result in the highscore. After that, your account will be switched to free mode. You can continue working on the tasks without any time pressure.</p>
      
      <p>Thank you for participating. We wish you all the best for your future as a hacker!</p>
    `,
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'news.heading',
    value: 'Neuigkeiten',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'news.heading',
    value: 'News',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'news.content_',
    value: `
      <div class="my-5"></div>
      
      <h3>Januar 2024</h3>
      
      <p>Der Community-Bereich ist früher erreichbar.
      </p>
      
      <div class="my-5"></div>
      
      <h3>Oktober 2023</h3>
      
      <p>Ab diesem Release sind alle Aufgaben auf deutsch und englisch spielbar.
      </p>
      
      <div class="my-5"></div>
      
      <h3>September 2023</h3>
      
      <p>Es kommt ein neuer Community-Bereich hinzu, dieser ist nach der Passage erreichbar. Dort gibt es regelmäßig neue Aufgaben und ihr könnt eigene Ideen einbringen.
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
  config.i18nExtend.push({
    lng: 'en',
    key: 'news.content_',
    value: `
      <div class="my-5"></div>
      
      <h3>January 2024</h3>
      
      <p>You can access the community area earlier.
      </p>
      
      <div class="my-5"></div>
      
      <h3>October 2023</h3>
      
      <p>From this release on all challenges are playable in English and German.
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

  config.i18nExtend.push({
    lng: 'de',
    key: 'links.heading',
    value: 'Externe Links',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'links.heading',
    value: 'External links',
  })

  config.i18nExtend.push({
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
  config.i18nExtend.push({
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

  config.i18nExtend.push({
    lng: 'de',
    key: 'hints.heading',
    value: 'Hinweise',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'hints.heading',
    value: 'Hints',
  })

  config.i18nExtend.push({
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
      
      
      
      <div class="my-5"></div>
      
      <p>Weitere nützliche Seiten:
        <ul>
          <li><a href="/contact">Kontakt / Impressum</a></li>
          <li><a href="/privacy">Datenschutzerklärung</a></li>
          <li><a href="/news">Neuigkeiten</a></li>
          <li><a href="/links">Links</a></li>
        </ul>
      </p>
    `,
  })
  config.i18nExtend.push({
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

  config.i18nExtend.push({
    lng: 'de',
    key: 'decode-me.heading',
    value: 'Decode Me!',
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'decode-me.heading',
    value: 'Decode Me!',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'decode-me.content_',
    value: `
      <h3 style="margin-top:32px;">Level 4</h3>

      <p><a href="/map">zurück</a> | <span style="color:lightgray;cursor:pointer;">springe zu Level</span></p>

      <p style="margin-top:32px;">Ermittle die Antwort aus der empfangenen Nachricht. Alle 10 Level steigert sich die Schwierigkeit.</p>
      
      <p>Schaue in den Quellcode um zu erfahren, wie man die Aufgabe automatisiert.</p>

      <p style="padding:12px;background-color:#171717;border-radius:12px;"><code>sdsfdsfsfss</code></p>

      <form autocomplete="off" method="post" id="challenge_form">
        <input id="challenge_answer" type="text" name="answer" style="height:32px">
        <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
      </form>
    `,
  })
  config.i18nExtend.push({
    lng: 'en',
    key: 'decode-me.content_',
    value: `
      <p>TODO</p>
    `,
  })
}
