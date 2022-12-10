/**
 * Sensitive variables abstracted from main code
 * @param imdb_api_key - API key required for IMDB API calls
 * @param user - saves state of local logged in user for access by local files
 */

const imdb_api_key = "k_cvboy11r";

var user = {
    username: '',
    userid: '',
    watchlist: []
}

module.exports = { imdb_api_key: imdb_api_key, user: user};