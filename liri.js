require("dotenv").config();
var keys = require("./keys.js");

var axios = require('axios');
var fs = require('fs');
const moment = require('moment')
const chalk = require('chalk');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var validCommands = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', '-help']
var userCommand = '';
var userCommandParam = '';

process.argv.forEach(function (val, index, array) {
    if (index == 2) {
        userCommand = val;
        if (validCommands.indexOf(userCommand) == -1) {
            console.log(chalk.red('Oops! The command you chose is not valid. Use -help command to see available commands.'));
            process.exit();
        }
        console.log('Command: ' + chalk.blue(userCommand));
    }
    if (index == 3) {
        userCommandParam = val;
        console.log('Param: ' + chalk.blue(userCommandParam));
    }
});

if (userCommand == '-help') {
    console.log('Valid commands are: \r');
    console.log(chalk.yellow('concert-this') + ' <artist/band name here>');
    console.log(chalk.yellow('spotify-this-song') + '<song name here>');
    console.log(chalk.yellow('movie-this') + ' <movie name here>');
    console.log(chalk.yellow('do-what-it-says'));
}

if (userCommand == 'do-what-it-says') {
    fs.readFile('random.txt', "utf8", function (err, data) {

        var lines = data.split('\n');
        var instruction = '';
        var param = '';

        for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

            if (lines[lineIndex].split(',').length == 1) {
                instruction = lines[lineIndex].split(',')[0];
            } else if (lines[lineIndex].split(',').length == 2) {
                instruction = lines[lineIndex].split(',')[0];
                param = lines[lineIndex].split(',')[1];
            }

            if (validCommands.indexOf(instruction) > -1) {

            }

        }
    });
}



var processBandsInTown = function (param) {
    axios.get('https://rest.bandsintown.com/artists/' + userCommandParam + '/events?app_id=codingbootcamp', {})
        .then(function (response) {
            console.log(response);
            if (response != null && response.data.length > 0) {
                var eventObject = response.data[0];
                console.log('* Name of the venue: ' + chalk.yellow(eventObject.venue.name));
                console.log('* Venue location: ' + chalk.yellow(eventObject.venue.city + ", " + eventObject.venue.country));
                console.log('* Date of the Event: ' + chalk.yellow(moment(eventObject.datetime).format("MM/DD/YYYY")));
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

var processOMDB = function (param) {
    axios.get('http://www.omdbapi.com/?t=' + userCommandParam + "&apikey=trilogy", {
            "t": userCommandParam,
            "apikey": 'trilogy'
        })
        .then(function (response) {
            //console.log(response);
            if (response != null && response.data != null) {
                var movieObject = response.data;
                console.log('* Title: ' + chalk.yellow(movieObject.Title));
                console.log('* Release Year: ' + chalk.yellow(movieObject.Year));
                console.log('* IMDB Rating: ' + chalk.yellow(movieObject.Ratings[0].Value));
                console.log('* Rotten Tomatoes Rating: ' + chalk.yellow(movieObject.Ratings[1].Value));
                console.log('* Country: ' + chalk.yellow(movieObject.Country));
                console.log('* Language: ' + chalk.yellow(movieObject.Language));
                console.log('* Plot: ' + chalk.yellow(movieObject.Plot));
                console.log('* Actors: ' + chalk.yellow(movieObject.Actors));

            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

var processSpotify = function (param) {
    console.log(chalk.red("\r -- Searching Spotify DB for track '" + userCommandParam + "' -- \r"));
    spotify
        .search({
            type: 'track',
            query: userCommandParam
        })
        .then(function (response) {
            //console.log(response);
            if (response != null && response.tracks.total > 0) {
                var trackObject = response.tracks.items[0];

                if (trackObject.artists.length > 0)
                    console.log('* Artist: ' + chalk.yellow(trackObject.artists[0].name));
                console.log('* Song Name: ' + chalk.yellow(trackObject.name));
                console.log('* Preview URL: ' + chalk.yellow(trackObject.preview_url));
                console.log('* Album: ' + chalk.yellow(trackObject.album.name));

            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

if (userCommand == 'spotify-this-song') {
    if (userCommandParam == null || userCommandParam == '') {
        userCommandParam = 'The Sign Ace Of Base';
    }
    processSpotify(userCommandParam);
}

if (userCommand == 'concert-this') {
    if (userCommandParam == null || userCommandParam == '') {
        userCommandParam = 'Sting';
    }
    processBandsInTown(userCommandParam)
}

if (userCommand == 'movie-this') {
    if (userCommandParam == null || userCommandParam == '') {
        userCommandParam = 'Mr. Nobody';
    }
    processOMDB(userCommandParam);
}