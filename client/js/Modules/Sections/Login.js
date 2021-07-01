class SectionLogin {
    constructor(game) {
        this.game = game
        this.section = this.createLogin()
        this.input = this.section.querySelector('#login_pseudo')
        this.button = this.section.querySelector('#createRoom')
    }

    createLogin() {
        let section = _('section', document.body, null, "login")
        section.classList.add('none')
        _("h1", section, this.game.name)

        let divC = _("div", section, null, null, "divContent")
        let div = _("div", divC, null, null, 'loginButtonContent')
        let input = _("input", div, null, "login_pseudo")
        input.placeholder = "Pseudo ..."
        _("button", div, "CREER UNE PARTIE", "createRoom")

        return section
    }

    /**
     * Init login page
     */
    init() {
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