const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 50
    },
    password:{
        type: String,
        required: true,
        min: 6
    },
    analysisHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' }]
})

module.exports = mongoose.model('User', userSchema)