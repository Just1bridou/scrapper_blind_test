class SectionLogin {
    constructor(game) {
        this.game = game
        this.sectionObj = this.createLogin()
        this.section = this.sectionObj.elem
    }

    createLogin() {

        let section = new Section(
            new Center(
                new LayoutVertical(
                    [
                        new Title(this.game.name),
                        new Input({
                            "placeholder": "Jouer ...",
                            "id": "login_pseudo",
                            "type": "text"
                        }),
                        new Button("Creer une partie", {
                            "id": "createRoom"
                        })
                    ]
                ), true, true,
            ),
            {
                "height": "full",
                "width": "full",
                "class": "none"
            }
        )

        document.body.appendChild(section.elem)

        return section
    }

    /**
     * Init login page
     */
    init() {

        var input = this.sectionObj.Center.LayoutVertical.Input.elem
        var button = this.sectionObj.Center.LayoutVertical.Button.elem

        input.addEventListener('keyup', (event) => {
            if(input.value != "") {
                button.disabled = false;
                
                if (event.keyCode === 13 ) {
                    this.game.emit("createRoom", { pseudo : input.value})
                }

            } else {
                button.disabled = true;
            }
        })
    
        button.addEventListener('click', () => {
            this.game.emit("createRoom", { pseudo : input.value})
        })

        this.game.on('roomCreated', (data) => {
            this.game.room = data.room
            this.game.emit("getData", null)
        })
    }
}