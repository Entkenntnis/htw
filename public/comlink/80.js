const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: 'Pssst!',
      options: [{ label: 'Ja?', next: 'start2' }],
    },
    start2: {
      text: 'Ich weiß, dass du ein Mensch bist.',
      options: [{ label: 'Okay ...', next: 'start3' }],
    },
    start3: {
      text: [
        'Deshalb hab ich einen kleinen Trick eingebaut.',
        'Möchtest du ihn wissen?',
      ],
      options: [
        { label: 'Ja, natürlich.', next: 'trick' },
        { label: 'Nein, lieber nicht.', next: 'start' },
      ],
    },
    trick: {
      text: [
        'Dreifach-Klick auf das Eingabefeld :)',
        'Dann kannst du den Text bearbeiten, hihi.',
      ],
      options: [{ label: 'Praktisch!', next: 'start' }],
    },
  },
}
