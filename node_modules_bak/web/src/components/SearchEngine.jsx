import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchEngine = ({ onSearch, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    where: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        where: initialData.where || '',
        checkIn: initialData.checkIn || '',
        checkOut: initialData.checkOut || '',
        guests: initialData.guests || 1
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border border-border p-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 md:gap-0">
        
        {/* Where */}
        <div className="flex-1 flex items-center px-4 py-3 md:py-2 hover:bg-muted/50 rounded-xl md:rounded-l-xl transition-colors cursor-text group">
          <MapPin className="w-5 h-5 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
          <div className="flex flex-col w-full">
            <label htmlFor="where" className="text-xs font-bold text-foreground mb-0.5">Where</label>
            <input 
              id="where"
              name="where"
              type="text"
              placeholder="Search destinations"
              value={formData.where}
              onChange={handleChange}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full p-0 h-5"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border my-auto mx-1" />

        {/* Check-in */}
        <div className="flex-1 flex items-center px-4 py-3 md:py-2 hover:bg-muted/50 rounded-xl transition-colors cursor-text group">
          <Calendar className="w-5 h-5 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
          <div className="flex flex-col w-full">
            <label htmlFor="checkIn" className="text-xs font-bold text-foreground mb-0.5">Check in</label>
            <input 
              id="checkIn"
              name="checkIn"
              type="date"
              value={formData.checkIn}
              onChange={handleChange}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full p-0 h-5"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border my-auto mx-1" />

        {/* Check-out */}
        <div className="flex-1 flex items-center px-4 py-3 md:py-2 hover:bg-muted/50 rounded-xl transition-colors cursor-text group">
          <Calendar className="w-5 h-5 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
          <div className="flex flex-col w-full">
            <label htmlFor="checkOut" className="text-xs font-bold text-foreground mb-0.5">Check out</label>
            <input 
              id="checkOut"
              name="checkOut"
              type="date"
              value={formData.checkOut}
              onChange={handleChange}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full p-0 h-5"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-border my-auto mx-1" />

        {/* Guests */}
        <div className="flex-1 flex items-center px-4 py-3 md:py-2 hover:bg-muted/50 rounded-xl transition-colors cursor-text group">
          <Users className="w-5 h-5 text-muted-foreground mr-3 group-focus-within:text-primary transition-colors" />
          <div className="flex flex-col w-full">
            <label htmlFor="guests" className="text-xs font-bold text-foreground mb-0.5">Who</label>
            <input 
              id="guests"
              name="guests"
              type="number"
              min="1"
              max="20"
              value={formData.guests}
              onChange={handleChange}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full p-0 h-5"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 p-2 md:p-0 md:pl-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              className="md:hidden flex-1 h-12 rounded-xl text-muted-foreground"
            >
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="flex-1 md:w-auto md:px-8 h-12 md:h-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-brand transition-all active:scale-95"
          >
            <Search className="w-5 h-5 md:mr-2" />
            <span className="md:inline">Search</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchEngine;