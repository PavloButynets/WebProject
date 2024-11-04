const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    asset: { type: String, required: true },
    //publishedAt: { type: Date, default: Date.now, index: { expires: '24h' } },
    publishedAt: { type: Date, default: Date.now },

});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
