;(() => {
  // parse URL like http://localhost:3000/challenge/1 and extract the challenge ID
  const url = new URL(window.location.href)
  const challengeId = parseInt(url.pathname.split('/').pop())

  const DATA = COM_TREE[challengeId]
  if (!DATA) {
    return // not available for this challenge
  }

  // TODO: maybe restore conversation later on ...

  injectChat()
  container = document.getElementById('comlink')
  header = document.getElementById('comlink-header')

  let messagesStarted = false
  let typing = false

  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true'
    if (!isExpanded && !messagesStarted) {
      runMessage('start')
      messagesStarted = true
    }
    header.setAttribute('aria-expanded', !isExpanded)
    container.classList.toggle('expanded', !isExpanded)
  })

  msgEl = document.getElementById('comlink-messages')
  optionsEl = document.getElementById('comlink-options')

  // ============================================================

  function injectChat() {
    const chatContainer = document.createElement('div')
    chatContainer.id = 'chat-container'

    chatContainer.innerHTML = `
      <div id="comlink" role="dialog" aria-labelledby="comlink-header" aria-describedby="comlink-content">
        <div id="comlink-header" role="button" tabindex="0" aria-label="Toggle COM-LINK" aria-expanded="false">
          <span class="led" aria-hidden="true"></span>
          <span id="comlink-title-text">COM-LINK&nbsp;&nbsp;<span id="comlink-character">KIWI</span></span>
          <svg id="comlink-toggle" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round" stroke="currentColor"/>
            <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke="currentColor" />
          </svg>
        </div>
        <div id="comlink-content" role="region" aria-live="polite" aria-label="Conversation with KIWI">
          <div id="comlink-messages"></div>
          <div id="comlink-options" aria-label="Response Options"></div>
        </div>
      </div>
    `
    document.body.appendChild(chatContainer)
  }

  async function runMessage(key) {
    const message = DATA.messages[key]
    if (!message) {
      return
    }
    // Allow message.text to be either a single string or an array of strings
    const texts = Array.isArray(message.text) ? message.text : [message.text]
    for (const t of texts) {
      if (typeof t !== 'string') continue
      await typeMsg('system', t)
    }

    if (message.next) {
      // if message has a next key, run that message
      await new Promise((r) => setTimeout(r, 300))
      runMessage(message.next)
      return
    }

    await new Promise((r) => setTimeout(r, 150))
    setOptions(message.options)
  }

  async function typeMsg(role, text) {
    const wrap = document.createElement('div')
    wrap.className = `comlink-msg ${role}`
    const bubble = document.createElement('div')
    bubble.className = 'comlink-bubble'
    wrap.appendChild(bubble)
    msgEl.appendChild(wrap)
    typing = true
    for (let i = 0; i < text.length; i++) {
      bubble.textContent += text[i]
      scrollToBottom()
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 25))
    }
    typing = false
    scrollToBottom()
  }

  function scrollToBottom() {
    msgEl.scrollTop = msgEl.scrollHeight
  }
  function clearOptions() {
    optionsEl.innerHTML = ''
  }

  function setOptions(list) {
    clearOptions()
    list.forEach((opt) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'comlink-opt-btn'
      btn.textContent = opt.label
      btn.addEventListener('click', () => selectOption(opt))
      optionsEl.appendChild(btn)
    })
    scrollToBottom()
  }

  async function selectOption(opt) {
    if (typing) {
      return // ignore if already typing
    }
    clearOptions()
    await typeMsg('user', opt.label)
    runMessage(opt.next)
  }
})()
