const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: 'Ich helfe dir gerne weiter, wenn du Fragen hast.',
      options: [
        { label: 'Wie geht diese Aufgabe?', next: 'prehint' },
        {
          label: 'Was hast du denn als Kind gemacht?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Hm, lass mich überlegen ...',
        'Ich habe viel Zeit mit Lesen verbracht.',
        'Und oft in den Himmel geschaut.',
      ],
      options: [{ label: 'Cool!', next: 'start' }],
    },
    prehint: {
      text: 'Ich kann dir den Trick verraten. Bist du bereit?',
      options: [
        { label: 'Ja, bitte!', next: 'hint' },
        { label: 'Nein, danke.', next: 'start' },
      ],
    },
    hint: {
      text: [
        'Der Trick ist ...',
        '... den Text zu markieren! Dann wird er sichtbar.',
        'Brauchst du noch mehr Hilfe?',
      ],
      options: [
        {
          label:
            'Ich habe den Bereich markiert, aber wenn ich das eingebe ist die Antwort falsch.',
          next: 'area',
        },
        { label: 'Wie markiere ich den Text auf einem Tablet?', next: 'touch' },
        { label: 'Nein, danke. Damit komme ich klar.', next: 'start' },
      ],
    },
    area: {
      text: ['Markiere den gesamten Bereich!', 'Da stehen noch mehr Sachen.'],
      next: 'start',
    },
    touch: {
      text: [
        'Halte deinen Finger lange auf dem Text!',
        'Danach kannst du die Auswahl verschieben und vergrößern.',
      ],
      next: 'start',
    },
  },
}
