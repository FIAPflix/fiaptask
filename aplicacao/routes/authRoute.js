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
      req.session.userInfo = user;
      res.status(200).redirect('/home');
    })
    .catch((error) => {
      const errorCode = error.code; // auth/invalid-credential
      const errorMessage = error.message; // Firebase: Error (auth/invalid-credential).
      console.log(errorCode);
      console.log(errorMessage);
    });
})

router.get('/logout', async (req, res) => {
  signOut(getAuth()).then(() => {
    req.session.destroy(error => {
      if (error) {
        res.status(400).send('Unable to log out');
      } else {
        res.redirect('/');
      }
    });
  }).catch((error) => {
    console.log(error)
;  });
})

router.get('/cadastrar', (req, res) => {
  res.render('cadastrar');
});

module.exports = router;