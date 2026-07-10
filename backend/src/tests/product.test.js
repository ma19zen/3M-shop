describe('Product Validation', () => {
  const validateProduct = (product) => {
    const errors = [];
    if (!product.name || product.name.trim().length === 0) errors.push('Name is required');
    if (!product.description) errors.push('Description is required');
    if (product.price === undefined || product.price < 0) errors.push('Valid price is required');
    if (!product.category) errors.push('Category is required');
    if (product.stock !== undefined && product.stock < 0) errors.push('Stock cannot be negative');
    return errors;
  };

  test('rejects product without name', () => {
    const errors = validateProduct({ description: 'Test', price: 10, category: 'Cat' });
    expect(errors).toContain('Name is required');
  });

  test('rejects product with negative price', () => {
    const errors = validateProduct({ name: 'Test', description: 'Desc', price: -5, category: 'Cat' });
    expect(errors).toContain('Valid price is required');
  });

  test('accepts valid product', () => {
    const errors = validateProduct({ name: 'Test', description: 'Desc', price: 10, category: 'Cat', stock: 5 });
    expect(errors).toHaveLength(0);
  });

  test('rejects negative stock', () => {
    const errors = validateProduct({ name: 'Test', description: 'Desc', price: 10, category: 'Cat', stock: -1 });
    expect(errors).toContain('Stock cannot be negative');
  });
});

describe('Product Rating Calculation', () => {
  const calcRating = (reviews) => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  };

  test('calculates average rating correctly', () => {
    const reviews = [{ rating: 5 }, { rating: 3 }, { rating: 4 }];
    expect(calcRating(reviews)).toBe(4);
  });

  test('returns 0 for no reviews', () => {
    expect(calcRating([])).toBe(0);
  });

  test('returns rating for single review', () => {
    expect(calcRating([{ rating: 3 }])).toBe(3);
  });
});

describe('Product Search Filter', () => {
  const products = [
    { name: 'Wireless Headphones', category: 'Electronics', price: 79.99 },
    { name: 'Running Shoes', category: 'Sports', price: 129.99 },
    { name: 'Coffee Beans', category: 'Food', price: 24.99 },
  ];

  const filterProducts = (products, { search, category, minPrice, maxPrice }) => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && p.category !== category) return false;
      if (minPrice && p.price < minPrice) return false;
      if (maxPrice && p.price > maxPrice) return false;
      return true;
    });
  };

  test('filters by search term', () => {
    const result = filterProducts(products, { search: 'wireless' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Wireless Headphones');
  });

  test('filters by category', () => {
    const result = filterProducts(products, { category: 'Sports' });
    expect(result).toHaveLength(1);
  });

  test('filters by price range', () => {
    const result = filterProducts(products, { minPrice: 20, maxPrice: 100 });
    expect(result).toHaveLength(2);
  });

  test('returns all products with no filters', () => {
    const result = filterProducts(products, {});
    expect(result).toHaveLength(3);
  });
});

describe('Cart Operations', () => {
  const addToCart = (cart, item) => {
    const existing = cart.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push({ ...item });
    }
    return cart;
  };

  const calculateTotal = (cart) => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  test('adds new item to cart', () => {
    const cart = [];
    addToCart(cart, { productId: '1', name: 'Test', price: 10, quantity: 2 });
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  test('increases quantity for existing item', () => {
    const cart = [{ productId: '1', name: 'Test', price: 10, quantity: 2 }];
    addToCart(cart, { productId: '1', name: 'Test', price: 10, quantity: 1 });
    expect(cart[0].quantity).toBe(3);
  });

  test('calculates total correctly', () => {
    const cart = [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 },
    ];
    expect(calculateTotal(cart)).toBe(40);
  });
});
