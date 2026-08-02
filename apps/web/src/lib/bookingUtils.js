import { differenceInDays, parseISO, isAfter, isBefore, isEqual, startOfDay, format } from 'date-fns';

export const calculateTotalPrice = (pricePerNight, checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return 0;
  
  const checkIn = typeof checkInDate === 'string' ? parseISO(checkInDate) : checkInDate;
  const checkOut = typeof checkOutDate === 'string' ? parseISO(checkOutDate) : checkOutDate;
  
  const nights = differenceInDays(startOfDay(checkOut), startOfDay(checkIn));
  if (nights <= 0) return 0;
  
  const subtotal = pricePerNight * nights;
  
  return {
    nights,
    subtotal,
    total: subtotal
  };
};

export const checkDateOverlap = (newCheckIn, newCheckOut, existingBookings) => {
  if (!existingBookings || existingBookings.length === 0) return false;
  
  const newStart = startOfDay(typeof newCheckIn === 'string' ? parseISO(newCheckIn) : newCheckIn);
  const newEnd = startOfDay(typeof newCheckOut === 'string' ? parseISO(newCheckOut) : newCheckOut);
  
  return existingBookings.some(booking => {
    if (booking.status === 'cancelled') return false;
    
    const existingStart = startOfDay(parseISO(booking.checkInDate));
    const existingEnd = startOfDay(parseISO(booking.checkOutDate));
    
    return (
      (isAfter(newStart, existingStart) && isBefore(newStart, existingEnd)) ||
      (isAfter(newEnd, existingStart) && isBefore(newEnd, existingEnd)) ||
      (isBefore(newStart, existingStart) && isAfter(newEnd, existingEnd)) ||
      isEqual(newStart, existingStart) ||
      isEqual(newEnd, existingEnd)
    );
  });
};

export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

export const formatDate = formatDisplayDate;

export const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  return `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}`;
};

/**
 * Formats amount into Indian Rupee (INR) with ₹ symbol and Indian numbering system.
 */
export const formatCurrencyINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Map original formatCurrency to formatCurrencyINR for backward compatibility
export const formatCurrency = formatCurrencyINR;

export const formatPhone = (phone) => {
  if (!phone) return '';
  const match = phone.match(/^(\+\d{1,3})(\d{5})(\d{5})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};

export const isPastDate = (date) => {
  if (!date) return true;
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  return isBefore(startOfDay(checkDate), today);
};