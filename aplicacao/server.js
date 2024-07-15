const express = require('express');
const { initializeApp } = require('firebase/app');
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
const firebaseConfig = {
  apiKey: process.env.FirebaseAPIKey,
  authDomain: "fiaptask.firebaseapp.com",
  projectId: "fiaptask",
  storageBucket: "fiaptask.appspot.com",
  messagingSenderId: "291675412470",
  appId: process.env.FirebaseAppID,
  measurementId: "G-77QB0RV8LF"
};
initializeApp(firebaseConfig);

// Middleware
app.use(require('./middleware/sessionMiddleware'));

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(require('./routes/home'));
app.use(require('./routes/authRoute'));
app.use(require('./routes/protectedRoute'));
app.use(require('./routes/databaseRoute'));
app.use((req, res) => {
  res.status(404).send('<h1>Página não encontrada</h1>');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});