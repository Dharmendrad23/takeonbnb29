import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { User, Lock, Bell, Shield, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { updateUser } from '@/lib/dataApi.js';

const GuestSettingsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(currentUser.id, formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestDashboardLayout>
      <Helmet><title>Account Settings | TakeOn BnB</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl w-full sm:w-auto flex flex-wrap h-auto mb-8 shadow-sm">
          <TabsTrigger value="profile" className="rounded-lg flex-1 sm:flex-none font-semibold"><User className="w-4 h-4 mr-2"/> Profile</TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg flex-1 sm:flex-none font-semibold"><Lock className="w-4 h-4 mr-2"/> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg flex-1 sm:flex-none font-semibold"><Bell className="w-4 h-4 mr-2"/> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 outline-none">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Full Name</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="h-12 bg-muted/50 border-border rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email Address</label>
                <Input 
                  value={currentUser?.email || ''} 
                  disabled 
                  className="h-12 bg-muted/50 border-border rounded-xl opacity-70 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground font-medium">Email cannot be changed directly.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Phone Number</label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="h-12 bg-muted/50 border-border rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className="w-full h-32 p-4 bg-muted/50 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="Tell hosts a little about yourself..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand mt-4">
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Save Changes
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-0 outline-none">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center"><Shield className="w-5 h-5 mr-2 text-primary"/> Password & Security</h2>
            <p className="text-muted-foreground mb-6">Update your password to keep your account secure.</p>
            <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-border hover:bg-muted">
              Change Password
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 outline-none">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div>
                  <p className="font-bold text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div>
                  <p className="font-bold text-foreground">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
                </div>
                <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer border border-border">
                  <div className="w-4 h-4 bg-muted-foreground rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </GuestDashboardLayout>
  );
};

export default GuestSettingsPage;