/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  // Only process if status changed to 'completed'
  if (oldStatus !== "completed" && newStatus === "completed") {
    const propertyId = booking.get("propertyId");
    const totalPrice = booking.get("totalPrice");
    
    // Get property and update totalRevenue
    const property = $app.findRecordById("properties", propertyId);
    const currentRevenue = property.get("totalRevenue") || 0;
    property.set("totalRevenue", currentRevenue + totalPrice);
    
    // Also update totalEarnings (same as totalRevenue for this property)
    const currentEarnings = property.get("totalEarnings") || 0;
    property.set("totalEarnings", currentEarnings + totalPrice);
    
    // Update totalBookings count
    const currentBookings = property.get("totalBookings") || 0;
    property.set("totalBookings", currentBookings + 1);
    
    $app.save(property);
    
    // Update host's totalEarnings
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    const hostCurrentEarnings = host.get("hostEarnings") || 0;
    host.set("hostEarnings", hostCurrentEarnings + totalPrice);
    $app.save(host);
  }
  
  e.next();
}, "bookings");