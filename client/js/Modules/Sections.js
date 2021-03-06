class SectionsManager {

    constructor(game) {
        this.game = game

        this.sections = []
        this.allPlayersList = []

        this.sections["login"] = new SectionLogin(game)
        this.sections["join"] = new SectionJoin(game)
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
}