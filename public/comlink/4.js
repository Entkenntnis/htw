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
        { label: 'Was ist die Antwort?', next: 'answer' },
        { label: 'Was soll ich mit den Zahlen machen?', next: 'numbers' },
        {
          label: 'Sag mal, wie bist du in dieser Gruppe gelandet?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Die Frage ist eher: wie haben Kiwi und Bex mich gefunden, haha.',
        'Ich habe nach jungen Menschen gesucht, denen ich in meiner restlichen Zeit was gutes Tun kann.',
        'Und tja, wie es der Zufall will, bin ich Kiwi begegnet.',
        'Ich wollte eh noch Sirtach und hab die beiden einfach mitgenommen.',
      ],
      options: [{ label: 'Aha!', next: 'entry' }],
    },
    answer: {
      text: [
        'Siehst du die fünf Zahlen über dem Eingabefeld?',
        'Das ist deine Antwort in ASCII-Codes.',
      ],
      options: [
        { label: 'Was soll ich damit machen?', next: 'numbers' },
        { label: 'Ah, verstehe.', next: 'entry' },
      ],
    },
    numbers: {
      text: [
        'Dafür ist die Tabelle da.',
        'Da steht links eine Zahl und rechts ein Zeichen.',
        'Entziffere damit die fünf Zahlen.',
      ],
      options: [
        { label: 'Alles klar!', next: 'entry' },
        { label: 'Ich verstehe die Tabelle nicht.', next: 'stepwise' },
      ],
    },
    stepwise: {
      text: [
        'Kein Problem, machen wir das einmal gemeinsam.',
        'Die erste Zahl ist 35.',
        'Suche die Zahl in der Tabelle ...',
      ],
      next: 'question',
    },
    question: {
      text: 'Welches Zeichen passt zu 35?',
      options: [
        { label: 'a', next: 'wrong' },
        { label: 's', next: 'wrong' },
        { label: '#', next: 'right' },
      ],
    },
    wrong: {
      text: 'Leider falsch! Probiere es nochmal',
      next: 'question',
    },
    right: {
      text: 'Siehst du? Keine Magie!',
      next: 'entry',
    },
  },
}
