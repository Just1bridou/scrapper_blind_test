class SectionJoin {
    constructor(game) {
        this.game = game
        this.sectionObj = this.createJoin()
        this.section = this.sectionObj.elem
    }

    createJoin() {

        let section = new Section(
            new Center(
                new LayoutVertical(
                    [
                        new Title(this.game.name),
                        new Input({
                            "placeholder": "Pseudo ...",
                            "type": "text"
                        }),
                        new Title("Choix du mode", {
                            "class": "title5 mt60"
                        }),
                        new LayoutHorizontal(
                            [
                                new Button("Distance"),
                                new Button("Local")
                            ]
                        ),
                        new Button("Rejoindre")
                    ]
                ), true, true, {
                    "class": "w50"
                }
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
     * Init join page
     */
    init() {

        var input = this.sectionObj.Center.LayoutVertical.Input.elem
        var button = this.sectionObj.Center.LayoutVertical.Button.elem

        input.addEventListener('keyup', (event) => {
            if(input.value != "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        input.addEventListener('keyup', (event) => {
            if(input.value != "") {
                button.disabled = false;
                
                if (event.keyCode === 13 ) {
                    this.game.emit("newPlayer", {"pseudo": input.value, "code": this.game.code})
                }

            } else {
                button.disabled = true;
            }
        })

        button.addEventListener('click', () => {
            this.game.emit("newPlayer", {"pseudo": input.value, "code": this.game.code})
        })
    }
}