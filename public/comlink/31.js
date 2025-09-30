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
        { label: 'Was muss ich hier machen?', next: 'strategy' },
        {
          label: 'Ich habe 1 - 0 - 0 - 0 eingegeben, aber das klappt nicht.',
          next: 'digits',
        },
        {
          label: 'Wie kommt man auf sowas?',
          next: 'backstory',
        },
      ],
    },
    strategy: {
      text: [
        'Nutze den Taschenrechner und berechne die Zahl 1000.',
        'Du kannst die Grundrechenarten dazu nutzen.',
      ],
      options: [
        { label: 'Alles klar.', next: 'entry' },
        { label: 'Was soll ich rechnen?', next: 'numbers' },
      ],
    },
    numbers: {
      text: ['Ich denke 10 mal 10 mal 10 wäre ein guter Ansatz.'],
      options: [{ label: 'Okay', next: 'entry' }],
    },
    digits: {
      text: [
        'Du hast nicht die Zahl 1000 berechnet, sondern vier einzelne Zahlen eingegeben.',
        'Um größere Zahlen zu erhalten, musst du rechnen.',
      ],
      options: [{ label: 'Ah, okay.', next: 'entry' }],
    },
    backstory: {
      text: [
        'Vielleicht war da jemand mal langweilig?',
        'Ich hab irgendwo gesehen, dass sowas auch als "Stapel" bezeichnet wird.',
        'Scheint für einige Algorithmen wichtig zu sein ... oder so.',
      ],
      options: [{ label: 'Hm, interessant.', next: 'entry' }],
    },
  },
}
