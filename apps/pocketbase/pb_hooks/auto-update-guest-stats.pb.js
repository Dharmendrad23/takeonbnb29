/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const booking = e.record;
  const guestId = booking.get("guestId");
  const totalPrice = booking.get("totalPrice");
  
  // Get guest record
  const guest = $app.findRecordById("guests", guestId);
  
  // Increment totalBookings
  const currentBookings = guest.get("totalBookings") || 0;
  guest.set("totalBookings", currentBookings + 1);
  
  // Add to totalSpent
  const currentSpent = guest.get("totalSpent") || 0;
  guest.set("totalSpent", currentSpent + totalPrice);
  
  // Update lastBookingDate
  guest.set("lastBookingDate", new Date().toISOString().split('T')[0]);
  
  $app.save(guest);
  
  e.next();
}, "bookings");

onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  // Only process if status changed to 'completed'
  if (oldStatus !== "completed" && newStatus === "completed") {
    const guestId = booking.get("guestId");
    const totalPrice = booking.get("totalPrice");
    
    // Get guest record
    const guest = $app.findRecordById("guests", guestId);
    
    // Add to totalSpent (totalBookings already incremented on creation)
    const currentSpent = guest.get("totalSpent") || 0;
    guest.set("totalSpent", currentSpent + totalPrice);
    
    $app.save(guest);
  }
  
  e.next();
}, "bookings");