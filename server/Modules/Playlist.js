module.exports = {
    connect: connect,
    getAllPlaylists: getAllPlaylists,
    getPlaylistById: getPlaylistById,
    getIdFromURL: getIdFromURL,
    getPlaylistByKeyWord: getPlaylistByKeyWord,
    insertPlaylist: insertPlaylist,
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

function insertPlaylist(playlist, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection("playlist").insertOne(playlist, function(err, res) {
        if (err)
            cb(500)
        else
            cb(200)
        db.close();
        });
      });
}

function getAllPlaylists(limit, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection("playlist").find().sort({id: -1}).limit(limit).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            cb(result)
        });
    });
}

function getPlaylistByKeyWord(keywork, limit, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection("playlist").find({$or:[{ 'name': new RegExp(keywork, 'i') },{"url": keywork}]}).sort({id: -1}).limit(limit).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            cb(result)
        });
    });
}

function getPlaylistById(id, cb) {
    queryParams("playlist", { id: id }, cb)
}

function getIdFromURL(url) {
    try {
        let parts = url.split('/')
        try {
            let segment = parts[parts.length - 1].split('?')
            return segment[0]
        } catch {
            return parts[parts.length - 1]
       }
    } catch {
        return []
    }
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