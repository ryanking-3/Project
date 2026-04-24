const router = require('express').Router();
const ctrl = require('../controllers/topicController');
const msg = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.browse);
router.get('/dashboard', auth, ctrl.dashboard);
router.get('/new', auth, (req, res) => res.render('topics/new'));

router.post('/new', auth, ctrl.create);

router.get('/stats', auth, ctrl.stats);

router.post('/:id/subscribe', auth, ctrl.subscribe);
router.post('/:id/unsubscribe', auth, ctrl.unsubscribe);

router.get('/:id', auth, ctrl.show);
router.post('/:id/message', auth, msg.create);

module.exports = router;