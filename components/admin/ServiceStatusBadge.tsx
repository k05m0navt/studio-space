import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceStatusBadgeProps {
  enabled: boolean;
  className?: string;
}

/**
 * ServiceStatusBadge component displays service status with semantic colors
 * Uses established badge patterns from the style guide
 */
export function ServiceStatusBadge({ enabled, className }: ServiceStatusBadgeProps) {
  return (
    <Badge 
      variant={enabled ? "default" : "secondary"}
      className={cn(
        "flex items-center gap-1.5 transition-colors",
        enabled 
          ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
          : "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      {enabled ? (
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
      ) : (
        <XCircle className="h-3 w-3" aria-hidden="true" />
      )}
      {enabled ? 'Enabled' : 'Disabled'}
    </Badge>
  );
}
