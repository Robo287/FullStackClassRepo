const req = require('express/lib/request');
const res = require('express/lib/response');

const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://127.0.0.1:27017";

function getMongoFindAll(res) {
    MongoClient.connect(uri, { useUnifiedTopology: true })
        .then(client => {
            console.log("Connected to MongoDB database");
            const db = client.db('roster');
            const coll = db.collection('students');

            console.log("MONGODB FIND: GET - All");
            coll.find().toArray()
                .then((results) => { res.render('index.ejs', { students: results }); })
                .catch(error => console.error(error));
        }).catch(error => console.error(error));
};

function getMongoFindQuery(passQuery, res) {
    var query;
    if (isNaN(passQuery)) {
        query = { "lname": passQuery };
    } else {
        query = { "_id": parseInt(passQuery) };
    }
    console.log(query);

    MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB database");
        const db = client.db('roster');
        const coll = db.collection('students');

        console.log("MONGODB FIND: GET - By Query");
        coll.find(query).toArray()
            .then((results) => { console.log(results); res.render('index.ejs', { students: results }); })
            .catch(error => console.error(error));
    }).catch(error => console.error(error));
};

function postMongoInsert(req, res) {
    var record_id = new Date().getTime();
    var obj = {};

    obj._id = record_id;
    obj.fname = req.body.fname;
    obj.lname = req.body.lname;
    obj.gpa = parseFloat(req.body.gpa);
    if (req.body.enrolled == "true") { //change for switch
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
            .then(result => { res.redirect('/students'); })
            .catch(error => console.error(error));
        }).catch(error => console.error(error));
};

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
    getMongoFindQuery: getMongoFindQuery ,
    putMongoUpdate: putMongoUpdate,
    delMongoDelete: delMongoDelete
};