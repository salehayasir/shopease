const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// GET /auth/register
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/register', { errors: [] });
});

// POST /auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', { errors: errors.array() });
  }
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.render('auth/register', { errors: [{ msg: 'Email already registered' }] });
    }
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect('/');
  } catch (err) {
    res.render('auth/register', { errors: [{ msg: 'Something went wrong. Try again.' }] });
  }
});

// GET /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { errors: [], message: req.query.message || null });
});

// POST /auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', { errors: errors.array(), message: null });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.render('auth/login', { errors: [{ msg: 'Invalid email or password' }], message: null });
    }
    req.session.user = { id: user._id, name: user.name, email: user.email };
    req.session.cart = user.cart || [];   // ← add this line
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    res.render('auth/login', { errors: [{ msg: 'Something went wrong.' }], message: null });
  }
});

// GET /auth/logout
router.get('/logout', async (req, res) => {
  try {
    if (req.session.user) {
      await User.findByIdAndUpdate(req.session.user.id, { cart: req.session.cart || [] });
    }
  } catch (err) {
    console.error('Error saving cart on logout:', err);
  }
  delete req.session.user;
  req.session.cart = [];
  res.redirect('/');
});

module.exports = router;
