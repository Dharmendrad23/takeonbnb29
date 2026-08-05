import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [amenities, setAmenities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  
  const initialFormState = {
    title: '',
    description: '',
    location: '',
    propertyType: 'Apartments',
    pricePerNight: '',
    bedrooms: '1',
    bathrooms: '1',
    guestCapacity: '1',
    selectedAmenities: [],
    photos: []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAmenities();
  }, []);

  const loadAmenities = async () => {
    try {
      const records = await pb.collection('amenities').getFullList({
        sort: 'name',
        $autoCancel: false
      });
      setAmenities(records);
    } catch (error) {
      console.error('Failed to load amenities:', error);
    }
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'title':
        if (!value.trim()) error = 'Title is required';
        break;
      case 'description':
        if (!value.trim()) error = 'Description is required';
        break;
      case 'location':
        if (!value.trim()) error = 'Location is required';
        break;
      case 'pricePerNight':
        if (!value || isNaN(value) || Number(value) <= 0) error = 'Valid price in INR is required';
        break;
      case 'bedrooms':
      case 'bathrooms':
      case 'guestCapacity':
        if (!value || isNaN(value) || Number(value) <= 0) error = 'Must be at least 1';
        break;
      case 'propertyType':
        if (!value) error = 'Property type is required';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleBlur = (field) => {
    validateField(field, formData[field]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  const handleAmenityToggle = (amenityId) => {
    const newAmenities = formData.selectedAmenities.includes(amenityId)
      ? formData.selectedAmenities.filter(id => id !== amenityId)
      : [...formData.selectedAmenities, amenityId];
      
    setFormData(prev => ({ ...prev, selectedAmenities: newAmenities }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 10) {
      toast.error('File upload failed: Maximum 10 photos allowed');
      return;
    }

    const MAX_SIZE = 20 * 1024 * 1024; // 20MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    const validFiles = files.filter(file => {
      if (file.size > MAX_SIZE) {
        toast.error(`File upload failed: ${file.name} exceeds 20MB limit`);
        return false;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File upload failed: ${file.name} is not a valid image format`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({ ...prev, photos: validFiles }));
    if (validFiles.length > 0 && errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }));
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear the entire form?')) {
      setFormData(initialFormState);
      setErrors({});
      setShowRetry(false);
      const fileInput = document.getElementById('photos-input');
      if (fileInput) fileInput.value = '';
    }
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser || !pb.authStore.isValid) {
      toast.error('Authentication failed. Please log in again.');
      return;
    }

    if (currentUser.userType !== 'host') {
      toast.error('You must be registered as a host to create properties');
      return;
    }

    const fieldsToValidate = ['title', 'description', 'location', 'pricePerNight', 'propertyType', 'bedrooms', 'bathrooms', 'guestCapacity'];
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error('Please fill all required fields correctly');
      const form = document.getElementById('create-property-form');
      if (form) {
        form.classList.remove('animate-shake');
        void form.offsetWidth; 
        form.classList.add('animate-shake');
      }
      return;
    }

    if (!formData.photos || formData.photos.length === 0) {
      setErrors(prev => ({ ...prev, photos: 'At least one photo is required' }));
      toast.error('Please select at least one photo');
      return;
    }

    setShowConfirm(true);
  };

  const executeSubmission = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    setShowRetry(false);

    try {
      const data = new FormData();
      data.append('hostId', currentUser.id);
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('propertyType', formData.propertyType);
      data.append('pricePerNight', parseFloat(formData.pricePerNight));
      data.append('status', 'Draft');
      data.append('bedrooms', parseInt(formData.bedrooms));
      data.append('bathrooms', parseInt(formData.bathrooms));
      data.append('guestCapacity', parseInt(formData.guestCapacity));
      
      formData.selectedAmenities.forEach(id => {
        data.append('amenities', id);
      });

      formData.photos.forEach((photo) => {
        data.append('photos', photo);
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 30000)
      );
      
      const createPromise = pb.collection('properties').create(data, { $autoCancel: false });
      
      const record = await Promise.race([createPromise, timeoutPromise]);
      
      toast.success('Property created successfully!');
      
      setTimeout(() => {
        navigate('/host/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Submission Error full stack:', error);
      setShowRetry(true);
      
      if (error.message === 'TIMEOUT') {
        toast.error('Failed to create property: Request timed out after 30 seconds');
      } else if (error.response) {
        const pbErrors = error.response.data;
        if (pbErrors && Object.keys(pbErrors).length > 0) {
          const errorMessages = Object.entries(pbErrors)
            .map(([field, details]) => `${field}: ${details.message}`)
            .join(', ');
          toast.error(`Failed to create property: ${errorMessages}`);
        } else {
          toast.error(`Failed to create property: ${error.response.message || 'Validation failed'}`);
        }
      } else {
        toast.error(`Failed to create property: ${error.message || 'Network error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Property - Take on BNB</title>
        <meta name="description" content="List your property on Take on BNB" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        <Header />

        <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                List your property
              </h1>
              <p className="text-xl text-muted-foreground">Share your space with travelers</p>
            </div>
            <Button variant="outline" onClick={clearForm} disabled={isSubmitting} className="min-h-[48px] transition-all duration-200 hover:scale-105 active:scale-95">
              Clear Form
            </Button>
          </motion.div>

          <form id="create-property-form" onSubmit={handlePreSubmit} className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-[-1rem]">
                Step 1 of 3: Basic Info
              </div>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Title *</label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      onBlur={() => handleBlur('title')}
                      placeholder="Cozy beachfront villa with ocean views"
                      className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.title ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                      disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      onBlur={() => handleBlur('description')}
                      placeholder="Describe your property, its features, and what makes it special..."
                      rows={5}
                      className={`transition-all duration-200 focus:ring-2 ${errors.description ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                      disabled={isSubmitting}
                    />
                    {errors.description && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                      placeholder="Mumbai, India"
                      className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.location ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                      disabled={isSubmitting}
                    />
                    {errors.location && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.location}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Property Type *</label>
                      <Select 
                        value={formData.propertyType} 
                        onValueChange={(value) => handleInputChange('propertyType', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.propertyType ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="animate-scale-in origin-top">
                          <SelectItem value="Villas">Villas</SelectItem>
                          <SelectItem value="Hotels">Hotels</SelectItem>
                          <SelectItem value="Apartments">Apartments</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.propertyType && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.propertyType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Price per Night in INR (₹) *</label>
                      <Input
                        type="number"
                        value={formData.pricePerNight}
                        onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                        onBlur={() => handleBlur('pricePerNight')}
                        placeholder="5000"
                        min="1"
                        step="1"
                        className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.pricePerNight ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                        disabled={isSubmitting}
                      />
                      {errors.pricePerNight && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.pricePerNight}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bedrooms *</label>
                      <Input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        onBlur={() => handleBlur('bedrooms')}
                        min="1"
                        className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.bedrooms ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                        disabled={isSubmitting}
                      />
                      {errors.bedrooms && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.bedrooms}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bathrooms *</label>
                      <Input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        onBlur={() => handleBlur('bathrooms')}
                        min="1"
                        className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.bathrooms ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                        disabled={isSubmitting}
                      />
                      {errors.bathrooms && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.bathrooms}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Guest Capacity *</label>
                      <Input
                        type="number"
                        value={formData.guestCapacity}
                        onChange={(e) => handleInputChange('guestCapacity', e.target.value)}
                        onBlur={() => handleBlur('guestCapacity')}
                        min="1"
                        className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.guestCapacity ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                        disabled={isSubmitting}
                      />
                      {errors.guestCapacity && <p className="text-sm text-destructive mt-1 animate-slide-down">{errors.guestCapacity}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-[-1rem]">
                Step 2 of 3: Amenities
              </div>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                  <p className="text-sm text-muted-foreground">Select the amenities available at your property.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={amenity.id}
                          checked={formData.selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => handleAmenityToggle(amenity.id)}
                          disabled={isSubmitting}
                          className="w-5 h-5"
                        />
                        <label htmlFor={amenity.id} className="text-sm cursor-pointer select-none font-medium flex-1">
                          {amenity.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-[-1rem]">
                Step 3 of 3: Media
              </div>
              <Card className="border-border shadow-sm transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Photos *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Photos (Max 10, up to 20MB each)</label>
                    <Input
                      id="photos-input"
                      type="file"
                      accept="image/jpeg, image/png, image/gif, image/webp"
                      multiple
                      onChange={handlePhotoChange}
                      className={`min-h-[48px] transition-all duration-200 focus:ring-2 ${errors.photos ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                      disabled={isSubmitting}
                    />
                    {formData.photos.length > 0 && !errors.photos && (
                      <p className="text-sm text-muted-foreground mt-2 animate-slide-down">
                        {formData.photos.length} {formData.photos.length === 1 ? 'photo' : 'photos'} selected
                      </p>
                    )}
                    {errors.photos && <p className="text-sm text-destructive mt-2 animate-slide-down">{errors.photos}</p>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting} 
                className="flex-1 bg-primary hover:bg-primary/90 text-white min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating property...
                  </>
                ) : 'Create Property'}
              </Button>
              
              {showRetry && !isSubmitting && (
                <Button 
                  type="button" 
                  size="lg" 
                  variant="secondary"
                  onClick={executeSubmission}
                  className="flex-1 min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Retry Submission
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/host/dashboard')} 
                disabled={isSubmitting}
                className="min-h-[56px] text-lg font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </Button>
            </motion.div>
          </form>
        </div>

        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent className="rounded-2xl animate-scale-in">
            <AlertDialogHeader>
              <AlertDialogTitle>Review Property Details</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to list "{formData.title}" for ₹{formData.pricePerNight}/night.
                Make sure all details and uploaded photos are correct before submitting.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting} className="rounded-xl min-h-[48px]">Review Again</AlertDialogCancel>
              <AlertDialogAction onClick={executeSubmission} disabled={isSubmitting} className="rounded-xl bg-primary hover:bg-primary/90 text-white min-h-[48px]">
                Confirm & Create
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Footer />
      </div>
    </>
  );
};

export default CreatePropertyPage;