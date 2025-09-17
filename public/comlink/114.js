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
        { label: 'Wie finde ich die Baumart heraus?', next: 'strategy' },
        {
          label: 'Ich habe den Baum gefunden, aber meine Eingabe ist falsch!',
          next: 'mistype',
        },
        {
          label: 'Was machst du denn so im Wald?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Lach mich nicht aus ...',
        'Ich umarme die Bäume und genieße das Gefühl der Geborgenheit ...',
        'So, jetzt ist es raus.',
      ],
      options: [{ label: 'Süß', next: 'entry' }],
    },
    mistype: {
      text: [
        'Der Baum hat viele Namen, versuche verschiedene Schreibweisen.',
        'Die meisten Varianten werden akzeptiert.',
      ],
      options: [
        { label: 'Danke', next: 'entry' },
        { label: 'Ich habe schon alles probiert.', next: 'disambig' },
      ],
    },
    disambig: {
      text: [
        'Vielleicht verwechselst du den Baum mit der Castanea?',
        'Das ist eine ganze andere Familie.',
      ],
      options: [{ label: 'Ups', next: 'entry' }],
    },
    strategy: {
      text: [
        'Schau genau hin! Im Bild sind ein paar Hinweise zu finden.',
        'Oder nutze eine Tool aus dem Internet, davon gibt es einige.',
      ],
      options: [
        { label: 'Was für ein Tool?', next: 'tools' },
        { label: 'Gibt es nicht noch einen anderen Weg?', next: 'filename' },
      ],
    },
    filename: {
      text: [
        'Ok, lass mich einen Trick verraten:',
        'Klicke auf das Bild und schaue auf den Dateinamen.',
      ],
      options: [{ label: 'Danke', next: 'entry' }],
    },
    tools: {
      text: [
        'Google Bilder-Suche zum Beispiel,',
        'oder eine KI,',
        'es gibt auch spezielle Apps dafür.',
      ],
      options: [{ label: 'Probiere ich mal', next: 'entry' }],
    },
  },
}
