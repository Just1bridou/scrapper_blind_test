module.exports = {
    connect: connect,
    getAllReports: getAllReports,
    newReport: newReport,
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
