import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

const mockProduct = {
  _id: '123',
  name: 'Test Product',
  price: 29.99,
  rating: 4,
  numReviews: 10,
  images: ['https://example.com/image.jpg'],
  category: 'Electronics',
  featured: false,
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  test('renders product name', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('renders product price', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  test('renders add to cart button', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/Add/)).toBeInTheDocument();
  });

  test('renders product rating stars', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  test('renders featured badge when featured', () => {
    const featuredProduct = { ...mockProduct, featured: true };
    renderWithProviders(<ProductCard product={featuredProduct} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  test('links to product detail page', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const link = screen.getByText('Test Product').closest('a');
    expect(link).toHaveAttribute('href', '/products/123');
  });
});
