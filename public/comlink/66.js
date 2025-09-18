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
        { label: 'Ich sehe nichts im Hintergrund!', next: 'strategy' },
        {
          label: 'Es erscheint nichts, wenn ich auf den Link klicke.',
          next: 'wait',
        },
        {
          label: 'Was sind das für Symbole in der Matrix?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: ['Das weiß ich selber nicht.'],
      options: [{ label: 'Mysteriös', next: 'entry' }],
    },
    wait: {
      text: ['Warte 5 - 10 Sekunden.', 'Dann erscheinen die Symbole.'],
      options: [{ label: 'OK', next: 'entry' }],
    },
    strategy: {
      text: [
        'Bisschen Geduld.',
        'Warte ein bisschen, es gibt Momente in denen die Schatten besser zu sehen sind.',
      ],
      options: [
        { label: 'Probiere ich mal.', next: 'entry' },
        { label: 'Ich kann es nicht lesen!', next: 'prehint' },
      ],
    },
    prehint: {
      text: [
        'Es kann helfen, die Bildschirm etwas abzudunkeln, um die Farben besser zu sehen.',
        'Ich könnte dir auch einen weiteren Tipp geben.',
      ],
      options: [
        { label: 'Ich probiere selber.', next: 'entry' },
        { label: 'Ja, bitte einen Tipp.', next: 'prehint2' },
      ],
    },
    prehint2: {
      text: ['Bist du dir sicher?'],
      options: [
        { label: 'Ja, bitte', next: 'hint' },
        { label: 'Na gut, ich probiere es nochmal selber.', next: 'entry' },
      ],
    },
    hint: {
      text: [
        'Der erste Buchstabe ist ein V und der letzte Buchstabe ist ein r.',
        'Das ist der Hinweis.',
      ],
      options: [{ label: 'Danke', next: 'entry' }],
    },
  },
}
