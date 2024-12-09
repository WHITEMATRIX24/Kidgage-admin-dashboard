// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    clickCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Lead', leadSchema);
