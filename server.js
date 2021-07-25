'use strict';
const dotenv = require('dotenv').config()
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
const Reports = require('./server/Modules/Report');
// const { Client } = require('socket.io/dist/client');
// const { inherits } = require('util');


app.use("/css", express.static( __dirname + "/client/css"))
app.use("/js", express.static( __dirname + "/client/js"))
app.use("/sound", express.static( __dirname + "/client/sound"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/pages/index.html")
})

app.get('/r/:code', (req, res) => {
  res.sendFile(__dirname + "/client/pages/index.html")
});

app.get('/reports', (req, res) => {
  res.sendFile(__dirname + "/client/pages/reports.html")
})

var serverRooms = []

io.on("connect", (socket) => { 
  
  const Client = new ClientBasic(socket)

  Client.on("createRoom", data => {

    let player = new Player(data.pseudo, true)
    let room = new Room()
    room.addPlayer(player, socket)

    Client.room = room
    Client.player = player
    
    serverRooms.push(room)

    let params = {
      "code": room.code,
      "uuidPlayer": player.uuid
    }

    Client.emit("roomCreated", params)
    Client.emit("saveUUID", player)
    
    Client.goToSection("login", "waitingRoom")
    room.playersEvent("refreshPlayersList", room.playersList)
  })

  Client.on("newPlayer", data => {
    let room = getRoom(data.code)
    let player = new Player(data.pseudo)
    
    Client.room = room
    Client.player = player

    Client.room.addPlayer(player, socket)

    let params = {
      "code": room.code,
      "uuidPlayer": player.uuid
    }

    Client.emit("roomCreated", params)
    Client.emit("saveUUID", player)
    Client.goToSection("join", "waitingRoom")
    Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
  })

  Client.on("browserConnection", code => {
    if(roomExist(code)) {
       // Client.emit("newModaleConnection")
        Client.showSection("join")
    } else {
        Client.showSection("login")
    }
  })

  Client.on("getAllPlaylists", limit => {
    Playlist.getAllPlaylists(limit, playlists => {
      Client.emit("getAllPlaylists", playlists)
    })
  })

  Client.on("playlistsKeyWord", data => {
    Playlist.getPlaylistByKeyWord(data.keyword, data.limit, playlists => {
      Client.emit("playlistsKeyWord", playlists)
    })
  })

  Client.on("searchNewPlaylist", url => {
      pptFct.getMusics(Playlist.getIdFromURL(url), res => {
        if(res.length == 0) {
          Client.emit("searchNewPlaylist", {error: 404})
        } else {
          Client.emit("searchNewPlaylist", {name: res.name, songs: res.numbers, url: url})
        }
      })
  })

  Client.on("addPlaylist", url => {
    pptFct.getMusics(Playlist.getIdFromURL(url), resMusic => {

      parseAllSongs(resMusic.musics, (res) => {
        for(let music of res) {
          if(music != undefined) {    
            music.name = normalize(music.name)
            music.artist = normalize(music.artist)
          }
        }

        let playlist = {
          name: resMusic.name,
          url: url,
          id: Playlist.getIdFromURL(url),
          songs: res
        }

        console.log(playlist)

        Playlist.insertPlaylist(playlist, code => {
          Client.emit('addPlaylist', {code: code, playlist: playlist})
        })
      }, progress => {
        Client.emit('loadingProgress', progress)
      })
    })
  })

  Client.on("selectRoomPlaylist", (fullUrl) => {

    Playlist.getPlaylistById(Playlist.getIdFromURL(fullUrl), res => {
      res = res[0]
    
      Client.room.playlist = res
      Client.room.playersEvent("playlistChose", res.name)
    })
  })

  Client.on("playerReady", data => {
    Client.player.setReady()
    Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
    if(Client.room.checkAllReady()) {

      Client.room.createBuffer()
      Client.room.createMusic()
      Client.room.setRandomMusic()

      Client.room.playersEvent("startGame", Client.room.playlist.name)
      setTimeout(() => {
        Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
        Client.room.playersEvent("getSong", Client.room.liveMusic.live.fullMusic.url)
      }, 1500)
    }
  })

  Client.on("skipMusic", data => {
    Client.player.skip = true
    Client.room.playersEvent("refreshPlayersList", Client.room.playersList)

    if(Client.room.skipMusic()) {
      Client.room.resetSkipVote()
      Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
      skipMusic()
    }

  })

  Client.on("changeSoundPlayer", volume => {
    Client.emit("changeSoundPlayer", volume)
  })

  Client.on("isPlayerAdmin", cb => {
    cb(Client.player.admin)
  })

  Client.on("BUFFERING", cb => {
    Client.room.readyBuffer(Client.player.uuid)
    if(Client.room.checkAllBuffer()) {
      console.log("all buffer ready")
      Client.room.playersEvent("playerPlay")
    }
  })

  // Client.on("ENDED", cb => {
  //   Client.room.endMusicPlayer(Client.player.uuid)
  //   if(Client.room.checkAllPlayerEnd()) {
  //     skipMusic()
  //   }
  // })

  Client.on("guessing", str => {
   // Client.room.liveMusic.chat.push({user: Client.player.name, msg: str})
    Client.room.checkResponse(str, Client.player, data => {
      let find = false
        if(data != null)
          find = true
      Client.room.playersEvent("newChatMessage", {user: Client.player.name, msg: str, find: find})
      Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
      Client.room.playersEvent("guessing", data)
      if(Client.room.allIsFind()) {
        Client.room.resetSkipVote()
        Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
        nextMusic()
      }
    })
  })

  Client.on("reportMusic", data => {
    Reports.newReport(data, () => {
      console.log("new report")
    })
  })

  Client.on("updateReport", data => {
    Reports.update(data, () => {
      console.log("update")
    })
  })

  socket.on("getAllReports", cb => {
    Reports.getAllReports(100, reports => {
      cb(reports)
    })
  })

  Client.on("disconnect", () => {
    if(!Client.disconnect) {
      if(Client.room) {
        Client.disconnect = true
        Client.room.disconnect(Client.player)
        Client.room.playersEvent("refreshPlayersList", Client.room.playersList)
      }
    }
  })


  function skipMusic() {

    let data = Client.room.liveMusic.live.fullMusic
    data.playlistId = Client.room.playlist.id
    data.closeAfter = 3000

    Client.room.playersEvent("skipMusic", data)

    Client.room.resetBuffer()
    Client.room.setRandomMusic()

    setTimeout(()=> {
      Client.room.playersEvent("getSong", Client.room.liveMusic.live.fullMusic.url)
    }, data.closeAfter)
  }

  function nextMusic() {
    Client.room.resetBuffer()
    Client.room.setRandomMusic()
    Client.room.playersEvent("getSong", Client.room.liveMusic.live.fullMusic.url)
  }

})

