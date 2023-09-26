initSqlJs().then(function(SQL){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/chals/chal98.db', true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = _ => {
    const uInt8Array = new Uint8Array(xhr.response)
    const db = new SQL.Database(uInt8Array)
    
    const button = document.getElementById('runner')
    button.className = ''
    
    function handler() {
      text = document.getElementById('value')
      const isGerman = navigator.language.startsWith('de')
      const sql = isGerman?"SELECT * FROM Geheimnis WHERE schlüssel='" + text.value + "';":"SELECT * FROM Secret WHERE key='" + text.value + "';"
      try {
        const output = db.exec(sql)
        document.getElementById('output').innerHTML = JSON.stringify(output, 0, 2)
      } catch (e) {
        document.getElementById('output').innerHTML = e.toString()
      }
    }
    
    button.addEventListener('click', handler)
    
    const input = document.getElementById("value")
    input.addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        handler()
      }
    })
  }
  xhr.send()
})
