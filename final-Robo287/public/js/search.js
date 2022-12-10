const brandLink = document.getElementById("brand");
const logoutBtn = document.getElementById("logout-btn");
const searchBtn = document.getElementById("search-button");
const resultsTable = document.getElementById("results-table");
const titleInfo = document.getElementById("title-info");
const epDiv = document.getElementById("title-episodes");
const parseuid = document.getElementById("user-id");
const parsetitle = document.getElementById("title-name");
const parsePoster = document.getElementById("poster-src");
const watchlistLink = document.getElementById("watchlist-link");
const watchlistDiv = document.getElementById("watchlist-page");
const watchListTable = document.getElementById("watchlist-table");
const messageDiv = document.getElementById("message");

var userLoggedId = document.getElementById("profile-id").textContent;
parseuid.setAttribute('value', userLoggedId);

brandLink.addEventListener('click', _ => {
    window.alert("Congrats!\nYou found an easter egg!\n10pts to you!");
})

/**
 * Event listener to run code to make the search functionality possible,
 * this will use a fetch request to do a GET on the /search/:id endpoint
 * that will return the search response.
 * Returned response will be used to build a dynamic table of all the results
 * to show the posters and title information.
 */
searchBtn.addEventListener('click', _ => {
    titleInfo.style.display = "none";
    watchlistDiv.style.display = "none"
    resultsTable.style.display = "block";
    messageDiv.style.display = "none";
    resultsTable.innerHTML = "";
    var query = document.getElementById("search-query").value;
    fetch('/search/' + query).then(res => res.json()).then(results => {
        // console.log(json[0])
        for(var i = 0; i < results.length; i++) {
            var img = document.createElement('img');
            var a = document.createElement('a');
            img.src = results[i].image;
            a.setAttribute('id', results[i].id);
            a.onclick=function(){ getTitleInfo(this.id) };
            var title = document.createTextNode(results[i].title);
            var desc = document.createTextNode(results[i].description);
            var row = resultsTable.insertRow();
            var imgcell = row.insertCell();
            imgcell.appendChild(a).appendChild(img).style.width = '150px';
            var titlecell = row.insertCell();
            titlecell.appendChild(title);
            var desccell = row.insertCell();
            desccell.appendChild(desc);
        }
    });
});

/**
 * Performs fetch requests on endpoints to dynamically build title detail pages
 * @param titleid - parsed from the link used to initiate the event, used to search for title in API
 * fetch reqquest points to the /title/:id endpoint which will be used to access the API
 * @returns {response} - object data fields used to dynamically build page
 */
