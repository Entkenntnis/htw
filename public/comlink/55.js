const COM_TREE = {
  character: 'JOSH',
  messages: {
    start: {
      text: ['Hey Kiddo!', 'Du weißt schon ...'],
      next: 'entry',
    },
    entry: {
      text: 'Frag mich, wenn du nicht weiterkommst mit der Aufgabe.',
      options: [
        { label: 'Wie finde ich den Namen heraus?', next: 'strategy' },
        { label: 'Warum ist "lila" falsch?', next: 'lila' },
        {
          label: 'Was haben Farben mit Hacking zu tun?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Eine sehr philosophische Frage!',
        'Wozu hacken wir?',
        'Wollen wir am Ende des Tages nicht die Dinge beschützen, die uns Farbe ins Leben bringen?',
        '...',
      ],
      options: [
        {
          label: 'hm ... darüber muss ich ein wenig nachdenken',
          next: 'entry',
        },
      ],
    },
    lila: {
      text: [
        'Die Farbe hat einen ganz bestimmten Namen.',
        'Es gibt viele unterschiedliche Lila-Töne',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    strategy: {
      text: [
        'Siehst du den Code, der mit # anfängt?',
        'Das ist der Hex-Code der Farbe. Dadurch ist die Farbe eindeutig bestimmt.',
        'Finde auf der verlinkten Seite die Farbe mit dem passenden Hex-Code.',
      ],
      options: [
        { label: 'Alles klar', next: 'entry' },
        { label: 'Was bedeutet der Hex-Code?', next: 'hex' },
      ],
    },
    hex: {
      text: [
        'Hier sind die Details: Der Code lautet #663399',
        'Je zwei Ziffern stehen für den Anteil an rot, grün und blau.',
        'Die Farbe hat also sehr viel blau (99), viel rot (66) und etwas grün (33).',
        'Aus diesen drei Grundfarben lassen sich alle sichtbaren Farben mischen.',
      ],
      options: [{ label: 'Danke', next: 'entry' }],
    },
  },
}
