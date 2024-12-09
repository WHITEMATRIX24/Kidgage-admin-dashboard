// models/Banner.js
const mongoose = require("mongoose");

const desktopBannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  bookingLink: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  fee: { type: Number, required: true },
  status: { type: Boolean, default: false },
});

const DesktopBanner = mongoose.model("DesktopBanners", desktopBannerSchema);

module.exports = DesktopBanner;
