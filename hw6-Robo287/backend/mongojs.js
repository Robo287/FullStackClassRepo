const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://127.0.0.1:27017";

/*
POST Requests will call postMongoInsert which will take the body of
the request break pass it into an empty object, create a record id
add it all into the empty object and then use the insertOne() 
MongoDB function to access the db and insert the document.
*/
function postMongoInsert(req, res) {
    var record_id = new Date().getTime();
    var obj = {};

    obj._id = record_id;
    obj.fname = req.body.fname;
    obj.lname = req.body.lname;
    obj.gpa = parseFloat(req.body.gpa);
    if (req.body.enrolled == "Yes") {
        obj.enrolled = true;
      } else {
        obj.enrolled = false;
      }

    MongoClient.connect(uri, { useUnifiedTopology: true })
        .then(client => {
            console.log("Connected to MongoDB database");
            const db = client.db('roster');
            const coll = db.collection('students');

            coll.insertOne(obj)
            .then(result => { res.redirect('http://localhost:3000/'); })
            .catch(error => console.error(error));
        }).catch(error => console.error(error));
};

/*
GET Requests without an :query qualifier will call getMongoFindAll
which will access the db and create an array of the response of 
all the documents in the database
*/
function getMongoFindAll(res) {
    MongoClient.connect(uri, { useUnifiedTopology: true })
        .then(client => {
            console.log("Connected to MongoDB database");
            const db = client.db('roster');
            const coll = db.collection('students');

            console.log("MONGODB FIND: GET - All");
            coll.find().toArray()
                .then((results) => { res.json(results) })
                .catch(error => console.error(error));
        }).catch(error => console.error(error));
};

/*
GET Requests with an :query qualifier will call getMongoFindQuery
which will access the db and create an array of the response of 
all the documents in the database that match the search query
*/
function getMongoFindQuery(passQuery, res) {
    var query;
    if (isNaN(passQuery)) {
        query = { "lname": passQuery };
    } else {
        query = { "_id": parseInt(passQuery) };
    }

    MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB database");
        const db = client.db('roster');
        const coll = db.collection('students');

        console.log("MONGODB FIND: GET - By Query");
        coll.find(query).toArray()
            .then((results) => { res.json(results); }) // return the res
            .catch(error => console.error(error));
    }).catch(error => console.error(error));
};

/*
PUT Requests will call putMongoUpdate which will use the passed
query variable to search the db for a matching document and 
use the $set within the findOneAndUpdate MongoDB function to 
make a change to the matching document.
*/
function putMongoUpdate(query, data, res) {
    MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB database");
        const db = client.db('roster');
        const coll = db.collection('students');

        console.log(query, data);
        coll.findOneAndUpdate(
            { _id: parseInt(query) }, 
            { $set: { fname: data.fname, lname: data.lname, gpa: data.gpa, enrolled: data.enrolled }},
            { upsert: true })
            .then(results => { console.log("Results:\n"); console.log(results); res.json('Success') })
            .catch(error => console.log(error));
    }).catch(error => console.error(error));
};

/*
DELETE Requests will call delMongoDelete which will use
the passed rid variable to call the deleteOne MongoDB
function to search the DB for a matching document and 
delete it.
*/
function delMongoDelete(rid, res) {
    var query = { "_id": parseInt(rid) };
    MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB database");
        const db = client.db('roster');
        const coll = db.collection('students');

        coll.deleteOne(query)
            .then(results => {
                if (results.deletedCount === 0) {
                    return res.json('404 - Unable to locate record');
                }
                res.json("Record: " + rid + " has been deleted");
            });
    }).catch(error => console.error(error));
};

module.exports = { 
    postMongoInsert: postMongoInsert,
    getMongoFindAll: getMongoFindAll,
    getMongoFindQuery: getMongoFindQuery,
    putMongoUpdate: putMongoUpdate,
    delMongoDelete: delMongoDelete
};