const express = require('express');
const bp = require('body-parser');
const mongojs = require('./mongojs');
const MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://127.0.0.1:27017";
const cors = require('cors');

const app = express();

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json())
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => { 

 });

app.get('/students', (req, res) => {
    mongojs.getMongoFindAll(res);
});

app.get('/students/:id', (req, res) => {
    var query = req.params.id
    mongojs.getMongoFindQuery(query, res);
});

app.put('/students', (req, res) => {
    var query = req.body._id
    var data = { fname: req.body.fname, lname: req.body.lname, gpa: parseFloat(req.body.gpa), enrolled: req.body.enrolled };
    mongojs.putMongoUpdate(query, data, res);
});

app.post('/students', (req, res) => {
    mongojs.postMongoInsert(req,res);
});

app.delete('/students/:id', (req, res) => {
    mongojs.delMongoDelete(req.body._id, res);
});

// Server and PORT setup
const port = process.env.PORT || 5678;
const server = app.listen(port, () => { console.log("Server listening on port " + port) });

// 404
app.use((req, res, next) => { res.status(404).send('Error 404!'); });
// Server Error
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
        res.status(err.statusCode).send(err.message);
    }
});