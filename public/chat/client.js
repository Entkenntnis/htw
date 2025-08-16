// Chat Client

console.log('Hello, this is the chat client ...')

function injectChat() {
  // Create container
  const chatContainer = document.createElement('div')
  chatContainer.id = 'chat-container'

  // Inject styles (scoped via ids/classes used below)
  const style = document.createElement('style')
  style.textContent = `
    #chat-box {
  position: fixed;
  right: 24px;
  bottom: 0;
      width: 300px;
  height: 42px; /* collapsed height */
      background: #838383ff;
      border: 1px solid #ccc;
      border-bottom: none;
      border-radius: 5px 5px 0 0;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      overflow: hidden;
      font-family: system-ui, sans-serif;
      color: #111;
  transition: height 0.4s ease;
      box-sizing: border-box;
    }
    #chat-box.expanded {
  height: 560px;
    }
    #chat-box-header {
      position: relative;
      padding: 6px 28px 6px 10px;
      cursor: pointer;
      user-select: none;
      font-weight: 600;
    }
    #chat-box-toggle-indicator {
      position: absolute;
      right: 8px;
      top: 6px;
      font-weight: 700;
      transition: transform 0.3s ease;
    }
    #chat-box.expanded #chat-box-toggle-indicator { transform: rotate(45deg); }
    #chat-box-content {
      display: none; /* Empty container for now */
      width: 100%;
      height: calc(100% - 42px);
      background: #fafafa;
    }
    #chat-box.expanded #chat-box-content { display: block; }
  `

  document.head.appendChild(style)

  chatContainer.innerHTML = `
    <div id="chat-box">
      <div id="chat-box-header">Chat mit Kiwi <span id="chat-box-toggle-indicator">+</span></div>
      <div id="chat-box-content"></div>
    </div>
  `

  document.body.appendChild(chatContainer)

  // Toggle logic
  const chatBox = chatContainer.querySelector('#chat-box')
  const header = chatContainer.querySelector('#chat-box-header')
  const COLLAPSED_HEIGHT = 42
  const EXPANDED_HEIGHT = 560

  header.addEventListener('click', () => {
    if (chatBox.classList.contains('expanded')) {
      chatBox.classList.remove('expanded')
      chatBox.style.height = COLLAPSED_HEIGHT + 'px'
    } else {
      chatBox.classList.add('expanded')
      chatBox.style.height = EXPANDED_HEIGHT + 'px'
    }
  })
}

injectChat()
