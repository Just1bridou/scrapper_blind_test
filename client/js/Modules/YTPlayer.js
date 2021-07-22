class YTPlayer {
    constructor(game) {
        this.game = game
        this.player = this.initPlayer()
        this.init()
    }

    initPlayer() {
        let player = new window.YT.Player('video-placeholder', {
            width: 0,
            height: 0,
           // videoId: id,
            playerVars: {
                color: 'white',
            },
            events: {
                onReady: this.initialize,
                onStateChange: (e) => {
                    this.onPlayerStateChange(e)
                }
            }
        });

        return player
    } 

    onPlayerStateChange(event) {
        if(event.data == YT.PlayerState.BUFFERING) {
            this.game.emit("BUFFERING")
        }
    }

    initialize() {
        console.log("YTPlayer Ready")
    }

    init() {
        //this.player.setVolume(50)

        this.game.on("changeSoundPlayer", volume => {
            console.log(volume)
            this.player.setVolume(volume)
            console.log(this.player.getVolume())
        })
    }

    load(id) {
        this.player.loadVideoById(id, 5/*getRndInteger(0,30)*/, "default")
    }
    
    play() {
        this.player.unMute();
        this.player.playVideo();
    }

    stop() {
        this.player.stopVideo()
    }

    pause() {
        this.player.pauseVideo()
    }
}