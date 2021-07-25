class SectionJoin {
    constructor(game) {
        this.game = game
        this.sectionObj = this.create()
        this.section = this.sectionObj.elem
    }

    create() {

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
                        new MultipleChoice(
                            [
                                new Choice("Distance", "distance"),
                                new Choice("Local", "local"),
                            ]
                        ),
                        new Button("Rejoindre", {
                            "class": "mt60"
                        })
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
        var section = this.sectionObj

        var inputObj = section.Center.LayoutVertical.Input
        var input = section.Center.LayoutVertical.Input.elem

        var buttonObj = section.Center.LayoutVertical.Button
        var button = section.Center.LayoutVertical.Button.elem

        button.disabled = true

        inputObj.onKeyup(() => {
            if(input.value != "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        inputObj.onKeyup((event) => {
            if(input.value != "") {
                button.disabled = false;
                
                if (event.keyCode === 13 ) {
                    this.game.emit("newPlayer", {"pseudo": input.value, "code": this.game.code})
                }

            } else {
                button.disabled = true;
            }
        })

        buttonObj.onClick(() => {
            let choice = section.Center.LayoutVertical.MultipleChoice.selected
            this.game.emit("newPlayer", {"pseudo": input.value, "code": this.game.code, "mode": choice})
        })
    }
}