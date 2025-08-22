function showSource() {
  // If already open, do nothing
  if (document.getElementById('source-overlay')) return

  const htmlSource = (function () {
    const docType = document.doctype
    let dt = ''
    if (docType) {
      dt = `<!DOCTYPE ${docType.name}${docType.publicId ? ' PUBLIC "' + docType.publicId + '"' : ''}${docType.systemId ? ' "' + docType.systemId + '"' : ''}>\n`
    }
    return dt + document.documentElement.outerHTML
  })()

  const overlay = document.createElement('div')
  overlay.id = 'source-overlay'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-label', 'Seitenquelltext')
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:999999',
    'background:rgba(0,0,0,.85)',
    'backdrop-filter:blur(3px)',
    'display:flex',
    'flex-direction:column',
    'padding:40px 50px 50px',
    'box-sizing:border-box',
    'font-family:Consolas,monospace',
    'color:#222',
  ].join(';')

  const inner = document.createElement('div')
  inner.style.cssText = [
    'position:relative',
    'flex:1',
    'background:#f7f7f7',
    'border:1px solid #444',
    'border-radius:10px',
    'box-shadow:0 4px 25px rgba(0,0,0,.5)',
    'overflow:hidden',
    'display:flex',
    'flex-direction:column',
  ].join(';')

  const header = document.createElement('div')
  header.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'padding:10px 14px',
    'background:linear-gradient(#ffffff,#e7e7e7)',
    'border-bottom:1px solid #ccc',
    'font-weight:600',
    'font-size:14px',
    'letter-spacing:.5px',
  ].join(';')
  header.textContent = 'Seitenquelltext'

  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.setAttribute('aria-label', 'Schließen (Esc)')
  closeBtn.textContent = '×'
  closeBtn.style.cssText = [
    'cursor:pointer',
    'border:none',
    'background:transparent',
    'color:#333',
    'font-size:26px',
    'line-height:1',
    'padding:0 6px 4px',
    'margin:0',
    'font-family:inherit',
    'transition:color .15s ease',
  ].join(';')
  closeBtn.onmouseenter = () => (closeBtn.style.color = '#d00')
  closeBtn.onmouseleave = () => (closeBtn.style.color = '#333')

  const bodyWrap = document.createElement('div')
  bodyWrap.style.cssText = [
    'flex:1',
    'overflow:auto',
    'padding:16px',
    'font-size:16px',
    'line-height:1.4',
    'tab-size:2',
    'white-space:pre',
    'background:#1e1e1e',
    'color:#d6d6d6',
    'text-shadow:none',
  ].join(';')

  const pre = document.createElement('pre')
  pre.style.cssText = [
    'margin:0',
    'font-family:inherit',
    'white-space:pre-wrap',
    'word-break:break-word',
  ].join(';')
  pre.textContent = htmlSource
  bodyWrap.appendChild(pre)

  function close() {
    window.removeEventListener('keydown', onKey)
    overlay.remove()
  }
  function onKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    }
  }
  window.addEventListener('keydown', onKey)
  closeBtn.addEventListener('click', close)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close()
  })

  header.appendChild(closeBtn)
  inner.appendChild(header)
  inner.appendChild(bodyWrap)
  overlay.appendChild(inner)
  document.body.appendChild(overlay)
  // Focus for accessibility
  closeBtn.focus()
}

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
      options: [
        { label: 'Das ist ok.', next: 'fallback' },
        {
          label:
            'Wo ein Wille, das ist ein Weg! Ich möchte es trotzdem alleine versuchen',
          next: 'fight',
        },
      ],
    },
    fight: {
      text: [
        'Im Chrome kannst du "view-source:" vor den Link schreiben.',
        'Für Apple-Geräte gibt es einen anderen Trick, den du am besten mit "website source ipad/iphone" findest.',
        'Viel Glück!',
      ],
      options: [{ label: 'Ich versuch mein Bestes.', next: 'entry' }],
    },
  },
}
