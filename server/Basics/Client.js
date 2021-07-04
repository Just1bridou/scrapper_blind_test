'use strict';

module.exports = class Client {
    constructor(socket) {
        this.room = null
        this.player = null
        this.socket = socket
        this.roomsLists = []
        this.init()
    }

    addRoom(room) {
        this.roomsLists.push(room)
    }

    sendClientPlaylist(socket, fullUrl, playlist) {
        console.log("emit")
        this.emit("getPlaylist", {url: fullUrl, playlist: playlist})
    }

    init() {
        
    }

    roomExist(code) {
        console.log("checking code : ", code)
        if(code != null) {
            console.log(this.roomsLists)
            for(let room of this.roomsLists) {
                if(room.code == code) {
                    console.log(room.code)
                    return true
                }
            }
        }
        return false
    }

    emit(name, data = null) {
        console.log("Emit: ", name)
        this.socket.emit(name, data)
    }

    on(name, cb) {
        this.socket.on(name, res => {
            console.log("On: ", name)
            cb(res)
        })
    } 

    showSection(name) {
        this.emit("showSection", name)
    }

    dismissSection(name) {
        this.emit("dismissSection", name)
    }

    goToSection(from, to) {
        this.emit("transitionSection", {from: from, to: to})
    }
}