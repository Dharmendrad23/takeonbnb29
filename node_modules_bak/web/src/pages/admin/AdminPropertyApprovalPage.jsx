import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Check, X, Search, FileText, MapPin, Users, Bath, Bed } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/bookingUtils.js';

const AdminPropertyApprovalPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Rejection State
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPendingProperties = async () => {
    setIsLoading(true);
    try {
      const filterStr = search 
        ? `status="Submitted" && (title ~ "${search}" || location ~ "${search}")`
        : `status="Submitted"`;

      const records = await pb.collection('properties').getList(1, 50, {
        filter: filterStr,
        expand: 'hostId',
        sort: '-created',
        $autoCancel: false
      });
      setProperties(records.items);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProperties();
  }, [search]);

  const handleApprove = async (id) => {
    try {
      await pb.collection('properties').update(id, {
        status: 'Approved',
        approvalStatus: 'approved'
      }, { $autoCancel: false });
      toast.success("Property Approved successfully");
      fetchPendingProperties();
    } catch (error) {
      toast.error("Approval failed");
      console.error(error);
    }
  };

  const openRejectionModal = (property) => {
    setSelectedProperty(property);
    setRejectionReason('');
    setRejectionModalOpen(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      await pb.collection('properties').update(selectedProperty.id, {
        status: 'Draft', // Return to draft so host can fix
        approvalStatus: 'rejected',
        rejectionReason: rejectionReason
      }, { $autoCancel: false });
      
      toast.success("Property Rejected");
      setRejectionModalOpen(false);
      fetchPendingProperties();
    } catch (error) {
      toast.error("Rejection failed");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <Helmet><title>Pending Approvals | Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Property Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve new luxury listings.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search pending..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border h-11 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading pending properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border border-dashed rounded-3xl shadow-sm">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">All Caught Up!</h3>
          <p className="text-muted-foreground">No properties currently pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map(property => (
            <Card key={property.id} className="bg-card border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-72 h-48 md:h-auto bg-muted shrink-0 relative">
                  {property.photos?.length > 0 ? (
                    <img 
                      src={pb.files.getUrl(property, property.photos[0])} 
                      alt={property.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 bg-warning text-warning-foreground text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    Awaiting Review
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1 shrink-0 text-primary/70" /> {property.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-primary">{formatCurrency(property.pricePerNight)}</div>
                      <div className="text-xs text-muted-foreground">per night</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium text-foreground/80 mb-4 bg-muted/50 p-2.5 rounded-xl border border-border w-fit">
                    <span className="flex items-center"><Bed className="w-4 h-4 mr-1.5 text-muted-foreground" /> {property.bedrooms}</span>
                    <span className="flex items-center"><Bath className="w-4 h-4 mr-1.5 text-muted-foreground" /> {property.bathrooms}</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-muted-foreground" /> {property.guestCapacity}</span>
                    <span className="capitalize">{property.propertyType}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Host: </span>
                      <span className="font-bold text-foreground">{property.expand?.hostId?.name || property.expand?.hostId?.email || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-6 rounded-xl" onClick={() => openRejectionModal(property)}>
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button className="bg-success hover:bg-success/90 text-success-foreground h-10 px-6 rounded-xl shadow-sm" onClick={() => handleApprove(property.id)}>
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Dialog open={rejectionModalOpen} onOpenChange={setRejectionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Reject Listing</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting "{selectedProperty?.title}". The host will see this message and can correct the issues before resubmitting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <Textarea 
              placeholder="E.g., Please upload higher resolution photos, description lacks detail..."
              className="min-h-[120px] resize-none"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPropertyApprovalPage;