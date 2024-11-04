const express = require('express');
const Asset = require('../models/asset.model');
const router = express.Router();

const getAssets = async (req, res) => {
    try {
        const { category = '', searchQuery = '', page = 1, limit = 8 } = req.query;

        const query = {};

        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } }, 
                { symbol: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const assets = await Asset.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalAssets = await Asset.countDocuments(query);

        res.json({
            total: totalAssets,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalAssets / limit),
            data: assets
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = getAssets;
