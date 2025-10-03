"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, Palette, Shield, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authorizedFetch } from "@/lib/client-auth";

interface SettingsPanelProps {
  locale?: string;
}

export function SettingsPanel({ locale = "en" }: SettingsPanelProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  // Settings state
  const [settings, setSettings] = useState({
    // General
    siteName: "Vasha Studio",
    siteDescription: "Creative Space & Photography Studio",
    adminEmail: "admin@vashastudio.com",
    timezone: "Europe/Moscow",

    // Notifications
    emailNotifications: true,
    bookingNotifications: true,
    systemNotifications: false,

    // Appearance
    defaultLocale: locale,
    enableDarkMode: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    async function load() {
      try {
        const localePath = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';
        const res = await authorizedFetch(`/${localePath}/api/settings/general`);
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data ?? {};
        setSettings(prev => ({
          ...prev,
          siteName: data.site?.name ?? prev.siteName,
          siteDescription: data.site?.description ?? prev.siteDescription,
          adminEmail: data.contact?.email ?? prev.adminEmail,
          // timezone left as-is (not stored in general settings yet)
        }));
      } catch (err) {
        console.error('Failed to load general settings', err);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const payload = {
        site: { name: settings.siteName, description: settings.siteDescription },
        contact: { email: settings.adminEmail }
      };
      const localePath = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';
      const res = await authorizedFetch(`/${localePath}/api/settings/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.text().catch(() => null);
        let msg = 'Failed to save settings';
        try { const j = body ? JSON.parse(body) : null; msg = j?.error || j?.message || msg; } catch {}
        toast.error(tCommon('error'), { description: msg });
        return;
      }

      setSaveStatus('success');
      toast.success(tCommon('success'), {
        description: 'Settings saved successfully',
      });

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      toast.error(tCommon('error'), {
        description: 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="Enter site name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Enter site description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Moscow">Europe/Moscow (MSK)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    <SelectItem value="America/New_York">America/New York (EST)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bookingNotifications">Booking Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new bookings are made</p>
                </div>
                <Switch
                  id="bookingNotifications"
                  checked={settings.bookingNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, bookingNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="systemNotifications">System Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive system updates and maintenance alerts</p>
                </div>
                <Switch
                  id="systemNotifications"
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, systemNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how your dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultLocale">Default Language</Label>
                <Select value={settings.defaultLocale} onValueChange={(value) => setSettings({ ...settings, defaultLocale: value })}>
                  <SelectTrigger id="defaultLocale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableDarkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the dashboard</p>
                </div>
                <Switch
                  id="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableDarkMode: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select 
                  value={String(settings.sessionTimeout)} 
                  onValueChange={(value) => setSettings({ ...settings, sessionTimeout: parseInt(value) })}
                >
                  <SelectTrigger id="sessionTimeout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
