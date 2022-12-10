/**
 * Abstracted Mongo functions to keep these processes separate
 * from other backend processes
 */
const req = require('express/lib/request');
const res = require('express/lib/response');
const config = require('./config');

const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://127.0.0.1:27017";

/**
 * Takes in authentication data from log in form and compares to DB entries
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @returns {results} - used in notifying the user if login was sucessful
 */
function checkAuth(req, res) {
    console.log(req.query);
    var email = req.query.email;
    var password = req.query.password;
    MongoClient.connect(uri, { useUnifiedTopology: true }).then(client => {
        console.log("Connected to Database");
        const db = client.db("IMDBmongodb");
        const coll = db.collection('users');
    
        coll.find({ $and: [{ email: email }, {password: password}] }).toArray().then(results => { 
            if (results.length != 0) {
                config.user.userid = results[0]._id;
                config.user.username = results[0].name;
                config.user.watchlist = results[0].watchlist;
                res.redirect("/search");
            } else {
                console.log("Incorrect username or password");
                res.redirect("http://localhost:8008/");
            }
         });
    });
}

/**
 * Takes in registration data and created a new DB entries
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @returns {result} - used in notifying the user if account creation was successful
 */
function addOneAccount(req, res) {
    console.log(req.body);
    var obj = {};
    var user_id = new Date().getTime();
    var name = req.body.rname;
    var email = req.body.remail;
    var password = req.body.rpassword;
    var watchlist = [];

    obj._id = user_id;
    obj.name = name;
    obj.email = email;
    obj.password = password;
    obj.watchlist = watchlist;
    MongoClient.connect(uri, { useUnifiedTopology: true }).then(client => {
        console.log("Connected to Database");
        const db = client.db("IMDBmongodb");
        const coll = db.collection('users');

        coll.insertOne(obj).then(result => { res.redirect('/'); })
            .catch(error => console.error(error));
    }).catch(error => console.error(error));
};

/**
 * Takes in title id and saves it to the corresponding user's watchlist in the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @returns {results} - used in notifying the user if DB entry was added sucessfully
 */
function addWatchlistMongo(req, res) {
    var userid = parseInt(req.body.userid);
    var titleid = req.body.titleid
    var titlename = req.body.titlename;
    var postersrc = req.body.postersrc;
    MongoClient.connect(uri, { useUnifiedTopology: true}).then(client => {
        console.log("Connected to Database");
        const db = client.db("IMDBmongodb");
        const coll = db.collection('users');

        coll.updateOne({ _id: userid },{ $push: { watchlist: titleid } }).then(results => {
            console.log("Success:"); console.log(results); res.redirect("/search") }).catch(error => console.log("Error:" + error));
    }).catch(error => console.log("Error:" + error));
}

/**
 * Takes in user id and returns the corresponding watchlist from the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - user id of currently logged in user, used for DB search
 * @returns {results} - used in notifying the user if DB entry was found
 */
function getWatchList(req, res, id) {
    var userid = parseInt(id);
    MongoClient.connect(uri, { useUnifiedTopology: true }).then(client => {
        console.log("Connected to Database");
        const db = client.db("IMDBmongodb");
        const coll = db.collection('users');

        coll.find({ _id: userid }).toArray().then(results => {
            res.send(results[0].watchlist);
        })
    });
}

/**
 * Takes in user id and returns the corresponding watchlist from the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - user id of currently logged in user, used for DB search
 * @param title - title id of the title that needs to be removed from DB
 * @returns {results} - used in notifying the user if DB entry was found and deleted
 */
function delOneWatchList(req, res, id, title) {
    var userid = parseInt(id);
    MongoClient.connect(uri, { useUnifiedTopology: true }).then(client => {
        console.log("Connected to Database");
        const db = client.db("IMDBmongodb");
        const coll = db.collection('users');

        coll.updateOne({ _id: userid }, { $pull: { watchlist: title } }).then(results => {
            res.send(results);
        }).catch(error => console.log(error));
    }).catch(error => console.log(error));
}

module.exports = {
    addWatchlistMongo: addWatchlistMongo,
    checkAuth: checkAuth,
    addOneAccount: addOneAccount,
    getWatchList: getWatchList,
    delOneWatchList: delOneWatchList
};