import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const HostSettingsPage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pb.collection('users').update(currentUser.id, { name, bio }, { $autoCancel: false });
      toast.success('Host profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostDashboardLayout>
      <Helmet><title>Host Settings | Take On BnB</title></Helmet>
      <h1 className="text-2xl font-bold text-foreground mb-6">Host Settings</h1>
      
      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Host Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Host Email</label>
            <Input 
              value={currentUser?.email} 
              disabled 
              className="bg-muted text-muted-foreground" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Host Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full flex min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Tell guests about yourself and your hospitality experience"
            />
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </HostDashboardLayout>
  );
};

export default HostSettingsPage;