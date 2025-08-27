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
        { label: 'Ich habe diese Frau noch nie gesehen.', next: 'who' },
        {
          label: 'Hast du das Bild selber gezeichnet?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Gezeichnet ist gut!',
        'Nein, die ganze Leistung geht an Normand, dem wir diese Version hier verdanken.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    who: {
      text: [
        'Sie ist wirklich seeeeehr berühmt! Falls du aber nicht drauf kommst, kann ich dir einen Tipp geben.',
      ],
      options: [
        { label: 'Ja, bitte!', next: 'hint' },
        { label: 'Ich überlege noch mal selber.', next: 'entry' },
      ],
    },
    hint: {
      text: [
        'Es ist ein Werk von Leonardo da Vinci und auf der Erde an einem Ort namens "Paris" zu bewundern.',
        'Vorausgesetzt, wenn man die jahrelange Reise auf sich nehmen möchte.',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
  },
}
