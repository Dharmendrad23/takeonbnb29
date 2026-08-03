import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { validatePropertyForm } from '@/lib/validatePropertyForm.js';
import { Loader2, Save } from 'lucide-react';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); 
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    propertyType: 'Apartments',
    pricePerNight: '',
    bedrooms: '1',
    bathrooms: '1',
    guestCapacity: '1',
    houseRules: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    status: 'Draft',
    newPhotos: []
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data } = await api.get(`/properties/${id}`);
      const propertyData = data.property || data;

      const hostId = propertyData.hostId?._id || propertyData.hostId || '';
      const userId = currentUser._id || currentUser.id;
      if (hostId && hostId.toString() !== userId.toString()) {
        toast.error('You can only edit your own properties');
        navigate('/host/dashboard');
        return;
      }

      setFormData({
        title: propertyData.title || '',
        description: propertyData.description || '',
        location: propertyData.location || '',
        propertyType: propertyData.propertyType || 'Apartments',
        pricePerNight: propertyData.pricePerNight?.toString() || '',
        bedrooms: propertyData.bedrooms?.toString() || '1',
        bathrooms: propertyData.bathrooms?.toString() || '1',
        guestCapacity: (propertyData.guests || propertyData.guestCapacity)?.toString() || '1',
        houseRules: propertyData.houseRules || '',
        checkInTime: propertyData.checkInTime || '14:00',
        checkOutTime: propertyData.checkOutTime || '11:00',
        status: propertyData.approvalStatus || 'pending',
        newPhotos: []
      });
    } catch (error) {
      console.error('Failed to load property:', error);
      toast.error('Failed to load property');
      navigate('/host/dashboard');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoading || formData.status === 'Submitted' || formData.status === 'Pending') return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const dataToSave = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          propertyType: formData.propertyType,
          pricePerNight: Number(formData.pricePerNight) || 0,
          bedrooms: Number(formData.bedrooms) || 1,
          bathrooms: Number(formData.bathrooms) || 1,
          guestCapacity: Number(formData.guestCapacity) || 1,
          houseRules: formData.houseRules,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
        };
        await api.put(`/properties/${id}`, dataToSave);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (err) {
        console.error('Auto-save failed', err);
        setSaveStatus('');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, id, initialLoading]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, newPhotos: files }));
  };

  const handleSubmit = async (e, submitForReview = false) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validatePropertyForm(formData);
    
    if (!isValid && submitForReview) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      const form = document.getElementById('edit-property-form');
      if (form) {
        form.classList.remove('animate-shake');
        void form.offsetWidth;
        form.classList.add('animate-shake');
      }
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('propertyType', formData.propertyType);
      data.append('pricePerNight', parseFloat(formData.pricePerNight) || 0);
      data.append('bedrooms', parseInt(formData.bedrooms) || 1);
      data.append('bathrooms', parseInt(formData.bathrooms) || 1);
      data.append('guestCapacity', parseInt(formData.guestCapacity) || 1);
      data.append('houseRules', formData.houseRules);
      data.append('checkInTime', formData.checkInTime);
      data.append('checkOutTime', formData.checkOutTime);
      
      if (formData.newPhotos && formData.newPhotos.length > 0) {
        formData.newPhotos.forEach(photo => {
          data.append('photos', photo);
        });
      }

      if (submitForReview) {
        data.append('status', 'Submitted');
      }

      await pb.collection('properties').update(id, data, { $autoCancel: false });
      toast.success(submitForReview ? 'Property submitted for review!' : 'Property details updated successfully');
      navigate('/host/properties');
    } catch (error) {
      console.error('Failed to update property:', error);
      toast.error('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLocked = formData.status === 'Submitted' || formData.status === 'Pending';

  return (
    <>
      <Helmet><title>Edit Property | Take On BnB</title></Helmet>
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Edit Property</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-muted-foreground">Status: {formData.status}</span>
                {saveStatus === 'saving' && <span className="text-sm text-muted-foreground flex items-center gap-1 animate-fade-in"><Loader2 className="w-3 h-3 animate-spin"/> Saving...</span>}
                {saveStatus === 'saved' && <span className="text-sm text-emerald-600 flex items-center gap-1 animate-fade-in"><Save className="w-3 h-3"/> Draft saved</span>}
              </div>
            </div>
          </motion.div>

          {isLocked && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mb-8 text-amber-800 dark:text-amber-400"
            >
              This property is currently under review. Editing is locked until a decision is made.
            </motion.div>
          )}

          <form id="edit-property-form" className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      disabled={isLocked}
                      className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.title ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                    />
                    {errors.title && <p className="text-xs text-destructive mt-1 animate-slide-down">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      disabled={isLocked}
                      className={`transition-all duration-200 focus:ring-2 ${errors.description ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1 animate-slide-down">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Location</label>
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={isLocked}
                        className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.location ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                      />
                      {errors.location && <p className="text-xs text-destructive mt-1 animate-slide-down">{errors.location}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Property Type</label>
                      <Select value={formData.propertyType} onValueChange={(v) => handleInputChange('propertyType', v)} disabled={isLocked}>
                        <SelectTrigger className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.propertyType ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}><SelectValue /></SelectTrigger>
                        <SelectContent className="animate-scale-in origin-top">
                          <SelectItem value="Villas">Villas</SelectItem>
                          <SelectItem value="Hotels">Hotels</SelectItem>
                          <SelectItem value="Apartments">Apartments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader><CardTitle>Capacity & Pricing</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Price per Night in INR (₹)</label>
                    <Input type="number" value={formData.pricePerNight} onChange={(e) => handleInputChange('pricePerNight', e.target.value)} disabled={isLocked} className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.pricePerNight ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`} />
                    {errors.pricePerNight && <p className="text-xs text-destructive mt-1 animate-slide-down">{errors.pricePerNight}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Guests</label>
                    <Input type="number" value={formData.guestCapacity} onChange={(e) => handleInputChange('guestCapacity', e.target.value)} disabled={isLocked} className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.guestCapacity ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                    <Input type="number" value={formData.bedrooms} onChange={(e) => handleInputChange('bedrooms', e.target.value)} disabled={isLocked} className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.bedrooms ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Bathrooms</label>
                    <Input type="number" value={formData.bathrooms} onChange={(e) => handleInputChange('bathrooms', e.target.value)} disabled={isLocked} className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.bathrooms ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader><CardTitle>Rules & Times</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Check-in Time</label>
                      <Input type="time" value={formData.checkInTime} onChange={(e) => handleInputChange('checkInTime', e.target.value)} disabled={isLocked} className="min-h-[48px] transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Check-out Time</label>
                      <Input type="time" value={formData.checkOutTime} onChange={(e) => handleInputChange('checkOutTime', e.target.value)} disabled={isLocked} className="min-h-[48px] transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">House Rules</label>
                    <Textarea value={formData.houseRules} onChange={(e) => handleInputChange('houseRules', e.target.value)} rows={3} disabled={isLocked} placeholder="E.g. No smoking, no pets..." className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader><CardTitle>Add New Photos</CardTitle></CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Additional Photos</label>
                    <Input
                      type="file"
                      accept="image/jpeg, image/png, image/gif, image/webp"
                      multiple
                      onChange={handlePhotoChange}
                      disabled={isLocked}
                      className="min-h-[48px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    {formData.newPhotos.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2 animate-slide-down">
                        {formData.newPhotos.length} new photos selected to append.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {!isLocked && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button type="button" variant="outline" size="lg" onClick={() => navigate('/host/properties')} disabled={loading} className="min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Cancel
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={(e) => handleSubmit(e, false)} disabled={loading} className="flex-1 min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  Save Details
                </Button>
                <Button type="button" size="lg" onClick={(e) => handleSubmit(e, true)} disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-white min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Submit for Review
                </Button>
              </motion.div>
            )}
          </form>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EditPropertyPage;