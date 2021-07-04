class SectionsManager {

    constructor(game) {
        this.game = game

        this.sections = []
        this.allPlayersList = []

        this.sections["login"] = new SectionLogin(game)
        this.sections["waitingRoom"] = new SectionWR(game, this)
        this.sections["inGame"] = new SectionInGame(game, this)

        this.init()
    }

    init() {
        this.game.on("showSection", name => {
            this.sections[name].init()
            this.show(name)
        })

        this.game.on("dismissSection", name => {
            this.dismiss(name)
        })

        this.game.on("transitionSection", data => {
            this.sections[data.to].init()
            this.transition(data.from, data.to)
        })

        this.game.on("refreshPlayersList", data => {
            this.refreshAllPlayerList(data)
        })
    }

    refreshAllPlayerList(data) {
        for(let key in this.allPlayersList) {
            this.allPlayersList[key](data, this.sections[key])
        }
    }

    /**
     * Make transition between two sections
     * @param {Section} toDismiss 
     * @param {Section} toShow 
     * @param {*} data 
     * @param {*} clear 
     * @param {*} text 
     */
    transition(toDismiss, toShow, text=null, fct = null) {
        let hideDiv = _('div', document.body, null, null, 'hideDiv')

        if(text)
            _('div', hideDiv, text, null, 'transitionDiv')

        setTimeout(() => {
            if(fct) {
                fct()
            }

            this.dismiss(toDismiss)
            this.show(toShow)
            scrollTop()
            hideDiv.style.animation = 'reverseFullWidth 1s forwards'
            setTimeout(() => {
                hideDiv.remove()
            }, 1500)
        }, 1600)
    }

    /**
     * Show section
     * @param {Section} section 
     */
    show(section) {
       this.getSection(section).classList.remove('none')
    }

    /**
     * Hide section
     * @param {Section} section 
     */
    dismiss(section) {
        this.getSection(section).classList.add('none')
    }

    getSection(section) {
        return this.sections[section].section
    }

    /**
     * Hide all pages
     */
    hideAll() {
        for(let section in this.sections) {
            this.dismiss(section)
        }
    }

    /**
     * Reset pages
     */
    resetAllCat() {
        // reset game
        waitingPlayerList.innerHTML = ""
        //gamePlayerList.innerHTML = ""
    }

      /**
     * Create modal to join the room
     */
    newModalConnect() {
        this.dismiss(this.login.section)
        let pseudo = document.createElement('input')
        pseudo.placeholder = "Pseudo"
        let button = document.createElement('button')
        button.innerHTML = "VALIDER"
        button.disabled = true

        var hiden = _('div', document.body, null, null, "modelHide")
        var div = _('div', hiden, null, null, "modalNewPlayer")
        _('h3', div, "Rejoindre")

        let inputContainer = _('div', div, null, null, 'modalContentInput')
        inputContainer.appendChild(pseudo)
        inputContainer.appendChild(button)

        pseudo.addEventListener('keyup', (event) => {
            if(pseudo.value != "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        pseudo.addEventListener('keyup', (event) => {
            if(pseudo.value != "") {
                button.disabled = false;
                
                if (event.keyCode === 13 ) {
                    this.game.socket.emit("newPlayer", {"pseudo": pseudo.value, "room": Game.room})
                }

            } else {
                button.disabled = true;
            }
        })

        button.addEventListener('click', () => {
            this.game.socket.emit("newPlayer", {"pseudo": pseudo.value, "room": this.game.room})
        })

        this.game.socket.on('removeModal', () => {
            hiden.remove()
            this.wr.initWaitingRoom()
            this.show(this.wr.section)
        })
    }
}