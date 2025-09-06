import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  start_time?: string;
  end_time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: 'studio' | 'coworking';
}

export function BookingsTable({
  bookings,
  filterStatus,
  searchQuery,
  onConfirmBooking,
  onCancelBooking,
}: {
  bookings: Booking[];
  filterStatus: string;
  searchQuery: string;
  onConfirmBooking?: (id: string) => void;
  onCancelBooking?: (id: string) => void;
}) {
  const filtered = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((booking) => (
            <tr key={booking.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{booking.name}</TableCell>
              <TableCell>{booking.email}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{booking.type}</Badge>
              </TableCell>
              <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
              <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
              <TableCell>
                <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {booking.status === 'pending' && (
                    <Button size="sm" onClick={() => onConfirmBooking?.(booking.id)}>Confirm</Button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <Button size="sm" variant="destructive" onClick={() => onCancelBooking?.(booking.id)}>Cancel</Button>
                  )}
                </div>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

