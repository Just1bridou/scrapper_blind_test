document.addEventListener('DOMContentLoaded', () => {
    const socket = io()

    let title = new Title("Reports")
    document.body.appendChild(title.elem)

    socket.emit("getAllReports", data => {
        console.log(data)

        for(let report of data) {
            let lay = new LayoutHorizontal(
               [
                new Input({
                    "type": "text",
                    "value": report.artist,
                    "class": "m2 flex_3 noRounded fs25"
                }),
                new Input({
                    "type": "text",
                    "value": report.name,
                    "class": "m2 flex_3 noRounded fs25"
                }),
                new Button("Save", {
                    "class": "m2 flex_1 noRounded fs25"
                })
               ]
            )
            document.body.appendChild(lay.elem)
        }
    })
})