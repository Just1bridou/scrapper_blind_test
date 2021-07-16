'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = class Player {
    constructor(name, admin = false) {
        this.uuid = uuidv4()
        this.name = name
        this.admin = admin
        this.ready = false
        this.score = 0
        this.skip = false
    }

    setReady() {
       this.ready = true 
    }
}
