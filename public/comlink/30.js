const COM_TREE = {
  character: 'JOSH',
  messages: {
    start: {
      text: ['Hey Kiddo!', 'Du weißt schon ...'],
      next: 'entry',
    },
    entry: {
      text: 'Frag mich, wenn du nicht weiterkommst mit der Aufgabe.',
      options: [
        { label: 'Was soll ich mit der Zahl machen?', next: 'strategy' },
        { label: 'Wo kann ich das Datum umwandeln?', next: 'question' },
      ],
    },
    strategy: {
      text: 'Die Zahl entspricht einem Datum. Suche nach einer Methode, die Zahl in ein Datum umzuwandeln.',
      next: 'entry',
    },
    question: {
      text: 'Probiere mal https://www.unixtimestamp.com/',
      next: 'entry',
    },
  },
}
