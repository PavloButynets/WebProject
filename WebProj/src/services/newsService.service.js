const Article = require('./../models/news.model'); 
const { logger } = require("../utils/logger");

class NewsService {
 saveArticle = async ({ title, url, description, asset, publishedAt }) => {
    try {

        if (title === "[Removed]") {
            logger.warn("Attempted to save a removed article");

            return null; 
        }

        const existingArticle = await Article.findOne({ url }); 
        if (existingArticle) {

           return existingArticle; 

        }

        const article = new Article({
            title,
            url,
            description,
            asset,
            publishedAt,
        });

        await article.save();
        logger.info(`Article saved: ${title} (${url})`);

        return article; 
    } catch (error) {
        logger.error(`Error saving article: ${error.message}`);
        throw new Error('Не вдалося зберегти статтю'); 

    }
};
}
// Експорт методів
module.exports = new NewsService();
