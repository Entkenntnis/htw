function goBack(event, url) {
  if (document.referrer && document.referrer.includes(url)) {
    window.history.back()
    // on js heavy pages, this may take some time
    event.preventDefault()
    setTimeout(() => {
      // Fallback in case history.back() fails
      if (document.location.pathname !== url) {
        window.location.href = url
      }
    }, 400)
  } else {
    window.location.href = url
  }
}

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
    'padding:16px',
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

window.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('go-here-after-loading-map')
  if (mapEl) {
    mapEl.scrollIntoView({ block: 'center', inline: 'center' })
  }
})

function getLng() {
  return document.documentElement.lang === 'en' ? 'en' : 'de'
}

function loadXRay() {
  ;(function () {
    const script = document.createElement('script')
    script.src = '/webxray/webxray.js'
    script.className = 'webxray'
    script.setAttribute('data-lang', 'en-US')
    script.setAttribute('data-baseuri', document.location.origin + '/webxray')
    document.body.appendChild(script)
  })()
}
