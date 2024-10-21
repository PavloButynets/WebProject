const router = require('express').Router();

const getTest = require("../controllers/test.controller");

const verifyToken = require('../middlewares/verifyToken')

router.route('/test').get(verifyToken, getTest)


module.exports = router;