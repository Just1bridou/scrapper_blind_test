const puppeteer = require('puppeteer');
const youtube = require('./youtube');
const axios = require('axios')

var SpotifyWebApi = require('spotify-web-api-node');

module.exports = {
  getMusics: getMusics,
  getYoutubeVideos: getYoutubeVideos,
};

async function getMusics(id, cb) {

  var results = {}
  results.musics = []

  var spotifyApi = new SpotifyWebApi({
    clientId: '9b14eaa2219a48289e044d245b517492',
    clientSecret: '783195aceb49407d9864f0ca7edd0c14'
  });

  spotifyApi.clientCredentialsGrant().then(
    function(data) {

      spotifyApi.setAccessToken(data.body['access_token']);

      spotifyApi.getPlaylist(id, {limit: 500})
        .then(function(data) {
          
          results.name = data.body.name
          results.numbers = data.body.tracks.total
          results.url = data.body.external_urls.spotify

          getNextPlaylist(spotifyApi, results, id, cb)

        }, function(err) {console.log(err)});
    },
    function(err) {console.log(err)}
  );
};

function getNextPlaylist(spotifyApi, results, id, cb, offset = 0) {

  spotifyApi.getPlaylistTracks(id , {
    offset: offset,
    limit: 100,
  })
  .then(
    function(data) {

      for(let i=0; i < data.body.items.length; i++) {
        let song = data.body.items[i]
        let idNb = (parseInt(i) + parseInt(offset))
        console.log(idNb)
       results.musics.push(
         {
           id: eval(idNb), 
           artist: song.track.artists[0].name,
           name: song.track.name
          }
        )
      }

     if(data.body.next) {
      getNextPlaylist(spotifyApi, results, id, cb, getOffset(data.body.next))
     } else {
      cb(results)
     }

    },
    function(err) {console.log(err)}
  );
}

function getOffset(url) {
  var url = new URL(url);
  return url.searchParams.get("offset");
}

async function getYoutubeVideos(music) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  let results = await youtube.scrape_youtube(browser, music.artist + " " + music.name);
  await browser.close();
  return results
}