let socket = io()

var player;

document.addEventListener('DOMContentLoaded', () => {

    window.YT.ready(function() {
        
        const Game = new GameManager()
        const Player = new YTPlayer(initPlayer())
        const Modale = new ModaleManager()
        const Playlist = new PlaylistManager(Game)
        const Sections = new SectionsManager(Game)

        Game.start()
        // let button = document.querySelector('.findPlaylist')
        // let input = document.querySelector('input')
        // button.addEventListener('click', () => {
        //     createLoader()
        //     socket.emit('findPlaylist', input.value)
        // })

        Game.on('getSong', song => {
            //console.log(song)
            //removeLoader()
            //console.log(song)
            let id = song.url.split("=")[1]
            Player.stop()
            Player.load(id)
            Player.play()
            //initPlayer(id[1])
        })

    /* socket.on('getPlaylist', res => {
            let content = document.querySelector('.playlist')
            content.innerHTML = ""
            _('h1', content, res.name)    
        })*/

        Game.on('getPlaylist', res => {
            //removeLoader()
            console.log("pl")
            Playlist.playlistResults(res)
        })
    })
})

 function initPlayer(id) {

    return new window.YT.Player('video-placeholder', {
        width: 0,
        height: 0,
       // videoId: id,
        playerVars: {
            color: 'white',
        },
        events: {
            onReady: initialize
        }
    });
}
/*
function initialize(){
    player.playVideo();
} */

function initialize() {

}

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