function roomExist(code) {
  for(let room of serverRooms) {
    if(room.code == code) {
      return true
    }
  }
  return false
}

function getRoom(code) {
  for(let room of serverRooms) {
    if(room.code == code) {
      return room
    }
  }
  return null
}

function normalize(s) {
  console.log(s)
  var r=s.toLowerCase();

  r = r.replace("- Live","")

  r = r.replace(/ *\([^)]*\) */g, "");
  r = r.replace(/ *\[[^)]*\] */g, "");

  r = r.replace(new RegExp("[!/\\.,]", 'g'),"");
  
  r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
  r = r.replace(new RegExp("æ", 'g'),"ae");
  r = r.replace(new RegExp("ç", 'g'),"c");
  r = r.replace(new RegExp("[èéêë]", 'g'),"e");
  r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
  r = r.replace(new RegExp("ñ", 'g'),"n");                            
  r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
  r = r.replace(new RegExp("œ", 'g'),"oe");
  r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
  r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
  r = r.replace(new RegExp("ğ", 'g'),"g");
  
  r = r.replace("radio edit","")
  r = r.replace("extended version","")
  r = r.replace("version originale","")
  r = r.replace("avec intro","")
  r = r.replace("version mixte","")
  r = r.replace("ed version","")
  r = r.replace("rerecorded","")

  r = r.replace(new RegExp(" - \\d{4}", 'g'),"");

  r = r.replace(new RegExp("pt \\d", 'g'),"");
  r = r.replace(new RegExp("pts \\d-\\d", 'g'),"");

  r = r.replace("remaster","")
  r = r.replace("remastered","")

  r = r.replace(new RegExp("\\d{4} remaster", 'g'),"");
  r = r.replace(new RegExp("\\d{4} remastered", 'g'),"");
  r = r.replace(new RegExp("remaster \\d{4}", 'g'),"");
  r = r.replace(new RegExp("remastered \\d{4}", 'g'),"");
  r = r.replace(new RegExp("remasterise en \\d{4}", 'g'),"");

  r = r.replace(new RegExp("original version \\d{4}", 'g'),"");
  r = r.replace(new RegExp("\\d{4} original version", 'g'),"");

  r = r.replace(new RegExp("version originale \\d{4}", 'g'),"");
  r = r.replace(new RegExp("ed \\d{4}", 'g'),"");

  r = r.replace(/\s{2,}/g, ' ');
  r = r.replace( /^\s+|\s+$/g, '' );

  r = r.replace(new RegExp(" -", 'g'),"");
  return r;
}

async function parseAllSongs(musics, cb, pg) {
    recursiveSong(musics.length, 0, cb, musics, [], pg)
}

async function recursiveSong(max, i, cb, list, array, pg) {
  
  percentage(i, max, pg)

  if(i == max) {
    cb(array)
  } else {
    await pptFct.getYoutubeVideos(list[i]).then((song) => {
      let singleSong = returnSong(song, list[i])
      //console.log(singleSong)
      array.push(singleSong)
      i = i + 1
      recursiveSong(max, i, cb, list, array, pg)
    })
  }
}

function returnSong(song, info) {
  for(let url of song) {
    if(url != null) {
      return {id: info.id, url: url, name: info.name, artist: info.artist}
    }
  }
}

function percentage(i, max, pg) {
  let pc = Math.round(i * 100 / max)
  console.log(pc + "%")
  pg(pc)
}

console.log("Listening on port: ", process.env.PORT)
serverNode.listen(process.env.PORT)