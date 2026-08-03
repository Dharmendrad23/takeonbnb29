import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Eye, Check, X, FileImage, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import api from '@/lib/api'; 
import { formatCurrencyINR, formatDate } from '@/lib/bookingUtils.js';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      let filter = [];
      if (search) {
        filter.push(`(guestFullName ~ "${search}" || propertyName ~ "${search}" || id ~ "${search}" || transactionId ~ "${search}")`);
      }
      if (statusFilter !== 'all') {
        filter.push(`bookingStatus = "${statusFilter}"`);
      }
      
      const filterStr = filter.join(' && ');

    const { data } = await api.get("/bookings");

let records = data;

if (search) {
  const q = search.toLowerCase();
  records = records.filter(
    b =>
      b.guestFullName?.toLowerCase().includes(q) ||
      b.propertyName?.toLowerCase().includes(q) ||
      b._id?.toLowerCase().includes(q) ||
      b.transactionId?.toLowerCase().includes(q)
  );
}

if (statusFilter !== "all") {
  records = records.filter(
    b => (b.bookingStatus || b.status) === statusFilter
  );
}

setBookings(records);
      setBookings(records);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    api.collection('bookings').subscribe('*', fetchBookings);
    return () => api.collection('bookings').unsubscribe('*');
  }, [search, statusFilter]);

  const handleApprove = async (booking) => {
    setActionLoading(true);
    try {
     await api.put(`/bookings/${booking._id}`,{
        status: 'confirmed',
        bookingStatus: 'confirmed',
        paymentStatus: 'verified'
      }, { $autoCancel: false });
      
      toast.success("Booking approved and verified successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to approve booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    setActionLoading(true);
    try {
    await api.put(`/bookings/${selectedBooking._id}`,{
        status: 'cancelled',
        bookingStatus: 'rejected',
        paymentStatus: 'failed',
        notes: `${selectedBooking.notes || ''}\nRejection Reason: ${rejectReason}`
      }, { $autoCancel: false });
      
      toast.success("Booking rejected");
      setIsRejectDialogOpen(false);
      setIsModalOpen(false);
      setRejectReason('');
      setSelectedBooking(null);
    } catch (err) {
      toast.error("Failed to reject booking");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const openRejectDialog = (booking) => {
    setSelectedBooking(booking);
    setIsRejectDialogOpen(true);
  };

  const viewImage = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsImageModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'badge-confirmed';
      case 'pending_verification': return 'badge-pending';
      case 'rejected': 
      case 'cancelled': return 'badge-cancelled';
      case 'completed': return 'badge-completed';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatStatus = (status) => {
    if (status === 'pending_verification') return 'Pending Verification';
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in-up">
      <Helmet><title>Bookings Management | Admin</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Booking Management</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Review and manage guest reservations and payments.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            className="h-12 px-4 bg-muted/50 border border-border rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, guest, or property..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 bg-muted/50 rounded-xl border-border h-12 font-medium"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-5 font-extrabold text-xs uppercase tracking-wider">Booking Info</th>
                <th className="px-6 py-5 font-extrabold text-xs uppercase tracking-wider">Dates</th>
                <th className="px-6 py-5 font-extrabold text-xs uppercase tracking-wider">Amount Paid</th>
                <th className="px-6 py-5 font-extrabold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 font-extrabold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({length: 5}).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-6"><Skeleton className="h-10 w-48" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-10 w-32" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-8 w-24 rounded-full" /></td>
                    <td className="px-6 py-6"><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-4" />
                    <p className="text-lg font-bold text-foreground">No bookings found</p>
                    <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground truncate max-w-[250px] mb-1">{booking.propertyName}</div>
                      <div className="text-muted-foreground text-xs font-medium mb-1">{booking.guestFullName}</div>
                      <div className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground w-fit">
                        ID: {booking._id.slice(0,8)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-foreground text-sm">{formatDate(booking.checkInDate)}</div>
                      <div className="text-muted-foreground text-xs mt-1">to {formatDate(booking.checkOutDate)}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-extrabold text-foreground text-base">{formatCurrencyINR(booking.totalAmount || booking.totalPrice)}</div>
                      <div className="font-mono text-xs text-muted-foreground mt-1 uppercase">{booking.paymentMethod || 'Stripe'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className={`${getStatusColor(booking.bookingStatus)} font-bold text-[10px]`}>
                        {formatStatus(booking.bookingStatus)}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {booking.bookingStatus === 'pending_verification' && (
                          <Button size="sm" onClick={() => handleApprove(booking)} className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm font-bold transition-all hover:-translate-y-0.5">
                            Verify
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => openDetails(booking)} className="h-9 rounded-xl border-border hover:bg-primary/10 hover:text-primary hover:border-primary/50 font-bold transition-all">
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-xl font-extrabold">Booking Details</DialogTitle>
            <DialogDescription className="font-medium">Review payment and guest information</DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-5 bg-primary/5 rounded-2xl border border-primary/20">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">Status</p>
                  <Badge variant="outline" className={`${getStatusColor(selectedBooking.bookingStatus)} font-bold`}>
                    {formatStatus(selectedBooking.bookingStatus)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Paid</p>
                  <p className="font-extrabold text-2xl text-primary">{formatCurrencyINR(selectedBooking.totalAmount || selectedBooking.totalPrice)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3">Guest Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col"><span className="text-muted-foreground text-xs font-bold uppercase mb-1">Name</span><span className="font-semibold text-foreground">{selectedBooking.guestFullName}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground text-xs font-bold uppercase mb-1">Phone</span><span className="font-semibold text-foreground">{selectedBooking.guestMobileNumber}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground text-xs font-bold uppercase mb-1">Email</span><span className="font-semibold text-foreground">{selectedBooking.guestEmail}</span></div>
                  </div>
                </div>
                <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                  <h3 className="font-extrabold text-sm text-foreground uppercase tracking-wider mb-4 border-b border-border pb-3">Payment Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col"><span className="text-muted-foreground text-xs font-bold uppercase mb-1">Method</span><span className="font-semibold text-foreground uppercase">{selectedBooking.paymentMethod || 'UPI'}</span></div>
                    <div className="flex flex-col"><span className="text-muted-foreground text-xs font-bold uppercase mb-1">Reference ID</span><span className="font-mono bg-background border border-border px-2 py-1 rounded inline-block w-fit font-bold">{selectedBooking.transactionId || 'N/A'}</span></div>
                    {selectedBooking.paymentScreenshot && (
                      <div className="flex flex-col mt-2">
                         <Button variant="outline" size="sm" onClick={(e) => viewImage(selectedBooking, e)} className="w-fit rounded-xl font-bold">
                           <ExternalLink className="w-4 h-4 mr-2" /> View Screenshot
                         </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedBooking.bookingStatus === 'pending_verification' && (
                <div className="pt-6 border-t border-border flex gap-3">
                  <Button onClick={() => handleApprove(selectedBooking)} disabled={actionLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 text-base font-bold shadow-md hover:-translate-y-0.5 transition-all">
                    {actionLoading ? 'Processing...' : 'Verify & Approve Payment'}
                  </Button>
                  <Button variant="outline" onClick={() => openRejectDialog(selectedBooking)} disabled={actionLoading} className="flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl h-14 text-base font-bold transition-all">
                    Reject Payment
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-extrabold text-destructive">Reject Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground font-medium">Please provide a reason for rejecting this verification. The guest will receive an email with this reason.</p>
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-border bg-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-destructive/50 text-sm font-medium"
              placeholder="e.g., UTR number does not match our bank records..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={handleRejectSubmit} disabled={!rejectReason.trim() || actionLoading} className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-bold shadow-sm">
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image View Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-transparent border-none shadow-none p-0">
          {selectedBooking?.paymentScreenshot && (
             <div className="relative rounded-2xl overflow-hidden bg-black/80 backdrop-blur-md p-4">
                <img 
                 src={selectedBooking.paymentScreenshot}
                  alt="Payment Screenshot" 
                  className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                />
             </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookingManagement;