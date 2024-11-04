const mongoose = require('mongoose');

const TaskQueueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    asset: { type: String, required: true },
    status: { type: String, enum: ['queued', 'processing'], default: 'queued' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TaskQueue', TaskQueueSchema);
