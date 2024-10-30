const { getNewsUrls, analyzeAsset } = require('../services/analyzeAsset.service');
const User = require('../models/user.model');
const AnalysisModel = require('../models/analysis.model');

// Контролер для аналізу новин
const analyzeAssetNews = async (req, res) => {
    const { asset, newsCount } = req.body;

    const userId = req.user.id;

    if (typeof newsCount !== 'number' || newsCount < 1 || newsCount > 50) {
        return res.status(400).json({
            error: 'Кількість новин повинна бути числом від 1 до 50.'
        });
    }

    try {
        const newsUrls = await getNewsUrls(asset, newsCount);

        if (!newsUrls || newsUrls.length === 0) {
            return res.status(404).json({ error: 'Новини для цього активу не знайдені' });
        }


        if (!newsUrls || newsUrls.length === 0) {
            return res.status(404).json({ error: 'Новини для цього активу не знайдені' });
        }

        res.status(202).json({
            message: 'Завдання додано до обробки.',
            status: "Start of analysis"
        });

        analyzeAsset(newsUrls, asset, userId);

    } catch (error) {
        console.error('Помилка аналізу новин:', error);
        res.status(500).json({ error: 'Помилка під час аналізу новин' });
    }
};

const getAnalysisStatus = async (req, res) => {
    const userId = req.user.id;

    const asset = req.query.asset;
    try {
        const analysis = await AnalysisModel.findOne({
            userId: userId,
            asset: asset,
        }).sort({ analyzedAt: -1 });;

        if (!analysis) {
            return res.status(404).json({ error: 'Аналіз не знайдено або вже завершено' });
        }

        // Повертаємо статус аналізу
        res.status(200).json({
            status: analysis.status,
            result: analysis.result,
            analyzedAt: analysis.analyzedAt,
            asset: analysis.asset
        });
    } catch (error) {
        console.error('Помилка при отриманні статусу аналізу:', error);
        res.status(500).json({ error: 'Помилка під час отримання статусу аналізу' });
    }
};


module.exports = {
    analyzeAssetNews,
    getAnalysisStatus
};