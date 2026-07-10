import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders 3M Shop brand name in navbar', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: '3M Shop' })).toBeInTheDocument();
});

test('renders Products link in navbar', () => {
  render(<App />);
  const links = screen.getAllByText('Products');
  expect(links.length).toBeGreaterThan(0);
});

test('renders Login link', () => {
  render(<App />);
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('renders Register link', () => {
  render(<App />);
  expect(screen.getByText('Register')).toBeInTheDocument();
});

test('renders loading spinner on home page', () => {
  render(<App />);
  expect(document.querySelector('.animate-spin')).toBeInTheDocument();
});

test('renders footer', () => {
  render(<App />);
  expect(screen.getByText(/2026 3M Shop/)).toBeInTheDocument();
});
