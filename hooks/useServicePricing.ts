import { useQuery } from '@tanstack/react-query';

async function fetchServicePricing() {
  const res = await fetch('/api/settings/services', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch service pricing');
  const json = await res.json();
  if (!json?.success) throw new Error('Failed to fetch service pricing');
  return json.data;
}

export function useServicePricing() {
  return useQuery({ queryKey: ['service-pricing'], queryFn: fetchServicePricing, staleTime: 5 * 60 * 1000 });
}
