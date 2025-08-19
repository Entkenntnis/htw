const COM_TREE = {
  character: 'KIWI',
  messages: {
    start: {
      text: ['Etwas kryptisch, nicht wahr?', 'Keine Sorge!'],
      next: 'entry',
    },
    entry: {
      text: 'Ich helfe dir bei Fragen gerne weiter.',
      options: [
        {
          label: 'Äh, wo sehe ich meinen Benutzernamen?',
          next: 'name',
        },
        {
          label:
            'Ich hab meinen Benutzernamen eingegeben - aber der ist falsch!',
          next: 'encourage',
        },
        {
          label: 'Warst du eigentlich schon mal auf Sirtach?',
          next: 'backstory',
        },
      ],
    },
    name: {
      text: [
        'Schau mal oben rechts.',
        'Da steht dein Name, neben den Punkten.',
      ],
      next: 'entry',
    },
    backstory: {
      text: [
        'Ertappt, hihi. Nein, es ist auch das erste Mal, dass ich Naxion verlasse.',
        'Aber ich habe schon viel darüber gelesen.',
        'Ich freue mich schon so sehr drauf!',
        'So, jetzt aber genug gequatscht - weiter mit der Aufgabe!',
      ],
      next: 'entry',
    },
    encourage: {
      text: [
        'Keine Angst, wenn das System einen Fehler anzeigt!',
        'Wer keine Fehler macht, lernt nicht.',
        'Das System sagt also, dass du deinen Benutzernamen falsch eingegeben hast.',
      ],
      next: 'pattern',
    },
    pattern: {
      text: ['Erkennst du das Muster?'],
      options: [
        {
          label: 'Hä, welches Muster?',
          next: 'reencourage',
        },
        {
          label: 'Ja, klar, die Zeichen sind vertauscht.',
          next: 'final-hint',
        },
      ],
    },
    reencourage: {
      text: ['Vergleiche die Ausgabe des Systems mit deinem Benutzernamen.'],
      next: 'pattern',
    },
    'final-hint': {
      text: [
        'Genau!',
        'Aber wenn du die Zeichen davor selbst schon vertauscht ...',
      ],
      options: [
        {
          label: 'Ah, jetzt verstehe ich! Danke, Kiwi!',
          next: 'entry',
        },
        {
          label: 'Kannst du mir das nochmal erklären?',
          next: 'explain',
        },
      ],
    },
    explain: {
      text: [
        'Klar!',
        'Der Fehler des Systems ist, dass es die Zeichen deiner Eingabe umdreht.',
        'Du denkst also einen Schritt voraus: Anstatt deinen Benutzernamen so einzugeben, wie er ist, gibst du ihn in der umgedrehten Form ein.',
        'Dann klappt es!',
      ],
      next: 'entry',
    },
  },
}
