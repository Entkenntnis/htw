const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: 'PUh ... ich hoffe deine Augen sind nicht ausgetrocknet.',
      next: 'entry',
    },
    entry: {
      text: 'Kann ich dir weiterhelfen?',
      options: [
        {
          label: 'Ich schwöre, ich habe nicht geblinzelt!',
          next: 'kein-blinzeln',
        },
        { label: 'Wie soll ich das angehen?', next: 'choice' },
        {
          label: 'Was hat das mit Hacken zu tun?',
          next: 'reason',
        },
      ],
    },
    reason: {
      text: [
        'Das ist eine gute Frage!',
        'Du hast sowas wahrscheinlich noch nie gemacht.',
        'Genau deshalb ist es eine Herausforderung. Dinge tun, die du noch nie getan hast ...',
        '... und dabei nicht aufgeben.',
      ],
      next: 'entry',
    },
    'kein-blinzeln': {
      text: [
        'Ein guter Start!',
        'Dann hast du sicherlich den Text aufblitzen sehen?',
      ],
      options: [
        { label: 'Wer kann so schnell lesen?', next: 'choice' },
        {
          label: 'Ja, aber ich habe keine Ahnung, was da steht.',
          next: 'choice',
        },
      ],
    },
    choice: {
      text: [
        'Es gibt viele Möglichkeiten, diese Aufgabe zu lösen, welchen Weg möchtest du gehen?',
      ],
      options: [
        { label: 'Ich will es ohne Hilfsmittel schaffen!', next: 'self' },
        {
          label: 'Ich hab ein Handy, das kann mir sicherlich helfen?',
          next: 'camera',
        },
        {
          label: 'Ich hab schon so viel probiert, aber nichts funktioniert.',
          next: 'frustration',
        },
      ],
    },
    self: {
      text: [
        'Sehr gut. Hier brauchst du vor allem ... etwas Geduld. Versuche erstmal nur das ERSTE Worte zu lesen.',
        'Hast du es?',
      ],
      options: [
        { label: 'Ja, das geht!', next: 'self2' },
        { label: 'Nein, das ist zu schwer.', next: 'frustration' },
      ],
    },
    self2: {
      text: [
        'Super!',
        'Und das ist der ganze Trick - Wort für Wort zur Lösung 💪',
      ],
      next: 'entry',
    },
    camera: {
      text: [
        'Ein Video mit dem Handy - und dann nur noch im passenden Moment pausieren 📹',
        'Damit brauchst du nicht ewig den Bildschirm anstarren.',
      ],
      options: [{ label: 'Ich probiere es mal!', next: 'entry' }],
    },
    frustration: {
      text: [
        'Das ist frustrierend, ich kann das gut verstehen.',
        'So ist es nunmal mit Herausforderungen.',
        'Umso schöner, wenn du nicht aufgibst und es schaffst!',
      ],
      next: 'entry',
    },
  },
}
