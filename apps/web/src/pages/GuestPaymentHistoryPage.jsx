import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { formatCurrencyINR, formatDate } from '@/lib/bookingUtils.js';
import { IndianRupee, Download, FileText, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { listBookings, listProperties } from '@/lib/dataApi.js';
import { getEntityId } from '@/lib/propertyMappers.js';

const GuestPaymentHistoryPage = () => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const [records, properties] = await Promise.all([
          listBookings({ guestId: currentUser.id }),
          listProperties(),
        ]);
        const propertyMap = new Map(properties.map((property) => [getEntityId(property), property]));
        const filteredRecords = records
          .filter((booking) => booking.status !== 'cancelled' && booking.bookingStatus !== 'rejected')
          .map((booking) => {
            const property = booking.property || propertyMap.get(String(booking.propertyId));
            return {
              ...booking,
              propertyName: booking.propertyName || property?.title || 'Property',
            };
          });
        
        setPayments(filteredRecords);
        const total = filteredRecords.reduce((sum, r) => sum + (r.totalAmount || r.totalPrice || 0), 0);
        setTotalSpent(total);
      } catch (e) {
        console.error("Error fetching payments:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [currentUser]);

  const handleDownloadReceipt = async (bookingId) => {
    try {
      const response = await apiServerClient.fetch(`/invoices/${bookingId}`);
      if (!response.ok) throw new Error('Failed to generate receipt');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Could not download receipt. Please try again later.');
    }
  };

  const filteredPayments = payments.filter(p => 
    (p.propertyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.transactionId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GuestDashboardLayout>
      <Helmet><title>Payment History | TakeOn BnB</title></Helmet>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Payment History</h1>
          <p className="text-muted-foreground text-lg">Track your spending and download invoices.</p>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary mb-0.5">Total Spent</p>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">
              {loading ? <Skeleton className="h-8 w-24" /> : formatCurrencyINR(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by property or transaction ID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-12 bg-card rounded-xl border-border"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Property</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Amount</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Method & ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-12"><Skeleton className="h-10 w-full" /></td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-muted-foreground">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="font-medium">No payment records found.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{formatDate(payment.created)}</td>
                    <td className="px-6 py-4 font-bold text-foreground max-w-[200px] truncate">{payment.propertyName}</td>
                    <td className="px-6 py-4 font-extrabold text-foreground">{formatCurrencyINR(payment.totalAmount || payment.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold uppercase text-xs text-muted-foreground">{payment.paymentMethod || 'UPI'}</span>
                        <span className="font-mono text-xs">{payment.transactionId || payment.id.slice(0,8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={payment.paymentStatus === 'verified' ? 'badge-confirmed' : 'badge-pending'}>
                        {(payment.paymentStatus || 'Verified').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        onClick={() => handleDownloadReceipt(payment.id)}
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg h-8 font-semibold border-border hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Receipt
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GuestDashboardLayout>
  );
};

export default GuestPaymentHistoryPage;