
const { admin } = require('./admin')

//Middleware Authentication
module.exports = (req, res, next) => {
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