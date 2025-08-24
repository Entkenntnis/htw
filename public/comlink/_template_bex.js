const COM_TREE = {
  character: 'BEX',
  dev: true,
  messages: {
    start: {
      text: 'Was geht?',
      next: 'entry',
    },
    entry: {
      text: 'Brauchst du Hilfe bei der Aufgabe?',
      options: [
        { label: '... was muss ich machen? ...', next: 'strategy' },
        { label: '... konkrete frage ...', next: 'question' },
        {
          label: '... Erzähl mal was von dir ...',
          next: 'backstory',
        },
      ],
    },
  },
}
