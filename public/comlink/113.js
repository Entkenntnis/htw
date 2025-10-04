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
        { label: 'Wie soll ich den Kanal finden?', next: 'strategy' },
        { label: 'Was bringt mir die Galerie?', next: 'gallery' },
        {
          label:
            'Ist das eine Zeitreise? Der Kanal ist doch über 200 Jahre alt!?',
          next: 'backstory',
        },
      ],
    },
    strategy: {
      text: [
        'Mit den Hinweisen sollte eine Internet-Suche ganz gute Ergebnisse liefern.',
        'Oder probiere mal den Link aus.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    gallery: {
      text: [
        'Dort sind einige Minecraft-Skins vertreten.',
        'Und auch vom gesuchten Kanal.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    backstory: {
      text: [
        'Ja, das ist ja das verrückte!',
        'Sie reden davon, als ob es für sie noch aktuell ist.',
        'Geschichten mit Zeitreisen sind kompliziert.',
      ],
      options: [{ label: 'Jetzt bin ich verwirrt.', next: 'entry' }],
    },
  },
}
