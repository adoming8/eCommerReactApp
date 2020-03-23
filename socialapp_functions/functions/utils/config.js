const serviceAccount = require("../ServiceAccountKey.json");

// Setting up enviromental variables
require('dotenv').config();

module.exports = {
    apiKey: process.env.apiKey,
    authDomain: "socialmediaapp-290c1.firebaseapp.com",
    databaseURL: "https://socialmediaapp-290c1.firebaseio.com",
    projectId: "socialmediaapp-290c1",
    storageBucket: "socialmediaapp-290c1.appspot.com",
    messagingSenderId: "534548684181",
    appId: "1:534548684181:web:8e7c0958b2710740432a9c",
    measurementId: "G-G3PGEEKC93"
  };