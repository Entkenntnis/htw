// AI GENERATED
// Chat implementation for challenge 21
// Requirements:
// - POST to /chal/chal21/complete with previous user/assistant messages
// - Response format: OK:<assistant message>; otherwise treat as error (alert)
// - Maintain full convo (user + assistant) client-side only (no persistence)
// - Block parallel requests
// - Typewriter effect for assistant reply
// - German UI, dark theme handled via styles.css

;(function () {
  const state = { messages: [], inFlight: false }

  // DOM creation / bootstrap
  const chatRoot = document.getElementById('chat') || createRoot()

  function createRoot() {
    const el = document.createElement('div')
    el.id = 'chat'
    document.body.appendChild(el)
    return el
  }

  // If structure not present, build it.
  let messagesList = chatRoot.querySelector('#messages')
  let form = chatRoot.querySelector('#chat-form')
  let input = chatRoot.querySelector('#chat-input')
  let sendBtn = chatRoot.querySelector('#chat-send')

  if (!messagesList) {
    messagesList = document.createElement('ul')
    messagesList.id = 'messages'
    chatRoot.appendChild(messagesList)
  }
  if (!form) {
    form = document.createElement('form')
    form.id = 'chat-form'
    form.autocomplete = 'off'
    form.innerHTML = `
			<input id="chat-input" type="text" placeholder="Frage stellen…" aria-label="Nachricht eingeben" />
			<button id="chat-send" type="submit">Senden</button>
		`
    chatRoot.appendChild(form)
  }
  if (!input)
    input = /** @type {HTMLInputElement} */ (form.querySelector('#chat-input'))
  if (!sendBtn) sendBtn = form.querySelector('#chat-send')

  // Optional initial assistant greeting (no typewriter)
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.greeting === 'string' &&
      window.greeting.trim()
    ) {
      const greet = window.greeting.trim()
      const greetMsg = { role: 'assistant', content: greet }
      state.messages.push(greetMsg)
      renderMessage(greetMsg)
      scrollToBottom(true)
    }
  } catch (_) {
    // ignore
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (state.inFlight) return
    const value = input.value.trim()
    // Echo user message
    const userMsg = { role: 'user', content: value }
    state.messages.push(userMsg)
    renderMessage(userMsg)
    input.value = ''
    input.focus()
    scrollToBottom()
    sendConversation()
  })

  function setDisabled(disabled) {
    input.disabled = disabled
    sendBtn.disabled = disabled
  }

  /** @param {{role:'user'|'assistant', content:string}} msg */
  function renderMessage(msg) {
    const li = document.createElement('li')
    li.className = 'msg ' + msg.role
    li.textContent = msg.content
    messagesList.appendChild(li)
    return li
  }

  function renderAssistantPlaceholder() {
    const li = document.createElement('li')
    li.className = 'msg assistant typing'
    messagesList.appendChild(li)
    scrollToBottom()
    return li
  }

  function scrollToBottom(force = false) {
    // Auto-scroll if user is near bottom or forced
    const threshold = 120
    const delta =
      messagesList.scrollHeight -
      messagesList.scrollTop -
      messagesList.clientHeight
    if (force || delta < threshold) {
      messagesList.scrollTop = messagesList.scrollHeight
    }
  }

  function sendConversation() {
    state.inFlight = true
    setDisabled(true)
    const placeholder = renderAssistantPlaceholder()
    const payload = {
      messages: state.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }

    fetch(window.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const text = await res.text()
        if (!res.ok || !text.startsWith('OK:')) {
          throw new Error(text || 'Unbekannter Fehler')
        }
        let assistant = text.slice(3).trim()
        const msg = { role: 'assistant', content: assistant }
        // add to state before typewriter so consistent with future context
        state.messages.push(msg)
        typeWriter(assistant, placeholder, () => {
          placeholder.classList.remove('typing')
          placeholder.textContent = assistant
          scrollToBottom(true)
          // Re-enable input only after typing completed
          state.inFlight = false
          setDisabled(false)
          input.focus()
        })
      })
      .catch((err) => {
        placeholder.remove()
        alert('Fehler: ' + err.message)
        // Error: allow new input
        state.inFlight = false
        setDisabled(false)
        input.focus()
      })
  }

  /** Typewriter effect */
  function typeWriter(text, el, onDone) {
    el.textContent = ''
    let i = 0
    let baseDelay = 24
    function step() {
      if (i >= text.length) {
        onDone && onDone()
        return
      }
      el.textContent += text[i]
      i++
      // accelerate after 120 chars
      const delay = i < 120 ? baseDelay : 8
      if (i % 12 === 0) scrollToBottom()
      setTimeout(step, delay)
    }
    step()
  }

  // Allow pressing Escape to focus input if needed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') input.focus()
  })
})()
