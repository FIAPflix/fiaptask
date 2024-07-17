const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userid = req.session.userInfo; // Retrieve user info from session

        if (userid && userid.email) {
            return res.status(200).redirect('home', { username: userid.email });
        } else {
            return res.status(401).render('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});

router.get('/home', async (req, res) => {
    try {
        const userid = req.session.userInfo; // Retrieve user info from session

        if (userid && userid.email) {
            return res.status(200).render('home', { username: userid.email });
        } else {
            return res.status(401).redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});

router.get('/consultaTarefa', async (req, res) => {
    try {
        const userid = req.session.userInfo; // Retrieve user info from session

        if (userid && userid.email) {
            return res.status(200).render('consultaTarefa');
        } else {
            return res.status(401).redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});

router.get('/consultaColaborador', async (req, res) => {
    try {
        const userid = req.session.userInfo; // Retrieve user info from session

        if (userid && userid.email) {
            return res.status(200).render('consultaColaborador');
        } else {
            return res.status(401).redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});

router.get('/novoColaborador', async (req, res) => {
    try {
        const userid = req.session.userInfo; // Retrieve user info from session

        if (userid && userid.email) {
            return res.status(200).render('novoColaborador');
        } else {
            return res.status(401).redirect('/');
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
        console.log(error);
    }
});

module.exports = router;