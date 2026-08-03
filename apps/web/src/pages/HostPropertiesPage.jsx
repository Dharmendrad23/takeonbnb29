import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { usePropertySync } from '@/hooks/usePropertySync.js';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';
import { Button } from '@/components/ui/button';
import { Plus, Home, FileText, Clock, CheckCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';

const HostPropertiesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, draft: 0, pending: 0, approved: 0, live: 0 });

  const fetchProperties = useCallback(async () => {
    try {
      const records = await pb.collection('properties').getFullList({
        filter: `hostId="${currentUser.id}"`,
        sort: '-updated',
        $autoCancel: false
      });
      setProperties(records);
      
      const newStats = { total: records.length, draft: 0, pending: 0, approved: 0, live: 0 };
      records.forEach(p => {
        const status = (p.status || p.approvalStatus || '').toString().toLowerCase();
        if (status === 'draft') newStats.draft++;
        else if (status === 'submitted' || status === 'pending') newStats.pending++;
        else if (status === 'approved') newStats.approved++;
        else if (status === 'live') newStats.live++;
      });
      setStats(newStats);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  usePropertySync(() => {
    fetchProperties();
  });

  const handleAction = async (action, property) => {
    try {
      if (action === 'edit') {
        navigate(`/host/edit-property/${property.id}`);
      } else if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this property?')) {
          await pb.collection('properties').delete(property.id, { $autoCancel: false });
          toast.success('Property deleted');
        }
      } else if (action === 'submit') {
        await pb.collection('properties').update(property.id, { status: 'Submitted' }, { $autoCancel: false });
        toast.success('Property submitted for review');
      } else if (action === 'publish') {
        await pb.collection('properties').update(property.id, { status: 'Live' }, { $autoCancel: false });
        toast.success('Property is now live!');
      } else if (action === 'unpublish') {
        await pb.collection('properties').update(property.id, { status: 'Draft' }, { $autoCancel: false });
        toast.success('Property unpublished and moved to drafts');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} property`);
    }
  };

  return (
    <HostDashboardLayout>
      <Helmet><title>My Properties | Take On BnB</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your listings and track their status.</p>
        </div>
        <Button onClick={() => navigate('/host/add-property')} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Create Listing
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><Home className="w-4 h-4"/> Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2"><FileText className="w-4 h-4"/> Drafts</div>
          <div className="text-2xl font-bold">{stats.draft}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-2"><Clock className="w-4 h-4"/> Pending</div>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2"><CheckCircle className="w-4 h-4"/> Approved</div>
          <div className="text-2xl font-bold">{stats.approved}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-2"><Globe className="w-4 h-4"/> Live</div>
          <div className="text-2xl font-bold">{stats.live}</div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse"></div>)}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border shadow-sm">
          <Home className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No properties yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Start your hosting journey by creating your first property listing. It only takes a few minutes.</p>
          <Button onClick={() => navigate('/host/add-property')} size="lg">Create Your First Listing</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((p, idx) => {
            const normalizedProperty = {
              ...p,
              status: p.status || p.approvalStatus || 'Draft',
            };
            return (
              <PropertyCard 
                key={p.id} 
                property={normalizedProperty} 
                index={idx}
                isHostView={true} 
                onAction={handleAction}
              />
            );
          })}
        </div>
      )}
    </HostDashboardLayout>
  );
};

export default HostPropertiesPage;