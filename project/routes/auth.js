const router = require('express').Router();
const ctrl = require('../controllers/authController');

router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);

module.exports = router;