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
        { label: 'Wie öffne ich den Quelltext?', next: 'source' },
        { label: 'Was soll ich im Quelltext finden?', next: 'directions' },
        {
          label: 'Es gibt Programme, die automatisch klicken können?',
          next: 'autoclicker',
        },
      ],
    },
    source: {
      text: [
        'Wenn du am PC bist: Mit Rechts-Klick findest du eine passende Option.',
        'Falls du die Option nicht findest oder auf einem Tablet bist, kann ich dir den Quelltext direkt öffnen.',
      ],
      options: [
        { label: 'Danke, habs.', next: 'entry' },
        {
          label: 'Ja, bitte öffne den Quelltext.',
          next: 'entry',
          effect: () => {
            showSource()
          },
        },
      ],
    },
    directions: {
      text: [
        'Halte nach der Zahl 2000 Ausschau.',
        'Wenn du sie gefunden hast, findest du in der Nähe eine URL.',
        'Diese URL wird dir weiterhelfen.',
      ],
      options: [
        { label: 'Ok, probiere ich mal.', next: 'entry' },
        { label: 'Und was soll ich mit der URL machen?', next: 'url' },
      ],
    },
    url: {
      text: [
        'Im Browser öffnen natürlich, haha.',
        'Dafür sind URLs doch da.',
        'Gib sie oben in die Adressleiste des Browsers sein.',
      ],
      options: [{ label: 'Okay', next: 'entry' }],
    },
    autoclicker: {
      text: [
        'Ja, die gibt es!',
        'Du findest so ein Programm, wenn du mal nach "AutoClicker" suchst.',
        'Damit sind 2000 Klicks in Sekunden erledigt.',
      ],
      options: [
        { label: 'Danke, ich mache mich mal auf die Suche.', next: 'entry' },
      ],
    },
  },
}
