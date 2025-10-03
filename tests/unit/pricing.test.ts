import { describe, test, expect } from 'vitest';
import { computeHours, computeAmount } from '../../lib/pricing';

describe('pricing util', () => {
  test('computeHours returns fractional hours', () => {
    expect(computeHours('09:00', '12:30')).toBe(3.5);
  });

  test('computeAmount hourly calculation', () => {
    expect(computeAmount({ unit: 'hour', rate: 50, hours: 1.5 })).toBe(75);
  });

  test('computeAmount half-day chunks', () => {
    // 3 hours -> 1 half-day chunk
    expect(computeAmount({ unit: 'half-day', rate: 300, hours: 3 })).toBe(300);
    // 5 hours -> 2 half-day chunks
    expect(computeAmount({ unit: 'half-day', rate: 300, hours: 5 })).toBe(600);
  });

  test('computeAmount day chunks', () => {
    // 10 hours -> 1 day chunk
    expect(computeAmount({ unit: 'day', rate: 500, hours: 10 })).toBe(500);
    // 30 hours -> 2 day chunks
    expect(computeAmount({ unit: 'day', rate: 500, hours: 30 })).toBe(1000);
  });
});
