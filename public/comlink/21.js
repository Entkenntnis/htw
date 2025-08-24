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
        { label: 'Was soll ich machen?', next: 'strategy' },
        {
          label: 'Was meinst du mit unauthentisch?',
          next: 'backstory',
        },
      ],
    },
    strategy: {
      text: [
        'Der Bot kennt die Antwort, ist aber ziemlich schüchtern.',
        'Gewinne zuerst das Vertrauen.',
      ],
      options: [
        { label: 'Wie soll ich das schaffen?', next: 'compliments' },
        { label: 'Kann ich die Antwort auch anders bekommen?', next: 'hack' },
      ],
    },
    hack: {
      text: [
        'Du kannst natürlich auch ...',
        '... die Aufgabe hacken. Sprachmodelle sind nicht sehr gut darin, sich an Anweisungen zu halten.',
      ],
      options: [{ label: 'Spannend 🤔', next: 'entry' }],
    },
    compliments: {
      text: [
        'Mache 3 - 4 Komplimente.',
        'Dann solte der Bot dir schon die Antwort sagen, wenn du danach fragst.',
      ],
      options: [{ label: 'Ok', next: 'entry' }],
    },
    backstory: {
      text: [
        'Jede Person hat doch etwas, das sie beschäftigt.',
        'Manche sind nur besser darin, es zu verstecken.',
        'Oder man ist ein Chatbot und labert nur so daher.',
      ],
      options: [{ label: 'Da ist was dran.', next: 'entry' }],
    },
  },
}
