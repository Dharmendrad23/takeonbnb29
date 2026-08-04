import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IndianRupee, Save, Trash2, CalendarRange, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { createPropertyRate, deletePropertyRate, listProperties, listPropertyRates } from '@/lib/dataApi.js';
import { getEntityId } from '@/lib/propertyMappers.js';

const HostCalendarRateManager = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [rates, setRates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pricePerNight: ''
  });

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const hostId = currentUser?.id || currentUser?._id || '';
        const records = (await listProperties()).filter((property) => String(property.hostId || '') === hostId);
        setProperties(records);
        if (records.length > 0) setSelectedPropertyId(getEntityId(records[0]));
      } catch (e) {
        console.error(e);
      }
    };
    fetchProps();
  }, [currentUser]);

  const fetchRates = async () => {
    if (!selectedPropertyId) return;
    setIsLoading(true);
    try {
      const records = await listPropertyRates({ propertyId: selectedPropertyId });
      setRates(records.sort((left, right) => new Date(left.startDate) - new Date(right.startDate)));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [selectedPropertyId]);

  const handleSetRate = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.pricePerNight) {
      toast.error('Please fill all fields');
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSaving(true);
    try {
      await createPropertyRate({
        propertyId: selectedPropertyId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        pricePerNight: Number(formData.pricePerNight)
      });
      
      toast.success('Custom rate applied successfully');
      setFormData({ startDate: '', endDate: '', pricePerNight: '' });
      fetchRates();
    } catch (error) {
      toast.error('Failed to set rate');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRate = async (id) => {
    try {
      await deletePropertyRate(id);
      toast.success('Rate rule removed');
      fetchRates();
    } catch (error) {
      toast.error('Failed to remove rate');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
      {/* Create Form */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-fit">
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
            <CalendarRange className="w-5 h-5 text-primary" /> Set Custom Rates
          </h2>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select Property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map(p => <SelectItem key={getEntityId(p)} value={getEntityId(p)}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSetRate} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground">Start Date</Label>
            <Input 
              type="date" 
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="bg-background border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">End Date</Label>
            <Input 
              type="date" 
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="bg-background border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Price per Night (₹)</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="number" 
                min="1"
                placeholder="5000"
                value={formData.pricePerNight}
                onChange={e => setFormData({...formData, pricePerNight: e.target.value})}
                className="pl-9 bg-background border-border font-bold"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving || !selectedPropertyId} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11">
            {isSaving ? 'Saving...' : <><Plus className="w-4 h-4 mr-2" /> Add Rate Rule</>}
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-6">Active Custom Rates</h3>
        
        {isLoading ? (
          <div className="text-muted-foreground">Loading rates...</div>
        ) : rates.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground font-medium">No custom rates set for this property.</p>
            <p className="text-sm text-muted-foreground mt-1">Default property price will be used.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rates.map(rate => (
              <div key={getEntityId(rate)} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors gap-4">
                <div>
                  <div className="font-semibold text-foreground text-sm mb-1">
                    {format(new Date(rate.startDate), 'MMM dd, yyyy')} - {format(new Date(rate.endDate), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-primary font-bold flex items-center">
                    <IndianRupee className="w-3.5 h-3.5 mr-0.5" /> {rate.pricePerNight.toLocaleString('en-IN')} / night
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => handleDeleteRate(getEntityId(rate))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostCalendarRateManager;