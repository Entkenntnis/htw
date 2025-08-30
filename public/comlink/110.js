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
        { label: 'Was muss ich machen?', next: 'strategy' },
        {
          label: 'Wieso macht es so ein Geräusch, wenn ich was tippe?',
          next: 'defect',
        },
        {
          label: 'Was soll ich mit dem blinkenden Text machen?',
          next: 'answer',
        },
        {
          label: 'Wie bist du an dieses Gerät gekommen?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Es lag eines Tages in meinem Postfach.',
        'Wahrscheinlich hat eine Drohne es dort abgeliefert.',
        'Leider hat unsere Wohnung keine Überwachungssysteme - diese können wir uns leider nicht leisten.',
      ],
      options: [{ label: 'Könnte gefährlich sein.', next: 'nodanger' }],
    },
    nodanger: {
      text: [
        'Keine Sorge, Kiwi hat es davor gründlich gecheckt.',
        'Nichts besonders, nur bisschen alte Elektronik.',
      ],
      options: [{ label: 'Mysteriös.', next: 'entry' }],
    },
    strategy: {
      text: [
        'Ich glaube, es hat was mit dem Startcode zu tun.',
        'Versuche doch mal, die Zahl 256 einzugeben.',
      ],
      options: [
        { label: 'Aber es klappt nicht.', next: 'defect' },
        { label: 'Let me cook.', next: 'entry' },
      ],
    },
    defect: {
      text: [
        'Jedes Mal, wenn du eine zweite Ziffer tippen möchtest, funktioniert das nicht.',
        'Scheint irgendein Defekt zu sein.',
      ],
      options: [
        { label: 'Wie soll ich da 256 eintippen?', next: 'calc' },
        { label: 'Das hält mich nicht auf.', next: 'entry' },
      ],
    },
    calc: {
      text: [
        'Hm, vielleicht mit einer Rechnung?',
        '5 + 5 = 10, das funktioniert und so habe ich eine zweistellige Zahl.',
        'Sollte auch für dreistellige Zahlen klappen.',
      ],
      options: [
        { label: 'Ah, das klingt noch einem Plan!', next: 'entry' },
        { label: 'Aber wie soll ich auf 256 kommen?', next: 'finerstrategy' },
      ],
    },
    finerstrategy: {
      text: [
        'Ich kann mir da verschiedene Wege vorstellen.',
        'Du könntest entweder ganz oft 9 + 9 + 9 + ... rechnen.',
        'Oder einige Mal 2 * 2 * 2 * ..., weil 256 eine Zweierpotenz ist.',
        'Oder eine andere Idee, es gibt viele Wege.',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
    answer: {
      text: [
        'Ah, das ist sehr gut.',
        'Dann hast du die Antwort gefunden!',
        'Trage sie unten in das Eingabefeld ein.',
      ],
      options: [{ label: 'Juhu!', next: 'entry' }],
    },
  },
}
