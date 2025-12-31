import moment from 'moment'

/**
 * @param {string} dateStr
 */
function dt(dateStr) {
  return moment(dateStr).valueOf()
}

/** @type {import("./types.js").ExperimentDefinition[]} */
export const experimentDefs = [
  {
    id: 1,
    description: 'Nicht blinzeln: Dry Run ohne Änderungen',
    challenge: 24,
    startTs: new Date('2025-10-21 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-04 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/1_base_trial.jpg',
    trialImg: '/experiments/1_base_trial.jpg',
    results: {
      numEvents: 10706,
      nShowBase: 382,
      nShowTrial: 417,
      nVisitorsBase: 294,
      nVisitorsTrial: 331,
      nSolversBase: 259,
      nSolversTrial: 283,
    },
    learning:
      'Der Dry Run lieferte wie erwartet kein Ergebnis. Es war bisschen viel Noise dabei, deshalb hat es etwas länger gedauert, bis sich die Daten stabilisiert haben. SRM-Check war zeitweise sehr gut, zeitweise arg unausgeglichen. Es ist gut zu sehen, dass die Unterschiede doch klein sind und nicht signifikant. Mein Messinstrument erweist sich als zuverlässig.',
  },
  {
    id: 2,
    description:
      'Zitronentinte: Was passiert, wenn ich den einen Füll-Satz von Kiwi weglasse? Im Base ist die längere Version, im Trial die kürzere. Hat die zusätzliche "Deko" einen Einfluss auf die Metrik?',
    challenge: 5,
    startTs: new Date('2025-10-21 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-04 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/2_base.png',
    trialImg: '/experiments/2_trial.png',
    results: {
      numEvents: 6299,
      nShowBase: 370,
      nShowTrial: 419,
      nVisitorsBase: 298,
      nVisitorsTrial: 355,
      nSolversBase: 264,
      nSolversTrial: 302,
    },
    learning:
      'Die größte Überraschung ist die zeitweise sogar signifikante (so darf ich das eigentlich nicht ausdrücken) Unterscheidung der Klick-Rate auf die Aufgabe. Das ist erstmal sehr verwunderlich, weil die SpielerInnen ja vor dem Öffnen der Aufgabe gar nicht wissen können, was sie in der Aufgabe erwartet.  Meine Hypothese: Im Kontext von Klassenzimmern gibt es Kontaminierungseffekte, Menschen empfehlen Aufgaben weiter - und es scheint so zu sein, dass die kürzere Version einen Ticken eher dazu führt, dass Menschen die Aufgabe weiterempfehlen. Aber die höhere Rate zeigt sich nicht in einer messbaren Veränderung der Lösungsrate. Das Publikum hat hier also keine definitive Antwort. Die Entscheidung liegt bei der Jury.',
  },
  {
    id: 3,
    description:
      'Booyah! -> Agent: Ich vermute, dass der base Titel zu kryptisch ist und viele Menschen abschreckt. Überprüfe diese Hypothese.',
    challenge: 86,
    startTs: new Date('2025-10-21 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-11 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/3_base.jpg',
    trialImg: '/experiments/3_trial.jpg',
    results: {
      numEvents: 10017,
      nShowBase: 301,
      nShowTrial: 300,
      nVisitorsBase: 179,
      nVisitorsTrial: 175,
      nSolversBase: 82,
      nSolversTrial: 95,
    },
    learning:
      'Erstaunlich ist der Uplift innerhalb der Aufgabe - auch wenn der Effekt nicht signifikant ist, selbst bei der Größe. Also gar nicht intuitiv für mich: dass der Titel am Lösen der Aufgabe mehr ändert als an der Klickrate. Ich werde weiter probieren.',
  },
  {
    id: 4,
    description:
      'Geburtstag: Fokus auf Blick-In-Den-Quellcode als Skill, um effektiv zu hacken',
    challenge: 77,
    startTs: new Date('2025-10-21 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-11 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/4_base.jpg',
    trialImg: '/experiments/4_trial.jpg',
    results: {
      numEvents: 7288,
      nShowBase: 252,
      nShowTrial: 226,
      nVisitorsBase: 172,
      nVisitorsTrial: 159,
      nSolversBase: 103,
      nSolversTrial: 90,
    },
    learning:
      'Es ist eigentlich erstaunlich, wie gar keinen Unterschied diese Änderung gemacht hat - weder positiv noch negativ. Die Daten sind komplett neutral. Das heißt, dass ich die Änderung damit übernehmen kann.',
  },
  {
    id: 5,
    description:
      'Einhorn: neue Aufgabenstellung ohne Pflicht-Verlinkung, dafür mehr auf der Seite integriert mit einer "Standard"-Aufgabe zu Geometrie.',
    challenge: 23,
    startTs: new Date('2025-10-24 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-02 15:00:00 GMT+0100').getTime(),
    baseImg: '/experiments/5_base.jpg',
    trialImg: '/experiments/5_trial.jpg',
    results: {
      numEvents: 2977,
      nShowBase: 93,
      nShowTrial: 76,
      nVisitorsBase: 56,
      nVisitorsTrial: 41,
      nSolversBase: 34,
      nSolversTrial: 10,
    },
    learning:
      'Die neue Aufgabe hat klar schlechter performt, sie ist weniger zugänglich als ich hoffte. Es wird einen neuen Testlauf mit einer anderen Variante der Aufgabe geben.',
  },
  {
    id: 6,
    description:
      'Minecraft III: welchen Effekt hat der direkte Hinweis? Was ist, wenn ich diesen Hinweis auslasse? Ich erwarte eine Reduktion.',
    challenge: 112,
    startTs: new Date('2025-10-22 02:00 GMT+0200').getTime(),
    endTs: new Date('2025-11-12 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/6_base.jpg',
    trialImg: '/experiments/6_trial.jpg',
    results: {
      numEvents: 9051,
      nShowBase: 270,
      nShowTrial: 266,
      nVisitorsBase: 189,
      nVisitorsTrial: 207,
      nSolversBase: 103,
      nSolversTrial: 125,
    },
    learning:
      'Schock: Die Version ohne Hinweis funktioniert signifikant besser. Eine separate Analyse der Gesamt-Lösungsrate zeigt eine Steigerung von 23% und mit Signifikanz (p=0.0376, two-sided). Ein so klares Ergebnis habe ich nicht erwartet. Das heißt also: der Hinweis ist abschreckend und es gibt nur wenige Leute, die damit interagieren. Ich kann ihn also ohne Probleme löschen.',
  },
  {
    id: 7,
    description:
      'Baum: minimale Änderung durch Entfernung des Links, erwarte keinen Effekt.',
    challenge: 114,
    startTs: new Date('2025-11-02 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-11-16 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/7.jpg',
    trialImg: '/experiments/7.jpg',
    results: {
      numEvents: 5691,
      nShowBase: 250,
      nShowTrial: 257,
      nVisitorsBase: 153,
      nVisitorsTrial: 164,
      nSolversBase: 128,
      nSolversTrial: 138,
    },
    learning:
      'Der Link hat absolut keinen messbaren Effekt gehabt, er kann also entfernt werden.',
  },
  {
    id: 8,
    description:
      'Inception: Ersetze mit Anwendung binäre Suche. Erwarte eine geringere Lösungsrate, aber wenn der Unterschied nicht zu krass, würde ich die vorherige Aufgabe ersetzen.',
    challenge: 84,
    startTs: new Date('2025-11-05 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-11-26 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/8_base.jpg',
    trialImg: '/experiments/8_trial.jpg',
    results: {
      numEvents: 6771,
      nShowBase: 199,
      nShowTrial: 209,
      nVisitorsBase: 105,
      nVisitorsTrial: 96,
      nSolversBase: 91,
      nSolversTrial: 60,
    },
    learning:
      'Dieses Ergebnis überzeugt noch nicht. Ich sollte mich nochmal an das Drawing-Board setzen und die Idee verfeinern. Da lässt sich sicherlich noch etwas mehr rausholen aus dem Konzept. Weil an sich ist die Idee schon witzig.',
  },
  {
    id: 9,
    description:
      'Einhorn: neue Iteration mit einer leicht vereinfachten Variante der Geometrie-Aufgabe',
    challenge: 23,
    startTs: new Date('2025-11-16 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-12-28 01:00 GMT+0100').getTime(),
  },
  {
    id: 10,
    description:
      'Ankunft in Sirtach: sprachlich gekürzte Version der Geschichte',
    challenge: 57,
    startTs: new Date('2025-11-08 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-12-20 01:00 GMT+0100').getTime(),
  },
  {
    id: 11,
    description:
      'Community-Area: Wieder ein A/A Test, um punktuell ein paar Daten zu erheben und natürlich für die Stabilität',
    challenge: 300,
    startTs: new Date('2025-11-07 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-11-21 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/11.jpg',
    trialImg: '/experiments/11.jpg',
    results: {
      numEvents: 12065,
      nShowBase: 374,
      nShowTrial: 352,
      nVisitorsBase: 41,
      nVisitorsTrial: 44,
      nSolversBase: 26,
      nSolversTrial: 27,
    },
    learning:
      'Der Uplift von 14 Prozent wirkt viel, aber aufgrund der insgesamt kleinen Rate von ~12% ist das nicht signifikant und das wird durch den hohen p-Wert deutlich. Da muss ich echt aufpassen, nichts reinzuinterpretieren bei anderen Experimenten. Bin ich mit 12% zufrieden? Ich weiß es nicht. Es ist nicht viel, aber auch nicht so kritisch finde ich.',
  },
  {
    id: 12,
    description: 'Nicht blinzeln: Macht das Bild von Kiwi einen Unterschied?',
    challenge: 24,
    startTs: new Date('2025-11-08 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-11-22 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/12_base.jpg',
    trialImg: '/experiments/12_trial.jpg',
    results: {
      numEvents: 10752,
      nShowBase: 459,
      nShowTrial: 436,
      nVisitorsBase: 339,
      nVisitorsTrial: 332,
      nSolversBase: 299,
      nSolversTrial: 300,
    },
    learning:
      'Kein Unterschied - wirklich GAR keiner. Hm, soll ich das Bild einbauen? Für die Konsistenz, ja, macht schon Sinn.',
  },
  {
    id: 13,
    description: 'Notiz: Wie groß ist der Effekt von COMLINK?',
    challenge: 16,
    startTs: new Date('2025-11-08 01:00 GMT+0100').getTime(),
    endTs: new Date('2025-11-29 01:00 GMT+0100').getTime(),
    baseImg: '/experiments/13_base.jpg',
    trialImg: '/experiments/13_trial.jpg',
    results: {
      numEvents: 17553,
      nShowBase: 613,
      nShowTrial: 624,
      nVisitorsBase: 351,
      nVisitorsTrial: 355,
      nSolversBase: 204,
      nSolversTrial: 172,
    },
    learning:
      'COMLINK macht einen Unterschied! Ich hab das Experiment leider verkehrt herum aufgesetzt, aber umgerechnet erhöht COMLINK die Lösungsrate um gut 20%, signifikant. Freu freu. Ein Moment zu feiern und eine Bestätigung, dass ein Hinweis-System der richtige Weg ist.',
  },
  {
    id: 14,
    description: 'Geburstag: Wie groß ist der Effekt von COMLINK?',
    challenge: 77,
    startTs: new Date('2025-11-12 00:01 GMT+0100').getTime(),
    endTs: new Date('2025-12-03 00:01 GMT+0100').getTime(),
    baseImg: '/experiments/14_base.jpg',
    trialImg: '/experiments/14_trial.jpg',
    results: {
      numEvents: 7793,
      nShowBase: 245,
      nShowTrial: 277,
      nVisitorsBase: 166,
      nVisitorsTrial: 166,
      nSolversBase: 89,
      nSolversTrial: 85,
    },
    learning:
      'Keine signifikante Veränderung, hier ist base ohne und trial mit COMLINK. Zugegen, die Hinweise sind auch recht halbgar gewesen. Ich bin mir unsicher, ob ich das unsignifikante Ergebnis beachten soll oder nicht. Es ist fast signifikant, könnte eventuell darauf hinweisen, dass COMLINK einen leicht negativen Einfluss hat? Naja, ich hatte davor auch öfters solche Einflüsse und die waren bisher sehr häufig noise. Daher: kein Ergebnis in diesem Experiment. Entweder ich biete einen besseren Hinweis an ... oder lasse die Aufgabe auch erstmal ohne COMLINK, weil kein so akuter Hinweis-Bedarf ist.',
  },
  {
    id: 15,
    description: 'Booyah -> 007: Vielleicht ist dieser Hook noch besser?',
    challenge: 86,
    startTs: new Date('2025-11-12 00:02+0100').getTime(),
    endTs: new Date('2025-12-10 00:02+0100').getTime(),
    baseImg: '/experiments/15_base.jpg',
    trialImg: '/experiments/15_trial.jpg',
    results: {
      numEvents: 15706,
      nShowBase: 508,
      nShowTrial: 470,
      nVisitorsBase: 263,
      nVisitorsTrial: 307,
      nSolversBase: 128,
      nSolversTrial: 142,
    },
    learning:
      'Umgerechnet wurde die Lösungsrate um 20% erhöht, indem ich den Titel auf ein populäreres Thema umgedichtet habe. Es ist eine Bestätigung: Nuancen machen einen Unterschied! Aufgabe ist jetzt überarbeitet und nochmal ein Bug gefixed',
  },
  {
    id: 16,
    description:
      'Taschenrechner: Pilot für neues Profilbild von Bex, ich finde das Bild drückt den Charakter von Bex besser aus. Es hat zwar nichts mit der Aufgabe an sich inhaltlich zu tun, aber ich bin trotzdem gespannt, ob das Bild Effekte verursacht.',
    challenge: 110,
    startTs: new Date('2025-11-13 00:01+0100').getTime(),
    endTs: new Date('2025-11-14 14:00+0100').getTime(),
    baseImg: '/experiments/16_base.jpg',
    trialImg: '/experiments/16_trial.jpg',
    results: {
      numEvents: 1222,
      nShowBase: 69,
      nShowTrial: 81,
      nVisitorsBase: 45,
      nVisitorsTrial: 55,
      nSolversBase: 39,
      nSolversTrial: 50,
    },
    learning:
      'Nichts Signifikantes, hab das Experiment früher abgebrochen, weil ich jetzt eine neue Version des Bilds erstellt habe, die auf jeden Fall stärker ist bzw. wo ich mich mehr dazu verbunden fühle, deshalb überschreibe ich damit das Ergebnis des Experiments. Auch wenn ein minimaler Uplift zu sehen ist, wie gesagt, es ist nicht signifikant, sehr wahrscheinlich totaler Zufall.',
  },
  {
    id: 17,
    description:
      'UNIX: Die ursprüngliche Version mit Zeitstempel tritt gegen eine neue Version mit root als Antwort an.',
    challenge: 30,
    startTs: new Date('2025-11-17 00:01+0100').getTime(),
    endTs: new Date('2025-12-15 00:01+0100').getTime(),
  },
  {
    id: 18,
    description:
      'Verdächtig: Eine andere Version, mit Fokus auf dem Erkennen gefälschter E-Mail-Adressen.',
    challenge: 79,
    startTs: new Date('2025-11-17 01:01+0100').getTime(),
    endTs: new Date('2025-12-22 01:01+0100').getTime(),
  },
  {
    id: 19,
    description:
      'Umfrage: Ich möchte wissen, was die Kids über Hacking und das Internet denken. Um keinen Schaden anzurichten, mache ich das hier als 50/50 Split.',
    challenge: 118,
    startTs: new Date('2025-11-21 00:01+0100').getTime(),
    endTs: new Date('2025-12-19 00:01+0100').getTime(),
  },
  {
    id: 20,
    description:
      'Gemälde: Messung des Effekts von COMLINK, base ist OHNE und trial ist MIT, Effekt sollte minimal sein, da Aufgabe nicht so schwer',
    challenge: 68,
    startTs: new Date('2025-11-23 00:01+0100').getTime(),
    endTs: new Date('2025-12-14 00:01+0100').getTime(),
    baseImg: '/experiments/20_base.jpg',
    trialImg: '/experiments/20_trial.jpg',
    results: {
      numEvents: 12630,
      nShowBase: 713,
      nShowTrial: 661,
      nVisitorsBase: 455,
      nVisitorsTrial: 443,
      nSolversBase: 436,
      nSolversTrial: 415,
    },
    learning:
      'Was mache ich hier? Wie erwartet macht COMLINK auf die Lösung einer Aufgabe nicht so einen Effekt, weder positiv noch negativ. Es ist basically clutter. Ich habe leider, andere Effekte wie Spaß oder Motivation zu checken. Ich denke, ich lasse es erstmal so und mache mir eine mentale Notiz, dass es auch Aufgabe gibt, die einfach genug sind, dass Leute keine Hinweise brauchen und der Churn eher woanders liegt.',
  },
  {
    id: 21,
    description:
      'Minecraft: A/A-Test, um nochmal die Stabilität und das Noise-Level zu überprüfen.',
    challenge: 336,
    startTs: new Date('2025-11-26 00:01+0100').getTime(),
    endTs: new Date('2025-12-10 00:01+0100').getTime(),
    baseImg: '/experiments/21_base.jpg',
    trialImg: '/experiments/21_base.jpg',
    results: {
      numEvents: 9207,
      nShowBase: 449,
      nShowTrial: 392,
      nVisitorsBase: 330,
      nVisitorsTrial: 294,
      nSolversBase: 236,
      nSolversTrial: 195,
    },
    learning:
      '2 Wochen könnten etwas kurz gewesen sein ... weil ich einen relativ schlechten SRM-Wert habe. Aber die Signifikanz-Barriere hält Stand und stellt sicher, dass das Ergebnis nicht als nennenswert dargestellt wird.',
  },
]
