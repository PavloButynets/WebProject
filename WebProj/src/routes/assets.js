const router = require('express').Router();

const getAssets = require("../controllers/getAssets.controller");
const getNewsByAsset = require("../controllers/getAssetNews.controller")

const verifyToken = require('../middlewares/verifyToken')


router.route('/get-assets').get(getAssets)
console.log(getNewsByAsset);
router.route("/get-news-by-asset").get(verifyToken, getNewsByAsset)

module.exports = router;