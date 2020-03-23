
const { db } = require('../utils/admin');

const firebase = require ('firebase');

const config = require('../utils/config');
firebase.initializeApp(config);


const { validateSignupData, validateLoginData } = require('../utils/validators');


exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

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
}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
   
    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

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
}