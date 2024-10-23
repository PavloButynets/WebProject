const axios = require('axios');
const { NEWS_API_KEY } = process.env;
const newsService = require('../services/newsService.service');
const Article = require('../models/news.model')
const LANGUAGE = 'en',
 PAGE_SIZE = 5;
const getNewsByAsset = async (req, res) => {
    const asset = req.query.asset; // Отримання активу з параметрів запиту
    const page = req.query.page || 1;
    const pageSize = PAGE_SIZE;
    const url = `https://newsapi.org/v2/everything?q=${asset}&apiKey=${NEWS_API_KEY}&language=${LANGUAGE}&pageSize=${pageSize}&page=${page}&sortBy=publishedAt`;

    try {
        const response = await axios.get(url);
        const articles = response.data.articles;

        if (articles.length > 0) {
            const savedArticles = await Promise.all(articles.map(async (article) => {
                    const newArticle = new Article({
                        title: article.title,
                        url: article.url,
                        description: article.description || '',
                        asset: asset,
                        publishedAt: article.publishedAt ? new Date(article.publishedAt) : Date.now(),
                    });
                    await newsService.saveArticle( newArticle );
                    return newArticle; 
                
            }));
            return res.status(200).json({
                message: `Знайдено ${articles.length} новин про ${asset}`,
                total: response.data.totalResults,
                articles: savedArticles, 
            });
        } else {
            return res.status(404).json({ message: `Не знайдено новин про ${asset}.` });
        }
    } catch (error) {
        console.error('Помилка при отриманні новин:', error.message);
        return res.status(500).json({ message: 'Помилка при отриманні новин.', error: error.message });
    }
};
module.exports = getNewsByAsset;
