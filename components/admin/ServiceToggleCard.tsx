import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ServiceIcon } from "./ServiceIcon";
import { ServiceStatusBadge } from "./ServiceStatusBadge";
import { cn } from "@/lib/utils";

interface ServiceToggleCardProps {
  service: 'studio' | 'coworking';
  enabled: boolean;
  isLoading?: boolean;
  onToggleRequest: (service: 'studio' | 'coworking', currentlyEnabled: boolean) => void;
  className?: string;
}

/**
 * ServiceToggleCard component displays individual service with toggle functionality
 * Follows the Enhanced Toggle Card Layout from the creative phase design
 */
export function ServiceToggleCard({
  service,
  enabled,
  isLoading = false,
  onToggleRequest,
  className,
}: ServiceToggleCardProps) {
  const serviceName = service === 'studio' ? 'Studio' : 'Coworking';
  const serviceDescription = service === 'studio' 
    ? 'Professional photography and video production space'
    : 'Shared workspace for freelancers and teams';

  const impactAreas = service === 'studio'
    ? ['Navigation', 'Booking', 'Studio Page']
    : ['Navigation', 'Booking', 'Coworking Page'];

  const handleToggle = () => {
    if (isLoading) return;
    onToggleRequest(service, enabled);
  };

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-200",
        "border-l-4",
        enabled ? "border-l-primary/60" : "border-l-muted",
        className
      )}
    >
      <CardContent className="p-6">
        {/* Service Info & Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
              enabled ? "bg-primary/10" : "bg-muted/50"
            )}>
              <ServiceIcon 
                service={service} 
                className={cn(
                  "h-6 w-6 transition-colors",
                  enabled ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {serviceName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {serviceDescription}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <Switch 
              checked={enabled}
              onCheckedChange={handleToggle}
              disabled={isLoading}
              aria-label={`${enabled ? 'Disable' : 'Enable'} ${serviceName} service`}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        
        {/* Status & Impact Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <ServiceStatusBadge enabled={enabled} />
          <span className="text-xs text-muted-foreground">
            Affects: {impactAreas.join(', ')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
