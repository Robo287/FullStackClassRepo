//queryand.js
const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://127.0.0.1:27017/";

MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
  if (err) throw err;

  var dbo = client.db("music");

  var query = { $and: [ {"first": "John"} , {"duration": { $lt: 200 }} ] };

  dbo.collection("songs").find(query).toArray(function(err, res) {
    if (err) throw err;

    console.log( JSON.stringify(res, null, 4) );

    client.close();
  });

});