//* initial Variable
let currentNote = null
let backgroundColor = '#fff'
let fontFamily = 'Times New Roman'
let maxCountNote = 1000

//* Element
const container = document.querySelector('.container')
const text = container.querySelector('#text')
const btnAdd = container.querySelector('#add')
const title = container.querySelector('#title')
const btnSave = container.querySelector('#save')
const btnClear = container.querySelector('#clear')
const selectFont = container.querySelector('#font')
const btnDelete = container.querySelector('#delete')
const elemColor = container.querySelector('#colors')
const template = container.querySelector('#New-note')
const wrapper = container.querySelector('.all-note')
const inputColor = container.querySelector('#custom-color')

//* Event Listener
btnSave.addEventListener('click', save)
btnAdd.addEventListener('click', addNote)
btnClear.addEventListener('click', clear)
btnDelete.addEventListener('click', deleteItem)
inputColor.addEventListener('input', e => setColor(e.target.value))
selectFont.addEventListener('change', () =>
  setFont(selectFont.options[selectFont.selectedIndex].value)
)

//* get all fonts in init file and append to body
fonts.map(font => {
  const option = newElement('option', { innerText: font, value: font })
  selectFont.appendChild(option)
})

//* get all colors in init file and append to body
colors.map(color => {
  const span = newElement('span', { dataset: { color } })
  span.style.backgroundColor = color
  elemColor.appendChild(span)
  span.addEventListener('click', () => setColor(color))
})

//* receive all item localStorage and show on Display
appendToBody()



//* Button Add Note => validation & add LocalStorage
function addNote () {
  validation() && addLocalStorage()
}

//* Button save => validation & Refresh DOM
function save () {
  if (currentNote !== null && validation()) {
    addLocalStorage(currentNote)
  }
  currentNote = null
  appendToBody()
  clear()
}

//* Delete Item With index in LocalStorage
function deleteItem () {
  currentNote !== null && localStorage.removeItem(currentNote)
  currentNote = null
  appendToBody()
  clear()
}

//* Go to Default Page
function clear () {
  title.value = ''
  text.value = ''
  setColor('#fff')
}

//* Validation value text & title
function validation () {
  if (title.value.length == 0) {
    Swal.fire('Please enter your title!', '', 'error')
    return false
  } else if (text.value.length == 0) {
    Swal.fire('Please enter your text!', '', 'error')
    return false
  } else {
    Swal.fire('done successfully!', '', 'success')
    return true
  }
}

//* Add information in LocalStorage
function addLocalStorage (index) {
  index ??= emptyItem()
  const note = {
    index,
    fontFamily,
    backgroundColor,
    date: new Date(),
    texts: text.value,
    header: title.value
  }
  localStorage.setItem(index, JSON.stringify(note))
  clear()
  appendToBody()
}

//* get Last Index Item In LocalStorage
function emptyItem () {
  for (let index = 0; index < maxCountNote; index++) {
    if (localStorage.getItem(index) == null) {
      return index
    }
  }
}

//* Get all item LocalStorage
function getDataLocalStorage () {
  let values = [],
    keys = Object.keys(localStorage),
    i = keys.length
  while (i--) {
    values.push(JSON.parse(localStorage.getItem(keys[i])))
  }
  return values
}

//* Refresh DOM
function appendToBody () {
  const allData = getDataLocalStorage()
  if (wrapper.children.length !== 0) {
    wrapper.innerHTML = ''
  }
  allData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach(source => {
      const item = template.content.cloneNode(true).firstElementChild
      item.dataset.index = source.index
      item.innerHTML = item.innerHTML.replace(/{(\w+)}/g, (_, key) => {
        switch (true) {
          case key == 'header':
            return source.header
          case key == 'texts':
            return source.texts
          case key == 'time':
            return String(new Date(source.date)).split(' ')[4]
          case key == 'background':
            return source.backgroundColor
          case key == 'fontFamily':
            return source.fontFamily
        }
      })
      wrapper.appendChild(item)
      item.addEventListener('click', () => showNote(source.index))
    })
}

//* Get note on localStorage & show display
function showNote (indexItem) {
  const { header, texts, index, backgroundColor, fontFamily } = JSON.parse(
    localStorage.getItem(indexItem)
  )
  title.value = header
  text.value = texts
  setColor(backgroundColor)
  setFont(fontFamily)
  currentNote = index
}

//* Set color for Text & title
function setColor (color) {
  backgroundColor = color
  text.style.backgroundColor = color
  title.style.backgroundColor = color
}

//* Set font for Text & title
function setFont (font) {
  fontFamily = font
  title.style.fontFamily = font
  text.style.fontFamily = font
}

//* Create element with special property
function newElement (tag = 'div', property) {
  const elem = document.createElement(tag)
  if (property) {
    Object.keys(property).forEach(key => {
      if (key != 'dataset') {
        elem[key] = property[key]
      } else {
        Object.keys(property[key]).forEach(data => {
          elem[key][data] = property[key][data]
        })
      }
    })
  }
  return elem
}
