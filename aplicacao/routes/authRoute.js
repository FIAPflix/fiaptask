const express = require('express');
const router = express.Router();
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');

// Route to add new user
router.post('/authNewUser', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  res.redirect('/');
})

router.post('/authUser', async (req, res) => {
  const { email, password } = req.body;
  signInWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // req.session.firebaseToken = user.accessToken;
      req.session.userInfo = user;
      res.status(200).redirect('/dashboard');
    })
    .catch((error) => {
      const errorCode = error.code; // auth/invalid-credential
      const errorMessage = error.message; // Firebase: Error (auth/invalid-credential).
      console.log(errorCode);
      console.log(errorMessage);
    });
})

router.post('/logout', async (req, res) => {

})

module.exports = router;