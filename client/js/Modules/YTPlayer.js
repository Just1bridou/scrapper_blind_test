class YTPlayer {
    constructor(player) {
        this.player = player
    }
/* 
    initPlayer() {

        

        return player
    } */

    load(id) {
        this.player.loadVideoById(id, getRndInteger(0,30), "default");
    }
    
    play() {
        this.player.playVideo();
    }

    stop() {
        this.player.stopVideo()
    }
}