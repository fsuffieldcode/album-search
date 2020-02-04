require('dotenv').config();

const express = require('express');
const ejs = require('ejs')
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');

const searchResults = ""
// require spotify-web-api-node package here:

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: '06bad78299c149c4b4b022537c7fb88e',
    clientSecret: 'bdf62e4caf2147c48d1572d8247bfe9f',
    redirectUri: 'http://localhost:3000/'
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    }
);

// Our routes go here:

app.post("/artist-search", function (req, res) {
    spotifyApi
        .searchArtists(req.body.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API
            res.render('artist-search-results', {searchResults: data.body})
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get("/", function (req, res) {
    res.render('home')
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));