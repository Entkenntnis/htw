// special keys:
// - "start" when user starts the conversation
// - "nudge" when UI triggers a message

const COM_TREE = {
  1: {
    character: 'KIWI',
    messages: {
      start: {
        text: 'Na, kommst du klar?',
        next: 'entry',
      },
      entry: {
        text: 'Ich helfe dir gerne weiter, wenn du Fragen hast.',
        options: [
          { label: 'Was ist die Lösung?', next: 'lösung' },
          { label: 'Ich mag kein Mathe :/', next: 'start' },
          {
            label: 'Wie weit ist die Erde von Naxion entfernt?',
            next: 'xxx',
          },
        ],
      },

      lösung: {
        text: 'Hey hey, nicht gleich aufgeben! Hast du schon die Aufgabe gefunden?',
        options: [
          { label: 'Ja klar, aber wie löse ich sie?', next: 'start' },
          { label: 'Hä, welche Aufgabe', next: 'start' },
        ],
      },
    },
  },
}
