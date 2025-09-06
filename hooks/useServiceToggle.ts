import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface ServiceDetails {
  enabled: boolean;
  price?: number;
  currency?: string;
  unit?: string;
  address?: string;
  images?: string[]; // public URLs
}
interface ServiceConfig {
  studio: ServiceDetails;
  coworking: ServiceDetails;
}
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function fetchServiceConfig(): Promise<ServiceConfig> {
  const response = await fetch('/api/settings/services', { cache: 'no-store' });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Unauthorized access');
    const errorResult = await response.json().catch(() => null);
    throw new Error(errorResult?.error || `HTTP ${response.status}: Failed to fetch`);
  }
  const result: ApiResponse<ServiceConfig> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to fetch service configuration');
  return result.data!;
}

async function updateServiceConfig(config: Partial<ServiceConfig>): Promise<ServiceConfig> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const response = await fetch('/api/settings/services', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error('Unauthorized access');
    const errorResult = await response.json().catch(() => null);
    throw new Error(errorResult?.error || `HTTP ${response.status}: Failed to update`);
  }
  const result: ApiResponse<ServiceConfig> = await response.json();
  if (!result.success) throw new Error(result.error || 'Failed to update service configuration');
  return result.data!;
}

/**
 * Hook
 */
export function useServiceToggle() {
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; service: 'studio' | 'coworking'; action: 'enable' | 'disable' }>({ isOpen: false, service: 'studio', action: 'enable' });
  const queryClient = useQueryClient();

  const { data: serviceConfig, isLoading, error } = useQuery({
    queryKey: ['service-config'],
    queryFn: fetchServiceConfig,
    staleTime: 5 * 60 * 1000,
    retry: (fc, err: any) => { if (err?.message?.includes('401') || err?.message?.includes('403')) return false; return fc < 3; },
  });

  const updateMutation = useMutation({
    mutationFn: updateServiceConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(['service-config'], data);
      toast.success('Service settings updated successfully');
    },
    onError: (error: Error) => {
      if (error.message === 'Unauthorized access') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUser');
          toast.error('Session expired. Please log in again.');
          window.location.reload();
        }
      } else {
        toast.error(`Failed to update service settings: ${error.message}`);
      }
    },
  });

  const handleToggleRequest = (service: 'studio' | 'coworking', currentlyEnabled: boolean) => {
    setConfirmDialog({ isOpen: true, service, action: currentlyEnabled ? 'disable' : 'enable' });
  };

  const handleConfirmToggle = () => {
    if (!serviceConfig) return;
    const { service, action } = confirmDialog;
    const newEnabled = action === 'enable';
    const updated: Partial<ServiceConfig> = {
      [service]: { ...(serviceConfig as any)[service], enabled: newEnabled } as any,
    };
    updateMutation.mutate(updated);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  const handleCancelToggle = () => setConfirmDialog({ ...confirmDialog, isOpen: false });
  const refetch = () => queryClient.invalidateQueries({ queryKey: ['service-config'] });

  return {
    serviceConfig,
    isLoading,
    error,
    isUpdating: updateMutation.isPending,
    confirmDialog,
    handleToggleRequest,
    handleConfirmToggle,
    handleCancelToggle,
    refetch,
    updateMutation,
  };
}
