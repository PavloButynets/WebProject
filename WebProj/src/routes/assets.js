const router = require('express').Router();

const getAssets = require("../controllers/getAssets.controller");
const getNewsByAsset = require("../controllers/getAssetNews.controller")
const {analyzeAssetNews, getAnalysisStatus} = require('../controllers/analyzeAsset.controller')
const {getAnalysisHistory } = require('../controllers/getHistory.controller')

const { cancelAnalysis } = require('../controllers/analyzeAsset.controller')

const verifyToken = require('../middlewares/verifyToken')




router.route('/get-assets').get(getAssets)

router.route("/get-news-by-asset").get(verifyToken, getNewsByAsset)
router.route('/analyze').post(verifyToken, analyzeAssetNews);
router.route('/status').get(verifyToken, getAnalysisStatus);

router.route('/history').get(verifyToken, getAnalysisHistory);

router.route('/cancel').delete(verifyToken, cancelAnalysis);


console.log(getNewsByAsset);
router.route("/get-news-by-asset").get(verifyToken, getNewsByAsset)


module.exports = router;