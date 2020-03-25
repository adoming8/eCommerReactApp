
const functions = require("firebase-functions");

const { getAllScreams, postOneScream } = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users')

const validateFBIdToken = require('./utils/middleware')

// Express Server
const express = require('express');
const app = express();

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', validateFBIdToken, postOneScream);

// Users Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', validateFBIdToken ,uploadImage);
app.post('/user', validateFBIdToken ,addUserDetails);



// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);






