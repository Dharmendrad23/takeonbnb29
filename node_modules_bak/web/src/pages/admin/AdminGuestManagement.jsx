import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, User, Mail, Phone, ShieldAlert, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminGuestManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const filter = search ? `name ~ "${search}" || email ~ "${search}"` : '';
      const records = await pb.collection('users').getFullList({
        filter, sort: '-created', $autoCancel: false
      });
      setUsers(records);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    pb.collection('users').subscribe('*', fetchUsers);
    return () => pb.collection('users').unsubscribe('*');
  }, [search]);

  const handleToggleStatus = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this user?`)) return;
    try {
      await pb.collection('users').update(id, { verified: !currentStatus }, { $autoCancel: false });
      toast.success(`User account ${!currentStatus ? 'activated' : 'suspended'}`);
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet><title>Users | Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Joined</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-muted-foreground">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user.name || 'Unnamed User'}</p>
                        <p className="text-xs text-muted-foreground font-mono">{user.id.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground"/> {user.email}</div>
                    </div>
                  </td>
                  <td><Badge variant="secondary" className="capitalize">{user.userType || 'guest'}</Badge></td>
                  <td className="text-sm text-muted-foreground">{new Date(user.created).toLocaleDateString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={user.verified} 
                        onCheckedChange={() => handleToggleStatus(user.id, user.verified)} 
                      />
                      <span className={`text-xs font-medium ${user.verified ? 'text-success' : 'text-destructive'}`}>
                        {user.verified ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openDetails(user)}>View Profile</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedUser.name || 'Unnamed User'}</h3>
                  <Badge variant="secondary" className="capitalize mt-1">{selectedUser.userType || 'guest'}</Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4"/> Email</span>
                  <span className="font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Joined</span>
                  <span className="font-medium">{new Date(selectedUser.created).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Account Status</span>
                  <Badge variant="outline" className={selectedUser.verified ? 'text-success border-success' : 'text-destructive border-destructive'}>
                    {selectedUser.verified ? 'Active' : 'Suspended'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGuestManagement;