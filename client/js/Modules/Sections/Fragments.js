class SectionLogin {
    constructor(game) {
        this.game = game
        this.section = this.createLogin()
        this.input = this.section.querySelector('#login_pseudo')
        this.button = this.section.querySelector('#createRoom')
        this.initLogin()
    }

    createLogin() {
        let section = _('section', document.body, null, "login")
        section.classList.add('none')
        _("h1", section, this.game.name)

        let divC = _("div", section, null, null, "divContent")
        let div = _("div", divC, null, null, 'loginButtonContent')
        let input = _("input", div, null, "login_pseudo")
        input.placeholder = "Pseudo ..."
        _("button", div, "CRÉER UNE PARTIE", "createRoom")

        return section
    }

    /**
     * Init login page
     */
    initLogin() {
        this.input.addEventListener('keyup', (event) => {
            if(this.input.value != "") {
                this.button.disabled = false;
                
                if (event.keyCode === 13 ) {
                    this.game.emit("createRoom", { pseudo : this.input.value})
                }

            } else {
                this.button.disabled = true;
            }
        })
    
        this.button.addEventListener('click', () => {
            this.game.emit("createRoom", { pseudo : this.input.value})
        })

        this.game.on('roomCreated', (data) => {
            this.game.room = data.room
            this.game.emit("getData", null)
        })
    }
}

class SectionWR {
    constructor(game, sub) {
        this.game = game
        this.sub = sub
        this.section = this.createSection()
        this.playersList = this.section.querySelector('#player_list')
        this.clickMe = this.section.querySelector('.clickMe')
        this.link = this.section.querySelector('#join_link')
        this.waitingTitle = document.querySelectorAll('.waiting_title')
        this.waitingNumbers = document.querySelectorAll('.waiting_numbers')
        this.ready_button = this.section.querySelector('#ready_button')
        this.initWaitingRoom()
    }

    createSection() {
        // Section
        let section = _('section', document.body, null, "waitingRoom")
        section.classList.add('none')

        // Header
        let header = _('section', section, null, null, "header")
        _('h1', header, null, null, "waiting_title")
        let dLink = _('div', header, null, null, "copyLink")
        _('span', dLink, "Cliquer ici pour copier le lien", null, "clickMe")
        _('input', dLink, null, "join_link")
        _('h1', header, null, null, "waiting_numbers")

        // Body
        let body = _('section', section, null, null, "body")
        let pDiv = _('serction', body, null, null, "playerDiv")
        _('div', pDiv, null, "player_list")
        _("button", pDiv, "Pret", "ready_button")

        return section
    }

    /**
     * Init waiting room page
     */
    initWaitingRoom() {
        for(let title of this.waitingTitle) {
            title.innerHTML = "PARTIE <span class='tonalite'>#</span>" + this.game.room
        }

        let path = location.protocol + '//' + location.host
        this.link.value = path + '/r/' + this.game.room
    
        this.link.addEventListener('click', () => {
            this.link.select();
            this.link.setSelectionRange(0, 99999);
            document.execCommand("copy");
        })

        this.link.addEventListener('click', () => {
            let save = this.clickMe.innerHTML
            this.clickMe.innerHTML = "COPIÉ !"
            setTimeout(() => {
                this.clickMe.innerHTML = save
            },2000)
        })

        this.ready_button.disabled = false
        this.ready_button.classList.remove('ready_click')
    
        this.ready_button.addEventListener('click', () => {
            console.log("player ready")
            this.ready_button.classList.toggle('ready_click')
            this.game.emit("switchState", null)
        })

        var refreshFCT = function refreshWRPL(playerList, section) {

            let localPlayer = JSON.parse(sessionStorage.getItem('player'))
    
            for(let nb of section.waitingNumbers) {
                nb.innerHTML = playerList.length + " JOUEUR(S)"
            }
    
            for(let player of playerList) {
                console.log(player)
    
                let playerLi = _('div', section.playersList, player.name)
    
                if(section.game.isAdmin(localPlayer)) {
                    if(!section.game.isActualPlayer(player)) {
                       let kickPlayer = _('div', playerLi, 'KICK', null, 'kickPlayer')
                       kickPlayer.addEventListener('click', () => {
                        section.game.socket.emit('kickPlayer', player.uuid)
                       })
                    }
                }
    
                if(!player.ready) {
                    playerLi.classList.add("unready")
                } else {
                    playerLi.classList.remove("unready")
                }
            }
        }

        this.sub.allPlayersList.push(refreshFCT)
    }
}