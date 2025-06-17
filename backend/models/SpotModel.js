const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: String,
  description: String,
  district: String,
  location: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_verified: { type: Boolean, default: false },
  images: [String] 
}, { timestamps: true });

module.exports = mongoose.model('Spot', spotSchema);
