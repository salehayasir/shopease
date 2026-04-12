require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 FIX: Docker-safe MongoDB connection
const MONGO_URL = process.env.MONGO_URI || "mongodb://mongo:27017/mydb";

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup (Docker-safe)
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartCount = req.session.cart
    ? req.session.cart.reduce((a, i) => a + i.quantity, 0)
    : 0;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ShopEase running at http://localhost:${PORT}`);
});
