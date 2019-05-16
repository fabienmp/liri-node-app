# UC Berkeley Extension : Homework #8
## LIRI Bot

This project is a simple LIRI Bot. LIRI is a Language Interpretation and Recognition Interface. This is a command line node app that takes in parameters and gives you back data. In this particular app, we handle five different commands:

* -help
* do-what-it-says
* concert-this
* movie-this
* spotify-this-song

## Commands 
### -help

This particular instruction provides the user with all the available commands and their respective format.

![-help](https://github.com/fabienmp/liri-node-app/blob/master/Screenshots/help%20command.PNG?raw=true)

### do-what-it-says

This command can be use to read a batch of instructions from the file 'random.txt' in the root folder. 
There should not be more than one instruction per line.

![do-what-it-says](https://github.com/fabienmp/liri-node-app/blob/master/Screenshots/do-what-it-says%20command.PNG?raw=true)

### concert-this

This command takes in one parameter, an artist/band name. This will search the Bands in Town Artist Events API and returns the following  data:

* Name of the venue
* Venue location
* Date of the Event (use moment to format this as "MM/DD/YYYY")

![concert-this](https://github.com/fabienmp/liri-node-app/blob/master/Screenshots/concert-this%20command.PNG?raw=true)

###  spotify-this-song

This command takes in one parameter, a song title. This will search the Spotify API and returns the following data:

* Artist(s)
* The song's name
* A preview link of the song from Spotify
* The album that the song is from

![-help](https://github.com/fabienmp/liri-node-app/blob/master/Screenshots/spotify-this-song%20command.PNG?raw=true)

###  movie-this

This command takes in one parameter, a movie name. This will search the OMDB API and returns the following data:

* Title of the movie.
* Year the movie came out.
* IMDB Rating of the movie.
* Rotten Tomatoes Rating of the movie.
* Country where the movie was produced.
* Language of the movie.
* Plot of the movie.
* Actors in the movie.

![-help](https://github.com/fabienmp/liri-node-app/blob/master/Screenshots/movie-this%20command.PNG?raw=true)

## Packages Used

* winston: The winston module is used to log all the commands, parameters, errors and data results.
* moment: This package was used to parse dates.
* chalk: This package was used to color the console text.
* axios: Used to make GET requests to the OMDB, BandsInTown APIs.
* node-spotify-api: Used to retrieve info about a song.

## Debugging 

A set of launch configurations are provided in order to quickly test all the features of this app.
At the moment, the configuration file is only compatible with VS Code (https://code.visualstudio.com/).

```
        {
            "type": "node",
            "request": "launch",
            "name": "OMDB",
            "program": "${workspaceFolder}/liri.js",
            "args": ["movie-this", "Lion King"]
        }
```

## Author

Fabien Mansoubi - https://github.com/fabienmp


