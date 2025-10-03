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
  serverMode = false,
  serverTotal = 0,
  serverPage = 1,
  serverPageSize = 10,
  onPageChange,
  onPageSizeChange,
}: {
  bookings: Booking[];
  filterStatus: string;
  searchQuery: string;
  onConfirmBooking?: (id: string) => void;
  onCancelBooking?: (id: string) => void;
  serverMode?: boolean;
  serverTotal?: number;
  serverPage?: number;
  serverPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}) {
  // If serverMode is enabled, the `bookings` prop represents the current page of data
  // and pagination controls should rely on serverTotal/serverPage/serverPageSize.

  // Client-side filtering/sorting/pagination (existing behavior)
  const filtered = (!serverMode ? bookings
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : bookings
  );

  // Apply sorting
  const { sortedData, requestSort, getSortIcon } = useTableSort(filtered, 'date', 'desc');

  // Apply pagination: client-side uses hook, server-side uses provided pagination props
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

  // Data to render
  const dataToRender = serverMode ? bookings : paginatedData;

  // Pagination helpers for server mode
  const serverTotalPages = serverMode ? Math.max(1, Math.ceil(serverTotal / serverPageSize)) : totalPages;
  const serverHasNext = serverMode ? serverPage < serverTotalPages : hasNextPage;
  const serverHasPrev = serverMode ? serverPage > 1 : hasPreviousPage;
  const serverStartIndex = serverMode ? (serverPage - 1) * serverPageSize + 1 : startIndex;
  const serverEndIndex = serverMode ? Math.min(serverPage * serverPageSize, serverTotal) : endIndex;
  const serverCurrentPage = serverMode ? serverPage : currentPage;
  const serverPageSizeValue = serverMode ? serverPageSize : pageSize;

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
            {dataToRender.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              dataToRender.map((booking) => (
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
                        <Button size="sm" className="min-w-[88px] h-10" onClick={() => onConfirmBooking?.(booking.id)} aria-label={`Confirm booking ${booking.id}`}>
                          Confirm
                        </Button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <Button size="sm" variant="destructive" className="min-w-[88px] h-10" onClick={() => onCancelBooking?.(booking.id)} aria-label={`Cancel booking ${booking.id}`}>
                          Cancel
                        </Button>
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
      {(serverMode ? serverTotal > 0 : totalItems > 0) && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {serverStartIndex} to {serverEndIndex} of {serverMode ? serverTotal : totalItems} bookings
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-muted-foreground">
                Rows per page:
              </label>
              <Select value={String(serverPageSizeValue)} onValueChange={(value) => {
                const n = Number(value);
                if (serverMode) onPageSizeChange?.(n); else changePageSize(n);
              }}>
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
              Page {serverCurrentPage} of {serverMode ? serverTotalPages : totalPages}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => { if (serverMode) onPageChange?.(1); else goToFirstPage(); }}
                disabled={!serverHasPrev}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => { if (serverMode) onPageChange?.(serverCurrentPage - 1); else goToPreviousPage(); }}
                disabled={!serverHasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => { if (serverMode) onPageChange?.(serverCurrentPage + 1); else goToNextPage(); }}
                disabled={!serverHasNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => { if (serverMode) onPageChange?.(serverMode ? serverTotalPages : 1); else goToLastPage(); }}
                disabled={!serverHasNext}
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

