/** @type {import("../data/types.js").ExperimentDefinition[]} */
export const experimentDefs = [
  {
    id: 1,
    description: 'Nicht blinzeln: Dry Run ohne Änderungen',
    challenge: 24,
    startTs: new Date('2025-10-21').getTime(),
    endTs: new Date('2025-11-04').getTime(),
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
    endTs: new Date('2025-11-07').getTime(),
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
]
