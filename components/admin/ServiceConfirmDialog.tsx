import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServiceIcon } from "./ServiceIcon";

interface ServiceConfirmDialogProps {
  isOpen: boolean;
  service: 'studio' | 'coworking';
  action: 'enable' | 'disable';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ServiceConfirmDialog component provides confirmation for service toggle actions
 * Implements the enhanced confirmation pattern from the creative phase design
 */
export function ServiceConfirmDialog({
  isOpen,
  service,
  action,
  isLoading = false,
  onConfirm,
  onCancel,
}: ServiceConfirmDialogProps) {
  const serviceName = service === 'studio' ? 'Studio' : 'Coworking';
  const isDisabling = action === 'disable';

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ServiceIcon service={service} className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">
              {action === 'disable' ? 'Disable' : 'Enable'} {serviceName}?
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {isDisabling ? (
              <>
                This will <strong>hide {serviceName.toLowerCase()}</strong> from navigation and booking options. 
                Users won't be able to book this service until you enable it again.
              </>
            ) : (
              <>
                This will make <strong>{serviceName.toLowerCase()}</strong> available for booking again 
                and show it in navigation menus.
              </>
            )}
            <br />
            <br />
            <span className="font-semibold text-foreground">
              Changes take effect immediately.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        {/* Impact areas preview */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Affected areas:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Navigation menu</li>
            <li>• Booking form options</li>
            <li>• Service pages ({serviceName.toLowerCase()})</li>
            <li>• Availability calendar</li>
          </ul>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant={isDisabling ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              `${action === 'disable' ? 'Disable' : 'Enable'} Service`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
