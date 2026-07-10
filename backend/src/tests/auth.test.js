process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRE = '30d';

const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');

describe('Auth Utilities', () => {
  test('generateToken returns a string', () => {
    const token = generateToken('user123', 'customer');
    expect(typeof token).toBe('string');
  });

  test('generateToken contains valid JWT parts', () => {
    const token = generateToken('user123', 'admin');
    const parts = token.split('.');
    expect(parts).toHaveLength(3);
  });
});

describe('AppError', () => {
  test('creates error with message and status code', () => {
    const error = new AppError('Not found', 404);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });

  test('sets status to error for 500-level codes', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });
});

describe('Auth Validation', () => {
  test('email validation regex works', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('test@')).toBe(false);
  });

  test('password minimum length check', () => {
    const minLength = 6;
    expect('123456'.length).toBeGreaterThanOrEqual(minLength);
    expect('12345'.length).toBeLessThan(minLength);
  });
});
