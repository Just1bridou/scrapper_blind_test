'use strict';

// Set server modules
var http = require('http');
let express = require("express")
let socketio = require("socket.io")

let app = express()
let serverNode = http.Server(app)
let io = socketio(serverNode)

// Get Basics
const ClientBasic = require("./server/Basics/Client")
const Room = require("./server/Basics/Room")
const Player = require("./server/Basics/Player")


// Get Modules
const pptFct = require('./server/pptFct')
const Playlist = require('./server/Modules/Playlist');
// const { Client } = require('socket.io/dist/client');
// const { inherits } = require('util');


app.use("/css", express.static( __dirname + "/client/css"))
app.use("/js", express.static( __dirname + "/client/js"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/pages/index.html")
})

io.on("connect", (socket) => { 

  const Client = new ClientBasic(socket)

  Client.on("createRoom", data => {

    let player = new Player(data.pseudo, true)
    let room = new Room()
    room.addPlayer(player, socket)

    let params = {
      "room": room.code,
      "uuidPlayer": player.uuid
    }

    Client.emit("roomCreated", params)
    Client.emit("saveUUID", player)
    room.playersEvent("refreshPlayersList", room.playersList)
    Client.goToSection("login", "waitingRoom")
  })

    socket.on("findPlaylist", (fullUrl) => {

      console.log('find playlist with url: ' + fullUrl)

      let id = Playlist.getIdFromURL(fullUrl)

      Playlist.getPlaylistById(id, (playlist) => {
        Client.sendClientPlaylist(socket, fullUrl, playlist)
      })

     /* pptFct.getMusics(url).then((res) => {
          //socket.emit("getPlaylist", res)

        parseAllSongs(res.musics, (res) => {
          console.log(res)
        })
         
         // let rdm = getRandomMusic(res.musics)
         /* pptFct.getYoutubeVideos(rdm).then((song) => {
            // socket.emit("getSong", song)

            for(let url of song) {
              if(url != null) {
                socket.emit("getSong", {music: rdm, url: url})
                return
              }
            }
          })*/
      //})
    })
})

async function parseAllSongs(musics, cb) {
  //for(let music of musics) {
  /*  console.log(musics)
    await pptFct.getYoutubeVideos(musics[0]).then((song) => {
      let singleSong = returnSong(song)
      console.log(singleSong)
      array.push(singleSong)

      
    })*/
    recursiveSong(musics.length, 0, cb, musics, [])
 // }
   // cb(array)
}

async function recursiveSong(max, i, cb, list, array) {
  
  percentage(i, max)

  if(i == max) {
    cb(array)
  } else {
    await pptFct.getYoutubeVideos(list[i]).then((song) => {
      let singleSong = returnSong(song, list[i])
      //console.log(singleSong)
      array.push(singleSong)
      i = i + 1
      recursiveSong(max, i, cb, list, array)
      
    })
  }
}

function returnSong(song, info) {
  for(let url of song) {
    if(url != null) {
      return {id: info.id, url: url, name: info.name}
    }
  }
}

function percentage(i, max) {
  let pc = Math.round(i * 100 / max)
  console.log(pc + "%")
}

function getRandomMusic(list) {
  return list[getRndInteger(0, list.length)]
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

console.log("Listening on port: 1646")
serverNode.listen(1646)