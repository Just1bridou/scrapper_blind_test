let socket = io()

var player;

document.addEventListener('DOMContentLoaded', () => {

    window.YT.ready(function() {
        
        const Game = new GameManager()
        const Player = new YTPlayer(Game)
        const Modale = new ModaleManager()
        const Playlist = new PlaylistManager(Game)
        const Sections = new SectionsManager(Game)

        Game.start()

        Game.on("skipMusic", data => {
            Player.stop()
            console.log(data)

            let content = _("div")
            _("h3", content, data.artist + " - " + data.name)
            _("button", content, "report")

            console.log(data.closeAfter)

            Modale.newModale({
                title: "La musique etait : ",
                description: content,
                closeButton: false,
                closeAfter: data.closeAfter
            })
        })

        Game.on('getSong', url => {
            let id = url.split("=")[1]
            
            // Player.stop()
            Player.load(id)
            Player.pause()
        })

        Game.on('playerPlay', data => {
            Player.play()
        })

        Game.on("newModaleConnection", data => {
            Sections.newModalConnect()
        })

        Game.on('startGame', name => {
            Sections.transition("waitingRoom", "inGame")
            Sections.sections["inGame"].init()
            Sections.sections["inGame"].setPlaylistName(name)
        })
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