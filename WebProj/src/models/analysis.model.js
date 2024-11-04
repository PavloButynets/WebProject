const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    result: { type: String },
    asset: { type: String, required: true },
    analyzedAt: { type: Date, default: Date.now },
    status: {type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

isProcessing: { type: Boolean, default: false }



});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;
