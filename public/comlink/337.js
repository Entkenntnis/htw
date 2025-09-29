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
        { label: 'Ich spiele immer noch kein Minecraft!', next: 'nonplayer' },
        {
          label: 'Wie ist es möglich, daraus einen Computer zu bauen?',
          next: 'how',
        },
      ],
    },
    nonplayer: {
      text: [
        'Kein Problem.',
        'Du kannst entweder selbst im Internet suchen.',
        'Oder ich gebe dir einen direkten Tipp.',
      ],
      options: [
        { label: 'Ich probiere es alleine.', next: 'entry' },
        { label: 'Bitte einen Tipp.', next: 'hint' },
      ],
    },
    hint: {
      text: [
        'Der Name ist auf englisch.',
        'Wenn man ihn direkt übersetzt, kommt sowas wie "roter Stein" raus.',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
    how: {
      text: [
        'Soweit ich das verstehe braucht man für einen Computer nur sowas wie einen Schalter.',
        'Normalerweise übernimmt das ein Transistor.',
        'In Minecraft geht das mit einem Komparator oder Repeater.',
      ],
      options: [{ label: 'Nerdy', next: 'entry' }],
    },
  },
}
