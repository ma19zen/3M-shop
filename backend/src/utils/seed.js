const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Food & Beverages', slug: 'food-beverages' },
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Home & Garden', slug: 'home-garden' },
];

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    price: 79.99,
    categorySlug: 'electronics',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 50,
    featured: true,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with advanced cushioning technology.',
    price: 129.99,
    categorySlug: 'sports',
    brand: 'SpeedFit',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    stock: 30,
    featured: true,
  },
  {
    name: 'Organic Coffee Beans - Dark Roast',
    description: 'Premium single-origin organic coffee beans.',
    price: 24.99,
    categorySlug: 'food-beverages',
    brand: 'BeanCraft',
    images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'],
    stock: 100,
    featured: true,
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Feature-packed smartwatch with health monitoring, GPS tracking.',
    price: 249.99,
    categorySlug: 'electronics',
    brand: 'TechPulse',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    stock: 25,
    featured: true,
  },
  {
    name: 'Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment.',
    price: 89.99,
    categorySlug: 'fashion',
    brand: 'UrbanPack',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    stock: 40,
    featured: false,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick non-slip yoga mat with alignment lines.',
    price: 39.99,
    categorySlug: 'sports',
    brand: 'ZenFit',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'],
    stock: 60,
    featured: false,
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with drainage holes.',
    price: 34.99,
    categorySlug: 'home-garden',
    brand: 'GreenLife',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500'],
    stock: 75,
    featured: false,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle.',
    price: 29.99,
    categorySlug: 'sports',
    brand: 'HydroKeep',
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
    stock: 80,
    featured: true,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Sleek 15W fast wireless charging pad.',
    price: 19.99,
    categorySlug: 'electronics',
    brand: 'ChargePro',
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500'],
    stock: 120,
    featured: false,
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 bamboo cutting boards in different sizes.',
    price: 44.99,
    categorySlug: 'home-garden',
    brand: 'KitchenCraft',
    images: ['https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=500'],
    stock: 45,
    featured: false,
  },
  {
    name: 'Polarized Sunglasses',
    description: 'Classic aviator-style polarized sunglasses with UV400 protection.',
    price: 59.99,
    categorySlug: 'fashion',
    brand: 'VisionStyle',
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
    stock: 55,
    featured: false,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact waterproof Bluetooth speaker with 360-degree sound.',
    price: 49.99,
    categorySlug: 'electronics',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    stock: 65,
    featured: true,
  },
];

const seedDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL connected for seeding');

    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    const createdCategories = {};
    for (const cat of categories) {
      const created = await prisma.category.create({ data: cat });
      createdCategories[cat.slug] = created.id;
    }
    console.log(`Seeded ${categories.length} categories`);

    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedAdminPassword,
        role: 'admin',
      },
    });
    await prisma.cart.create({ data: { userId: adminUser.id } });

    const hashedCustomerPassword = await bcrypt.hash('customer123', 12);
    const customerUser = await prisma.user.create({
      data: {
        name: 'John Customer',
        email: 'customer@example.com',
        password: hashedCustomerPassword,
        role: 'customer',
      },
    });
    await prisma.cart.create({ data: { userId: customerUser.id } });

    for (const product of products) {
      const { categorySlug, ...rest } = product;
      await prisma.product.create({
        data: { ...rest, categoryId: createdCategories[categorySlug] },
      });
    }

    console.log(`Seeded ${products.length} products`);
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: customer@example.com / customer123');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDB();
