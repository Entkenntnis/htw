const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: 'Na, kommst du klar?',
      next: 'entry',
    },
    entry: {
      text: 'Ich helfe dir gerne weiter, wenn du Fragen hast.',
      options: [
        { label: 'Was ist die Lösung?', next: 'quengel' },
        { label: 'Ich mag kein Mathe :/', next: 'mathe' },
        {
          label: 'Wie weit ist die Erde von Naxion entfernt?',
          next: 'backstory',
        },
      ],
    },
  },
}
