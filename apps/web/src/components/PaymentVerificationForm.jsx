import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const PaymentVerificationForm = ({ onSubmit, isSubmitting, defaultValues = {} }) => {
  const [formData, setFormData] = useState({
    transactionId: '',
    guestName: defaultValues.name || '',
    phone: defaultValues.phone || '',
    screenshot: null
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.screenshot) {
      const objectUrl = URL.createObjectURL(formData.screenshot);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [formData.screenshot]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, screenshot: 'Please upload an image file (JPG, PNG, etc)' }));
        return;
      }
      setFormData(prev => ({ ...prev, screenshot: file }));
      setErrors(prev => ({ ...prev, screenshot: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.transactionId || formData.transactionId.length < 8) {
      newErrors.transactionId = 'Valid UTR/Transaction ID is required';
    }
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }
    if (!formData.screenshot) {
      newErrors.screenshot = 'Payment screenshot is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full animate-fade-in-up">
      <div className="space-y-2">
        <Label htmlFor="transactionId" className="text-foreground font-semibold">UPI UTR / Transaction ID *</Label>
        <Input 
          id="transactionId"
          placeholder="e.g. 312345678901" 
          value={formData.transactionId}
          onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
          className={`h-12 rounded-xl bg-card border-2 ${errors.transactionId ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary focus-visible:ring-primary/20'}`}
        />
        {errors.transactionId && <p className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1"/>{errors.transactionId}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guestName" className="text-foreground font-semibold">Guest Name *</Label>
          <Input 
            id="guestName"
            placeholder="John Doe" 
            value={formData.guestName}
            onChange={(e) => setFormData({...formData, guestName: e.target.value})}
            className={`h-12 rounded-xl bg-card border-2 ${errors.guestName ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary focus-visible:ring-primary/20'}`}
          />
          {errors.guestName && <p className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1"/>{errors.guestName}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number *</Label>
          <Input 
            id="phone"
            type="tel"
            placeholder="+91 9876543210" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className={`h-12 rounded-xl bg-card border-2 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : 'border-border focus-visible:border-primary focus-visible:ring-primary/20'}`}
          />
          {errors.phone && <p className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1"/>{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground font-semibold">Upload Payment Screenshot *</Label>
        <div className={`relative border-2 border-dashed rounded-xl overflow-hidden flex flex-col items-center justify-center transition-colors cursor-pointer min-h-[160px] ${errors.screenshot ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary hover:bg-primary/5 bg-muted/20'}`}>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp,image/gif" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          
          {preview ? (
            <div className="relative w-full h-full min-h-[200px]">
              <img src={preview} alt="Screenshot Preview" className="w-full h-full object-contain absolute inset-0 bg-black/5" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                <CheckCircle2 className="w-10 h-10 mb-2" />
                <p className="font-medium">Click to replace</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-muted-foreground p-6">
              <UploadCloud className="w-10 h-10 mb-2 text-primary/60" />
              <p className="font-medium text-foreground">Click or drag image to upload</p>
              <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
        {errors.screenshot && <p className="text-sm text-destructive flex items-center mt-1"><AlertCircle className="w-4 h-4 mr-1"/>{errors.screenshot}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-gradient-orange text-white hover:-translate-y-1 transition-all duration-300"
      >
        {isSubmitting ? 'Submitting Booking...' : 'Verify Payment'}
      </Button>
    </form>
  );
};

export default PaymentVerificationForm;