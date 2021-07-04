class YTPlayer {
    constructor(game) {
        this.game = game
        this.player = this.initPlayer()
    }

    initPlayer() {
        return new window.YT.Player('video-placeholder', {
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
    } 

    onPlayerStateChange(event) {
        if(event.data == YT.PlayerState.BUFFERING) {
            this.game.emit("buffering")
        }
    }

    initialize() {
        console.log("YTPlayer Ready")
    }

    load(id) {
        this.player.loadVideoById(id, getRndInteger(0,30), "default")
    }
    
    play() {
        this.player.playVideo();
    }

    stop() {
        this.player.stopVideo()
    }

    pause() {
        this.player.pauseVideo()
    }
}