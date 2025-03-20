const { add, formatDate } = require('../src/utils');

describe('Utility Functions', () => {
  describe('add', () => {
    test('adds two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds positive and negative numbers correctly', () => {
      expect(add(5, -3)).toBe(2);
      expect(add(-2, 7)).toBe(5);
    });

    test('adds two negative numbers correctly', () => {
      expect(add(-3, -4)).toBe(-7);
    });

    test('adds zero correctly', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(10, 0)).toBe(10);
      expect(add(0, 0)).toBe(0);
    });

    test('adds decimal numbers correctly', () => {
      expect(add(1.5, 2.5)).toBe(4);
      expect(add(0.1, 0.2)).toBeCloseTo(0.3); // Handle floating point precision
    });
  });

  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date(2023, 0, 15); // January 15, 2023
      expect(formatDate(date)).toBe('2023-01-15');
    });

    test('pads single digit months and days with zeros', () => {
      const date = new Date(2023, 8, 5); // September 5, 2023
      expect(formatDate(date)).toBe('2023-09-05');
    });

    test('works with first and last day of year', () => {
      const firstDay = new Date(2023, 0, 1); // January 1, 2023
      const lastDay = new Date(2023, 11, 31); // December 31, 2023
      
      expect(formatDate(firstDay)).toBe('2023-01-01');
      expect(formatDate(lastDay)).toBe('2023-12-31');
    });
  });
});
