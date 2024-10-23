const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const Article = require('./../models/asset.model'); 

// Функція для отримання тексту статті
async function fetchArticleText(url) {
    // Перевірка валідності URL
    if (!url || typeof url !== 'string') {
        console.error('Невірний URL:', url);
        return null;
    }

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            },
        });

        const virtualConsole = new (require('jsdom')).VirtualConsole();
        virtualConsole.sendTo(console, { omitJSDOMErrors: true });

        const dom = new JSDOM(data, { virtualConsole });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (article) {
            return {
                title: article.title,
                content: article.textContent,
                // Можна додати інші поля, такі як author, date, etc.
            };
        } else {
            console.log('Не вдалося розпізнати основний текст статті.');
            return null;
        }
    } catch (error) {
        console.error('Помилка при отриманні тексту статті:', error.message);
        return null;
    }
}

// Функція для збереження статті в базі даних
const saveArticle = async (title, url, description, asset) => {
    try {
        const existingArticle = await Article.findOne({ url }); // Перевірка наявності статті
        if (existingArticle) {
            console.log(`Стаття вже існує: ${title}`);
            return existingArticle; // Якщо стаття вже існує, повертаємо її
        }

        // Створення нової статті
        const article = new Article({
            title,
            url,
            description,
            asset,
        });

        await article.save(); // Збереження статті
        console.log(`Стаття збережена: ${title}`);
        return article; // Повертаємо збережену статтю
    } catch (error) {
        console.error('Помилка при збереженні статті:', error.message);
        throw new Error('Не вдалося зберегти статтю'); // Обробка помилок
    }
};

// Експорт методів
module.exports = {
    saveArticle,
};
