const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");


// initializing the app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  }); 