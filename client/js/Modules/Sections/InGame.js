class SectionInGame {
    constructor(game, sub) {
        this.game = game
        this.sub = sub
        this.section = this.create()
        
        this.playersList = this.section.querySelector('.ig_pList_container')
    }

    create() {
        let section = _('section', document.body, null, "inGame")
        section.classList.add('none')

        // Left Panel
        let lPanel = _('section', section, null, null, "ig_lPanel")

            let pList = _('div', lPanel, null, null, "ig_pList")
                let crown = _('div', pList, null, null, "ig_crown_container")
                    crown.innerHTML = "<i class='fas fa-crown'></i>"
                let pListContainer = _('div', pList, null, null, "ig_pList_container")

            let buttonBar = _('div', lPanel, null, null, "ig_buttons_bar")
                _('button', buttonBar, "A", null, "ig_buttons")
                _('button', buttonBar, "B", null, "ig_buttons")
                _('button', buttonBar, "C", null, "ig_buttons")
               let next = _('button', buttonBar, "D", null, "ig_buttons")
               next.addEventListener("click", () => {
                   this.game.emit("skipMusic")
               })

        // Right Panel
        let rPanel = _('section', section, null, null, "ig_rPanel")
            let topPanel = _('div', rPanel, null, null, "ig_rPanel_top")
                let wave = _('div', topPanel, null, null, "wave_viewer")
                let infosContainer = _('div', topPanel, null, null, "rPanel_infosContainer")
                    let playlistName = _('h3', infosContainer, "Annees 80", null, "ig_playlistName")
                    let status = _('h2', infosContainer, "Lecture en cours", null, "ig_status")
                let timeContainer = _('div', topPanel, null, null, "rPanel_timerContainer")
                    let timer = _('div', timeContainer, null, null, "rPanel_timer")
                        let timerBg = _('div', timer, null, null, "rPanel_timer_bg")
                        let timerTime = _('div', timerBg, null, null, "rPanel_timer_time")
                        let time = _('h4', timerTime, "30")


            let midPanel = _('div', rPanel, null, null, "ig_rPanel_mid")

            this.game.on("newChatMessage", chat => {
                let container = _('div', document.querySelector('.ig_rPanel_mid'), null, null, "ig_msgContainer")
                _('h4', container, chat.user+ " : ", null, "ig_msgUser")
                _('h4', container, chat.msg, null, "ig_msg")
            })

            let botPanel = _('div', rPanel, null, null, "ig_rPanel_bot")
                let responseContainer = _('div', botPanel, null, null, "ig_rPanel_repContainer")
                    let inputResponse = _('input', responseContainer, null, null, "ig_repInput")
                        inputResponse.placeholder = "Artiste / Titre ..."
                    let buttonResponse = _('button', responseContainer, "Envoyer", null, "ig_repButton")

                    inputResponse.addEventListener('keyup', (event) => {                            
                        if (event.keyCode === 13 ) {
                            if(inputResponse.value != "") {
                                console.log(inputResponse.value)
                                this.game.emit("guessing", inputResponse.value)
                                inputResponse.value = ""
                            }                        
                        }
                    })

                    buttonResponse.addEventListener('click', () => {
                        if(inputResponse.value != "") {
                            console.log(inputResponse.value)
                            this.game.emit("guessing", inputResponse.value)
                            inputResponse.value = ""
                        }
                    })


        var refreshFCT = function refreshPL(playerList, section) {
            section.playersList.innerHTML = ""

            for(let player of playerList) {
                let playerLi = _('div', section.playersList, player.name)
                playerLi.classList.add('wr_playerCase')
            }
        }

        this.sub.allPlayersList["inGame"] = refreshFCT

        return section
    }

    setPlaylistName(name) {
        this.section.querySelector('.ig_playlistName').innerHTML = name
    }
    
    init() {
        this.generateWave()
    }

    generateWave() {
        let wContainer = this.section.querySelector('.wave_viewer')

        let nb = Math.round((30 * (75 * window.innerWidth / 100) / 100) / 15)

        for(let i = 0; i < nb ; i++) {
            let div = _('div', wContainer, null, null, "wavePipe")
            let transi = getRndInteger(100, 300)
            div.style.transition = transi + "ms height linear"
            setInterval(() => {
                div.style.height = getRndInteger(20, 90) + "%"
            }, transi);
        }
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}