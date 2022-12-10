// Node Modules
const express = require('express');
const app = express();
const bp = require('body-parser');
const mongo = require('./mongo');
const config = require('./config');
const axios = require('axios');
const { response } = require('express');

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Default route
/**
 * Default route for serving the index.ejs
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Authentication routes
/**
 * Endpoint route use to call mongodb authentication check
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.get('/auth', (req, res) => {
    mongo.checkAuth(req, res);
})
/**
 * Endpoint route use to call mongodb to create a new account
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.post('/auth', (req, res) => {
    mongo.addOneAccount(req, res);
})

// Search Routes
/**
 * Endpoint route use to serve search.ejs page
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.get('/search', (req, res) => {
    res.render('search.ejs', { user: config.user });
    console.log(config.user);
});
/**
 * Endpoint route use to post to search.ejs page and configure the global user variable
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.post('/search', (req, res) => {
    console.log(req.body);
    config.user.username = req.body.username;
    config.user.userid = req.body.userid;
    res.redirect('/search');
}); 

// IMDB API Routes
/**
 * Endpoint route use to request SearchTitle from IMDB API
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param query - user's query search term used to query the API for results
 * @returns {response} - response data from API
 */
app.get('/search/:query', (req, res) => {
    var query = req.params.query;
    var apikey = config.imdb_api_key;
    var requestUrl = "https://imdb-api.com/en/API/SearchTitle/" + apikey + "/" + query;
    axios.get(requestUrl).then(response => {
        res.send(response.data.results);
    });
});
/**
 * Endpoint route use to request Title from IMDB API
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - id of the title the user is searching for a response on
 * @returns {response} - response data from API
 */
app.get('/title/:id', (req, res) => {
    var id = req.params.id;
    var apikey = config.imdb_api_key;
    var requestUrl = "https://imdb-api.com/en/API/Title/" + apikey + "/" + id;
    axios.get(requestUrl).then(response => {
        console.log(response.data);
        res.send(response.data);
    });
});
/**
 * Endpoint route use to request SeasonEpisodes from IMDB API
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - id of the title the user is searching for a response on
 * @param season - season number the user is searching for a response on
 * @returns {response} - response data from API
 */
app.get('/episodes/:id/:season', (req, res) => {
    var id = req.params.id;
    var season = req.params.season;
    var apikey = config.imdb_api_key;
    var requestUrl = "https://imdb-api.com/en/API/SeasonEpisodes/" + apikey + "/" + id + "/" + season;
    axios.get(requestUrl).then(response => {
        res.send(response.data);
    })
});
/**
 * Endpoint route use to request YouTubeTrailer from IMDB API
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - id of the title the user is searching for a response on
 * @returns {response} - response data from API
 */
app.get('/yt/:id', (req, res) => {
    var id = req.params.id;
    var apikey = config.imdb_api_key;
    var requestUrl = "https://imdb-api.com/en/API/YouTubeTrailer/" + apikey + "/" + id;
    axios.get(requestUrl).then(response => {
        res.send(response.data);
    });
});

// Watchlist Routes
/**
 * Endpoint route use to call mongodb to return the user's watchlist from the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - id of the user that corresponds to the requested watchlist
 */
app.get('/watchlist/:id', (req, res) => {
    var id = req.params.id;
    mongo.getWatchList(req, res, id);
});
/**
 * Endpoint route use to call mongodb to add to the user's watchlist in the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 */
app.post('/update', (req, res) => {
    mongo.addWatchlistMongo(req, res);
});
/**
 * Endpoint route use to call mongodb to delete an entry from the user's watchlist in the DB
 * @param req - request object container used to take in data
 * @param res - response object container used to feed out data
 * @param id - id of the user that corresponds to the requested watchlist
 * @param title - id of the title that will be deleted from the watchlist
 */
app.delete('/update/:id/:title', (req, res) => {
    var id = req.params.id;
    var title = req.params.title;
    mongo.delOneWatchList(req, res, id, title);
})

// PORT
const PORT = process.env.PORT || 8008;
const server = app.listen(PORT, () => { console.log('Server connected to port: ' + PORT)});