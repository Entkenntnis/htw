// special keys:
// - "start" when user starts the conversation
// - "nudge" when UI triggers a message

const COM_TREE = {
  1: {
    character: 'KIWI',
    messages: {
      start: {
        text: 'Hallo, das ist eine Nachricht im COM-LINK.',
        options: [
          { label: 'visible in ui', next: 'id' },
          { label: 'visible in ui 2', next: 'id' },
        ],
      },
    },
  },
}
