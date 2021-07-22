module.exports = {
    connect: connect,
    getAllReports: getAllReports,
    newReport: newReport,
    update: update,
};

var MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://justin:9NGdgv83mfJqJ74Y@blindtest.l9dkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
DB_NAME = "blindtest"

function connect() {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) return console.log(err)
        db = db.db(DB_NAME)
    })
}

function newReport(report, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection("reports").insertOne(report, function(err, res) {
        if (err)
            cb(500)
        else
            cb(200)
        db.close();
        });
      });
}

function getAllReports(limit, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);
        dbo.collection("reports").find().sort({id: -1}).limit(limit).toArray(function(err, result) {
            if (err) throw err;
            db.close();
            cb(result)
        });
    });
}

function update(payload, cb) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db(DB_NAME);

        dbo.collection('playlist').findOneAndUpdate(
            { id: payload.playlistId, "songs.id": payload.id },
            { $set: { "songs.$.artist": payload.artist, "songs.$.name": payload.music } },
            function(errUpdate, resultUpdate) {
                if (errUpdate) throw err;
    
                dbo.collection("reports").deleteOne({playlistId: payload.playlistId, id: payload.id}, function(err, obj) {  
                    if (err) throw err;  
                    console.log(obj.result.n + " record(s) deleted");  
                    db.close();  
                    cb(resultUpdate)
                }); 
                
            }
        );

    });
}