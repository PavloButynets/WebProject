const mongoose = require('mongoose');
const { parentPort } = require('worker_threads');
const { analyzeAsset } = require('../services/analyzeAsset.service');

mongoose.connect('mongodb+srv://pavlobutynez:AvmZEhBcrkLiMf6o@webproj.bhvy0.mongodb.net/WebProjDB?retryWrites=true&w=majority&appName=WebProj'
).then(() => {
    console.log('Підключено до MongoDB в робочому потоці');
}).catch(err => {
    console.error('Помилка підключення до MongoDB в робочому потоці:', err);
});

parentPort.on('message', async ({ newsUrls, asset, userId }) => {
    try {
        await analyzeAsset(newsUrls, asset, userId);
        parentPort.postMessage({ status: 'completed' });
    } catch (error) {
        parentPort.postMessage({ status: 'error', error: error.message });
    }
});
