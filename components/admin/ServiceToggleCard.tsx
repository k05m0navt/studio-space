import React, { useState, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ServiceIcon } from "./ServiceIcon";
import { ServiceStatusBadge } from "./ServiceStatusBadge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Edit } from "lucide-react";
import { OptimizedImage } from "@/components/optimized-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CURRENCIES = ['USD','EUR','GBP','UAH','RUB'];
const UNITS = ['hour','half-day','day'];

interface ServiceDetails {
  enabled: boolean;
  price?: number;
  currency?: string;
  unit?: string;
  address?: string;
  images?: string[];
}
interface Props {
  service: 'studio' | 'coworking';
  enabled: boolean;
  isLoading?: boolean;
  onToggleRequest: (service: 'studio' | 'coworking', currentlyEnabled: boolean) => void;
  className?: string;
  config?: { studio: ServiceDetails; coworking: ServiceDetails };
  refetch?: () => void;
}

export const ServiceToggleCard = memo(function ServiceToggleCard({
  service,
  enabled,
  isLoading = false,
  onToggleRequest,
  className,
  config,
  refetch,
}: Props) {
  const t = (typeof window === 'undefined') ? ((k: string) => k) as any : undefined;
const serviceName = service === 'studio' ? t ? t('services.studio.name') : 'Studio' : t ? t('services.coworking.name') : 'Coworking';
  const serviceDescription = service === 'studio'
    ? (t ? t('services.studio.description') : 'Professional photography and video production space')
    : (t ? t('services.coworking.description') : 'Shared workspace for freelancers and teams');

  const impactAreas = service === 'studio'
    ? ['Navigation', 'Booking', 'Studio Page']
    : ['Navigation', 'Booking', 'Coworking Page'];

  const handleToggle = () => {
    if (isLoading) return;
    onToggleRequest(service, enabled);
  };

  // Edit dialog state
  const [open, setOpen] = useState(false);
  const initial = config ? config[service] : { price: 0, currency: 'RUB', unit: 'hour', address: '', images: [] as string[] };
  const [price, setPrice] = useState<string>(String(initial?.price ?? ''));
  const [currency, setCurrency] = useState<string>(initial?.currency ?? 'RUB');
  const [unit, setUnit] = useState<string>(initial?.unit ?? 'hour');
  const [address, setAddress] = useState<string>(initial?.address ?? '');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);

  // Save price/address/currency/unit -> call PUT via settings API
  const handleSave = async () => {
    try {
      const payload: any = { [service]: { price: price ? Number(price) : 0, currency, unit, address } };
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const res = await fetch('/api/settings/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setOpen(false);
      refetch?.();
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  };

  // Upload image
  const handleFile = async (fileInput: FileList | null) => {
    if (!fileInput || fileInput.length === 0) return;
    const file = fileInput[0];
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('service', service);
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const res = await fetch('/api/settings/services', {
        method: 'POST',
        body: fd,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Upload failed');
      setImages(json.data.images ?? []);
      refetch?.();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Delete image by public URL
  const handleDeleteImage = async (url: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      const res = await fetch('/api/settings/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify({ service, url }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Delete failed');
      setImages(json.data.images ?? []);
      refetch?.();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // initialize dialog-local state when opening to avoid render loops
  const openEditDialog = () => {
    const c = config?.[service] ?? { price: 0, currency: 'USD', unit: 'hour', address: '', images: [] as string[] };
    setPrice(String(c.price ?? ''));
    setCurrency(c.currency ?? 'USD');
    setUnit(c.unit ?? 'hour');
    setAddress(c.address ?? '');
    setImages(c.images ?? []);
    setOpen(true);
  };

  return (
    <>
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-200",
          "border-l-4",
          enabled ? "border-l-primary/60" : "border-l-muted",
          className
        )}
      >
        <CardContent className="p-6">
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
                <h3 className="text-xl font-semibold text-foreground mb-1">{serviceName}</h3>
                <p className="text-sm text-muted-foreground">{serviceDescription}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Price:</strong> {config?.[service]?.price ? `${config?.[service].currency ?? 'USD'} ${config?.[service].price}` : 'Not set'}
              </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> {config?.[service]?.address ?? 'Not set'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={openEditDialog}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Button>

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

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <ServiceStatusBadge enabled={enabled} />
            <span className="text-xs text-muted-foreground">
              Affects: {impactAreas.join(', ')}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {serviceName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Price</Label>
              <div className="flex gap-2">
                <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 50" />
                <Select onValueChange={(v) => setCurrency(v)}>
                  <SelectTrigger className="w-28"><SelectValue placeholder={currency} /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => setUnit(v)}>
                  <SelectTrigger className="w-28"><SelectValue placeholder={unit} /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Service address" />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2 flex-wrap">
                {(images || []).map((img) => (
                  <div key={img} className="w-24 h-24 rounded overflow-hidden relative border">
                    <OptimizedImage src={img} alt="preview" width={96} height={96} className="object-cover w-full h-full" />
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files)} disabled={uploading} />
                {uploading && <span className="text-sm ml-2">Uploading...</span>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
