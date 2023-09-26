function compare(a, b) {
  let diff = 0
  for (let i = 0; i < 3; i++) {
    diff += Math.abs(a[i]-b[i])
  }
  return diff
}

const result = document.getElementById('result')

function update() {
  document.getElementById('injector').innerHTML = document.getElementById('css-input').value
  const bar1 = colorValues(window.getComputedStyle(document.getElementById('bar1')).backgroundColor)
  const bar2 = colorValues(window.getComputedStyle(document.getElementById('bar2')).backgroundColor)
  const bar3 = colorValues(window.getComputedStyle(document.getElementById('bar3')).backgroundColor)
  const bar4 = colorValues(window.getComputedStyle(document.getElementById('bar4')).backgroundColor)
  const bar5 = colorValues(window.getComputedStyle(document.getElementById('bar5')).backgroundColor)
  const bar6 = colorValues(window.getComputedStyle(document.getElementById('bar6')).backgroundColor)
  const diff1 = compare(bar1, [229, 0, 0])
  const diff2 = compare(bar2, [255, 141, 0])
  const diff3 = compare(bar3, [255, 238, 0])
  const diff4 = compare(bar4, [2, 129, 33])
  const diff5 = compare(bar5, [0, 76, 255])
  const diff6 = compare(bar6, [119, 0, 136])
  const diff = diff1 + diff2 + diff3 + diff4 + diff5 + diff6
  const diffRel = Math.round((diff / 255) * 100)
  result.innerHTML = diffRel <= 100 ? atob(window.atobx) : 'Farben sind leider nicht in der richtigen Reihenfolge. / Colors are not in the right order.'
}

// https://stackoverflow.com/a/44655529
// return array of [r,g,b,a] from any valid color. if failed returns undefined
function colorValues(color)
{
    window.atobx = "RGllIEFudHdvcnQgbGF1dGV0IHByaWRlLg=="
    if (color === '')
        return;
    if (color.toLowerCase() === 'transparent')
        return [0, 0, 0, 0];
    if (color[0] === '#')
    {
        if (color.length < 7)
        {
            // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
        }
        return [parseInt(color.substr(1, 2), 16),
            parseInt(color.substr(3, 2), 16),
            parseInt(color.substr(5, 2), 16),
            color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1];
    }
    if (color.indexOf('rgb') === -1)
    {
        // convert named colors
        var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
        var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
        temp_elem.style.color = flag;
        if (temp_elem.style.color !== flag)
            return; // color set failed - some monstrous css rule is probably taking over the color of our object
        temp_elem.style.color = color;
        if (temp_elem.style.color === flag || temp_elem.style.color === '')
            return; // color parse failed
        color = getComputedStyle(temp_elem).color;
        document.body.removeChild(temp_elem);
    }
    if (color.indexOf('rgb') === 0)
    {
        if (color.indexOf('rgba') === -1)
            color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
        return color.match(/[\.\d]+/g).map(function (a)
        {
            return +a
        });
    }
}

window.onload = update 

//postURL(window.location.href, "answer", btoa(stack[stack.length - 1].myValue + "%secret_word"))

/**
 * Takes a URL and goes to it using the POST method.
 * @param {string} url  The URL with the GET parameters to go to.
 * @param {boolean=} multipart  Indicates that the data will be sent using the
 *     multipart enctype.
 */
function postURL(url, key, val) {
  var form = document.createElement("FORM");
  form.method = "POST";
  form.style.display = "none"
  document.body.appendChild(form)
  form.action = url
  var input = document.createElement("INPUT")
  input.type = "hidden"
  input.name = decodeURIComponent(key)
  input.value = decodeURIComponent(val)
  form.appendChild(input)
  form.submit();
}








