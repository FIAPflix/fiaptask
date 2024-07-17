const express = require('express');
const router = express.Router();

router.get('/novoColaborador', (req, res) => {
    res.render('novoColaborador');
});

router.get('/novaTarefa', (req, res) => {
    res.render('novaTarefa');
});

router.get('/consultaTarefa', (req, res) => {
    res.render('consultaTarefa');
});

// Delete after test
router.get('/teste', (req, res) => {
    res.render('teste');
});

module.exports = router;