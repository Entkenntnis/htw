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
        { label: 'Was muss ich machen?', next: 'strategy' },
        { label: 'Wo im Quelltext finde ich die Antwort?', next: 'position' },
        {
          label: 'Was meinst du mit "letzte Tage"?',
          next: 'backstory',
        },
      ],
    },
    position: {
      text: [
        'Scrolle runter, bist du den Kasten wiederfindest.',
        'Im Kasten ist die Antwort sichtbar.',
      ],
      options: [{ label: 'Ok, danke.', next: 'entry' }],
    },
    strategy: {
      text: [
        'Öffne den Quelltext.',
        'Dazu habe ich dir diesen Button gebaut.',
        'Klick ihn!',
      ],
      options: [{ label: 'Mach ich.', next: 'entry' }],
    },
    backstory: {
      text: [
        'Wenn du so direkt fragst, hast du auch eine Antwort verdienst.',
        'Die Ärzte haben mir nicht mehr viel Zeit gegeben.',
        'Auf Sirtach gibt es ein Projekt für Menschen wie mich, an dem ich teilnehmen möchte.',
        'Haha, ich versuche es gelassen zu nehmen. Wir machen das beste daraus, ok?',
      ],
      options: [{ label: '【=◈︿◈=】 <3 <3 <3', next: 'entry' }],
    },
  },
}
