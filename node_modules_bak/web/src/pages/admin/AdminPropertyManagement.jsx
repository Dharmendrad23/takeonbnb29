import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, Edit, Trash2, MapPin, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import pb from '@/lib/pocketbaseClient.js';
import { formatCurrency } from '@/lib/bookingUtils.js';
import { toast } from 'sonner';

const AdminPropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', propertyType: 'Villas',
    pricePerNight: '', bedrooms: '', bathrooms: '', guestCapacity: '', status: 'Live'
  });

  const fetchProperties = async () => {
    try {
      const filter = search ? `title ~ "${search}" || location ~ "${search}"` : '';
      const records = await pb.collection('properties').getFullList({
        filter, sort: '-created', $autoCancel: false
      });
      setProperties(records);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    pb.collection('properties').subscribe('*', fetchProperties);
    return () => pb.collection('properties').unsubscribe('*');
  }, [search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '', description: '', location: '', propertyType: 'Villas',
      pricePerNight: '', bedrooms: '', bathrooms: '', guestCapacity: '', status: 'Live'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setEditingId(property.id);
    setFormData({
      title: property.title, description: property.description, location: property.location,
      propertyType: property.propertyType, pricePerNight: property.pricePerNight,
      bedrooms: property.bedrooms, bathrooms: property.bathrooms, guestCapacity: property.guestCapacity,
      status: property.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guestCapacity: Number(formData.guestCapacity),
        hostId: pb.authStore.model?.id || 'admin' // Fallback if needed
      };

      if (editingId) {
        await pb.collection('properties').update(editingId, data, { $autoCancel: false });
        toast.success("Property updated successfully");
      } else {
        await pb.collection('properties').create(data, { $autoCancel: false });
        toast.success("Property created successfully");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await pb.collection('properties').delete(id, { $autoCancel: false });
      toast.success("Property deleted");
    } catch (err) {
      toast.error("Failed to delete property");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Helmet><title>Properties | Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Property Management</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateModal} className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Property' : 'Create New Property'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input name="location" value={formData.location} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={formData.propertyType} onValueChange={(v) => handleSelectChange('propertyType', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villas">Villas</SelectItem>
                        <SelectItem value="Hotels">Hotels</SelectItem>
                        <SelectItem value="Apartments">Apartments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price per Night (INR)</Label>
                    <Input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} required min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} required min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} required min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Guest Capacity</Label>
                    <Input type="number" name="guestCapacity" value={formData.guestCapacity} onChange={handleInputChange} required min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground text-sm"
                    required 
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingId ? 'Save Changes' : 'Create Property'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Type</th>
              <th>Price/Night</th>
              <th>Capacity</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="7" className="text-center py-8">Loading...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-muted-foreground">No properties found.</td></tr>
            ) : (
              properties.map(property => (
                <tr key={property.id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {property.photos?.length > 0 ? (
                          <img src={pb.files.getUrl(property, property.photos[0])} alt="" className="w-full h-full object-cover" />
                        ) : <Home className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <span className="truncate max-w-[200px]">{property.title}</span>
                    </div>
                  </td>
                  <td><div className="flex items-center text-muted-foreground"><MapPin className="w-3.5 h-3.5 mr-1"/> {property.location}</div></td>
                  <td>{property.propertyType}</td>
                  <td className="font-semibold">{formatCurrency(property.pricePerNight)}</td>
                  <td className="text-muted-foreground">{property.bedrooms}B • {property.bathrooms}B • {property.guestCapacity}G</td>
                  <td>
                    <Badge variant="outline" className={
                      property.status === 'Live' ? 'bg-success/10 text-success border-success/20' : 
                      property.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' : ''
                    }>
                      {property.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(property)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(property.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPropertyManagement;