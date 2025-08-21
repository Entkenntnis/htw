const COM_TREE = {
  character: 'JOSH',
  dev: true,
  messages: {
    start: {
      text: ['Hey Kiddo!', 'Du weißt schon ...'],
      next: 'entry',
    },
    entry: {
      text: 'Frag mich, wenn du nicht weiterkommst mit der Aufgabe.',
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
