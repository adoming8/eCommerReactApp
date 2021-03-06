const admin = require("firebase-admin");
const serviceAccount = require('../ServiceAccountKey.json');
const functions = require("firebase-functions");


// initializing the app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "socialmediaapp-290c1.appspot.com"
  }); 

// Initializing an instance of cloud firestore 
const db = admin.firestore();

module.exports = { admin, db, serviceAccount}
