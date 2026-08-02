export const validateBookingForm = (formData) => {
  const errors = {};

  if (!formData.guestFullName || formData.guestFullName.trim().length < 2) {
    errors.guestFullName = "Full name must be at least 2 characters.";
  }

  if (!formData.guestEmail) {
    errors.guestEmail = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
    errors.guestEmail = "Please provide a valid email format (e.g., name@example.com).";
  }

  if (!formData.guestMobileNumber) {
    errors.guestMobileNumber = "Mobile number is required.";
  } else {
    // Matches PocketBase validation pattern and ensures country code
    const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phonePattern.test(formData.guestMobileNumber.replace(/\s+/g, ''))) {
      errors.guestMobileNumber = "Invalid phone format. Please include country code.";
    }
  }

  if (!formData.propertyId) {
    errors.propertyId = "Please select a property.";
  }

  if (!formData.checkIn) {
    errors.checkIn = "Check-in date is mandatory.";
  }

  if (!formData.checkOut) {
    errors.checkOut = "Check-out date is mandatory.";
  }

  if (formData.checkIn && formData.checkOut) {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    
    if (checkOutDate <= checkInDate) {
      errors.checkOut = "Check-out date must be strictly after the check-in date.";
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      errors.checkIn = "Check-in cannot be set to a past date.";
    }
  }

  if (!formData.guests || formData.guests < 1) {
    errors.guests = "At least 1 guest must be selected.";
  } else if (formData.guests > 10) {
    errors.guests = "For groups larger than 10, please contact support.";
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = "Acceptance of Terms & Conditions is required to book.";
  }

  return errors;
};