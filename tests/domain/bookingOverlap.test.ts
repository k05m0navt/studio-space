import { describe, it, expect } from 'vitest';

// Reimplement minimal overlap checker used in the API: existing.start_time < new.end_time && existing.end_time > new.start_time
function timesOverlap(existingStart: string, existingEnd: string, newStart: string, newEnd: string) {
  return existingStart < newEnd && existingEnd > newStart;
}

describe('booking overlap detection', () => {
  it('detects exact overlap (12-14 vs 12-14)', () => {
    expect(timesOverlap('12:00', '14:00', '12:00', '14:00')).toBeTruthy();
  });

  it('detects contained overlap (12-14 vs 13-13:30)', () => {
    expect(timesOverlap('12:00', '14:00', '13:00', '13:30')).toBeTruthy();
  });

  it('detects crossing overlap (12-14 vs 11-15)', () => {
    expect(timesOverlap('12:00', '14:00', '11:00', '15:00')).toBeTruthy();
  });

  it('detects touching end-start as non-overlapping (12-14 vs 14-15)', () => {
    expect(timesOverlap('12:00', '14:00', '14:00', '15:00')).toBeFalsy();
  });

  it('detects touching start-end as non-overlapping (12-14 vs 10-12)', () => {
    expect(timesOverlap('12:00', '14:00', '10:00', '12:00')).toBeFalsy();
  });

  it('detects adjacent inside as overlapping when seconds differ (12:00:00-14:00:00 vs 13:59:59-15:00)', () => {
    expect(timesOverlap('12:00', '14:00', '13:59:59', '15:00')).toBeTruthy();
  });
});
