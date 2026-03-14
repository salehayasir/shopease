const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');

// GET /cart — view cart
router.get('/', requireAuth, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart/index', { cart, total });
});

// POST /cart/add — add item
router.post('/add', requireAuth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.redirect('/products');

  let cart = req.session.cart || [];
  const existing = cart.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    cart.push({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      quantity: parseInt(quantity)
    });
  }
  req.session.cart = cart;
  res.redirect('/cart');
});

// POST /cart/update — update quantity
router.post('/update', requireAuth, (req, res) => {
  const { productId, quantity } = req.body;
  let cart = req.session.cart || [];
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.productId !== productId);
    }
  }
  req.session.cart = cart;
  res.redirect('/cart');
});

// POST /cart/remove — remove item
router.post('/remove', requireAuth, (req, res) => {
  const { productId } = req.body;
  req.session.cart = (req.session.cart || []).filter(i => i.productId !== productId);
  res.redirect('/cart');
});

// POST /cart/checkout — place order (demo)
router.post('/checkout', requireAuth, (req, res) => {
  req.session.cart = [];
  res.render('cart/success');
});

module.exports = router;
