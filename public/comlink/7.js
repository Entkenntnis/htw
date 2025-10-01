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
        { label: 'Wie öffne ich den Quelltext?', next: 'howtosource' },
        { label: 'Wo im Quelltext ist die Antwort?', next: 'position' },
        {
          label: 'Hä, was ist nochmal ein Quelltext?',
          next: 'reexplain',
        },
      ],
    },
    reexplain: {
      text: [
        'Jede Webseite hat zwei Seiten:',
        'Die "schöne" Oberfläche, und eine Menge an Text, die diese Oberfläche beschreibt.',
        'Im Quelltext stehen viel mehr Dinge, als an der Oberfläche zu sehen sind.',
        'Wie zum Beispiel deine Antwort.',
      ],
      options: [{ label: 'OK', next: 'entry' }],
    },
    position: {
      text: [
        'Scrolle weiter nach unten und schaue alles durch.',
        'Die Antwort wird ziemlich auffällig sein.',
      ],
      options: [{ label: 'Danke!', next: 'entry' }],
    },
    howtosource: {
      text: ['Ich zeige dir gerne, wie das für dein System funktioniert.'],
      options: [
        { label: 'Ich nutze einen Computer/Laptop', next: 'pc' },
        { label: 'Ich nutze ein mobiles Gerät (Tablet/Handy)', next: 'mobile' },
      ],
    },
    pc: {
      text: ['Super! Welchen Browser nutzt du gerade?'],
      options: [
        { label: 'Firefox, Chrome, Edge, Brave, Opera, ...', next: 'easy' },
        { label: 'Ich nutze Safari (Mac)', next: 'safari' },
      ],
    },
    easy: {
      text: [
        'Sehr gut! Dein System erlaubt es dir leicht, auf den Quelltext zuzugreifen',
        'Mache irgendwo auf der Seite einen Rechtsklick!',
        'Im Menü erscheint die Option "Seitenquelltext anzeigen".',
        'Drauf klicken, fertig!',
      ],
      options: [{ label: 'Perfekt, danke.', next: 'entry' }],
    },
    safari: {
      text: [
        'Safari braucht bisschen mehr Arbeit.',
        'Um den Quelltext sehen zu können, musst du erst die Entwicklertools aktivieren.',
      ],
      options: [
        { label: 'Ja, zeige mir wie das geht!', next: 'safari-developer' },
        { label: 'Gibt es auch eine andere Methode?', next: 'fallback' },
      ],
    },
    'safari-developer': {
      text: [
        'Gehe auf Safari > Einstellungen > Erweitert',
        'Setze einen Haken bei Entwickler.',
        'Jetzt kannst du auf der Seite einen Rechtsklick machen.',
        'Wähle "Seitenquelltext anzeigen".',
      ],
      options: [
        { label: 'Danke, hat geklappt!', next: 'entry' },
        { label: 'Gibt es noch eine andere Methode?', next: 'fallback' },
      ],
    },
    fallback: {
      text: [
        'Nun, ich kann dir dann ... etwas unter die Arme greifen. Wenn du das möchtest, klicke auf QUELLTEXT-ÖFFNER.',
      ],
      options: [
        {
          label: 'QUELLTEXT-ÖFFNER',
          next: 'source-opener',
          effect: () => {
            showSource()
          },
        },
        {
          label: 'Nein, ich möchte es nochmal selber versuchen.',
          next: 'entry',
        },
      ],
    },
    'source-opener': {
      text: 'Seitenquelltext geöffnet',
      options: [
        { label: 'Danke.', next: 'entry' },
        {
          label: 'Nochmal öffnen',
          next: 'source-opener',
          effect: () => {
            showSource()
          },
        },
      ],
    },
    mobile: {
      text: [
        'Seufz - vielleicht habe ich im Eifer meinen Mund etwas zu voll genommen ...',
        'Auf einem mobilen Gerät wird es ohne Hilfe von mir doch schwierig.',
      ],
      options: [{ label: 'Das ist ok.', next: 'fallback' }],
    },
  },
}
