//Anthony Robustelli - Z23478142 - sentiment-analysis.js
const Sent = require('sentiment'); //define sentiment module to be used
const fs = require('fs'); //define fs module to be used

const sent = new Sent(); //instantiate a sentiment object

try {
    const headline = fs.readFileSync('news.txt', 'utf8'); //define headline and have fs read in the text from news.txt to headine
    var sentResults = sent.analyze(headline); //use sentiment to analyze the headline text
    console.log("The article headline is: " + headline); //show the user the text that was read/analyzed
    console.log("The Sentiment Analysis results are as follows:"); 
    console.dir(sentResults); //show the user the analysis results
} catch (err) {
    console.log(err); //catch and log errors
}
