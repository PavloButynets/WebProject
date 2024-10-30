const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    asset: { type: String, required: true },
    threadId: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'error'], default: 'active' }
});

const WorkerModel = mongoose.model('Worker', workerSchema);
module.exports = WorkerModel