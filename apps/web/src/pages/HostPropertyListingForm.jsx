import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, UploadCloud, X, Loader2, Home, MapPin, ListChecks, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Home },
  { id: 2, title: 'Amenities', icon: ListChecks },
  { id: 3, title: 'Media', icon: ImageIcon }
];

const HostPropertyListingForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  
  // Step 1 State
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', propertyType: 'Villas',
    pricePerNight: '', bedrooms: '', bathrooms: '', guestCapacity: ''
  });

  // Step 2 State
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Step 3 State
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const { data } = await api.get("/amenities");
        const records = Array.isArray(data) ? data : (data.amenities || []);
        setAvailableAmenities(records);
      } catch (err) {
        console.error("Failed to fetch amenities", err);
      }
    };
    fetchAmenities();
  }, []);

  useEffect(() => {
  const fetchCities = async () => {
    try {
      const { data } = await api.get("/properties")

      const uniqueCities = Array.from(
  new Set(
    (data.properties || [])
      .map(item => item.location?.trim())
      .filter(Boolean)
  )
).sort((a, b) => a.localeCompare(b));

      setCities(uniqueCities);
    } catch (err) {
      console.error("Failed to load city suggestions:", err);
    }
  };

  fetchCities();
}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 10) {
      toast.error('You can upload a maximum of 10 photos');
      return;
    }
    
    // Validate sizes (20MB)
    const validFiles = files.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 20MB limit`);
        return false;
      }
      return true;
    });

    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const validateStep1 = () => {
    if (!formData.title || !formData.description || !formData.location || !formData.pricePerNight || !formData.bedrooms || !formData.bathrooms || !formData.guestCapacity) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (formData.pricePerNight < 1 || formData.bedrooms < 1 || formData.bathrooms < 1 || formData.guestCapacity < 1) {
      toast.error('Numeric fields must be at least 1');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/properties", {
        hostId: currentUser?._id || currentUser?.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        propertyType: formData.propertyType,
        pricePerNight: Number(formData.pricePerNight),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        guests: Number(formData.guestCapacity),
        amenities: selectedAmenities,
        photos: photos.map(photo => photo.preview || ""),
        approvalStatus: "approved",
      });
      
      toast.success('Property submitted successfully!');
      navigate('/host/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <Helmet><title>Add New Property | Take on BNB</title></Helmet>

      {/* Progress Bar */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-card transition-all duration-300 ${
                  isCompleted ? 'bg-primary text-primary-foreground' : 
                  isCurrent ? 'bg-primary text-primary-foreground scale-110 shadow-md' : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={`mt-2 text-sm font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 md:p-8 flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Property Details</h2>
                  <p className="text-muted-foreground">Start with the basic information about your property.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Property Title <span className="text-destructive">*</span></Label>
                    <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Luxury Sea View Villa" className="h-12 bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Location <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Goa, India"
                        className="pl-9 h-12 bg-background border-border"
                        list="property-cities"
                      />
                      <datalist id="property-cities">
                        {cities.map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Description <span className="text-destructive">*</span></Label>
                  <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe what makes your property unique..." className="min-h-[120px] bg-background border-border resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Property Type <span className="text-destructive">*</span></Label>
                    <Select value={formData.propertyType} onValueChange={(val) => handleSelectChange('propertyType', val)}>
                      <SelectTrigger className="h-12 bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Villas">Villas</SelectItem>
                        <SelectItem value="Hotels">Hotels</SelectItem>
                        <SelectItem value="Apartments">Apartments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Price per Night (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="1" name="pricePerNight" value={formData.pricePerNight} onChange={handleInputChange} placeholder="5000" className="h-12 bg-background border-border font-semibold text-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Bedrooms <span className="text-destructive">*</span></Label>
                    <Input type="number" min="1" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="h-12 bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Bathrooms <span className="text-destructive">*</span></Label>
                    <Input type="number" min="1" step="0.5" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="h-12 bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Guest Capacity <span className="text-destructive">*</span></Label>
                    <Input type="number" min="1" name="guestCapacity" value={formData.guestCapacity} onChange={handleInputChange} className="h-12 bg-background border-border" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Amenities */}
            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">What amenities do you offer?</h2>
                  <p className="text-muted-foreground">Select all that apply to your property.</p>
                </div>
                
                {availableAmenities.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">Loading amenities...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableAmenities.map(amenity => (
                      <div 
                        key={amenity.id} 
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAmenities.includes(amenity.id) 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <Checkbox 
                          checked={selectedAmenities.includes(amenity.id)} 
                          onCheckedChange={() => toggleAmenity(amenity.id)} 
                          className="pointer-events-none"
                        />
                        <span className="font-medium text-foreground select-none">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Media */}
            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">Property Photos</h2>
                  <p className="text-muted-foreground">Upload up to 10 high-quality images (Max 20MB each).</p>
                </div>
                
                <div 
                  className="border-2 border-dashed border-border rounded-2xl p-10 text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  <UploadCloud className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-foreground mb-1">Click to upload photos</h3>
                  <p className="text-sm text-muted-foreground">JPEG, PNG, WEBP allowed</p>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                        <img src={photo.preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="destructive" size="icon" className="w-8 h-8 rounded-full" onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-muted/10 flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="h-12 px-6 rounded-xl font-bold">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl font-bold">
              Next Step <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl font-bold shadow-md">
              {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Property'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostPropertyListingForm;
