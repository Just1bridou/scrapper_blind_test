module.exports = {
    connect: connect,
    getAllPlaylists: getAllPlaylists,
    getPlaylistById: getPlaylistById,
    getIdFromURL: getIdFromURL,
};

var MongoClient = require("mongodb").MongoClient;
const url = 'mongodb://127.0.0.1:27017'
DB_NAME = "blindtest"

function connect() {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) return console.log(err)
        db = db.db(DB_NAME)
    })
}

function getAllPlaylists() {

}

function getPlaylistById(id, cb) {
    queryParams("playlist", { id: id }, cb)
}

function getIdFromURL(url) {
    let parts = url.split('/')
    return parts[parts.length - 1]
}

function queryParams(collection, params, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        var query = params;
        dbo.collection(collection).find(query).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            cb(result)
        });
    });
}