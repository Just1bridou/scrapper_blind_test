'use strict';

module.exports = class Room {
    constructor() {
        this.code = this.generateRoomToken()
        this.playersList = []
        this.socketsList = []

        this.playlist = null
        this.liveMusic = {
            buffer: [],
            toPlay: [],
            live: [],
            chat: []
        }
    }

    checkResponse(str) {
        if(str == this.liveMusic.live.music.name) {
            this.liveMusic.live.music.find = true
        } else if(str == this.liveMusic.live.artist.name) {
            this.liveMusic.live.artist.find = true
        }
    }

    allIsFind() {
        return (this.liveMusic.live.music.find && this.liveMusic.live.artist.find)
    }

    createMusic() {
        for(let music of this.playlist.songs) {
            if(music.url != null) {
                this.liveMusic.toPlay.push(music.id)
            }
        }
    }

    setRandomMusic() {
        let randomMusic = this.playlist.songs[this.getRandomMusicId()]
        this.liveMusic.live.artist = {name: randomMusic.artist, find: false}
        this.liveMusic.live.music = {name: randomMusic.name, find: false}
        this.liveMusic.live.fullMusic = randomMusic

        console.log(this.liveMusic)
    }

    getRandomMusicId() {
        let id = this.liveMusic.toPlay[getRndInteger(0, this.liveMusic.toPlay.length)]
        let index = this.liveMusic.toPlay.indexOf(id);
        this.liveMusic.toPlay.splice(index, 1);
        return id
    }

    createBuffer() {
        for(let player of this.playersList) {
            this.liveMusic.buffer[player.uuid] = false
        }
    }

    resetBuffer() {
        for(let player of this.playersList) {
            this.liveMusic.buffer[player.uuid] = false
        }
    }

    readyBuffer(uuid) {
        this.liveMusic.buffer[uuid] = true
    }

    checkAllBuffer() {
        for(let player of this.playersList) {
            if(!this.liveMusic.buffer[player.uuid])
                return false
        }
        return true
    }

    checkAllReady() {
        for(let player of this.playersList) {
            if(!player.ready)
                return false
        }
        return true
    }
    
    addPlayer(player, socket) {
        this.playersList.push(player)
        this.socketsList[player.uuid] = socket
    }

    generateRoomToken() {
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    playersEvent(name, data = null) {
        for(let player of this.playersList) {
            this.socketsList[player.uuid].emit(name, data)
        }
    }
}
  
function getRndInteger(min, max) {
return Math.floor(Math.random() * (max - min) ) + min;
}