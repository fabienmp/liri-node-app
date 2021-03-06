require("dotenv").config();

const keys = require("./keys.js");
const axios = require('axios');
const fs = require('fs');
const moment = require('moment')
const chalk = require('chalk');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const winston = require('winston');
const myWinstonOptions = {
    transports: new winston.transports.File({
        filename: './log.txt'
    })
}
const logger = new winston.createLogger(myWinstonOptions)

var validCommands = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says', '-help'];

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var processBandsInTown = function (commandParam, callBack) {
    console.log(chalk.red("\r -- Searching BandsInTown for artist '" + commandParam + "' -- \r"));
    logger.info("\r -- Searching OMDB for artist '" + commandParam + "' -- \r");
    axios.get('https://rest.bandsintown.com/artists/' + commandParam + '/events?app_id=codingbootcamp', {})
        .then(function (response) {
            //console.log(response);
            if (response != null && response.data.length > 0) {
                var eventObject = response.data[0];
                console.log('* Name of the venue: ' + chalk.yellow(eventObject.venue.name));
                logger.info('* Name of the venue: ' + eventObject.venue.name);
                console.log('* Venue location: ' + chalk.yellow(eventObject.venue.city + ", " + eventObject.venue.country));
                logger.info('* Venue location: ' + eventObject.venue.city + ", " + eventObject.venue.country);
                console.log('* Date of the Event: ' + chalk.yellow(moment(eventObject.datetime).format("MM/DD/YYYY")));
                logger.info('* Date of the Event: ' + moment(eventObject.datetime).format("MM/DD/YYYY"));

            }
            if (callBack != null) {
                callBack();
            }
        })
        .catch(function (error) {
            console.log(error);
            logger.error(error);
        });
}

var processOMDB = function (commandParam, callBack) {
    console.log(chalk.red("\r -- Searching OMDB for movie '" + commandParam + "' -- \r"));
    logger.info("\r -- Searching OMDB for movie '" + commandParam + "' -- \r");
    axios.get('http://www.omdbapi.com/?t=' + commandParam + "&apikey=trilogy", {
            "t": commandParam,
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

                logger.info('* Title: ' + movieObject.Title);
                logger.info('* Release Year: ' + movieObject.Year);
                logger.info('* IMDB Rating: ' + movieObject.Ratings[0].Value);
                logger.info('* Rotten Tomatoes Rating: ' +movieObject.Ratings[1].Value);
                logger.info('* Country: ' + movieObject.Country);
                logger.info('* Language: ' + movieObject.Language);
                logger.info('* Plot: ' + movieObject.Plot);
                logger.info('* Actors: ' + movieObject.Actors);
            }
            if (callBack != null) {
                callBack();
            }
        })
        .catch(function (error) {
            console.log(error);
            logger.error(error);
        });
}

var processSpotify = function (commandParam, callBack) {
    console.log(chalk.red("\r -- Searching Spotify DB for track '" + commandParam + "' -- \r"));
    logger.info("\r -- Searching Spotify DB for track '" + commandParam + "' -- \r");
    spotify
        .search({
            type: 'track',
            query: commandParam
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

                if (trackObject.artists.length > 0)
                    logger.info('* Artist: ' + trackObject.artists[0].name);
                logger.info('* Song Name: ' + trackObject.name);
                logger.info('* Preview URL: ' + trackObject.preview_url);
                logger.info('* Album: ' + trackObject.album.name);

            }
            if (callBack != null) {
                callBack();
            }
        })
        .catch(function (err) {
            console.log(err);
            logger.error(err);
        });
}


var captureCommand = function () {

    var userCommand = '';
    var userCommandParam = '';

    process.argv.forEach(function (val, index, array) {
        if (index == 2) {
            userCommand = val;
            if (validCommands.indexOf(userCommand) == -1) {
                console.log(chalk.red('Oops! The command you chose is not valid. Use -help command to see available commands.'));
                logger.info('Oops! The command you chose is not valid. Use -help command to see available commands.');
                process.exit();
            }
            console.log('Command: ' + chalk.blue(userCommand));
            logger.info('Command: ' + chalk.blue(userCommand));
        }
        if (index == 3) {
            userCommandParam = val;
            console.log('Param: ' + chalk.blue(userCommandParam));
            logger.info('Param: ' + chalk.blue(userCommandParam));
        }
    });

    dispatchCommand(userCommand, userCommandParam);
}

var dispatchCommand = function (userCommand, userCommandParam, callBack) {

    if (userCommand == '-help') {
        console.log('Valid commands are: \r');
        console.log(chalk.yellow('concert-this') + ' <artist/band name here>');
        console.log(chalk.yellow('spotify-this-song') + '<song name here>');
        console.log(chalk.yellow('movie-this') + ' <movie name here>');
        console.log(chalk.yellow('do-what-it-says'));

        logger.info('Valid commands are: \r');
        logger.info('concert-this' + ' <artist/band name here>');
        logger.info('spotify-this-song' + '<song name here>');
        logger.info('movie-this' + ' <movie name here>');
        logger.info('do-what-it-says');
    }

    if (userCommand == 'do-what-it-says') {
        fs.readFile('random.txt', "utf8", function (err, data) {

            var lines = data.split('\n');
            var instruction = '';
            var param = '';

            for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

                if (lines[lineIndex].split(',').length == 1) {
                    instruction = lines[lineIndex].split(',')[0].replaceAll('\r', '');
                } else if (lines[lineIndex].split(',').length == 2) {
                    instruction = lines[lineIndex].split(',')[0].replaceAll('\r', '');
                    param = lines[lineIndex].split(',')[1].replaceAll('"', '').replaceAll('\r', '');
                }

                if (validCommands.indexOf(instruction) > -1) {
                    dispatchCommand(instruction, param);
                }
            }
        });
    }

    if (userCommand == 'spotify-this-song') {
        if (userCommandParam == null || userCommandParam == '') {
            userCommandParam = 'The Sign Ace Of Base';
        }
        processSpotify(userCommandParam, callBack);
    }

    if (userCommand == 'concert-this') {
        if (userCommandParam == null || userCommandParam == '') {
            userCommandParam = 'Sting';
        }
        processBandsInTown(userCommandParam, callBack)
    }

    if (userCommand == 'movie-this') {
        if (userCommandParam == null || userCommandParam == '') {
            userCommandParam = 'Mr. Nobody';
        }
        processOMDB(userCommandParam, callBack);
    }
}

captureCommand();