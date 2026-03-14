require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and crystal-clear sound. Perfect for music lovers and remote workers alike.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    category: 'Electronics',
    stock: 45,
    rating: 4.8,
    reviews: 324,
    slug: 'wireless-noise-cancelling-headphones'
  },
  {
    name: 'Minimalist Leather Wallet',
    description: 'Slim profile RFID-blocking genuine leather wallet. Holds up to 8 cards and cash. Available in black and brown. Handcrafted for durability.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
    category: 'Accessories',
    stock: 100,
    rating: 4.6,
    reviews: 189,
    slug: 'minimalist-leather-wallet'
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated 32oz bottle. Keeps drinks cold 24 hours, hot 12 hours. BPA-free, leak-proof lid. Perfect for outdoor adventures.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    category: 'Outdoors',
    stock: 80,
    rating: 4.7,
    reviews: 512,
    slug: 'stainless-steel-water-bottle'
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact TKL mechanical keyboard with Cherry MX switches. RGB backlit, programmable macros, aluminum frame. The perfect upgrade for your desk setup.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600',
    category: 'Electronics',
    stock: 30,
    rating: 4.9,
    reviews: 276,
    slug: 'mechanical-keyboard'
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    category: 'Sports',
    stock: 60,
    rating: 4.5,
    reviews: 203,
    slug: 'yoga-mat-premium'
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'Handcrafted ceramic dripper with matching server. Brews 2-4 cups of smooth, rich coffee. Includes 40 paper filters. For the coffee connoisseur.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    category: 'Kitchen',
    stock: 40,
    rating: 4.7,
    reviews: 158,
    slug: 'ceramic-pour-over-coffee-set'
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360-degree surround sound speaker with 20-hour battery. IPX7 waterproof rating, built-in microphone, and USB-C charging. Adventure-ready.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    category: 'Electronics',
    stock: 55,
    rating: 4.6,
    reviews: 445,
    slug: 'portable-bluetooth-speaker'
  },
  {
    name: 'Cotton Canvas Backpack',
    description: '20L waxed canvas backpack with leather trim. Multiple compartments, 15" laptop sleeve, and water-resistant coating. Timeless style meets function.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    category: 'Bags',
    stock: 35,
    rating: 4.8,
    reviews: 291,
    slug: 'cotton-canvas-backpack'
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 3 hand-poured soy wax candles. Scents: Vanilla Oak, Sea Breeze, and Sandalwood. 40-hour burn time each. Perfect for gifting.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1602607144288-c6e0e64d3b46?w=600',
    category: 'Home',
    stock: 70,
    rating: 4.9,
    reviews: 367,
    slug: 'scented-soy-candle-set'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable mesh running shoes with responsive foam cushioning. Available in sizes 7-13. Built for speed and long-distance comfort.',
    price: 124.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    category: 'Sports',
    stock: 90,
    rating: 4.7,
    reviews: 634,
    slug: 'running-shoes'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('✅ Database seeded with 10 products!');
  mongoose.connection.close();
}

seed().catch(console.error);
