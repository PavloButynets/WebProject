const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const { OpenAI  } = require('openai');
const NewsModel = require('../models/news.model')
const AnalysisModel = require('../models/analysis.model')
const { logger } = require("../utils/logger");

const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ,
  });
  const openai = new OpenAI(configuration);

const fetchArticleText = async (url) => {
    try {

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36' }
        });

        const virtualConsole = new (require('jsdom')).VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        const dom = new JSDOM(data, { virtualConsole });

        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (article) {
            logger.info('Article text successfully fetched.');

            return article.textContent; 
        } else {
            console.log('Не вдалося розпізнати основний текст статті.');
            return null;
        }
    } catch (error) {
        logger.warn('Failed to recognize the main text of the article.');

        console.error('Помилка при отриманні тексту статті:', error);
        return null;
    }
};

const analyzeChunk = async (chunk) => {
    try {
        logger.info('Analyzing chunk of text...');

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: `Here is the information about the asset:\n\n${chunk}\n\nPlease give a brief financial analysis and forecast of this asset.`,                },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });
        return response.choices[0].message.content.trim();

        //  await new Promise((resolve) => setTimeout(resolve, 20000));
        
        //  const simulatedResponse = `Фінансовий аналіз для активу: Прогноз: Зростання на 10% у наступні 6 місяців.`;

        //  return simulatedResponse;
    } catch (error) {
        logger.error('Error analyzing chunk:', error);
        return ''; 
    }
};

const analyzeAsset = async (newsUrls, asset, userId,) => {
    try {
        logger.info(`Starting analysis for asset: ${asset} by user: ${userId}`);

        const analysis = new AnalysisModel({
            userId,
            asset,
            result: '',
            analyzedAt: new Date(),
            status: "Статті знайдено, відбувається парсинг сторінок"
        });
        await analysis.save();
        
        const allArticleTexts = []; 

        for (const url of newsUrls) {
            const articleText = await fetchArticleText(url.url); 
            if (articleText) {
                allArticleTexts.push(articleText); 
            }
        }
        //await new Promise((resolve) => setTimeout(resolve, 5000));

        analysis.status = "Текст статей отримано, відбувається аналіз";

        await analysis.save();
        const combinedText = allArticleTexts.join('\n\n'); 

        const chunks = chunkText(combinedText, 5000); 
        logger.info(`Analyzing ${chunks.length} chunks...`);

        const results = await Promise.all(chunks.map(analyzeChunk)); 
        
        analysis.result = results.join('\n\n'); 
        analysis.status = "completed"; 
        analysis.analyzedAt = new Date()
        
        await analysis.save();
        logger.info(`Analysis completed successfully for asset: ${asset}`);

    } catch (error) {
        logger.error('Error analyzing asset:', error);

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
        
        logger.error('Error fetching news from database:', error);
        throw new Error('Помилка отримання новин');
    }
};


module.exports = {
    fetchArticleText,
    analyzeAsset,
    getNewsUrls
};
