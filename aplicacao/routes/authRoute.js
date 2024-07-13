const express = require('express');

const { getAuth } = require('firebase-admin/auth');

const router = express.Router();

// Route to add new user
router.post('/authNewUser', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //console.log(JSON.stringify(req.body))
  getAuth()
    .createUser({
      email: email,
      password: password,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
    });
  res.render('index');
})

module.exports = router;