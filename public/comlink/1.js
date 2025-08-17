const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: 'Na, kommst du klar?',
      next: 'entry',
    },
    entry: {
      text: 'Ich helfe dir gerne weiter, wenn du Fragen hast.',
      options: [
        { label: 'Was ist die Lösung?', next: 'quengel' },
        { label: 'Ich mag kein Mathe :/', next: 'mathe' },
        {
          label: 'Wie weit ist die Erde von Naxion entfernt?',
          next: 'backstory',
        },
      ],
    },
    quengel: {
      text: 'Hey hey, nicht gleich aufgeben! Hast du schon die Aufgabe gefunden?',
      options: [
        { label: 'Ja schon, aber kein Bock auf Mathe', next: 'mathe' },
        { label: 'Hä, welche Aufgabe?', next: 'rechnung' },
      ],
    },
    rechnung: {
      text: [
        'Im vorletzten Absatz steht die Aufgabe:',
        'Berechne das Ergebnis von 6 + 4 · 9.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    mathe: {
      text: [
        'Da bist du nicht allein ʕ·͡ᴥ·ʔ',
        'Lass uns das gemeinsam lösen!',
        'Erstmal, kennst du noch die Punkt-vor-Strich-Regel?',
      ],
      options: [
        { label: 'Ja, klar!', next: 'prompt-first-step' },
        { label: 'Die ... was?', next: 'explain' },
      ],
    },
    explain: {
      text: [
        'Die Punkt-vor-Strich-Regel!',
        'Sie besagt, dass du eine Multiplikation vor der Addition rechnest.',
      ],
      options: [
        {
          label: 'Ja, daran erinnere ich mich ...',
          next: 'prompt-first-step',
        },
        { label: 'Kannst du das nochmal erklären?', next: 'explain' },
      ],
    },
    'prompt-first-step': {
      text: ['Schau dir also 6 + 4 · 9 an. Was ist der erste Schritt?'],
      options: [
        { label: '6 + 4', next: 'first-step' },
        { label: '4 · 9', next: 'second-step' },
        { label: 'Welche Regel soll ich beachten?', next: 'explain' },
      ],
    },
    'first-step': {
      text: 'Hmm, das ist nicht ganz richtig. Denk nochmal nach!',
      options: [{ label: 'OK', next: 'prompt-first-step' }],
    },
    'second-step': {
      text: 'Richtig!',
      next: 'calc1',
    },
    calc1: {
      text: 'Jetzt rechne 4 · 9 aus. Was kommt dabei raus?',
      options: [
        { label: '23', next: 'calc1-incorrect' },
        { label: '36', next: 'calc1-correct' },
        { label: '49', next: 'calc1-incorrect' },
      ],
    },
    'calc1-incorrect': {
      text: 'Hmm, das ist nicht ganz richtig. Denk nochmal nach!',
      options: [{ label: 'OK', next: 'calc1' }],
    },
    'calc1-correct': {
      text: 'Richtig! 4 · 9 ist 36.',
      next: 'calc2',
    },
    calc2: {
      text: [
        'Jetzt rechne 6 + 36 aus und schon hast du die Lösung!',
        'Vergiss nicht, sie in das Eingabefeld zu schreiben!',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    backstory: {
      text: 'Die Erde ist etwa 4,24 Lichtjahre von Naxion entfernt. Das ist eine ziemlich große Distanz, aber für intergalaktische Reisen durchaus machbar.',
      next: 'entry',
    },
  },
}
