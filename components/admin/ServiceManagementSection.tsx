"use client";

import { Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceToggleCard } from "./ServiceToggleCard";
import { ServiceConfirmDialog } from "./ServiceConfirmDialog";
import { useServiceToggle } from "@/hooks/useServiceToggle";
import { cn } from "@/lib/utils";

interface ServiceManagementSectionProps {
  className?: string;
}

/**
 * ServiceManagementSection component provides the main interface for managing services
 * Implements the Enhanced Toggle Card Layout from the creative phase design
 */
export function ServiceManagementSection({ className }: ServiceManagementSectionProps) {
  const {
    serviceConfig,
    isLoading,
    error,
    isUpdating,
    confirmDialog,
    handleToggleRequest,
    handleConfirmToggle,
    handleCancelToggle,
    refetch,
  } = useServiceToggle();

  if (error) {
    const isAuthError = error instanceof Error && error.message.includes('Unauthorized access');
    
    return (
      <Card className={cn("border-error/20", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-error">
              <Settings className="h-5 w-5" />
              Service Management
            </CardTitle>
            {!isAuthError && (
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="text-error border-error/20 hover:bg-error/5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {isAuthError ? (
              <>
                <p className="text-error mb-2">Session Expired</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Your admin session has expired. Please refresh the page to log in again.
                </p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                  className="text-error border-error/20 hover:bg-error/5"
                >
                  Refresh Page
                </Button>
              </>
            ) : (
              <>
                <p className="text-error mb-2">Failed to load service settings</p>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn("relative", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Service Management
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={isLoading || isUpdating}
              className="text-muted-foreground"
            >
              <RefreshCw 
                className={cn(
                  "h-4 w-4 mr-2",
                  (isLoading || isUpdating) && "animate-spin"
                )} 
              />
              Refresh
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable or disable services throughout the application. Changes take effect immediately.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2].map((index) => (
                <Card key={index} className="border-l-4 border-l-muted">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div>
                          <Skeleton className="h-6 w-24 mb-2" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      <Skeleton className="w-12 h-6 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : serviceConfig ? (
            // Service toggle cards
            <div className="grid gap-4 md:grid-cols-2">
              <ServiceToggleCard
                service="studio"
                enabled={serviceConfig.studio.enabled}
                isLoading={isUpdating}
                onToggleRequest={handleToggleRequest}
                config={serviceConfig}
                refetch={refetch}
              />
              <ServiceToggleCard
                service="coworking"
                enabled={serviceConfig.coworking.enabled}
                isLoading={isUpdating}
                onToggleRequest={handleToggleRequest}
                config={serviceConfig}
                refetch={refetch}
              />
            </div>
          ) : null}

          {/* Additional info */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">About Service Management</p>
                <p>
                  Disabled services will be hidden from navigation menus, booking forms, 
                  and their respective pages. Users won't be able to access or book disabled services. 
                  All changes are applied immediately across the application.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Loading overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="bg-background border rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Updating services...</span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <ServiceConfirmDialog
        isOpen={confirmDialog.isOpen}
        service={confirmDialog.service}
        action={confirmDialog.action}
        isLoading={isUpdating}
        onConfirm={handleConfirmToggle}
        onCancel={handleCancelToggle}
      />
    </>
  );
}
