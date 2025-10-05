const COM_TREE = {
  character: 'JOSH',
  dev: true,
  messages: {
    start: {
      text: ['Hey Kiddo!', 'Du weißt schon ...'],
      next: 'entry',
    },
    entry: {
      text: 'Frag mich, wenn du nicht weiterkommst mit der Aufgabe.',
      options: [
        { label: 'Was soll ich mit der Nachricht machen?', next: 'strategy' },
        { label: 'Was ist mein Agenten-Kürzel?', next: 'kürzel' },
        {
          label: 'Ist das eine Anspielung auf eine bestimmte Cartoon-Serie?',
          next: 'backstory',
        },
      ],
    },
    strategy: {
      text: [
        'Gib deinen Namen ein.',
        'Rufe dann den Deaktivierungs-Code ab.',
        'Schreibe dazu direkt in den Text hinein.',
      ],
      options: [{ label: 'Okay', next: 'entry' }],
    },
    kürzel: {
      text: [
        'Dein Kürzel entspricht deinen Benutzernamen auf Hack The Web.',
        'Du findest ihn oben rechts in der Leiste.',
      ],
      options: [{ label: 'Alles klar.', next: 'entry' }],
    },
    backstory: {
      text: ['Ja!', 'Die Aufgabe ist inspiriert von Kim Possible.'],
      options: [{ label: 'Wusste ich es doch.', next: 'entry' }],
    },
  },
}
