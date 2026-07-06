/// <reference path="../pb_data/types.d.ts" />
// Log property creation
onRecordAfterCreateSuccess((e) => {
  const property = e.record;
  const hostId = property.get("hostId");
  
  // Try to find admin user from request context if available
  // For now, we'll log with a generic admin reference
  const logRecord = new Record($app.findCollectionByNameOrId("activity_logs"));
  logRecord.set("actionType", "property_added");
  logRecord.set("targetId", property.id);
  logRecord.set("targetType", "property");
  logRecord.set("details", "Property '" + property.get("title") + "' created by host " + hostId);
  
  // Note: adminId would need to be set from request context if available
  // This is a limitation of the hook - we can't access the authenticated admin user
  
  $app.save(logRecord);
  
  e.next();
}, "properties");

// Log property updates
onRecordUpdate((e) => {
  const property = e.record;
  const original = e.record.original();
  
  // Check if approval status changed
  const oldStatus = original.get("approvalStatus");
  const newStatus = property.get("approvalStatus");
  
  if (oldStatus !== newStatus) {
    let actionType = "property_updated";
    if (newStatus === "approved") {
      actionType = "property_approved";
    } else if (newStatus === "rejected") {
      actionType = "property_rejected";
    }
    
    const logRecord = new Record($app.findCollectionByNameOrId("activity_logs"));
    logRecord.set("actionType", actionType);
    logRecord.set("targetId", property.id);
    logRecord.set("targetType", "property");
    logRecord.set("details", "Property '" + property.get("title") + "' status changed to " + newStatus);
    
    $app.save(logRecord);
  }
  
  e.next();
}, "properties");

// Log booking creation
onRecordAfterCreateSuccess((e) => {
  const booking = e.record;
  
  const logRecord = new Record($app.findCollectionByNameOrId("activity_logs"));
  logRecord.set("actionType", "booking_created");
  logRecord.set("targetId", booking.id);
  logRecord.set("targetType", "booking");
  logRecord.set("details", "Booking created for " + booking.get("propertyName") + " by guest " + booking.get("guestFullName"));
  
  $app.save(logRecord);
  
  e.next();
}, "bookings");

// Log booking status changes
onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  if (oldStatus !== newStatus) {
    let actionType = "booking_created";
    if (newStatus === "confirmed") {
      actionType = "booking_confirmed";
    } else if (newStatus === "cancelled") {
      actionType = "booking_cancelled";
    }
    
    const logRecord = new Record($app.findCollectionByNameOrId("activity_logs"));
    logRecord.set("actionType", actionType);
    logRecord.set("targetId", booking.id);
    logRecord.set("targetType", "booking");
    logRecord.set("details", "Booking status changed from " + oldStatus + " to " + newStatus);
    
    $app.save(logRecord);
  }
  
  // Log payment status changes
  const oldPaymentStatus = original.get("paymentStatus");
  const newPaymentStatus = booking.get("paymentStatus");
  
  if (oldPaymentStatus !== newPaymentStatus && newPaymentStatus === "paid") {
    const logRecord = new Record($app.findCollectionByNameOrId("activity_logs"));
    logRecord.set("actionType", "payment_received");
    logRecord.set("targetId", booking.id);
    logRecord.set("targetType", "booking");
    logRecord.set("details", "Payment received for booking - Amount: ₹" + booking.get("totalAmount"));
    
    $app.save(logRecord);
  }
  
  e.next();
}, "bookings");