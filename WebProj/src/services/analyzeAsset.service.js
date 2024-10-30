const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { OpenAI  } = require('openai');
const NewsModel = require('../models/news.model')
const AnalysisModel = require('../models/analysis.model')
const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ,
  });
  const openai = new OpenAI(configuration);

// Функція для вилучення тексту статті з URL
const fetchArticleText = async (url) => {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36' }
        });

        const virtualConsole = new (require('jsdom')).VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        const dom = new JSDOM(data, { virtualConsole });

        // Використовуємо бібліотеку Readability для вилучення основного контенту
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (article) {
            return article.textContent; // Основний текст статті
        } else {
            console.log('Не вдалося розпізнати основний текст статті.');
            return null;
        }
    } catch (error) {
        console.error('Помилка при отриманні тексту статті:', error);
        return null;
    }
};

// Функція для аналізу одного чанка
const analyzeChunk = async (chunk) => {
    try {
        // const response = await openai.chat.completions.create({
        //     model: 'gpt-4',
        //     messages: [
        //         {
        //             role: 'user',
        //             content: `Ось інформація про актив:\n\n${chunk}\n\nДай, будь ласка, короткий фінансовий аналіз і прогноз цього активу.`,
        //         },
        //     ],
        //     max_tokens: 500,
        //     temperature: 0.7,
        // });
        // return response.choices[0].message.content.trim();

         await new Promise((resolve) => setTimeout(resolve, 20000));
        
         // Імітація результату аналізу
         const simulatedResponse = `Фінансовий аналіз для активу:\n\n${chunk}\n\nПрогноз: Зростання на 10% у наступні 6 місяців.`;
         
         return simulatedResponse;
    } catch (error) {
        console.error('Помилка при аналізі чанка:', error);
        return ''; 
    }
};

const analyzeAsset = async (newsUrls, asset, userId,) => {
    try {

        const analysis = new AnalysisModel({
            userId,
            asset,
            result: '',
            analyzedAt: new Date(),
            status: "Статті знайдено, відбувається парсинг сторінок"
        });

        const allArticleTexts = []; 

        for (const url of newsUrls) {
            const articleText = await fetchArticleText(url.url); 
            if (articleText) {
                allArticleTexts.push(articleText); 
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));

        analysis.status = "Текст статей отримано, відбувається аналіз";

        await analysis.save();
        const combinedText = allArticleTexts.join('\n\n'); 

        const chunks = chunkText(combinedText, 5000); 

        const results = await Promise.all(chunks.map(analyzeChunk)); 
        
        analysis.result = results.join('\n\n'); 
        analysis.status = "completed"; 
        analysis.analyzedAt = new Date()
        await analysis.save();
    } catch (error) {
        console.error('Помилка при аналізі активу:', error);
        throw new Error('Помилка аналізу активу');
    }
};

const chunkText = (text, maxTokens) => {
    const words = text.split(/\s+/); 
    const chunks = [];
    let currentChunk = [];

    for (let word of words) {
        currentChunk.push(word);

        if (currentChunk.join(' ').split(/\s+/).length >= maxTokens) {
            chunks.push(currentChunk.join(' '));
            currentChunk = []; 
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks; 
};
const getNewsUrls = async (asset, newsCount) => {
    try {

        const newsUrls = await NewsModel.find({ asset }).limit(newsCount).select('url').lean();
        return newsUrls;
    } catch (error) {
        console.error('Помилка під час отримання новин з бази даних:', error);
        throw new Error('Помилка отримання новин');
    }
};


module.exports = {
    fetchArticleText,
    analyzeAsset,
    getNewsUrls
};
