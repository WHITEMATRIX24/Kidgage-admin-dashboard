const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    publishedOn: { type: Date, required: true },
    image: { type: String, required: true },
    activeStatus: { type: Boolean, default: true },

});
const News = mongoose.model('News', newsSchema);
module.exports = News;
