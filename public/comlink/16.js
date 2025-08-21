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
        { label: 'Was muss ich tun?', next: 'overview' },
        { label: 'Wie ändere ich den Dateinamen?', next: 'change' },
        {
          label: 'Machst du oft Flüchtigkeitsfehler?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'JAA! Leider zu viele!',
        'Keine Ahnung, was mit mir ist.',
        'Ich gebe mir ja schon so viel Mühe.',
      ],
      options: [{ label: 'Oh je.', next: 'entry' }],
    },
    overview: {
      text: [
        'Da ist ein Link auf eine Textdatei.',
        'Du kannst sie öffnen, aber der Dateiname enthält einen Tippfehler und du siehst die falsche Datei.',
      ],
      options: [
        { label: 'Wie lautet der richtige Dateiname?', next: 'which-name' },
        { label: 'Alles klar, ich probiere das mal.', next: 'entry' },
      ],
    },
    'which-name': {
      text: ['Schau dir den Link an!', 'Dir fällt sicherlich was auf!'],
      options: [
        { label: 'Hä?', next: 'letter' },
        { label: 'Ah, ok!', next: 'entry' },
      ],
    },
    letter: {
      text: ['Es fehlt ein Buchstabe!'],
      options: [{ label: 'Ah!', next: 'entry' }],
    },
    change: {
      text: [
        'Es gibt mehrere Methoden, wähle eine, die ich dir erklären soll:',
      ],
      options: [
        { label: 'A) Link kopieren und bearbeiten', next: 'methodA' },
        { label: 'B) Link öffnen und im Browser ändern', next: 'methodB' },
        { label: 'C) Manuell tippen', next: 'methodC' },
      ],
    },
    methodA: {
      text: [
        'Kopiere zuerst den Link.',
        'Öffe dann einen neuen Browser-Tab.',
        'Füge den Link ein, Achtung! Noch nicht Enter drücken!',
        'Jetzt kannst du den Fehler beheben.',
        'Nun öffne den Link, mit Enter oder durch Klick auf den ersten Vorschlag - voila!',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
    methodB: {
      text: [
        'Klicke auf den Link.',
        'Klicke im Browser auf die Adressleiste - du kannst den Link jetzt bearbeiten.',
        'Korrigieren den Fehler.',
        'Drücke Enter oder klicke auf den ersten Vorschlag, um den Link zu öffnen.',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
    methodC: {
      text: [
        'Öffne einen neuen Browser-Tab und fange an, den Link abzutippen.',
        'Dabei kannst du natürlich den Fehler beheben.',
        'Wenn du fertig bist, den Link öffenn und fertig!',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
  },
}
