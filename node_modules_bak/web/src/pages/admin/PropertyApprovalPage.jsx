import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, User, Mail, Phone, Calendar, CheckCircle2, XCircle, Home } from 'lucide-react';
import { toast } from 'sonner';

const PropertyApprovalPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      const records = await pb.collection('properties').getFullList({
        filter: `approvalStatus = 'pending'`,
        expand: 'hostId',
        sort: '-created',
        $autoCancel: false
      });
      setProperties(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await pb.collection('properties').update(selectedProperty.id, {
        approvalStatus: status,
        rejectionReason: status === 'rejected' ? rejectionReason : ''
      }, { $autoCancel: false });

      // Notify host
      await pb.collection('notifications').create({
        userId: selectedProperty.hostId,
        type: 'email',
        message: `Your property "${selectedProperty.title}" has been ${status}. ${status === 'rejected' ? 'Reason: ' + rejectionReason : ''}`,
        isRead: false
      }, { $autoCancel: false });

      toast.success(`Property successfully ${status}`);
      setIsModalOpen(false);
      fetchPendingProperties();
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setProcessing(false);
      setRejectionReason('');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <Helmet><title>Property Approvals | Admin</title></Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Property Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve new property listings.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">All Caught Up!</h3>
          <p className="text-muted-foreground">No pending properties to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow border-border" onClick={() => { setSelectedProperty(p); setIsModalOpen(true); }}>
              <div className="aspect-video bg-muted relative rounded-t-xl overflow-hidden">
                {p.photos?.length > 0 ? (
                  <img src={pb.files.getUrl(p, p.photos[0])} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><Home className="w-10 h-10 text-muted-foreground/30" /></div>
                )}
                <Badge className="absolute top-3 right-3 bg-warning text-warning-foreground border-none">Pending</Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{p.location}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><User className="w-3.5 h-3.5" /> {p.expand?.hostId?.name || 'Unknown'}</span>
                  <span className="text-muted-foreground font-medium">{new Date(p.created).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedProperty && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
            <DialogHeader>
              <DialogTitle className="text-2xl">Review Property</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Images */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x h-48">
                {selectedProperty.photos?.map((photo, i) => (
                  <img key={i} src={pb.files.getUrl(selectedProperty, photo)} className="h-full w-auto object-cover rounded-lg snap-start" alt={`Property ${i}`} />
                ))}
              </div>

              {/* Details */}
              <div>
                <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
                <p className="flex items-center gap-1 text-muted-foreground mt-1"><MapPin className="w-4 h-4" /> {selectedProperty.location}</p>
                <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm leading-relaxed">{selectedProperty.description}</p>
                </div>
              </div>

              {/* Host Info */}
              <div className="border border-border p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Host Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> {selectedProperty.expand?.hostId?.name}</p>
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground"/> {selectedProperty.expand?.hostId?.email}</p>
                  <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground"/> Contact info</p>
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/> Member since {new Date(selectedProperty.expand?.hostId?.created).getFullYear()}</p>
                </div>
              </div>

              {/* Rejection input */}
              <div className="space-y-2">
                <h3 className="font-semibold text-destructive">Rejection Reason (if applicable)</h3>
                <Textarea 
                  placeholder="Explain why this property cannot be approved..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-3 sm:justify-between border-t border-border pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={() => handleAction('rejected')} disabled={processing || !rejectionReason.trim()} className="bg-destructive hover:bg-destructive/90">
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button onClick={() => handleAction('approved')} disabled={processing} className="bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PropertyApprovalPage;