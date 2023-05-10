initSqlJs().then(function(SQL){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/chals/chal98.db', true)
  xhr.responseType = 'arraybuffer'

  xhr.onload = e => {
    const uInt8Array = new Uint8Array(xhr.response)
    const db = new SQL.Database(uInt8Array)
    
    const button = document.getElementById('runner')
    button.className = ''
    
    function handler() {
      text = document.getElementById('value')
      const sql = "SELECT * FROM Geheimnis WHERE schlüssel='" + text.value + "';"
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
