import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { useTableSort } from '@/hooks/useTableSort';

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
  // Filter bookings
  const filtered = bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // Apply sorting
  const { sortedData, requestSort, getSortIcon } = useTableSort(filtered, 'date', 'desc');

  // Apply pagination
  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(sortedData, { initialPageSize: 10 });

  const SortableHeader = ({ column, children }: { column: keyof Booking; children: React.ReactNode }) => {
    const sortIcon = getSortIcon(column);
    return (
      <TableHead>
        <button
          onClick={() => requestSort(column)}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {children}
          {sortIcon === 'asc' && <ArrowUp className="w-4 h-4" />}
          {sortIcon === 'desc' && <ArrowDown className="w-4 h-4" />}
          {sortIcon === null && <ArrowUpDown className="w-4 h-4 opacity-50" />}
        </button>
      </TableHead>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader column="name">Name</SortableHeader>
              <SortableHeader column="email">Email</SortableHeader>
              <SortableHeader column="type">Service</SortableHeader>
              <SortableHeader column="date">Date</SortableHeader>
              <TableHead>Time</TableHead>
              <SortableHeader column="status">Status</SortableHeader>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex} to {endIndex} of {totalItems} bookings
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-muted-foreground">
                Rows per page:
              </label>
              <Select value={String(pageSize)} onValueChange={(value) => changePageSize(Number(value))}>
                <SelectTrigger id="pageSize" className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToFirstPage}
                disabled={!hasPreviousPage}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToPreviousPage}
                disabled={!hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToNextPage}
                disabled={!hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToLastPage}
                disabled={!hasNextPage}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

