class Note {
  constructor (_conitaner) {
    // Global
    this.currentNote = null
    this.backgroundColor = '#fff'
    this.font = 'Times New Roman'
    this.text = document.querySelector('#text')
    this.title = document.querySelector('#title')
    this.conitaner = document.querySelector(_conitaner)
    document.querySelectorAll('[data-color]').forEach(elem => {
      const color = elem.dataset.color
      elem.style.backgroundColor = color
      elem.addEventListener('click', () => this.setColor(color))
    })
    // Variable
    const btnFont = this.conitaner.querySelector('#font')
    const btnAdd = this.conitaner.querySelector('#add')
    const btnsave = this.conitaner.querySelector('#save')
    const btnClear = this.conitaner.querySelector('#clear')
    const btnDelete = this.conitaner.querySelector('#delete')
    const inputColor = this.conitaner.querySelector('#custom-color')
    // Event Listener
    btnFont.addEventListener('change', () => {
      this.font = btnFont.options[btnFont.selectedIndex].value
      this.title.style.fontFamily = this.font
      this.text.style.fontFamily = this.font
    })
    btnsave.addEventListener('click', this.save.bind(this))
    btnClear.addEventListener('click', this.clear.bind(this))
    btnDelete.addEventListener('click', this.delete.bind(this))
    btnAdd.addEventListener('click', () => {
      this.validation()
        ? this.addTolocalStorage()
        : Swal.fire('Please Enter at one character!', '', 'error')
    })
    inputColor.addEventListener('input', event =>this.setColor(event.target.value))
    // resive all item localStorage and show
    this.appendToBody()
  }
  save () {
    console.log(this.validation());
    this.currentNote !== null && this.validation()
      ? this.addTolocalStorage(this.currentNote)
      : Swal.fire('Please Enter at one character!', '', 'error')
    this.currentNote = null
    this.appendToBody()
    this.clear()
  }
  delete () {
    this.currentNote !== null && localStorage.removeItem(this.currentNote)
    this.currentNote = null
    this.appendToBody()
    this.clear()
  }
  clear () {
    this.title.value = ''
    this.text.value = ''
    this.setColor('#fff')
  }
  validation () {
    if (this.title.value.length != 0 && this.text.value.length != 0) {
      return true
    }
    return false
  }
  addTolocalStorage (index) {
    if (index == null) index = this.calcIndex.apply(this)
    const note = {
      index,
      font: this.font,
      date: new Date(),
      text: this.text.value,
      title: this.title.value,
      backgroundColor: this.backgroundColor
    }
    localStorage.setItem(index, JSON.stringify(note))
    this.setColor('#fff')
    this.appendToBody()
  }
  calcIndex () {
    for (let index = 0; index < 1000; index++)
      if (localStorage.getItem(index) == null) return index
  }
  getDataLocalStorage () {
    let values = [],
      keys = Object.keys(localStorage),
      i = keys.length
    while (i--) {
      values.push(JSON.parse(localStorage.getItem(keys[i])))
    }
    return values
  }
  appendToBody () {
    const getAllitemLocalStorage = this.getDataLocalStorage()
    const template = document.querySelector('#New-note')
    const wrapper = this.conitaner.querySelector('.all-note')
    if (wrapper.children.length !== 0) {
      wrapper.innerHTML = ''
    }
    getAllitemLocalStorage
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(sourse => {
        const item = template.content.cloneNode(true).firstElementChild
        item.dataset.index = sourse.index
        item.innerHTML = item.innerHTML.replace(/{(\w+)}/g, (_, key) => {
          switch (true) {
            case key == 'title':
              return sourse.title
            case key == 'text':
              return sourse.text
            case key == 'time':
              return String(new Date(sourse.date)).split(' ')[4]
            case key == 'background':
              return sourse.backgroundColor
            case key == 'font':
              return sourse.font
          }
        })
        wrapper.appendChild(item)
        item.addEventListener('click', () => this.showNote(sourse.index))
      })
  }
  showNote (indexItem) {
    const { title, text, index, backgroundColor, font } = JSON.parse(localStorage.getItem(indexItem))
    this.title.value = title
    this.text.value = text
    this.text.style.fontFamily = font
    this.title.style.fontFamily = font
    this.setColor(backgroundColor)
    this.currentNote = index
  }
  setColor (color) {
    this.backgroundColor = color
    this.text.style.backgroundColor = color
    this.title.style.backgroundColor = color
  }
  createElement (tag = 'div', html = '', classlist = '') {
    const elem = document.createElement(tag)
    elem.className = classlist
    elem.innerHTML = html
    return elem
  }
}
new Note('.container')
