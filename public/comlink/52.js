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
        { label: 'Was ist das Binärsystem nochmal?', next: 'refresh' },
        { label: 'Wie funktioniert das Binärsystem?', next: 'principle' },
        {
          label: 'Und damit lassen sich wirklich ALLE Zahlen schreiben?',
          next: 'proof',
        },
      ],
    },
    proof: {
      text: [
        'Ich kann dir das jetzt nicht komplett beweisen.',
        'Aber ja, wenn du bisschen herumprobierst wirst du merken, dass es ein schönes Muster ist.',
      ],
      options: [{ label: 'Bin noch nicht 100% überzeugt.', next: 'entry' }],
    },
    refresh: {
      text: [
        'Im Binärsystem gibt es nur 0er und 1er.',
        'Trotzdem lassen sich damit alle Zahlen darstellen.',
        'Diese Aufgabe soll dir helfen, das Prinzip zu erkennen.',
      ],
      options: [
        { label: 'Alles klar.', next: 'entry' },
        { label: 'Welches Prinzip?', next: 'principle' },
      ],
    },
    principle: {
      text: [
        'Du siehst in der Aufgabe eine sechststellige Binärzahl.',
        'Über jeder Zahl ist ein runder Knopf mit einer Zweierpotenz. Mit einem Klick auf den Knopf schaltest du um zwischen 0 und 1.',
        'Kannst du mir soweit folgen?',
      ],
      options: [{ label: 'Ja, und weiter?', next: 'principle2' }],
    },
    principle2: {
      text: [
        'Wenn du die "aktiven" Zweierpotenzen addierst, also dort wo eine 1 ist, dann entspricht das immer dem Wert der Zahl.',
        'Finde jetzt eine Kombination an Zweierpotenzen, die 45 ergibt.',
      ],
      options: [{ label: 'Danke.', next: 'entry' }],
    },
  },
}
