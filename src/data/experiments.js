/** @type {import("./types.js").ExperimentDefinition[]} */
export const experimentDefs = [
  {
    id: 1,
    description: 'Nicht blinzeln: Dry Run ohne Änderungen',
    challenge: 24,
    startTs: new Date('2025-10-21').getTime(),
    endTs: new Date('2025-11-04').getTime(),
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
    startTs: new Date('2025-10-21').getTime(),
    endTs: new Date('2025-11-04').getTime(),
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
    startTs: new Date('2025-10-21').getTime(),
    endTs: new Date('2025-11-11').getTime(),
    baseImg: '/experiments/3_base.jpg',
    trialImg: '/experiments/3_trial.jpg',
  },
  {
    id: 4,
    description:
      'Geburtstag: Fokus auf Blick-In-Den-Quellcode als Skill, um effektiv zu hacken',
    challenge: 77,
    startTs: new Date('2025-10-21').getTime(),
    endTs: new Date('2025-11-11').getTime(),
    baseImg: '/experiments/4_base.jpg',
    trialImg: '/experiments/4_trial.jpg',
  },
  {
    id: 5,
    description:
      'Einhorn: neue Aufgabenstellung ohne Pflicht-Verlinkung, dafür mehr auf der Seite integriert mit einer "Standard"-Aufgabe zu Geometrie.',
    challenge: 23,
    startTs: new Date('2025-10-24').getTime(),
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
    startTs: new Date('2025-10-22').getTime(),
    endTs: new Date('2025-11-12').getTime(),
  },
  {
    id: 7,
    description:
      'Baum: minimale Änderung durch Entfernung des Links, erwarte keinen Effekt.',
    challenge: 114,
    startTs: new Date('2025-11-02').getTime(),
    endTs: new Date('2025-11-16').getTime(),
  },
  {
    id: 8,
    description:
      'Inception: Ersetze mit Anwendung binäre Suche. Erwarte eine geringere Lösungsrate, aber wenn der Unterschied nicht zu krass, würde ich die vorherige Aufgabe ersetzen.',
    challenge: 84,
    startTs: new Date('2025-11-05').getTime(),
    endTs: new Date('2025-11-26').getTime(),
  },
  {
    id: 9,
    description:
      'Einhorn: neue Iteration mit einer leicht vereinfachten Variante der Geometrie-Aufgabe',
    challenge: 23,
    startTs: new Date('2025-11-03').getTime(),
    endTs: new Date('2025-11-24').getTime(),
  },
  {
    id: 10,
    description:
      'Ankunft in Sirtach: sprachlich gekürzte Version der Geschichte',
    challenge: 57,
    startTs: new Date('2025-11-08').getTime(),
    endTs: new Date('2025-12-06').getTime(),
  },
  {
    id: 11,
    description:
      'Community-Area: Wieder ein A/A Test, um punktuell ein paar Daten zu erheben und natürlich für die Stabilität',
    challenge: 300,
    startTs: new Date('2025-11-07').getTime(),
    endTs: new Date('2025-11-21').getTime(),
  },
]
