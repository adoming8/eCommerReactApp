const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");
// Express Server
const express = require('express');
const app = express();

// Setting up enviromental variables
require('dotenv').config();


// initializing the SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); 

// Initializing an instance of firestore
const db = admin.firestore();

// Initinalize Firebase
  //web app's Firebase configuration
  var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: "socialmediaapp-290c1.firebaseapp.com",
    databaseURL: "https://socialmediaapp-290c1.firebaseio.com",
    projectId: "socialmediaapp-290c1",
    storageBucket: "socialmediaapp-290c1.appspot.com",
    messagingSenderId: "534548684181",
    appId: "1:534548684181:web:8e7c0958b2710740432a9c",
    measurementId: "G-G3PGEEKC93"
  };
const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)


// ============ GETTING DOCs FUNCTION (fetching collections from db) ===============
app.get('/screams', (req, res) => {
    db.collection("screams")
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
            screamId: doc.id,
            body: doc.data().body,
            userHadle: doc.data().userHandle,
            createdAt: doc.data().createdAt
        }); 
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});


//Middleware Authentication
const validateFBIdToken = (req, res, next) => {
  console.log("Check if request is authorized with Firebase ID token");
  console.log(req.headers);

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !req.cookies.__session
  ) {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
    return res.status(403).json({ error: "Unauthorised" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      console.log("ID Token correctly decoded", decodedToken);
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(error => {
      console.error(
        "Error while verifying Firebase ID token:" + idToken,
        error
      );
      res.status(403).json(error);
    });
};
  

// ======  Creating DOCs FUNCTION (fetching collections from db) ===========
app.post('/scream', validateFBIdToken, (req, res) => {
  if (req.body.body.trim() === ''){
      return res.status(400).json({body: 'Body must not be empty'});
  }

  // will get req.body since its a post request
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };

  db.collection("screams")
    .add(newScream)
    .then(doc => { // document created, return response
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" }); // return server error
      console.error(err);
    });
});

// Helper Function - checks if its a valid email
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

// Helper Function - verifies if handle string is empty
const isEmpty = (string) => {
    if (string.trim() === '') return true; // trim to elimite blank spaces
    else return false;
}

// ========= SignUp Route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };
        // email Verification
    let errors = {};
    if (isEmpty(newUser.email)){
        errors.email = 'Must not be empty'
    } else if ( !isEmail(newUser.email)){
        errors.email = 'Must be a valid email address'
    }
        // email Verification
    if (isEmpty(newUser.password)){
        errors.password = 'Must not be empty'
    } if (newUser.password !== newUser.confirmPassword)
        errors.password = 'Passwords must match';

    if (isEmpty(newUser.handle)){ errors.handle = 'Must not be empty'} 
    
    if ( Object.keys(errors).length > 0 ) return res.status(400).json(errors)

    // TODO validate data

    //User Handle Authentication - unique handles only
    let token;
    let userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then( doc => {
            if(doc.exists){
                return res.status(400).json({ handle: 'this handle is already taken'})
            } else {
                return firebase
                .auth()
                .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then ( data => {
            userId = data.user.uid;
            return data.user.getIdToken(); // token is need to protect route and need to acess    
        })
        .then ( idtoken => {
            token = idtoken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then (() => {
            return res.status(201).json({token});
        })
        .catch( err => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use' ) {
                return res.status(400).json({ email: 'Email is already in used' })
            } else {
                return res.status(500).json({ error: err.code }) // 500 server error
            }
        });
});



app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
   
    let errors = {};

    if(isEmpty(user.email) ) errors.email = 'Must not be empty'
    if(isEmpty(user.password) ) errors.password = 'Must not be empty'

    if (Object.keys(errors).length > 0 ) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then (data =>{
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token})
        })
        .catch(err => {
            console.error(err);
            if(err.code === 'auth/wrong-password'){
                return res.status(403).json({ general: 'Sorry, wrong credentials. Please try again!'}); // 403 unauthorized
            } else return res.status(500).json({ error: err.code})
        });
});


// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);






