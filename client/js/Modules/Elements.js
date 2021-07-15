class Elements {

    constructor() {
        this.attrList = {
            "rounded": {
                "false": "elements_rounded_false",
            },

            "background": {
                "green": "elements_background_green",
                "yellow": "elements_background_yellowÒ",
                "purple": "elements_background_purple",
                "purple_light": "elements_background_purple_light",
            },

            "color": {
                "green": "elements_color_green",
                "yellow": "elements_color_yellowÒ",
                "purple": "elements_color_purple",
                "purple_light": "elements_color_purple_light",
            },

            "layout_flex": {
                "vertical": "elements_layout_flex_vertical"
            },

            "height": {
                "full": "height_full"
            },

            "width": {
                "full": "width_full"
            },
        }
    }

    setAttributes(elem, attr) {
        if(attr == null)
            return

        for (const [key, value] of Object.entries(attr)) {
            if(this.attrList[key] && this.attrList[key][value]) {
                elem.classList.add(this.attrList[key][value])
            } else {
                elem.setAttribute(key, value)
            }
        }
    }

    initEl(el, children, attr) {
        let elem = document.createElement(el)
        if(children)
            this.setChildren(elem, children)
        this.setAttributes(elem, attr)
        return elem
    }

    initText(el, text, attr) {
        let elem = document.createElement(el)
        elem.innerText = text
        this.setAttributes(elem, attr)
        return elem
    }

    setChildren(elem, children) {
        if(children == null)
            return

        if(Array.isArray(children)) {
            for(let child of children) {
                elem.appendChild(child.elem)
            }   
        } else {
            elem.appendChild(children.elem)
        }
    }
}

// CONATINERS

class Container extends Elements {
    constructor(children, attr = null) {
        super()
        this.elem = this.initEl("div", children, attr)
    }
}

class Section extends Elements {
    constructor(children, attr = null) {
        super()
        this.elem = this.initEl("section", children, attr)
    }
}

class Center extends Elements {
    constructor(children, x = true, y = true, attr = null) {
        super()
        this.elem = this.initEl("div", children, attr)
        if(x && y) {
            this.elem.classList.add('elements_center')
        } else {
            if(x)
                this.elem.classList.add('elements_center_x')
            if(y)
                this.elem.classList.add('elements_center_y')
        }
    }
}

// ELEMENTS

class Input extends Elements {
    constructor(attr = null) {
        super()
        this.elem = this.initEl("input", null, attr)
    }
}

class Button extends Elements {
    constructor(text, attr = null) {
        super()
        this.elem = this.initText("button", text, attr)
    }
}

class Title extends Elements {
    constructor(text, attr = null) {
        super()
        this.elem = this.initText("h1", text, attr)
        this.elem.classList.add('title')
    }
}