let socket = io()

document.addEventListener('DOMContentLoaded', () => {
    let button = document.querySelector('.findPlaylist')
    let input = document.querySelector('input')
    button.addEventListener('click', () => {
        createLoader()
        socket.emit('findPlaylist', input.value)
    })

    socket.on('getSong', song => {
        removeLoader()
        console.log(song)
    })
})

function createLoader() {
    let content = _('div', document.body, null, null, "loaderModale")
    _('div', content, null, null, "loaderModaleContent")
}

function removeLoader() {
    let loader = document.querySelector('.loaderModale')
    if(loader) {
        loader.remove()
    }
}

function createPlaylist(list) {
    console.log(list)
    let content = document.querySelector('.playlist')

    content.innerHTML = ""

    _('h1', content, list.name)
    let listUL = _('ul', content)

    for(let song of list.musics) {
        _('li', listUL, song.name)
    }
}

function _(tag, parent, text=null,  id=null, classs=null) {
	let element = document.createElement(tag)
	if (text)
		element.appendChild(document.createTextNode(text))
	parent.appendChild(element)
	if (id)
		element.id = id
	if (classs)
		element.classList.add(classs)
	return element
}