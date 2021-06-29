'use strict';

module.exports = class Client {
    constructor(socket) {
        this.socket = socket
        this.roomsLists = []
    }

    addRoom(room) {
        this.roomsLists.push(room)
    }

    sendClientPlaylist(socket, fullUrl, playlist) {
        socket.emit("getPlaylist", {url: fullUrl, playlist: playlist})
    }
}