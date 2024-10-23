const router = require('express').Router();
const auth = require('./auth')
const asets = require('./assets');

router.use('/auth', auth)
router.use('/assets', asets);

module.exports = router;