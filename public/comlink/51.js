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
        { label: 'Was muss ich machen?', next: 'task' },
        { label: 'Ich verstehe diesen Kasten nicht.', next: 'manual' },
        {
          label: 'Arbeiten Computer wirklich nur mit 0 und 1?',
          next: 'backstory',
        },
      ],
    },
    task: {
      text: [
        'Finde die Binärzahl, die den Wert 7 hat.',
        'Klicke dazu auf die Kreise und schalte sie an oder aus.',
      ],
      options: [{ label: 'OK, probiere ich aus.', next: 'entry' }],
    },
    manual: {
      text: [
        'In dem Kasten ist eine 6-stellige Binärzahl dargestellt.',
        'Über jeder Ziffer siehst du einen Kreis.',
        'Klicke auf den Kreis, um die Ziffer zu ändern.',
        'Rechts siehst du den Wert der Binärzahl.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    backstory: {
      text: [
        'Ja! Alles, was du siehst, alle Bilder und Videos ...',
        'Alle Texte, alle Musik - alles wird digital dargestellt.',
        'Damit das funktioniert, gibt es viele Tricks.',
        'Man kann viele Jahre damit verbringen, diese ganze Technik kennenzulernen.',
      ],
      options: [{ label: 'Faszinierend', next: 'entry' }],
    },
  },
}
