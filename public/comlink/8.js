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
        { label: 'Gibt es einen Trick?', next: 'trick' },
        {
          label: 'Kriegst du Albträume vom Mathe-Unterricht?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Ganz sooo schlimm ist es nicht.',
        'Immerhin mag ich Rätsel, und davon gab es viele in Mathe.',
        'Aber viele Themen fand ich ziemlich langweilig, leider.',
      ],
      options: [{ label: 'Hm, geht mir ähnlich.', next: 'entry' }],
    },
    trick: {
      text: [
        'Ja, den habe ich später mitbekommen.',
        'Du kannst die Reihenfolge der Zahlen tauschen.',
        'Dadurch kannst du dir die Rechnung vereinfachen.',
      ],
      options: [{ label: 'Hast du ein Beispiel?', next: 'trickdetails' }],
    },
    trickdetails: {
      text: [
        'Zum Beispiel kannst du die 1 und die 9 addieren, oder die 2 und die 8.',
        'Das sind runde Ergebnisse.',
        'Aber man könnte auch immer die erste und letzte Zahl addieren.',
        'Du hast die Wahl und kannst dir die Zahlen zurechtlegen.',
      ],
      options: [{ label: 'Danke', next: 'entry' }],
    },
  },
}