function getTitleInfo(titleid) {
    resultsTable.style.display = "none";
    watchlistDiv.style.display = "none"
    titleInfo.style.display = "block";
    messageDiv.style.display = "none";
    epDiv.innerHTML = "";
    var titlePosterImg = document.getElementById("title-poster");
    var titleCaption = document.getElementById("title-caption")
    var titleTitle = document.getElementById("title-title");
    var titleRating = document.getElementById("title-rating");
    var titlePlot = document.getElementById("title-plot");
    var titleYouTube = document.getElementById("title-yt");
    fetch('/title/' + titleid).then(res => res.json()).then(results => {
        titlePosterImg.src = results.image;
        parsePoster.value = results.image;
        titlePosterImg.style.width = '300px';
        titleCaption.innerHTML = titleid;
        titleCaption.value = titleid;
        titleTitle.innerHTML = results.title;
        titleRating.innerHTML = results.imDbRating;
        parsetitle.value = results.title;
        titlePlot.innerHTML = results.plot;
        var header = document.getElementById("title-epstats");
        if (results.tvSeriesInfo != null) {
            header.innerHTML = "Episodes:";
            var seasonArr = results.tvSeriesInfo.seasons;
            var numberOfSeason = seasonArr.length;
            var table = document.createElement('table');
            epDiv.appendChild(table);
            table.setAttribute('class', 'table');
            for(var i = 1; i <= numberOfSeason; i++) {
                fetch('/episodes/' + titleid + "/" + i).then(res => res.json()).then(results => {
                    results.episodes.forEach(episode => {
                        var epRow = document.createElement('tr');
                        table.appendChild(epRow);
                        var epSeasCell = document.createElement('td');
                        var epSeas = document.createTextNode("S" + episode.seasonNumber);
                        epRow.appendChild(epSeasCell).appendChild(epSeas);
                        epSeasCell.setAttribute('style', 'width: 5%');
                        var epNumCell = document.createElement('td');
                        var epNum = document.createTextNode("Ep. " + episode.episodeNumber);
                        epRow.appendChild(epNumCell).appendChild(epNum);
                        epNumCell.setAttribute('style', 'width: 5%');
                        var epTitleCell = document.createElement('td');
                        var epTitle = document.createTextNode(episode.title);
                        epRow.appendChild(epTitleCell).appendChild(epTitle);
                        var epPlotCell = document.createElement('td');
                        var epPlot = document.createTextNode(episode.plot);
                        epRow.appendChild(epPlotCell).appendChild(epPlot);
                    });
                });
            }
        } else { 
            header.innerHTML = "Movie Info:";
            var hrelease = document.createElement('h5');
            var release = document.createTextNode("Release Date: " + results.releaseDate);
            epDiv.appendChild(hrelease).appendChild(release);
            var hruntime = document.createElement('h5');
            var runtime = document.createTextNode("Runtime: " + results.runtimeStr);
            epDiv.appendChild(hruntime).appendChild(runtime);
            var hawards = document.createElement('h5');
            var awards = document.createTextNode("Awards: " + results.awards);
            epDiv.appendChild(hawards).appendChild(awards);
            var hstars = document.createElement('h5');
            var stars = document.createTextNode("Starring: " + results.stars);
            epDiv.appendChild(hstars).appendChild(stars);
            console.log(results.boxOffice);
        }
    });
    fetch('/yt/' + titleid).then(res => res.json()).then(results => {
        var yturl = "https://www.youtube.com/embed/" + results.videoId;
        titleYouTube.src = yturl;
    });
}

/**
 * Deletes a selected entry in the watchlist
 * @param titleid - parsed from the link used to initiate the event, used to search for title in API
 * @returns {response} - used in notifying the user of successful deletion
 */
function deleteListEntry(titleid) {
    fetch('/update/' + userLoggedId + '/' + titleid, { method: 'DELETE' }).then(res => res.json()).then(results => {
        if(results.modifiedCount > 0) {
            var message = document.createTextNode("Entry from your watchlist deleted!");
            messageDiv.appendChild(message);
            messageDiv.style.color = 'red';
            watchlistDiv.style.display = "none"
        }
    })
}

/**
 * Link used to show the watchlist page, used the /watchlist/:id endpoint to 
 * get the user's saved watchlist and then recursively uses /title/:title to 
 * get the necessary info to display for the watchlist.
 */
watchlistLink.addEventListener('click', _ => {
    watchlistDiv.style.display = "block"
    resultsTable.style.display = "none";
    titleInfo.style.display = "none";
    messageDiv.style.display = "none";
    watchListTable.innerHTML = "";
    var count = 1;
    fetch('/watchlist/' + userLoggedId).then(res => res.json()).then(results => {
        results.forEach(title => {
            fetch('/title/' + title).then(res => res.json()).then(results => {
                var img = document.createElement('img');
                var a = document.createElement('a');
                var btn = document.createElement('button');
                btn.setAttribute('id', results.id)
                btn.setAttribute('class', 'btn btn-danger');
                btn.onclick=function(){ deleteListEntry(this.id) };
                img.src = results.image;
                a.setAttribute('id', results.id);
                a.onclick=function(){ getTitleInfo(this.id) };
                var title = document.createTextNode(results.title);
                var season;
                if (results.tvSeriesInfo == null) { 
                    season = document.createTextNode("Runtime: " + results.runtimeStr); 
                } else { 
                    season = document.createTextNode("Number of Seasons: " + results.tvSeriesInfo.seasons.length); 
                }
                var btnText = document.createTextNode("Delete");
                var row = watchListTable.insertRow();
                row.setAttribute('class', 'w-100');
                var imgcell = row.insertCell().appendChild(a).appendChild(img).style.width = '150px';
                var titlecell = row.insertCell().appendChild(title);
                var seasoncell = row.insertCell().appendChild(season);
                var delBtncell = row.insertCell().appendChild(btn).appendChild(btnText);
            });
        })
    });
})