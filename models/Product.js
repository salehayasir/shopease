const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 50 },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  slug: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Product', productSchema);
