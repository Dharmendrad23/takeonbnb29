import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createProperty } from '@/lib/dataApi.js';

const HostAddPropertyPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'apartment',
    pricePerNight: '',
    propertyCategory: 'All',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...formData,
        hostId: currentUser.id || currentUser._id,
        pricePerNight: Number(formData.pricePerNight),
        approvalStatus: 'pending' // Usually requires admin approval
      };
      
      await createProperty(data);
      toast.success('Property submitted for review!');
      navigate('/host/properties');
    } catch (err) {
      toast.error('Failed to create property. Check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostDashboardLayout>
      <Helmet><title>Add Property | Take On BnB</title></Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Add New Property</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Property Title</label>
              <Input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Cozy Downtown Loft"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe what makes your place unique..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Location (City, Country)</label>
                <Input 
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Paris, France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Price per Night ($)</label>
                <Input 
                  required
                  type="number"
                  min="1"
                  value={formData.pricePerNight}
                  onChange={e => setFormData({...formData, pricePerNight: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1.5">Property Type</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.propertyType}
                  onChange={e => setFormData({...formData, propertyType: e.target.value})}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="room">Private Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.propertyCategory}
                  onChange={e => setFormData({...formData, propertyCategory: e.target.value})}
                >
                  <option value="All">General</option>
                  <option value="Villa">Villa</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Budget">Budget</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Property'}
            </Button>
          </div>
        </form>
      </div>
    </HostDashboardLayout>
  );
};

export default HostAddPropertyPage;