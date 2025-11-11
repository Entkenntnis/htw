const COM_TREE = window.trial
  ? {
      character: 'KIWI',
      dev: true,
      messages: {
        start: {
          text: 'Na, kommst du klar?',
          next: 'entry',
        },
        entry: {
          text: 'Ich helfe dir gerne weiter, wenn du Fragen hast.',
          options: [
            { label: 'Was muss ich machen?', next: 'strategy' },
            {
              label:
                'Kann nicht jeder einfach den Quellcode von Hack The Web kopieren?',
              next: 'copy',
            },
          ],
        },
        strategy: {
          text: [
            'Klick auf den verlinkten Ordner.',
            'Dort findest du den Server-Code zu dieser Aufgabe.',
          ],
          options: [{ label: 'OK', next: 'entry' }],
        },
        copy: {
          text: [
            'Ja, das geht!',
            'Du könntest in paar Stunden eine eigene Version von Hack The Web bauen.',
            'Das ist so gemacht, damit Menschen voneinander lernen könne.',
          ],
          options: [{ label: 'Cool.', next: 'entry' }],
        },
      },
    }
  : null
