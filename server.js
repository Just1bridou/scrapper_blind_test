const pptFct = require('./server/pptFct')

var http = require('http');
let express = require("express")
let socketio = require("socket.io")

let app = express()
let serverNode = http.Server(app)
let io = socketio(serverNode)

app.use("/css", express.static( __dirname + "/client/css"))
app.use("/js", express.static( __dirname + "/client/js"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/pages/index.html")
})

io.on("connect", (socket) => { 

    socket.on("findPlaylist", (url) => {

      console.log('find playlist with url: ' + url)

      pptFct.getMusics(url).then((res) => {
          //socket.emit("getPlaylist", res)
          let rdm = getRandomMusic(res.musics)
          pptFct.getYoutubeVideos(rdm).then((song) => {
            socket.emit("getSong", song)

            for(let url of song) {
              if(url != null) {
                socket.emit("getSong", {music: rdm, url: url})
                return
              }
            }
          })
      })
    })
})

function getRandomMusic(list) {
  return list[getRndInteger(0, list.length)]
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

serverNode.listen(1646)