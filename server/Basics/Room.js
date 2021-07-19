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

    checkResponse(str, player, cb) {
        str = str.toLowerCase()
        if(str == this.liveMusic.live.music.name && !this.liveMusic.live.music.find) {
            player.score += 60
            this.liveMusic.live.music.find = true
            cb({type: "title", player: player.name, name: this.liveMusic.live.music.name})
        } else if(str == this.liveMusic.live.artist.name && !this.liveMusic.live.artist.find) {
            player.score += 40
            this.liveMusic.live.artist.find = true
            cb({type: "artist", player: player.name, name: this.liveMusic.live.artist.name})
        } else {
            cb(null)
        }
    }

    allIsFind() {
        return (this.liveMusic.live.music.find && this.liveMusic.live.artist.find)
    }

    createMusic() {
        for(let music of this.playlist.songs) {
            console.log(music)
            if(music != null && music.url != null) {
                this.liveMusic.toPlay.push(music.id)
            }
        }
    }

    setRandomMusic() {
        let randomMusic = this.playlist.songs[this.getRandomMusicId()]
        if(randomMusic) {

            randomMusic.artist = randomMusic.artist.replace('’', '\'')
            randomMusic.name = randomMusic.name.replace('’', '\'')

            this.liveMusic.live.artist = {name: randomMusic.artist, find: false}
            this.liveMusic.live.music = {name: randomMusic.name, find: false}
            this.liveMusic.live.fullMusic = randomMusic

            console.log(this.liveMusic)
        } else {
            this.playersEvent("newChatMessage", {user: "Server", msg: "End of playlist", find: true})
        }
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

    skipMusic() {
        let count = this.playersList.length
        let skip = 0
        for(let player of this.playersList) {
            if(player.skip)
                skip++
        }

        let ratio = skip / count

        if(ratio >= 0.75) {
            return true
        }

        return false
    }

    resetSkipVote() {
        for(let player of this.playersList) {
            player.skip = false
        }
    }

    disconnect(player) {
        for(let i = 0; i < this.playersList.length; i++) {
            if(player == this.playersList[i]) {
                this.playersList.splice(i, 1);
                this.socketsList.splice(i, 1);
                if(this.liveMusic.buffer.length > 0) {
                    this.liveMusic.buffer.splice(i, 1);
                }
            }
        }
    }
}
  
function getRndInteger(min, max) {
return Math.floor(Math.random() * (max - min) ) + min;
}