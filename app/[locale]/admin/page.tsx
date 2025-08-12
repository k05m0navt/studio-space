"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Shield,
  BarChart3,
  RefreshCw,
  Download,
  Search,
  MoreHorizontal,
  User,
  Settings,
  Activity,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Helpers
/** Returns Authorization header from localStorage token if available (client-only). */
function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Wraps fetch to attach Authorization header and no-store. Does not throw on 401/403.
 * Caller should handle unauthorized responses to reset UI state.
 */
async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const mergedHeaders: HeadersInit = { ...(init.headers || {}), ...getAuthHeaders() };
  return fetch(input, { ...init, headers: mergedHeaders, cache: init.cache ?? 'no-store' });
}

// Types
interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'studio' | 'coworking';
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  message?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface Stats {
  totalBookings: number;
  monthlyRevenue: number;
  activeMembers: number;
  studioUtilization: number;
  pendingBookings: number;
  confirmedBookings: number;
  todayBookings: number;
  weeklyGrowth: number;
}

const AdminLoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('admin');
  const tAuth = useTranslations('auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // guard against duplicate submits
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        cache: 'no-store',
        signal: controller.signal,
        credentials: 'omit'
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        toast.error(tAuth('loginFailed'));
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data?.token && data?.user) {
        // Enforce admin role for dashboard access
        const roleUpper = String(data.user.role).toUpperCase();
        if (roleUpper !== 'ADMIN') {
          toast.error(tAuth('accessDenied'));
          setIsLoading(false);
          return;
        }
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminAuth', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        onLogin();
        toast.success(tAuth('loginSuccess'));
      } else {
        toast.error(tAuth('loginFailed'));
      }
    } catch (err) {
      toast.error(tAuth('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
              <p className="text-muted-foreground mt-2">{t('loginDescription')}</p>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email">{tAuth('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={tAuth('email')}
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{tAuth('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={tAuth('password')}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="h-12"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    tAuth('login')
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  color = "primary" 
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  trendLabel?: string;
  color?: "primary" | "success" | "warning" | "destructive";
}) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    destructive: "bg-red-500/10 text-red-600 border-red-500/20"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-card to-card/50 h-full">
        <CardContent className="p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1 flex-1 min-h-[60px]">
              <p className="text-sm font-medium text-muted-foreground line-clamp-2">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className={cn("p-3 rounded-full border shrink-0", colorClasses[color])}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-auto">
              <TrendingUp className={cn("w-3 h-3", trend >= 0 ? "text-green-500" : "text-red-500")} />
              <span className={cn("text-xs font-medium", trend >= 0 ? "text-green-500" : "text-red-500")}> 
                {trend >= 0 ? "+" : ""}{trend}% {trendLabel}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    monthlyRevenue: 0,
    activeMembers: 0,
    studioUtilization: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    todayBookings: 0,
    weeklyGrowth: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');

  const handleUnauthorized = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    }
    setIsAuthenticated(false);
    toast.error(tAuth('sessionExpired'));
  }, [tAuth]);

  const loadDashboardData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const locale = window.location.pathname.split('/')[1] || 'en';

      const [bookingsResponse, usersResponse, statsResponse] = await Promise.all([
        authorizedFetch(`/${locale}/api/admin/bookings`),
        authorizedFetch(`/${locale}/api/admin/users`),
        authorizedFetch(`/${locale}/api/admin/stats`)
      ]);

      if ([bookingsResponse, usersResponse, statsResponse].some(r => r.status === 401 || r.status === 403)) {
        handleUnauthorized();
        return;
      }

      let bookingsData: Booking[] = [];
      let usersData: User[] = [];
      let statsData: Stats = {
        totalBookings: 0,
        monthlyRevenue: 0,
        activeMembers: 0,
        studioUtilization: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        todayBookings: 0,
        weeklyGrowth: 0
      };
      
      if (bookingsResponse.ok) {
        const data = await bookingsResponse.json();
        bookingsData = Array.isArray(data) ? data : (data?.bookings ?? []);
      }
      if (usersResponse.ok) {
        const data = await usersResponse.json();
        usersData = Array.isArray(data) ? data : (data?.users ?? []);
      }
      if (statsResponse.ok) {
        statsData = await statsResponse.json();
      }
      
      setStats(statsData);
      setBookings(bookingsData);
      setUsers(usersData);
      
      toast.success(t('messages.dataRefreshed'));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error(t('messages.dataLoadFailed'));
    } finally {
      setIsLoadingData(false);
    }
  }, [t, handleUnauthorized]);

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
      loadDashboardData();
    }
    setIsLoading(false);
  }, [loadDashboardData]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast.success(t('messages.logoutSuccess'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 max-w-8xl py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('welcome')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('description')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={loadDashboardData}
                disabled={isLoadingData}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("w-4 h-4", isLoadingData && "animate-spin")} />
                {tCommon('refresh')}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('overview')}</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">{t('bookings')}</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">{t('users')}</span>
              </TabsTrigger>
              <TabsTrigger value="admins" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admins</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">{t('settings')}</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
                    <StatsCard
                      title={t('stats.totalBookings')}
                      value={stats.totalBookings}
                      icon={Calendar}
                      trend={stats.weeklyGrowth}
                      trendLabel={t('stats.thisMonth')}
                      color="primary"
                    />
                    <StatsCard
                      title={t('stats.monthlyRevenue')}
                      value={`$${stats.monthlyRevenue.toLocaleString()}`}
                      icon={DollarSign}
                      trend={8.2}
                      trendLabel={t('stats.thisMonth')}
                      color="success"
                    />
                    <StatsCard
                      title={t('stats.pendingBookings')}
                      value={stats.pendingBookings}
                      icon={Clock}
                      color="warning"
                    />
                    <StatsCard
                      title={t('stats.studioUtilization')}
                      value={`${stats.studioUtilization}%`}
                      icon={Activity}
                      trend={5.1}
                      trendLabel={t('stats.thisMonth')}
                      color="primary"
                    />
                  </div>

                  {/* Recent Activity */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {t('recentBookings')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {bookings.slice(0, 3).map((booking, index) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {booking.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{booking.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {booking.type} - {booking.date}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={
                                booking.status === 'confirmed' ? 'default' :
                                booking.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {booking.status}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                      <Card className="h-full border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-warning" />
                            {t('quickActions.title')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { icon: Plus, label: t('quickActions.addBooking'), onClick: () => setActiveTab('bookings') },
                              { icon: Users, label: t('quickActions.manageUsers'), onClick: () => setActiveTab('users') },
                              { icon: Shield, label: t('quickActions.createAdmin'), onClick: () => setActiveTab('admins') },
                              { icon: Download, label: t('quickActions.exportData'), onClick: () => toast.info(t('quickActions.exportSoon')) }
                            ].map((action, index) => (
                              <motion.div
                                key={action.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15, delay: index * 0.05 }}
                                whileHover={{ scale: 1.01, x: 2 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start h-12 hover:bg-surface-container-high transition-all duration-150"
                                  onClick={action.onClick}
                                >
                                  <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                                  <span className="truncate">{action.label}</span>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <TabsContent value="bookings" className="space-y-6">
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {t('bookingManagement.title')}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder={t('bookingManagement.searchPlaceholder')}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder={t('bookingManagement.filterBy')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{tCommon('status')}</SelectItem>
                              <SelectItem value="pending">{tCommon('pending')}</SelectItem>
                              <SelectItem value="confirmed">{tCommon('confirmed')}</SelectItem>
                              <SelectItem value="cancelled">{tCommon('cancelled')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{tCommon('name')}</TableHead>
                              <TableHead>{tCommon('email')}</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>{tCommon('date')}</TableHead>
                              <TableHead>{tCommon('time')}</TableHead>
                              <TableHead>{tCommon('status')}</TableHead>
                              <TableHead>{tCommon('actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings
                              .filter(booking => 
                                filterStatus === 'all' || booking.status === filterStatus
                              )
                              .filter(booking =>
                                booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                booking.email.toLowerCase().includes(searchQuery.toLowerCase())
                              )
                              .map((booking, index) => (
                                <motion.tr
                                  key={booking.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="hover:bg-muted/50"
                                >
                                  <TableCell className="font-medium">{booking.name}</TableCell>
                                  <TableCell>{booking.email}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                      {booking.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                  <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
                                  <TableCell>
                                    <Badge variant={
                                      booking.status === 'confirmed' ? 'default' :
                                      booking.status === 'pending' ? 'secondary' : 'destructive'
                                    }>
                                      {booking.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>{tCommon('actions')}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                          <Eye className="mr-2 h-4 w-4" />
                                          {t('bookingManagement.viewDetails')}
                                        </DropdownMenuItem>
                                        {booking.status === 'pending' && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              const updatedBookings = bookings.map(b =>
                                                b.id === booking.id ? { ...b, status: 'confirmed' as const } : b
                                              );
                                              setBookings(updatedBookings);
                                              toast.success(t('messages.bookingConfirmed'));
                                            }}
                                          >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {t('bookingManagement.confirmBooking')}
                                          </DropdownMenuItem>
                                        )}
                                        {booking.status !== 'cancelled' && (
                                          <DropdownMenuItem
                                            onClick={() => {
                                              const updatedBookings = bookings.map(b =>
                                                b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
                                              );
                                              setBookings(updatedBookings);
                                              toast.success(t('messages.bookingCancelled'));
                                            }}
                                          >
                                            <XCircle className="mr-2 h-4 w-4" />
                                            {t('bookingManagement.cancelBooking')}
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </motion.tr>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <TabsContent value="users" className="space-y-6">
                <motion.div
                  key="users"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          {t('userManagement.title')}
                        </CardTitle>
                        <Button className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          {t('userManagement.addUser')}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{tCommon('name')}</TableHead>
                              <TableHead>{tCommon('email')}</TableHead>
                              <TableHead>{t('userManagement.role')}</TableHead>
                              <TableHead>{tCommon('status')}</TableHead>
                              <TableHead>{t('userManagement.lastLogin')}</TableHead>
                              <TableHead>{tCommon('actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.map((user, index) => (
                              <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="hover:bg-muted/50"
                              >
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback>
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                    {user.isActive ? tCommon('active') : tCommon('inactive')}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>{tCommon('actions')}</DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        {t('userManagement.editUser')}
                                      </DropdownMenuItem>
                                      {user.role !== 'admin' && (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            const updatedUsers = users.map(u =>
                                              u.id === user.id ? { ...u, role: 'admin' as const } : u
                                            );
                                            setUsers(updatedUsers);
                                            toast.success(t('messages.userUpdated'));
                                          }}
                                        >
                                          <Shield className="mr-2 h-4 w-4" />
                                          {t('userManagement.makeAdmin')}
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem
                                        onClick={() => {
                                          const updatedUsers = users.map(u =>
                                            u.id === user.id ? { ...u, isActive: !u.isActive } : u
                                          );
                                          setUsers(updatedUsers);
                                          toast.success(t('messages.userUpdated'));
                                        }}
                                      >
                                        {user.isActive ? (
                                          <>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            {t('userManagement.deactivateUser')}
                                          </>
                                        ) : (
                                          <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {t('userManagement.activateUser')}
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('userManagement.deleteUser')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* Admins Tab */}
            {activeTab === "admins" && (
              <TabsContent value="admins" className="space-y-6">
                <motion.div
                  key="admins"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          {t('adminManagement.title')}
                        </CardTitle>
                        <Button 
                          onClick={() => setIsCreateAdminOpen(true)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('adminManagement.createAdmin')}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6">
                        {users.filter(user => user.role === 'admin').map((admin, index) => (
                          <motion.div
                            key={admin.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="w-12 h-12">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {admin.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">{admin.name}</h3>
                                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="default" className="text-xs">
                                        {t('adminManagement.fullAccess')}
                                      </Badge>
                                      <Badge variant={admin.isActive ? 'default' : 'destructive'} className="text-xs">
                                        {admin.isActive ? tCommon('active') : tCommon('inactive')}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-1" />
                                    {tCommon('edit')}
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Manage Permissions
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Activity className="mr-2 h-4 w-4" />
                                        View Activity
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-red-600">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {t('userManagement.removeAdmin')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        {t('settings')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="text-center py-12">
                          <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
                          <p className="text-muted-foreground">
                            Settings and configuration options will be available here.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>

        {/* Create Admin Dialog */}
        <CreateAdminDialog 
          open={isCreateAdminOpen} 
          onOpenChange={setIsCreateAdminOpen}
          onSuccess={(newAdmin) => {
            setUsers(prev => [...prev, newAdmin]);
            setIsCreateAdminOpen(false);
            toast.success(t('messages.adminCreated'));
          }}
        />
      </motion.div>
    </div>
  );
}

// Create Admin Dialog Component
const CreateAdminDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: (admin: User) => void;
}) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAdmin: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    onSuccess(newAdmin);
    setFormData({ name: "", email: "", password: "" });
    setIsLoading(false);
    onOpenChange(false);
    toast.success(t('adminCreated'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createAdmin')}</DialogTitle>
          <DialogDescription>
            {t('createAdminDescription')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">{t('name')}</Label>
            <Input
              id="admin-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">{t('email')}</Label>
            <Input
              id="admin-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">{t('password')}</Label>
            <Input
              id="admin-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('creating') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 