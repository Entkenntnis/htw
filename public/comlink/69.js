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
        { label: 'Ich erkenne nichts.', next: 'fuzzy' },
        {
          label: 'Findest du dein Leben sinnlos?',
          next: 'backstory',
        },
      ],
    },
    fuzzy: {
      text: [
        'Du musst die Bilder genauer übereinander legen.',
        'Probiere es nochmal.',
      ],
      options: [{ label: 'OK, mach ich.', next: 'entry' }],
    },
    backstory: {
      text: [
        'Nein, so ist es nicht.',
        'Mit Kiwi und Josh bin ich gut augehoben.',
        'Und das Hacken macht mir auch viel Spaß.',
        'Vielleicht tut es auch gut, mal die ganzen Gedanken wegzupacken.',
      ],
      options: [{ label: '(づ｡◕‿‿◕｡)づ', next: 'entry' }],
    },
    strategy: {
      text: [
        'Du kannst die Bilderrahmen verschieben.',
        'Probiere es mit der Maus oder deinem Finger (wenn du Touch hast).',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
  },
}
