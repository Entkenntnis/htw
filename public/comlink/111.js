const COM_TREE = {
  character: 'BEX',
  messages: {
    start: {
      text: 'Was geht?',
      next: 'entry',
    },
    entry: {
      text: 'Brauchst du Hilfe bei der Aufgabe?',
      options: [
        { label: 'Was muss ich machen?', next: 'strategy' },
        { label: 'Was bedeutet diese hochgestellte 4?', next: 'power' },
        {
          label: 'Was ist mit deinen Eltern passiert?',
          next: 'backstory',
        },
      ],
    },
    power: {
      text: ['Das ist eine Potenz.', 'Das heißt, 10⁴ = 10 · 10 · 10 · 10'],
      options: [
        { label: 'Alles klar', next: 'entry' },
        { label: 'Was ist das Ergebnis?', next: 'calculation' },
      ],
    },
    calculation: {
      text: [
        '10 hoch 4 ist 10000.',
        'Immer so viele Nullen wie die Potenz, easy peasy.',
      ],
      options: [{ label: 'Ok', next: 'entry' }],
    },
    strategy: {
      text: [
        'Der Hinweis ist wieder eine Zahl.',
        'Berechne wie davor diese Zahl mit dem Taschenrechner.',
      ],
      options: [
        { label: 'Aber welche Tasten soll ich drücken?', next: 'details' },
        { label: 'Das schaffe ich!', next: 'entry' },
      ],
    },
    details: {
      text: [
        'Eine Kette an Multiplikationen scheint sinnvoll.',
        '2 mal 5 gleich 10, das ist doch ein Start.',
      ],
      options: [{ label: 'Ok, lass mich mal probieren.', next: 'entry' }],
    },
    backstory: {
      text: [
        'Die Frage ist eher was mit mir passiert ist!',
        'Eines Tages wache ich aus dem Kälteschlaf in Naxion auf, einfach so.',
        'Nichts, keine Erklärung, nix.',
        'Zum Glück habe ich Kiwi gefunden, sie hat sich seitdem um mich gekümmert.',
        'Ich weiß gar nicht, was meine Eltern sich dabei gedacht haben ...',
      ],
      options: [{ label: ':/', next: 'entry' }],
    },
  },
}
