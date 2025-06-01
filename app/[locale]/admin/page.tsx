"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  Camera, 
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
  MapPin,
  RefreshCw,
  Download,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
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

interface Stats {
  totalBookings: number;
  monthlyRevenue: number;
  activeMembers: number;
  studioUtilization: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    monthlyRevenue: 0,
    activeMembers: 0,
    studioUtilization: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('admin');

  // Check authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    if (adminAuth === "authenticated") {
      setIsAuthenticated(true);
      loadDashboardData();
    }
    setIsLoading(false);
  }, []);

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      // Load bookings
      const token = localStorage.getItem('adminToken');
      if (token) {
        const response = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
          
          // Calculate stats from bookings
          const totalBookings = data.bookings?.length || 0;
          const pending = data.bookings?.filter((b: Booking) => b.status === 'pending').length || 0;
          const confirmed = data.bookings?.filter((b: Booking) => b.status === 'confirmed').length || 0;
          
          setStats({
            totalBookings,
            monthlyRevenue: totalBookings * 75, // Estimate
            activeMembers: 48, // Mock data
            studioUtilization: Math.round((confirmed / Math.max(totalBookings, 1)) * 100),
            pendingBookings: pending,
            confirmedBookings: confirmed
          });
        }
      } else {
        // Use mock data if no token
        const mockBookings: Booking[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            type: 'studio',
            date: '2024-01-15',
            start_time: '10:00',
            end_time: '14:00',
            status: 'confirmed',
            createdAt: '2024-01-10T12:00:00Z'
          },
          {
            id: '2',
            name: 'Mike Chen',
            email: 'mike@example.com',
            phone: '+1 (555) 987-6543',
            type: 'coworking',
            date: '2024-01-15',
            start_time: '09:00',
            end_time: '17:00',
            status: 'pending',
            createdAt: '2024-01-12T15:30:00Z'
          },
          {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@example.com',
            type: 'studio',
            date: '2024-01-16',
            start_time: '15:00',
            end_time: '18:00',
            status: 'confirmed',
            createdAt: '2024-01-13T09:15:00Z'
          }
        ];
        
        setBookings(mockBookings);
        setStats({
          totalBookings: mockBookings.length,
          monthlyRevenue: 12750,
          activeMembers: 48,
          studioUtilization: 78,
          pendingBookings: mockBookings.filter(b => b.status === 'pending').length,
          confirmedBookings: mockBookings.filter(b => b.status === 'confirmed').length
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper auth
    if (loginForm.username === "admin" && loginForm.password === "studio123") {
      localStorage.setItem("adminAuth", "authenticated");
      setIsAuthenticated(true);
      loadDashboardData();
      toast.success("Welcome back!", {
        description: "Successfully logged in to admin dashboard."
      });
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your username and password."
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setBookings([]);
    setStats({
      totalBookings: 0,
      monthlyRevenue: 0,
      activeMembers: 0,
      studioUtilization: 0,
      pendingBookings: 0,
      confirmedBookings: 0
    });
    toast.success("Logged out successfully");
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      // Update local state immediately for better UX
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      toast.success(`Booking ${newStatus} successfully`);
      
      // Recalculate stats
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      );
      
      const confirmed = updatedBookings.filter(b => b.status === 'confirmed').length;
      const pending = updatedBookings.filter(b => b.status === 'pending').length;
      
      setStats(prev => ({
        ...prev,
        confirmedBookings: confirmed,
        pendingBookings: pending,
        studioUtilization: Math.round((confirmed / Math.max(updatedBookings.length, 1)) * 100)
      }));
      
    } catch (error) {
      console.error('Failed to update booking:', error);
      toast.error('Failed to update booking status');
      // Revert the local state on error
      loadDashboardData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Confirmed</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-300 text-yellow-800 dark:border-yellow-600 dark:text-yellow-300">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Shield className="w-8 h-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
              <p className="text-muted-foreground">Access the Vasha Studio dashboard</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="h-12"
                    required
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button type="submit" className="w-full h-12 text-base font-semibold">
                    <Shield className="w-4 h-4 mr-2" />
                    Login to Dashboard
                  </Button>
                </motion.div>
              </form>
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  Demo credentials:<br />
                  Username: <strong>admin</strong><br />
                  Password: <strong>studio123</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
            <p className="text-muted-foreground">Manage your studio bookings and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={loadDashboardData}
              disabled={isLoadingData}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Studio Utilization</p>
                  <p className="text-2xl font-bold">{stats.studioUtilization}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Bookings</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings">{t('bookings')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
              <TabsTrigger value="settings">{t('settings')}</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search bookings..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.type === 'studio' ? 'default' : 'secondary'}>
                              {booking.type === 'studio' ? 'Studio' : 'Coworking'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
                              <div className="text-sm text-muted-foreground">
                                {booking.start_time} - {booking.end_time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {booking.status === 'pending' && (
                                  <>
                                    <DropdownMenuItem 
                                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      className="text-green-600 dark:text-green-400"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Confirm
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No bookings found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                        <p>Analytics charts would be displayed here</p>
                        <p className="text-sm">Connect to analytics service</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Time Slots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">10:00 - 14:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">14:00 - 18:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">50%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">18:00 - 22:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">25%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Studio Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Studio Hours</Label>
                      <Input defaultValue="9:00 AM - 10:00 PM" />
                    </div>
                    <div>
                      <Label>Hourly Rate</Label>
                      <Input defaultValue="$75" />
                    </div>
                    <div>
                      <Label>Maximum Booking Duration</Label>
                      <Input defaultValue="8 hours" />
                    </div>
                    <div>
                      <Label>Advance Booking Limit</Label>
                      <Input defaultValue="30 days" />
                    </div>
                  </div>
                  <Button className="mt-4">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
} 