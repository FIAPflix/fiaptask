const express = require('express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
var path = require('path');

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// Render engine
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'html');

// Initialize Firebase Admin SDK
const serviceAccount = require('./fiaptask-ba6e8f79dec4.json'); // Replace with your service account key file path
initializeApp({
  credential: cert(serviceAccount)
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Middleware to verify Firebase ID token
// const authenticateUser = async (req, res, next) => {
//   const idToken = req.headers.authorization;

//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.user = decodedToken;
//     next();
//   } catch (error) {
//     console.error('Error verifying Firebase ID token:', error);
//     res.status(403).json({ error: 'Unauthorized' });
//   }
// };

// Routes
app.use(require('./routes/home'));
app.use(require('./routes/authRoute'));
app.use(require('./routes/databaseRoute'));
app.use((req, res) => {
  res.status(404).send('<h1>Página não encontrada</h1>');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});