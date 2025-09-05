import { Building, Coffee, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceIconProps {
  service: 'studio' | 'coworking';
  className?: string;
}

/**
 * ServiceIcon component provides consistent iconography for different services
 * Following the Material Design 3 system defined in the style guide
 */
export function ServiceIcon({ service, className }: ServiceIconProps) {
  const IconComponent = service === 'studio' ? Building : Coffee;
  
  return (
    <IconComponent 
      className={cn("h-6 w-6 text-primary", className)} 
      aria-hidden="true"
    />
  );
}
