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
          label: 'Was bedeutet 2FA?',
          next: '2fa',
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
    '2fa': {
      text: [
        '2FA steht für Zwei-Faktor-Authentifizierung.',
        'Also wenn du neben dem Passwort noch auf dem Handy einen Code erhältest oder über eine App.',
        'Das macht es viel sicherer und schwerer zu hacken.',
      ],
      options: [{ label: 'Danke für die Erklärung.', next: 'entry' }],
    },
  },
}
