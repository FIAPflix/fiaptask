const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/novoColaborador', (req, res) => {
    res.render('novoColaborador');
});

router.get('/novaTarefa', (req, res) => {
    res.render('novaTarefa');
});

router.get('/consultaTarefa', (req, res) => {
    res.render('consultaTarefa');
});

module.exports = router;