import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormFieldWrapper } from '@/components/FormFieldWrapper.jsx';
import { toast } from 'sonner';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const HostPropertyForm = ({ property = null, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      title: property?.title || '',
      description: property?.description || '',
      location: property?.location || '',
      propertyType: property?.propertyType || 'Villas',
      pricePerNight: property?.pricePerNight || '',
      bedrooms: property?.bedrooms || '',
      bathrooms: property?.bathrooms || '',
      guestCapacity: property?.guestCapacity || '',
      houseRules: property?.houseRules || ''
    }
  });

  const propertyType = watch('propertyType');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        pricePerNight: Number(data.pricePerNight),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        guestCapacity: Number(data.guestCapacity),
        hostId: currentUser.id,
        status: property ? property.status : 'Draft',
      };

      if (property?.id) {
        await pb.collection('properties').update(property.id, payload, { $autoCancel: false });
        toast.success('Property updated successfully');
      } else {
        await pb.collection('properties').create(payload, { $autoCancel: false });
        toast.success('Property added successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(error.message || 'Failed to save property. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg max-h-[85vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
        <h2 className="text-xl font-bold text-foreground">{property ? 'Edit Property' : 'Add New Property'}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        <form id="property-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWrapper label="Property Title" required error={errors.title?.message}>
              <Input 
                placeholder="E.g., Luxury Sea View Villa" 
                className="text-foreground"
                {...register('title', { required: 'Title is required' })} 
              />
            </FormFieldWrapper>
            
            <FormFieldWrapper label="Location" required error={errors.location?.message}>
              <Input 
                placeholder="E.g., Goa, India" 
                className="text-foreground"
                {...register('location', { required: 'Location is required' })} 
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label="Description" required error={errors.description?.message}>
            <Textarea 
              placeholder="Describe your property..." 
              className="min-h-[120px] text-foreground"
              {...register('description', { required: 'Description is required' })} 
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormFieldWrapper label="Property Type" required>
              <Select 
                value={propertyType} 
                onValueChange={(val) => setValue('propertyType', val)}
              >
                <SelectTrigger className="text-foreground">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Villas">Villa</SelectItem>
                  <SelectItem value="Hotels">Hotel</SelectItem>
                  <SelectItem value="Apartments">Apartment</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Price per Night (₹)" required error={errors.pricePerNight?.message}>
              <Input 
                type="number" 
                min="1" 
                className="text-foreground"
                placeholder="E.g., 5000" 
                {...register('pricePerNight', { required: 'Price is required', min: 1 })} 
              />
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FormFieldWrapper label="Bedrooms" required error={errors.bedrooms?.message}>
              <Input 
                type="number" 
                min="1" 
                className="text-foreground"
                {...register('bedrooms', { required: 'Required' })} 
              />
            </FormFieldWrapper>
            
            <FormFieldWrapper label="Bathrooms" required error={errors.bathrooms?.message}>
              <Input 
                type="number" 
                min="1" 
                step="0.5"
                className="text-foreground"
                {...register('bathrooms', { required: 'Required' })} 
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Max Guests" required error={errors.guestCapacity?.message}>
              <Input 
                type="number" 
                min="1" 
                className="text-foreground"
                {...register('guestCapacity', { required: 'Required' })} 
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label="House Rules">
            <Textarea 
              placeholder="E.g., No smoking, Check-in at 2 PM..." 
              className="text-foreground"
              {...register('houseRules')} 
            />
          </FormFieldWrapper>
          
          {/* Note: Photos upload skipped for brevity in this simple form, could be added via file input handling pocketbase multipart form data */}
          <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
            Note: Photo upload functionality is managed via the detailed property editor after initial creation.
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3 mt-auto">
        <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="property-form" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6">
          {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Property</>}
        </Button>
      </div>
    </div>
  );
};

export default HostPropertyForm;