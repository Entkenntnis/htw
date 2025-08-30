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
        { label: 'Was muss ich hier machen?', next: 'strategy' },
        {
          label: 'Hast du dich gut mit deinen Eltern verstanden?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: ['Ja, sehr gut sogar.', 'Ich vermisse sie sehr.'],
      options: [{ label: '*hug*', next: 'entry' }],
    },
    strategy: {
      text: [
        'Du hast es schon zweimal geschafft!',
        'Das Prinzip ist weiter gleich.',
      ],
      options: [
        { label: 'Erkläre es mir nochmal', next: 'reexplain' },
        { label: 'Auch wahr', next: 'entry' },
      ],
    },
    reexplain: {
      text: [
        'Berechne das Ergebnis mit dem Taschenrechner, dann erscheint die Lösung',
        'Die hochgestellten Zahlen sind Potenzen, diese sagen dir, wie oft die die Zahl multiplizieren musst.',
      ],
      options: [{ label: 'Ok', next: 'entry' }],
    },
  },
}
