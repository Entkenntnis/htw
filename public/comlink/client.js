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

  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true'
    header.setAttribute('aria-expanded', !isExpanded)
    container.classList.toggle('expanded', !isExpanded)
  })

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
})()
