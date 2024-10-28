import API from './axios'; // імпортуємо вашу налаштування axios

export const analyzeByNews = (asset, newsCount) => {
    return API.post("assets/analyze", {
        asset,
        newsCount, 
    });
};
