export type Unit = 'hour' | 'half-day' | 'day';

export function computeHours(start?: string, end?: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const s = new Date(); s.setHours(sh, sm, 0, 0);
  const e = new Date(); e.setHours(eh, em, 0, 0);
  const diff = Math.max(0, (e.getTime() - s.getTime()) / (1000 * 60 * 60));
  return diff;
}

export function computeAmount({ unit, rate, hours }: { unit: Unit; rate: number; hours: number }) {
  if (!hours || hours <= 0) return 0;
  let amount = 0;
  if (unit === 'hour') {
    amount = rate * hours;
  } else if (unit === 'half-day') {
    // Treat half-day as 4-hour chunks
    amount = rate * Math.ceil(hours / 4);
  } else if (unit === 'day') {
    amount = rate * Math.ceil(hours / 24);
  } else {
    amount = rate * hours;
  }
  return Number(amount.toFixed(2));
}
