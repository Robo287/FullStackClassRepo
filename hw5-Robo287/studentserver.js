const express = require('express');
const bp = require('body-parser');
const mongojs = require("./mongo");
const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://127.0.0.1:27017";

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json())
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.redirect('/students');
});

app.get('/students', (req, res) => { 
    mongojs.getMongoFindAll(res);
});

app.get('/students/:query', (req, res) => {
    var query = req.params.query;
    mongojs.getMongoFindQuery(query, res);
});

app.post('/students', (req, res) => {
    mongojs.postMongoInsert(req, res);
});

app.put('/students', (req, res) => {
    var query = req.body._id;
    var enrolledBool;
    if (req.body.enrolled == "true") { 
        enrolledBool = true; 
    } else { 
        enrolledBool = false; 
    }
    var data = { fname: req.body.fname, lname: req.body.lname, gpa: parseFloat(req.body.gpa), enrolled: enrolledBool };
    mongojs.putMongoUpdate(query, data, res);
});

app.delete('/students', (req, res) => {
    mongojs.delMongoDelete(req.body._id, res);
});

    app.listen(5678, function() {
        console.log('listening on port 5678');
    });