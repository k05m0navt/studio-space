import { describe, it, expect } from 'vitest';

function parseHours(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(sh, sm, 0, 0);
  const endDate = new Date();
  endDate.setHours(eh, em, 0, 0);
  if (endDate.getTime() <= startDate.getTime()) endDate.setDate(endDate.getDate() + 1);
  const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  return Math.max(0, hours);
}

function computeAmount(rate: number, start: string, end: string) {
  const hours = parseHours(start, end);
  return Number((rate * hours).toFixed(2));
}

describe('computeAmount', () => {
  it('calculates simple 1 hour booking', () => {
    expect(computeAmount(100, '09:00', '10:00')).toBe(100.00);
  });

  it('calculates fractional 1.5 hour booking', () => {
    expect(computeAmount(80, '09:00', '10:30')).toBe(120.00);
  });

  it('wraps overnight booking to next day', () => {
    expect(computeAmount(50, '23:00', '01:00')).toBe(100.00);
  });
});
