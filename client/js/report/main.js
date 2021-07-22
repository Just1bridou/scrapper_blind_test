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
                    "class": "m2 flex_3 noRounded fs25",
                    "id": "artist"
                }),
                new Input({
                    "type": "text",
                    "value": report.name,
                    "class": "m2 flex_3 noRounded fs25",
                    "id": "music"
                }),
                new Button("Save", {
                    "class": "m2 flex_1 noRounded fs25"
                })
               ]
            )

            document.body.appendChild(lay.elem)

            lay.Button.onClick(() => {
                
                let payload = {
                    playlistId: report.playlistId,
                    artist: lay.artist.elem.value,
                    music: lay.music.elem.value,
                    id: report.id
                }

                socket.emit("updateReport", payload)
                lay.remove()
            })
        }
    })
})