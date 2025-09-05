import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Types
interface ServiceConfig {
  studio: { enabled: boolean };
  coworking: { enabled: boolean };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API functions
async function fetchServiceConfig(): Promise<ServiceConfig> {
  const response = await fetch('/api/settings/services', {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    // For GET requests, we don't expect auth errors, but handle them gracefully
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access');
    }
    
    try {
      const errorResult = await response.json();
      throw new Error(errorResult.error || `HTTP ${response.status}: Failed to fetch service configuration`);
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to fetch service configuration`);
    }
  }
  
  const result: ApiResponse<ServiceConfig> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch service configuration');
  }
  
  return result.data!;
}

async function updateServiceConfig(config: ServiceConfig): Promise<ServiceConfig> {
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
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized access');
    }
    
    // Try to get error message from response
    try {
      const errorResult = await response.json();
      throw new Error(errorResult.error || `HTTP ${response.status}: Failed to update service configuration`);
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to update service configuration`);
    }
  }
  
  const result: ApiResponse<ServiceConfig> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update service configuration');
  }
  
  return result.data!;
}

/**
 * Custom hook for managing service toggle state and API interactions
 * Provides optimistic updates and error handling
 */
export function useServiceToggle() {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    service: 'studio' | 'coworking';
    action: 'enable' | 'disable';
  }>({
    isOpen: false,
    service: 'studio',
    action: 'enable',
  });

  const queryClient = useQueryClient();

  // Query for service configuration
  const {
    data: serviceConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['service-config'],
    queryFn: fetchServiceConfig,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (401/403)
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Mutation for updating service configuration
  const updateMutation = useMutation({
    mutationFn: updateServiceConfig,
    onSuccess: (data) => {
      // Update cache with new data
      queryClient.setQueryData(['service-config'], data);
      toast.success('Service settings updated successfully');
    },
    onError: (error: Error) => {
      if (error.message === 'Unauthorized access') {
        // Clear auth state and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUser');
          toast.error('Session expired. Please log in again.');
          // Reload page to trigger redirect to login
          window.location.reload();
        }
      } else {
        toast.error(`Failed to update service settings: ${error.message}`);
      }
    },
  });

  // Handle toggle request (opens confirmation dialog)
  const handleToggleRequest = (service: 'studio' | 'coworking', currentlyEnabled: boolean) => {
    setConfirmDialog({
      isOpen: true,
      service,
      action: currentlyEnabled ? 'disable' : 'enable',
    });
  };

  // Handle confirmed toggle
  const handleConfirmToggle = () => {
    if (!serviceConfig) return;

    const { service, action } = confirmDialog;
    const newEnabled = action === 'enable';

    const updatedConfig: ServiceConfig = {
      ...serviceConfig,
      [service]: { enabled: newEnabled },
    };

    updateMutation.mutate(updatedConfig);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  // Handle cancel toggle
  const handleCancelToggle = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  // Refetch service configuration
  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['service-config'] });
  };

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
  };
}
