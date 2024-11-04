const { getNewsUrls, analyzeAsset } = require('../services/analyzeAsset.service');

const AnalysisModel = require('../models/analysis.model');
const { Worker } = require('worker_threads');

let activeWorkers = {}; 
const MAX_WORKERS_PER_USER = 3; 

const analyzeAssetNews = async (req, res) => {
    const { asset, newsCount } = req.body;
    const userId = req.user.id;

    const activeUserWorkers = activeWorkers[userId] ? Object.keys(activeWorkers[userId]).length : 0;
    if (activeUserWorkers >= MAX_WORKERS_PER_USER) {
        return res.status(429).json({
            error: `Досягнуто максимуму паралельних аналізів для користувача. Дочекайтеся завершення поточного аналізу.`
        });
    }


    if (typeof newsCount !== 'number' || newsCount < 1 || newsCount > 50) {
        return res.status(400).json({
            error: 'Кількість новин повинна бути числом від 1 до 50.'
        });
    }


    if (activeWorkers[userId] && activeWorkers[userId][asset]) {
        return res.status(409).json({
            error: `Аналіз для активу ${asset} вже виконується.`
        });
    }

    try {
        console.log(asset, newsCount)
        const newsUrls = await getNewsUrls(asset, newsCount);
        console.log(newsUrls)


        if (!newsUrls || newsUrls.length === 0) {
            return res.status(404).json({ error: 'Новини для цього активу не знайдені' });
        }

        res.status(202).json({
            message: 'Завдання додано до обробки.',
            status: "Start of analysis"
        });


        const worker = new Worker('C:\\IT\\WEB_ЛНУ\\WebProj\\WebProj\\WebProj\\src\\utils\\worker.js');
        
        activeWorkers[userId] = activeWorkers[userId] || {};
        activeWorkers[userId][asset] = worker;
        
        console.log(activeWorkers)
        worker.postMessage({ newsUrls, asset, userId });

        worker.on('message', (message) => {
            if (message.status === 'completed' || message.status === 'error') {
                delete activeWorkers[userId][asset];
                if (Object.keys(activeWorkers[userId]).length === 0) {
                    delete activeWorkers[userId];
                }
            }
        });

    } catch (error) {
        console.error('Помилка аналізу новин:', error);
        res.status(500).json({ error: 'Помилка під час аналізу новин' });
    }
};



const getAnalysisStatus = async (req, res) => {
    const userId = req.user.id;
    const asset = req.query.asset;

    try {
        const analysis = await AnalysisModel.findOne({ userId: userId, asset: asset }).sort({ analyzedAt: -1 });;



        if (!analysis) {
            return res.status(404).json({ error: 'Аналіз не знайдено або вже завершено' });
        }


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

const cancelAnalysis = async (req, res) => {
    const userId = req.user.id;
    const { asset } = req.query; 

    if (activeWorkers[userId] && activeWorkers[userId][asset]) {
        activeWorkers[userId][asset].terminate();

        delete activeWorkers[userId][asset];

        await AnalysisModel.deleteOne({ userId: userId, asset: asset });

        if (Object.keys(activeWorkers[userId]).length === 0) {
            delete activeWorkers[userId];
        }

        res.status(200).json({ message: `Analysis for asset ${asset} has been canceled and data removed.` });
    } else {
        res.status(404).json({ error: `No active analysis for asset ${asset} to cancel.` });
    }
};



module.exports = {
    analyzeAssetNews,
    getAnalysisStatus,
    cancelAnalysis
};
