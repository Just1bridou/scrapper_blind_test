class GameManager {
    constructor() {
        this.socket = io()
        this.name = "BLIND TEST"
        this.uuid = sessionStorage.getItem('uuidPlayer');
        this.code = window.location.pathname.split('/')[2]
        this.init()
    }
    
    init() {
        /**
         * Save player's UUID on sessionStorage
         */
        this.socket.on('saveUUID', (player) => {
            sessionStorage.setItem('uuid', player.uuid);
            sessionStorage.setItem('player', JSON.stringify(player))
        })

        this.socket.on('roomCreated', (data) => {
            this.code = data.code
        })
    }

    /**
     * Check if player is actual player
     * @param {player} player 
     * @returns bool
     */
    isActualPlayer(player) {
        if(player.uuid == sessionStorage.getItem('uuid')) {
            return true
        }
        return false
    }

    /**
     * Check if player is admin
     * @param {player} player 
     * @returns bool
     */
    isAdmin(player) {
        if(player.modo) {
            return true
        }
        return false
    }

    start() {
        this.emit("browserConnection", this.code)
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
}