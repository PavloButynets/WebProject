const router = require("express").Router();
 const {
    createAccount,
    loginUser,
    refreshToken,
    logoutUser
 } = require('../controllers/auth.controller')

 const verifyToken = require("../middlewares/verifyToken")

router.post('/signup', createAccount)

router.post('/login', loginUser)

router.post("/logout",  logoutUser);

router.post("/refresh-token", refreshToken);

module.exports = router;