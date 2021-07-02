'use strict';

module.exports = class Room {
    constructor() {
        this.code = this.generateRoomToken()
        this.playersList = []
        this.socketsList = []

        this.playlist = null
        this.liveMusic = null
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