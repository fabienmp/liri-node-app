require("dotenv").config();
var keys = require("./keys.js");

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

if (userCommand == 'spotify-this-song') {
    if (userCommandParam == null || userCommandParam == '') {
        userCommandParam = 'The Sign Ace Of Base';
    }
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