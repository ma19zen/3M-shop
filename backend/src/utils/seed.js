const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Features active noise cancellation, comfortable over-ear design, and crystal-clear audio.',
    price: 79.99,
    category: 'Electronics',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50,
    featured: true,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with advanced cushioning technology. Perfect for marathon training and everyday runs.',
    price: 129.99,
    category: 'Sports',
    brand: 'SpeedFit',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 30,
    featured: true,
  },
  {
    name: 'Organic Coffee Beans - Dark Roast',
    description: 'Premium single-origin organic coffee beans. Dark roasted to perfection for a bold, rich flavor with notes of chocolate and caramel.',
    price: 24.99,
    category: 'Food & Beverages',
    brand: 'BeanCraft',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'],
    stock: 100,
    featured: true,
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Feature-packed smartwatch with health monitoring, GPS tracking, and 7-day battery life. Water-resistant up to 50 meters.',
    price: 249.99,
    category: 'Electronics',
    brand: 'TechPulse',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 25,
    featured: true,
  },
  {
    name: 'Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment. Vintage design meets modern functionality.',
    price: 89.99,
    category: 'Fashion',
    brand: 'UrbanPack',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    stock: 40,
    featured: false,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat with alignment lines. Eco-friendly TPE material, perfect for yoga, pilates, and floor exercises.',
    price: 39.99,
    category: 'Sports',
    brand: 'ZenFit',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    stock: 60,
    featured: false,
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with drainage holes and bamboo trays. Perfect for succulents and small indoor plants.',
    price: 34.99,
    category: 'Home & Garden',
    brand: 'GreenLife',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'],
    stock: 75,
    featured: false,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and leak-proof.',
    price: 29.99,
    category: 'Sports',
    brand: 'HydroKeep',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
    stock: 80,
    featured: true,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Sleek 15W fast wireless charging pad compatible with all Qi-enabled devices. Features LED indicator and overcharge protection.',
    price: 19.99,
    category: 'Electronics',
    brand: 'ChargePro',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'],
    stock: 120,
    featured: false,
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 bamboo cutting boards in different sizes with juice groove. Antimicrobial, eco-friendly, and knife-friendly.',
    price: 44.99,
    category: 'Home & Garden',
    brand: 'KitchenCraft',
    images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=500'],
    stock: 45,
    featured: false,
  },
  {
    name: 'Polarized Sunglasses',
    description: 'Classic aviator-style polarized sunglasses with UV400 protection. Lightweight titanium frame with scratch-resistant lenses.',
    price: 59.99,
    category: 'Fashion',
    brand: 'VisionStyle',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock: 55,
    featured: false,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof Bluetooth speaker with 360-degree sound. 12-hour playtime, built-in microphone, and rugged design.',
    price: 49.99,
    category: 'Electronics',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    stock: 65,
    featured: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await Product.deleteMany({});

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer',
    });

    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: customer@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
