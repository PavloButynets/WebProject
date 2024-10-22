const mongoose = require('mongoose');

// Створюємо схему для активів
const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    market_cap: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['cryptocurrency', 'stocks'],
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
