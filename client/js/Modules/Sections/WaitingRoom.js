class SectionWR {
    constructor(game, sub) {
        this.game = game
        this.sub = sub
        this.section = this.createSection()
        this.playersList = this.section.querySelector('.wr_plistContent')
        this.clickMe = this.section.querySelector('.wr_clickMe')
        this.link = this.section.querySelector('#wr_join_link')
        this.waitingTitle = document.querySelector('.wr_title')
        this.ready_button = this.section.querySelector('#ready_button')

        // Playlists
        this.playlistChose = this.section.querySelector(".wr_playlist_title")
        this.playlistsSearch = this.section.querySelector('.wr_playlist_input')
        this.playlistsResults = this.section.querySelector('.wr_playlist_results')

        this.Playlist = new PlaylistManager(game)
    }

    createSection() {
        // Section
        let section = _('section', document.body, null, "waitingRoom")
        section.classList.add('none')

        // Players List
        let pListContent = _('section', section, null, null, "wr_plistContent")

        // Body
        let body = _('section', section, null, null, "body")

        let bodyB1 = _('div', body, null, null, "wr_body_1")
            _('h1', bodyB1, null, null, "wr_title")

        let bodyB2 = _('div', body, null, null, "wr_body_2")
            let divPlaylistContent = _('div', bodyB2, null, null, "wr_playlist_content")
                _('h2', divPlaylistContent, "Aucune playlist selectionee", null, "wr_playlist_title")
                let inputPlaylist = _('input', divPlaylistContent, null, null, "wr_playlist_input")
                inputPlaylist.placeholder = "Chercher une playlist"
                _('div', divPlaylistContent, null, null, "wr_playlist_results")

        let bodyB3 = _('div', body, null, null, "wr_body_3")
            let dLink = _('div', bodyB3, null, null, "wr_copyLink")
            _('span', dLink, "Copier le lien", null, "wr_clickMe")
            _('input', dLink, null, "wr_join_link")
            _("button", bodyB3, "Pret", "ready_button")

        return section
    }

    /**
     * Init waiting room page
     */
    init() {
        this.waitingTitle.innerHTML = this.game.name

        let path = location.protocol + '//' + location.host
        this.link.value = path + '/r/' + this.game.code
    
        this.link.addEventListener('click', () => {
            this.link.select();
            this.link.setSelectionRange(0, 99999);
            document.execCommand("copy");
        })

        this.link.addEventListener('click', () => {
            let save = this.clickMe.innerHTML
            this.clickMe.innerHTML = "COPIE !"
            setTimeout(() => {
                this.clickMe.innerHTML = save
            },2000)
        })

        this.ready_button.disabled = true
        this.ready_button.classList.remove('ready_click')
    
        this.ready_button.addEventListener('click', () => {
            console.log("player ready")
            this.ready_button.classList.toggle('ready_click')
            this.game.emit("switchState", null)
        })

        this.Playlist.getAllPlaylists(data => {
            this.refreshPlaylists(data)
        })

        this.playlistsSearch.addEventListener('keyup', (event) => {
            if(this.playlistsSearch.value != "") {
                this.game.emit("playlistsKeyWord", {keyword: this.playlistsSearch.value, limit: 10})
            } else {
                this.Playlist.getAllPlaylists(data => {
                    this.refreshPlaylists(data)
                })
            }
        })

        this.game.on("playlistsKeyWord", data => {
            this.refreshPlaylists(data)
        })

        this.game.on("playlistChose", name => {
            this.playlistChose.innerHTML = name
        })

        var refreshFCT = function refreshWRPL(playerList, section) {

            let localPlayer = JSON.parse(sessionStorage.getItem('player'))
    
            for(let player of playerList) {
                let playerLi = _('div', section.playersList, player.name)
                playerLi.classList.add('wr_playerCase')
    
                if(section.game.isAdmin(localPlayer)) {
                    if(!section.game.isActualPlayer(player)) {
                       let kickPlayer = _('div', playerLi, 'KICK', null, 'kickPlayer')
                       kickPlayer.addEventListener('click', () => {
                        section.game.emit('kickPlayer', player.uuid)
                       })
                    }
                }
    
                if(!player.ready) {
                    playerLi.classList.add("unready")
                } else {
                    playerLi.classList.remove("unready")
                }
            }
        }

        this.sub.allPlayersList["waitingRoom"] = refreshFCT
    }

    refreshPlaylists(data) {
        this.playlistsResults.innerHTML = ""
        if(data.length == 0) {
            _('h3', this.playlistsResults, "Aucune playlist trouvee")
            let newPlaylist = _('button', this.playlistsResults, "Ajouter une playlist")

            newPlaylist.addEventListener('click', () => {
                let mControler = new ModaleManager()

                let modaleContent = _('div', null, null, null, 'wr_modale_content')
                let input = _('input', modaleContent, null, null, 'wr_modale_content_input')
                input.placeholder = "SPOTIFY URL..."
                
                // TODO remove
                input.value = "https://open.spotify.com/playlist/6J7xdAmvpquhkPG1sxldMp?si=f496063e3e6c454d"
                
                let button = _('button', modaleContent, "Rechercher", null, 'wr_modale_content_add')

                let modaleResults = _('div', modaleContent, null, null, 'wr_modale_results')

                button.addEventListener('click', () => {
                    if(input.value != "") {
                        this.Playlist.searchNewPlaylist(input.value, data => {
                            modaleResults.innerHTML = ""
                            if(data.error) {
                                _('h3', modaleResults, "Aucune playlist trouvee")
                            } else {
                               let div = _('div', modaleResults, data.name)
                               _('span', div, " (" + data.songs + " songs)")
                               let addPlaylist = _('button', div, "Add")
                               addPlaylist.addEventListener('click', () => {
                                    addPlaylist.remove()
                                    _('h5', modaleResults, "Ajout de la playlist en cours...", null, "pg_h5")
                                    let pb = _('section',modaleResults)
                                    let progressBar = new Progress(pb)

                                    this.Playlist.addPlaylist(data.url, data => {
                                        console.log(data)
                                        progressBar.remove()
                                        mControler.tearDown()
                                        this.game.emit("playlistsKeyWord", {keyword: data.url, limit: 10})
                                    })

                                    this.game.on('loadingProgress', progress => {
                                        progressBar.update(progress)
                                    })
                               })
                            }
                        })
                    }
                })

                mControler.newModale({
                    title: "Nouvelle Playlist",
                    description: modaleContent,
                    closeButton: true
                })
            })

        } else {
            for(let playlist of data) {
                console.log(playlist)
                let div = _('div', this.playlistsResults, playlist.name)
                _('span', div, " (" + playlist.songs.length + " songs)")

                div.addEventListener('click', ()=>{
                    let allDivs = document.querySelectorAll(".wr_playlist_results div")
                    for(let pl of allDivs) {
                        pl.classList.remove("plSelect")
                    }
                    div.classList.add("plSelect")
                    this.game.emit("findPlaylist", playlist.url)
                })
            }
        }
    }
}