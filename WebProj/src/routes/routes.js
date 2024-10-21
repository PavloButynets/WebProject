const router = require('express').Router();
const auth = require('./auth')
const test = require('./test');

router.use('/auth', auth)
router.use('/', test);

module.exports = router;