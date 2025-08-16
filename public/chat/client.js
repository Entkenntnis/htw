// Chat Client

console.log('Hello, this is the chat client ...')

function injectChat() {
  // Create container
  const chatContainer = document.createElement('div')
  chatContainer.id = 'chat-container'

  // Inject styles (scoped via ids/classes used below)
  const style = document.createElement('style')
  style.textContent = `
    :root {
      /* Base palette updated to brand green #00bc8c */
      --com-bg: radial-gradient(circle at 20% 110%, #0f2e26 0%, #081d18 60%, #04100d 100%);
      --com-border: #0d6f56;
      --com-border-glow: 162 100% 38%;
      --com-accent: #00bc8c;
      --com-accent-rgb: 0 188 140;
      --com-accent-dim: #00795c;
      --com-accent-soft: #38e1b8;
      --com-text: #dbf7f0;
      --com-text-dim: #76b4a2;
      --com-shadow: 0 0 0 1px #0d3a2e, 0 0 4px #06231b, 0 0 12px rgba(0,188,140,.28);
      --com-transition: 340ms cubic-bezier(.4,.14,.18,1);
      --com-font: "Consolas", "SFMono-Regular", ui-monospace, "Roboto Mono", monospace;
    }
    #chat-box {
      position: fixed;
      right: 24px;
      bottom: 0;
      width: 300px;
      height: 42px; /* collapsed height */
      background: var(--com-bg);
      border: 1px solid var(--com-border);
      border-bottom: none;
      border-radius: 9px 9px 0 0;
      box-shadow: var(--com-shadow);
      overflow: hidden;
      font-family: var(--com-font);
      color: var(--com-text);
      transition: height var(--com-transition), box-shadow 600ms ease, filter 600ms ease;
      box-sizing: border-box;
      backdrop-filter: blur(3px) saturate(140%);
      -webkit-font-smoothing: antialiased;
      letter-spacing: .4px;
      isolation: isolate;
    }
    #chat-box::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(115deg, rgba(var(--com-accent-rgb),.18), transparent 42%),
        repeating-linear-gradient(180deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px);
      mix-blend-mode: screen;
      opacity: .55;
    }
    #chat-box.expanded {
      height: 560px;
      box-shadow: 0 0 0 1px #0c5f49, 0 0 6px #0b3a2d, 0 0 20px rgba(var(--com-accent-rgb),.45), 0 0 42px rgba(var(--com-accent-rgb),.25);
    }
    #chat-box-header {
      position: relative;
      padding: 6px 40px 6px 14px;
      cursor: pointer;
      user-select: none;
      font-weight: 500;
      font-size: 13px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 8px;
      line-height: 1.2;
  background: linear-gradient(90deg, rgba(var(--com-accent-rgb),.18), rgba(var(--com-accent-rgb),.04) 55%, rgba(var(--com-accent-rgb),.14));
  border-bottom: 1px solid #0d2d24;
      letter-spacing: 1.5px;
    }
    #chat-box-header:focus-visible {
      outline: 2px solid var(--com-accent);
      outline-offset: -2px;
    }
    #chat-box-header .led {
      width: 9px;
      height: 9px;
      border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #53ffd8, #00bc8c 55%, #004a36 70%);
  box-shadow: 0 0 2px #53ffd8, 0 0 6px #00bc8c, 0 0 12px rgba(var(--com-accent-rgb),.55);
      flex: 0 0 auto;
      position: relative;
      animation: led-pulse 4s ease-in-out infinite;
    }
    #chat-box.expanded #chat-box-header .led {
      animation: led-pulse-active 2.8s ease-in-out infinite;
    }
    @keyframes led-pulse {
      0%, 70%, 100% { filter: brightness(1); opacity: .85; }
      40% { filter: brightness(1.6); opacity: 1; }
    }
    @keyframes led-pulse-active {
      0%, 100% { filter: brightness(1.1); }
      50% { filter: brightness(1.9); }
    }
    #chat-box-title-text {
      flex: 1 1 auto;
      color: var(--com-text);
      text-shadow: 0 0 2px rgba(var(--com-accent-rgb),.55);
      font-weight: 600;
    }
    #chat-box-title-text span.id {
      color: var(--com-text-dim);
      font-weight: 400;
      letter-spacing: .5px;
    }
    #chat-box-toggle-indicator {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%) rotate(0deg);
      font-weight: 600;
      font-size: 16px;
      color: var(--com-accent);
      text-shadow: 0 0 4px rgba(var(--com-accent-rgb),.7), 0 0 9px rgba(var(--com-accent-rgb),.35);
      transition: transform 260ms ease, color 400ms ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: linear-gradient(135deg, rgba(var(--com-accent-rgb),.2), rgba(var(--com-accent-rgb),.05));
      box-shadow: inset 0 0 4px rgba(var(--com-accent-rgb),.55), 0 0 6px rgba(var(--com-accent-rgb),.28);
    }
    #chat-box.expanded #chat-box-toggle-indicator { transform: translateY(-50%) rotate(135deg); }
    #chat-box-header:hover #chat-box-toggle-indicator { color: var(--com-accent-soft); }
    #chat-box-content {
      display: none; /* Empty container for now */
      width: 100%;
      height: calc(100% - 42px);
      background: linear-gradient(180deg, #051612, #0a241d);
      position: relative;
      overflow: hidden;
      font-size: 12px;
      color: var(--com-text-dim);
    }
    #chat-box-content::before {
      content: "";
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(180deg, rgba(var(--com-accent-rgb),.05) 0 2px, transparent 2px 4px);
      pointer-events: none;
      opacity: .25;
    }
    #chat-box.expanded #chat-box-content { display: block; }
  `

  document.head.appendChild(style)

  chatContainer.innerHTML = `
    <div id="chat-box" role="complementary" aria-label="COM-Link Chat" aria-expanded="false">
      <div id="chat-box-header" role="button" tabindex="0" aria-controls="chat-box-content" aria-expanded="false">
        <span class="led" aria-hidden="true"></span>
        <span id="chat-box-title-text">COM-LINK <span class="id">KIWI</span></span>
        <span id="chat-box-toggle-indicator" aria-hidden="true">+</span>
      </div>
      <div id="chat-box-content" role="region" aria-label="Chat Transmission Channel">
        <div id="cl-messages" aria-live="polite"></div>
        <div id="cl-options" aria-label="Response Options"></div>
      </div>
    </div>
  `

  document.body.appendChild(chatContainer)

  // Toggle logic
  const chatBox = chatContainer.querySelector('#chat-box')
  const header = chatContainer.querySelector('#chat-box-header')
  const COLLAPSED_HEIGHT = 42
  const EXPANDED_HEIGHT = 560
  let conversationStarted = false

  // --- Conversation Data (Help-oriented, task already visible externally) ---
  const COM_TREE = {
    start: {
      text: [
        'Hejo editor – ich bin dein optionaler COM-Link. Aufgabe siehst du bereits extern, ich wiederhole sie nicht.',
        'Frag mich nach Hinweisen, Bestätigung oder Unsinn. Ich bin neugierig, eifrig und mild chaotisch. Womit starten wir?',
      ],
      options: [
        { label: 'Kurzer Hinweis', next: 'hint_basic' },
        { label: 'Ich weiß nicht weiter', next: 'no_idea' },
        { label: 'Was ist die Lösung?', next: 'solution_request' },
        { label: 'Ich kann kein Mathe', next: 'cant_math' },
        { label: 'Zufallsfrage', next: 'random' },
      ],
    },
    hint_basic: {
      text: 'Denk an die Rechnung im letzten Absatz: Ergebnis = Zahl die du einträgst. Multiplikation hat Priorität vor Addition.',
      options: [
        { label: 'Noch ein Hinweis', next: 'hint_step' },
        { label: 'Ich kenne die Lösung (42)', next: 'final_correct' },
        { label: 'Ich weiß nicht weiter', next: 'no_idea' },
      ],
    },
    hint_step: {
      text: 'Erst das Produkt bilden, dann zur übrig gebliebenen Zahl addieren. Das wars schon.',
      options: [
        { label: 'Okay, dann ist es 42', next: 'final_correct' },
        { label: 'Erklär "Punkt vor Strich"', next: 'order_explain' },
        { label: 'Ich weiß nicht weiter', next: 'no_idea' },
      ],
    },
    no_idea: {
      text: 'Alles gut. Wähle: kleiner Hinweis, Rechenschritt oder ich gebe dir schlicht die Lösung (ich urteile nur innerlich).',
      options: [
        { label: 'Hinweis', next: 'hint_basic' },
        { label: 'Rechenschritt zeigen', next: 'step_hint' },
        { label: 'Sag einfach die Lösung', next: 'solution_reveal' },
        { label: 'Zurück', next: 'start' },
      ],
    },
    step_hint: {
      text: 'Zwischenschritt: Das Produkt der beiden rechten Zahlen zuerst. Danach die Summe bilden.',
      options: [
        { label: 'Verstanden – Ergebnis 42', next: 'final_correct' },
        { label: 'Noch unsicher', next: 'no_idea' },
      ],
    },
    solution_request: {
      text: 'Direkt die Lösung? Offiziell sollst du sie selbst finden. Inoffiziell kann ich sie flüstern… willst du wirklich schummeln?',
      options: [
        { label: 'Ja flüstern', next: 'solution_reveal' },
        { label: 'Ok, Hinweis reicht', next: 'hint_basic' },
        { label: 'Ich kann kein Mathe', next: 'cant_math' },
      ],
    },
    solution_reveal: {
      text: 'Die Zahl lautet 42. Trag sie ein und beobachte was passiert.',
      options: [
        { label: 'Fertig ✅', next: 'final_correct' },
        { label: 'Wieso 42?', next: 'order_explain' },
      ],
    },
    cant_math: {
      text: 'Kein Problem. Du hast sicher ein Gerät mit Taschenrechner. Oder nutz meine Hinweise: Priorität zuerst ausnutzen, dann addieren.',
      options: [
        { label: 'Zeig Rechenschritt', next: 'step_hint' },
        { label: 'Ich rate 90', next: 'guess_90' },
        { label: 'Ich weiß nicht weiter', next: 'no_idea' },
      ],
    },
    guess_90: {
      text: '90??? Charmant falsches Chaos. Stichwort: Punkt vor Strich.',
      options: [
        { label: 'Erklär das Prinzip', next: 'order_explain' },
        { label: 'Dann ist es 42', next: 'final_correct' },
        { label: 'Noch ein Hinweis', next: 'hint_basic' },
      ],
    },
    order_explain: {
      text: 'Operator-Priorität ("Punkt vor Strich"): Multiplikation/Division zuerst vollständig auswerten, danach Addition/Subtraktion. Dadurch entsteht die korrekte Zielzahl.',
      options: [
        { label: 'Dann Ergebnis 42', next: 'final_correct' },
        { label: 'Noch unsicher', next: 'no_idea' },
      ],
    },
    random: {
      text: 'Wie weit ist die Sonne? *Schätze mal so 2 Jahre Reisezeit* (Galaktischer Scherz. In Wirklichkeit sehr weiter weg. Fokus zurück zur Aufgabe?)',
      options: [
        { label: 'Zurück zur Hilfe', next: 'start' },
        { label: 'Hinweis', next: 'hint_basic' },
      ],
    },
    final_correct: {
      text: [
        'Richtig: 42. Du hast den Einstieg gemeistert.',
        'Nächste Steps werden extern freigeschaltet – du kannst hier jederzeit neu starten.',
      ],
      options: [
        { label: 'Neustart', next: 'restart' },
        { label: 'Zufallsfrage', next: 'random' },
      ],
    },
    restart: {
      text: 'Zurück zum Anfang… bereit für eine neue Runde Hinweise & Chaos.',
      options: [{ label: 'Los', next: 'start' }],
    },
  }

  // --- DOM Refs ---
  const messagesEl = chatContainer.querySelector('#cl-messages')
  const optionsEl = chatContainer.querySelector('#cl-options')

  // --- Styles extension ---
  style.textContent += `
    #cl-messages {
      position: absolute;
      inset: 0 0 80px 0;
      overflow-y: auto;
      padding: 10px 12px 12px;
      scrollbar-width: thin;
      scrollbar-color: var(--com-accent-dim) transparent;
    }
    #cl-messages::-webkit-scrollbar { width: 6px; }
    #cl-messages::-webkit-scrollbar-track { background: transparent; }
    #cl-messages::-webkit-scrollbar-thumb {
      background: linear-gradient(var(--com-accent-dim), var(--com-accent));
      border-radius: 3px;
    }
    .cl-msg { margin: 0 0 10px; display: flex; gap: 6px; line-height: 1.35; }
    .cl-msg.system { justify-content: flex-start; }
    .cl-msg.user { justify-content: flex-end; }
    .cl-bubble { max-width: 92%; padding: 6px 8px 5px; font-size: 11.5px; border: 1px solid #0d3a2e; border-radius: 6px; background: rgba(0,0,0,.25); position: relative; }
    .cl-msg.system .cl-bubble { background: rgba(0,188,140,.08); border-color: rgba(var(--com-accent-rgb),.5); box-shadow: 0 0 0 1px rgba(var(--com-accent-rgb),.15), 0 0 8px rgba(var(--com-accent-rgb),.18); }
    .cl-msg.user .cl-bubble { background: linear-gradient(135deg, rgba(var(--com-accent-rgb),.2), rgba(var(--com-accent-rgb),.05)); border-color: rgba(var(--com-accent-rgb),.55); box-shadow: 0 0 0 1px rgba(var(--com-accent-rgb),.35), 0 0 6px rgba(var(--com-accent-rgb),.22); }
    .typing-cursor { display: inline-block; width: 6px; background: var(--com-accent); margin-left: 2px; animation: blink 1s steps(1,end) infinite; height: 11px; position: relative; top: 1px; }
    @keyframes blink { 0%,50% { opacity: 1 } 50.01%,100% { opacity: 0 } }
  #cl-options { position: absolute; bottom: 0; left: 0; right: 0; max-height: 42%; overflow-y: auto; padding: 8px 10px 10px; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; background: linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.45)); border-top: 1px solid #0c2e25; }
  #cl-options::-webkit-scrollbar { width: 5px; }
  #cl-options::-webkit-scrollbar-thumb { background: rgba(var(--com-accent-rgb),.35); border-radius: 3px; }
  .cl-opt-btn { cursor: pointer; border: 1px solid rgba(var(--com-accent-rgb),.5); background: rgba(var(--com-accent-rgb),.12); color: var(--com-text); font-family: var(--com-font); font-size: 11px; padding: 5px 10px 5px; line-height: 1.15; border-radius: 5px; letter-spacing: .6px; text-transform: none; transition: background .25s, color .25s, border-color .25s, transform .2s; width: auto; max-width: 100%; text-align: right; align-self: flex-end; }
  .cl-opt-btn:hover:not([disabled]) { background: rgba(var(--com-accent-rgb),.24); transform: translateX(-2px); }
    .cl-opt-btn:hover:not([disabled]) { background: rgba(var(--com-accent-rgb),.22); }
    .cl-opt-btn:disabled { opacity: .4; cursor: default; }
  `

  // --- Utility ---
  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight
  }

  function createMsg(role, text) {
    const wrap = document.createElement('div')
    wrap.className = `cl-msg ${role}`
    const bubble = document.createElement('div')
    bubble.className = 'cl-bubble'
    bubble.textContent = text
    wrap.appendChild(bubble)
    messagesEl.appendChild(wrap)
    scrollToBottom()
    return bubble
  }

  let typing = false
  async function typeMsg(role, text) {
    const wrap = document.createElement('div')
    wrap.className = `cl-msg ${role}`
    const bubble = document.createElement('div')
    bubble.className = 'cl-bubble'
    wrap.appendChild(bubble)
    messagesEl.appendChild(wrap)
    const cursor = document.createElement('span')
    cursor.className = 'typing-cursor'
    typing = true
    for (let i = 0; i < text.length; i++) {
      bubble.textContent += text[i]
      if (i === text.length - 1) {
        // completed
      }
      if (i % 2 === 0) bubble.appendChild(cursor)
      scrollToBottom()
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 25))
      if (cursor.parentNode) cursor.remove()
    }
    typing = false
    scrollToBottom()
  }

  function clearOptions() {
    optionsEl.innerHTML = ''
  }
  function setOptions(list) {
    clearOptions()
    list.forEach((opt) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'cl-opt-btn'
      btn.textContent = opt.label
      btn.addEventListener('click', () => selectOption(opt))
      optionsEl.appendChild(btn)
    })
  }

  async function runNode(key) {
    const node = COM_TREE[key]
    if (!node) return
    // If restart -> special behaviour
    if (key === 'restart') {
      createMsg(
        'system',
        typeof node.text === 'string' ? node.text : node.text[0]
      )
      setTimeout(() => runNode('start'), 400)
      setOptions([])
      return
    }
    // Display system message(s)
    const texts = Array.isArray(node.text) ? node.text : [node.text]
    for (let i = 0; i < texts.length; i++) {
      await typeMsg('system', texts[i])
    }
    if (node.options && node.options.length) setOptions(node.options)
    else setOptions([{ label: 'Neustart', next: 'restart' }])
  }

  async function selectOption(opt) {
    if (typing) return // Disable current buttons
    ;[...optionsEl.querySelectorAll('button')].forEach(
      (b) => (b.disabled = true)
    )
    createMsg('user', opt.label)
    await new Promise((r) => setTimeout(r, 120))
    runNode(opt.next)
  }

  function startConversation() {
    if (conversationStarted) return
    conversationStarted = true
    runNode('start')
  }

  function toggleChat() {
    const expanded = chatBox.classList.toggle('expanded')
    chatBox.style.height =
      (expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT) + 'px'
    chatBox.setAttribute('aria-expanded', String(expanded))
    header.setAttribute('aria-expanded', String(expanded))
    if (expanded) startConversation()
  }
  header.addEventListener('click', toggleChat)
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleChat()
    }
  })
}

injectChat()
