(function () {
  function parseTsUnion(typeStr) {
    if (!typeStr || typeStr.indexOf('|') === -1) return null
    var parts = typeStr.split('|').map(function (p) { return p.trim() })
    var values = []
    for (var i = 0; i < parts.length; i++) {
      var m = parts[i].match(/^'([^']*)'$/) || parts[i].match(/^"([^"]*)"$/)
      if (!m) return null
      values.push(m[1])
    }
    return values.length ? values : null
  }

  function isBooleanType(typeStr) {
    if (!typeStr) return false
    return /^(boolean|Boolean)(\s*\|\s*null)?$/.test(typeStr.trim())
  }

  function coerceDefault(raw) {
    if (raw === undefined || raw === null || raw === 'null' || raw === 'undefined') return null
    var s = String(raw).trim()
    if (s === 'true') return true
    if (s === 'false') return false
    var m = s.match(/^'(.*)'$/) || s.match(/^"(.*)"$/)
    if (m) return m[1]
    if (/^-?\d+(\.\d+)?$/.test(s)) return s
    return null // complex default (function/object) — not usable as a control seed
  }

  function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  }

  function buildCode(tagName, controls, values) {
    var parts = [tagName]
    controls.forEach(function (c) {
      var v = values[c.name]
      if (c.kind === 'boolean') {
        if (v) parts.push(c.name)
      } else if (v !== '' && v !== null && v !== undefined) {
        parts.push(c.name + '="' + v + '"')
      }
    })
    return '<' + parts.join(' ') + '>…</' + tagName + '>'
  }

  function init() {
    var body = document.body
    var chemin = body.getAttribute('data-chemin')
    var tagName = body.getAttribute('data-tagname')
    if (!chemin || !window.PLAYGROUND_PROPS || !window.PLAYGROUND_PROPS[chemin]) return

    var propsList = window.PLAYGROUND_PROPS[chemin]
    var overrides = (window.PLAYGROUND_OVERRIDES && window.PLAYGROUND_OVERRIDES[chemin]) || {}
    var recipe = window.PLAYGROUND_RECIPES && window.PLAYGROUND_RECIPES[chemin]

    var controls = []
    propsList.forEach(function (p) {
      if (overrides[p.name]) {
        controls.push({ name: p.name, kind: 'enum', values: overrides[p.name], default: coerceDefault(p.default) })
      } else if (isBooleanType(p.type)) {
        controls.push({ name: p.name, kind: 'boolean', default: coerceDefault(p.default) === true })
      } else {
        var union = parseTsUnion(p.type)
        if (union) {
          controls.push({ name: p.name, kind: 'enum', values: union, default: coerceDefault(p.default) })
        } else if (p.isText) {
          controls.push({ name: p.name, kind: 'text', default: coerceDefault(p.default) })
        }
      }
    })

    if (!controls.length) return

    var section = document.getElementById('playground-section')
    var controlsEl = document.getElementById('playground-controls')
    var previewEl = document.getElementById('playground-preview')
    var codeEl = document.getElementById('playground-code')
    if (!section || !controlsEl) return
    section.style.display = ''

    var values = {}
    controls.forEach(function (c) { values[c.name] = c.default })

    controls.forEach(function (c) {
      var wrap = document.createElement('label')
      wrap.className = 'pg-control'
      var span = document.createElement('span')
      span.textContent = c.name
      wrap.appendChild(span)

      if (c.kind === 'boolean') {
        var input = document.createElement('input')
        input.type = 'checkbox'
        input.checked = !!c.default
        input.addEventListener('change', function () {
          values[c.name] = input.checked
          render()
        })
        wrap.appendChild(input)
      } else if (c.kind === 'enum') {
        var select = document.createElement('select')
        c.values.forEach(function (val) {
          var opt = document.createElement('option')
          opt.value = val
          opt.textContent = val === '' ? '(défaut)' : val
          if (val === c.default) opt.selected = true
          select.appendChild(opt)
        })
        select.addEventListener('change', function () {
          values[c.name] = select.value
          render()
        })
        wrap.appendChild(select)
      } else if (c.kind === 'text') {
        var text = document.createElement('input')
        text.type = 'text'
        text.value = c.default || ''
        text.addEventListener('input', function () {
          values[c.name] = text.value
          render()
        })
        wrap.appendChild(text)
      }
      controlsEl.appendChild(wrap)
    })

    function render() {
      if (codeEl) codeEl.textContent = buildCode(tagName, controls, values)
      if (previewEl && recipe) {
        try {
          previewEl.innerHTML = recipe(values)
        } catch (e) {
          previewEl.textContent = 'Erreur de rendu de la recette : ' + e.message
        }
      }
    }

    render()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
