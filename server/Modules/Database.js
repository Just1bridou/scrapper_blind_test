module.exports = {
    connect: connect,
};

var MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://justin:9NGdgv83mfJqJ74Y@blindtest.l9dkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

function connect(dbName) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        if (err) return console.log(err)
        db = client.db(dbName)
        console.log(`Connected MongoDB: ${url}`)
        console.log(`Database: ${dbName}`)
      })
}