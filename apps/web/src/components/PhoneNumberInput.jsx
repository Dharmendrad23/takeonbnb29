import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', label: 'US/CA (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+91', label: 'IN (+91)' },
  { code: '+86', label: 'CN (+86)' },
  { code: '+33', label: 'FR (+33)' },
  { code: '+39', label: 'IT (+39)' },
  { code: '+34', label: 'ES (+34)' },
  { code: '+49', label: 'DE (+49)' },
  { code: '+81', label: 'JP (+81)' },
  { code: '+61', label: 'AU (+61)' }
];

export const PhoneNumberInput = ({ value, onChange, error, onBlur, id, disabled }) => {
  // Extract initial country code if present
  const getInitialState = () => {
    if (!value) return { code: '+91', number: '' };
    const matched = COUNTRY_CODES.find(c => value.startsWith(c.code));
    if (matched) {
      return { code: matched.code, number: value.slice(matched.code.length).trim() };
    }
    return { code: '+91', number: value };
  };

  const [countryCode, setCountryCode] = useState(getInitialState().code);
  const [phoneNumber, setPhoneNumber] = useState(getInitialState().number);

  useEffect(() => {
    // Notify parent of combined value whenever parts change
    if (phoneNumber) {
      onChange(`${countryCode} ${phoneNumber}`);
    } else {
      onChange(''); // Empty if no number entered
    }
  }, [countryCode, phoneNumber]);

  return (
    <div className={cn(
      "flex flex-row rounded-md border shadow-sm transition-smooth",
      error ? "border-destructive ring-1 ring-destructive" : "border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <div className="flex items-center pl-3 text-muted-foreground">
        <Phone className="w-5 h-5" />
      </div>
      <Select 
        value={countryCode} 
        onValueChange={setCountryCode}
        disabled={disabled}
      >
        <SelectTrigger className="w-[110px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0 shadow-none font-medium">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="w-px h-6 bg-border self-center" />
      
      <Input
        id={id}
        type="tel"
        placeholder="98765 43210"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
        onBlur={onBlur}
        disabled={disabled}
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
      />
    </div>
  );
};