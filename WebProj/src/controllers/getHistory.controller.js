const Analysis = require('../models/analysis.model'); // Імпортуємо модель аналізу

const getAnalysisHistory = async (req, res) => {
    const userId = req.user.id;
    const  asset = req.query.asset; 

    try {
        if (!asset && !userId) {
            return res.status(400).json({ message: 'Please provide an asset or user ID.' });
        }

        const filter = {};
        if (asset) {
            filter.asset = asset; 
        }
        if (userId) {
            filter.userId = userId;
        }

        const analysisHistory = await Analysis.find(filter)
            .sort({ analyzedAt: -1 }) 
            .exec();

        return res.status(200).json(analysisHistory); 
    } catch (error) {
        console.error('Error retrieving analysis history:', error);
        return res.status(500).json({ message: 'Server error while retrieving analysis history.' });
    }
};

module.exports = {
    getAnalysisHistory,
};
