
const { db, admin } = require('../utils/admin');

const firebase = require ('firebase');

const config = require('../utils/config');
firebase.initializeApp(config);



const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utils/validators');

// Sign up user
exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png'

    //User Handle Authentication - unique handles only
    let token;
    let userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then( doc => {
            if(doc.exists){
                return res.status(400).json({ handle: "this handle is already taken"})
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
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
                return res.status(400).json({ email: "Email is already in used" })
            } else {
                return res.status(500).json({ error: err.code }) // 500 server error
            }
        });
};

// Log user in
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
                return res.status(403).json({ general: "Sorry, wrong credentials. Please try again!"}); // 403 unauthorized
            } else return res.status(500).json({ error: err.code})
        });
};

// Add user profile details
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then( () => {
        return res.json({ message: 'Details added successfully'});
    })
    .catch( err => {
        console.error(err);
        return res.status(500).json({error: err.code})
    });
};

// Upload profile image for user
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new BusBoy({ headers: req.headers }); // instance of BusBoy with our headers

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on( 'file', (fieldname, file, filename, encoding, mimetype) => { // file event

        // console.log(fieldname);
        // console.log(filename);
        // console.log(mimetype);

        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({ error: 'Wrong file type submitted'})
        }

        // my.image.png (need the png extension)
        const imageExtension = filename.split('.')[filename.split('.').length -1];
        // 122432421342342.png for filename
        imageFileName = `${Math.round(Math.random() * 100000000000)}.${imageExtension}`;
        const filepath= path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimetype};

        file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            // construct url to add to user object
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            // authenticated at this step by middleware and user object is available
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
        })
        .then(() => {
            return res.json({ message: " Image uploaded sucessfully"})
        })
        .catch( err => {
            console.error(err);
            return res.status(500).json({error: err.code})
        })
    })
    busboy.end(req.rawBody);
};