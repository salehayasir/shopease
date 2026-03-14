const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /products — all products
router.get('/', async (req, res) => {
  const { category, sort } = req.query;
  let filter = {};
  if (category) filter.category = category;

  let sortOption = {};
  if (sort === 'price-asc') sortOption = { price: 1 };
  else if (sort === 'price-desc') sortOption = { price: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };

  const products = await Product.find(filter).sort(sortOption);
  const categories = await Product.distinct('category');
  res.render('products/index', { products, categories, category, sort });
});

// GET /products/:slug — single product
router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).render('404');
  const related = await Product.find({
    category: product.category,
    slug: { $ne: product.slug }
  }).limit(3);
  res.render('products/show', { product, related });
});

module.exports = router;
