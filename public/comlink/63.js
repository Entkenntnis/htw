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
        { label: 'Was ist die Antwort?', next: 'answer' },
        { label: 'Ich check den Quellcode nicht.', next: 'source' },
        {
          label: 'Wie schafft es Bex so gut?',
          next: 'bex',
        },
      ],
    },
    answer: {
      text: [
        'Spiele das Spiel und erreiche 100 Punkte, dann erscheint die Antwort.',
      ],
      options: [
        { label: 'Okay', next: 'entry' },
        { label: 'Erklär mir nochmal die Regeln.', next: 'rules' },
      ],
    },
    rules: {
      text: [
        'Steuere den Ball mit den Pfeiltasten oder mit den Touch-Controls.',
        'Berühre abwechselnd die linke und rechte Wand, um Punkte zu erhalten.',
        'Erreiche 100 Punkte, um die Antwort zu erhalten.',
      ],
      options: [{ label: 'Okay', next: 'entry' }],
    },
    source: {
      text: [
        'Der Quellcode enthält viele Elemente.',
        'Suche nach der Zeile, die ich dir markiert habe mit "SCHAU MAL".',
        'Dort findest du einen Hinweis.',
      ],
      options: [{ label: 'Okay', next: 'entry' }],
    },
    bex: {
      text: [
        'Er meint, es geht darum den Rhythmus zu finden.',
        'Was auch immer das bedeuten soll.',
      ],
      options: [{ label: 'Interessant.', next: 'entry' }],
    },
  },
}
