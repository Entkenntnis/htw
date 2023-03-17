# Hack The Web - source code and build instructions

Hallo! In diesem Repo findest du den Quellcode von Hack The Web. Dieses Readme gibt dir eine Anleitung, wie du diesen Quellcode zum Laufen bringen kannst. Das ist als Backup-Lösung gedacht, falls https://hack.arrrg.de ausfallen sollte. Es gibt die Möglichkeit, das Projekt wieder zum Laufen zu bringen.

Der Quellcode soll aber nicht die Aufgaben spoilern - daher habe ich darauf geachtet, alle sensiblen Daten in eine separate Datei zu packen und nicht mitzuliefern. Darin sind hauptsächlich Antworten gespeichert und ein paar Passwörter. Solltest du die Aufgaben gelöst haben, kannst du diese Datei selbst ausfüllen.

## Schritt 1: Setup

Installiere auf deinem Computer git und node.js (inkl. npm). Gehe in ein Verzeichnis deiner Wahl und führe folgende Befehle aus:

```
git clone https://github.com/Entkenntnis/htw.git
cd htw
npm install
npm install sqlite3
```

Mache eine **Kopie** von `secrets.placeholder.js` und benenne sie in `secrets.js` um. 

Damit sind alle Voraussetzungen erfüllt. Du kannst den Server  mit `npm start` starten und hast einen funktionierenden Server auf `localhost:3000`

## Schritt 2: Antworten eintragen

Im nächsten Schritt ist es deine Aufgabe, die Antworten in die Datei `secrets.js` einzutragen. Einige Antworten sind durch die Aufgabenstellung gegeben und müssen einen bestimmten Wert haben. Andere Antworten kannst du selbst festlegen.

## Schritt 3: Hosting

Im Produktivbetrieb nutzt das Projekt eine separate Datenbank. Das Passwort dazu muss auch eingetragen werden. Außerdem muss noch ein Impressum eingefügt werden. Optional kann ein Master-Passwort gesetzt werden, um moderieren zu können. Das war's dann auch schon. Der Rest des Codes dient der Verwaltung, wie z.B. die Möglichkeit, die Punktzahl neu zu berechnen oder eine ausführliche Analyse-Funktion (letzteres nur auf localhost aktiviert, `localhost:3000/dashboard`). 
