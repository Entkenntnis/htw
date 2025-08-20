const COM_TREE = {
  character: 'BEX',
  messages: {
    start: {
      text: ['Brauchst du Hilfe bei der Aufgabe?'],
      options: [
        { label: 'Ich spiele kein Minecraft!', next: 'clueless' },
        { label: 'Was ist eine Block-ID?', next: 'id' },
        { label: 'Wie finde ich die Block-ID heraus?', next: 'recherche' },
        {
          label: 'Erzähl mal, was ist denn für ein Weltraumkram passiert?',
          next: 'backstory',
        },
      ],
    },
    backstory: {
      text: [
        'Hm, das ist kompliziert ...',
        'Meine Eltern ... naja, sie haben mich weggeschickt.',
        'Plötzlich wache ich in Naxion aus dem Kälteschlaf auf und man sagt mir, mein Zukause ist viele Lichtjahre entfernt.',
        'Was für eine Scheiße!',
        'Sorry ',
      ],
      options: [{ label: 'Oh.', next: 'start' }],
    },
    id: {
      text: [
        'Das Spiel muss ja die ganzen Blöcke irgendwie unterscheiden können, oder?',
        'Jeder kann einen Block ganz anders nennen, aber das Spiel braucht eine eindeutige ID dafür.',
        'Die ID ist entweder eine Zahl, wie z.B. 13, oder ein Text, wie z.B. minecraft:stone.',
      ],
      options: [
        { label: 'Wo finde ich diese ID?', next: 'recherche' },
        { label: 'Was ist das überhaupt für ein Block?', next: 'clueless' },
        { label: 'Danke für den Hinweis', next: 'start' },
      ],
    },
    clueless: {
      text: [
        'Ich sehe, du brauchst einen kleinen Crashkurs.',
        'Möchtest du, dass ich dir sagen, was für ein Block das ist?',
      ],
      options: [
        { label: 'Ja, bitte!', next: 'block' },
        { label: 'Nein, danke.', next: 'start' },
      ],
    },
    recherche: {
      text: ['Das Internet ist voll von Informationen über Minecraft.'],
      options: [
        { label: 'Suchen, das kriege ich selbst hin!', next: 'start' },
        {
          label: 'Ich habe schon gesucht, aber nichts gefunden.',
          next: 'website-hint',
        },
      ],
    },
    'website-hint': {
      text: [
        'Es gibt eine tolle Website, die alle Blöcke auflistet:',
        'minecraft-ids.grahamedgecombe.com',
      ],
      options: [{ label: 'Danke!', next: 'start' }],
    },
    block: {
      text: ['Ich gib dir vier Möglichkeiten zur Auswahl:'],
      options: [
        { label: 'Bruchstein', next: 'wrong' },
        { label: 'Granit', next: 'wrong' },
        { label: 'Grundgestein ', next: 'right' },
        { label: 'Kies', next: 'wrong' },
      ],
    },
    wrong: {
      text: ['Leider falsch.', 'Versuche es noch einmal.'],
      next: 'block',
    },
    right: {
      text: [
        'Richtig!',
        'Das ist Grundgestein, auch bekannt als Bedrock.',
        'Es ist unzerstörbar, außer mit einem Hack oder im Kreativmodus.',
      ],
      options: [
        { label: 'Cool, danke!', next: 'start' },
        {
          label: 'Aber ich habe ihn doch im Survival-Modus abgebaut!',
          next: 'bug',
        },
      ],
    },
    bug: {
      text: ['Haha, da ist jemand am Hacken!'],
      next: 'start',
    },
  },
}
