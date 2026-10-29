const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  poster: String, // URL or local path
  wastage: String, // e.g. "7.99%"
  discount: String, // e.g. "100% OFF"
  extraValue: String, // e.g. "₹200/g"
  endDate: Date,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
