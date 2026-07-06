/// <reference path="../pb_data/types.d.ts" />
// Log all admin actions for audit trail

// Log property creation
onRecordAfterCreateSuccess((e) => {
  const adminId = e.record.get("hostId");
  
  try {
    const logRecord = new Record("activity_logs");
    logRecord.set("adminId", adminId);
    logRecord.set("actionType", "property_added");
    logRecord.set("targetId", e.record.id);
    logRecord.set("targetType", "property");
    logRecord.set("details", "Property created: " + e.record.get("title") + " at " + e.record.get("location"));
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging property creation:", err);
  }
  
  e.next();
}, "properties");

// Log property updates
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const changes = [];
  
  if (original.get("title") !== e.record.get("title")) {
    changes.push("title");
  }
  if (original.get("status") !== e.record.get("status")) {
    changes.push("status");
  }
  if (original.get("pricePerNight") !== e.record.get("pricePerNight")) {
    changes.push("pricePerNight");
  }
  
  if (changes.length > 0) {
    const adminId = e.record.get("hostId");
    
    try {
      const logRecord = new Record("activity_logs");
      logRecord.set("adminId", adminId);
      logRecord.set("actionType", "property_updated");
      logRecord.set("targetId", e.record.id);
      logRecord.set("targetType", "property");
      logRecord.set("details", "Property updated: " + e.record.get("title") + ". Changed fields: " + changes.join(", "));
      $app.save(logRecord);
    } catch (err) {
      console.log("Error logging property update:", err);
    }
  }
  
  e.next();
}, "properties");

// Log property deletion
onRecordAfterDeleteSuccess((e) => {
  const adminId = e.record.get("hostId");
  
  try {
    const logRecord = new Record("activity_logs");
    logRecord.set("adminId", adminId);
    logRecord.set("actionType", "property_updated");
    logRecord.set("targetId", e.record.id);
    logRecord.set("targetType", "property");
    logRecord.set("details", "Property deleted: " + e.record.get("title"));
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging property deletion:", err);
  }
  
  e.next();
}, "properties");

// Log booking creation
onRecordAfterCreateSuccess((e) => {
  try {
    const logRecord = new Record("activity_logs");
    logRecord.set("actionType", "booking_created");
    logRecord.set("targetId", e.record.id);
    logRecord.set("targetType", "booking");
    logRecord.set("details", "Booking created for " + e.record.get("guestFullName") + " at " + e.record.get("propertyName") + ". Amount: $" + e.record.get("totalAmount"));
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging booking creation:", err);
  }
  
  e.next();
}, "bookings");

// Log booking status changes
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const bookingStatusChanged = original.get("bookingStatus") !== e.record.get("bookingStatus");
  const paymentStatusChanged = original.get("paymentStatus") !== e.record.get("paymentStatus");
  
  if (bookingStatusChanged || paymentStatusChanged) {
    try {
      const logRecord = new Record("activity_logs");
      logRecord.set("actionType", "booking_confirmed");
      logRecord.set("targetId", e.record.id);
      logRecord.set("targetType", "booking");
      
      let details = "Booking updated for " + e.record.get("guestFullName") + ". ";
      if (bookingStatusChanged) {
        details += "Booking status: " + original.get("bookingStatus") + " → " + e.record.get("bookingStatus") + ". ";
      }
      if (paymentStatusChanged) {
        details += "Payment status: " + original.get("paymentStatus") + " → " + e.record.get("paymentStatus") + ".";
      }
      
      logRecord.set("details", details);
      $app.save(logRecord);
    } catch (err) {
      console.log("Error logging booking update:", err);
    }
  }
  
  e.next();
}, "bookings");

// Log user status changes (guest profile creation/updates)
onRecordAfterCreateSuccess((e) => {
  try {
    const logRecord = new Record("activity_logs");
    logRecord.set("actionType", "guest_contacted");
    logRecord.set("targetId", e.record.id);
    logRecord.set("targetType", "guest");
    logRecord.set("details", "Guest profile created: " + e.record.get("fullName") + " (" + e.record.get("email") + ")");
    $app.save(logRecord);
  } catch (err) {
    console.log("Error logging guest creation:", err);
  }
  
  e.next();
}, "guests");

// Log guest profile updates
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const isBlockedChanged = original.get("isBlocked") !== e.record.get("isBlocked");
  
  if (isBlockedChanged) {
    try {
      const logRecord = new Record("activity_logs");
      logRecord.set("actionType", "guest_contacted");
      logRecord.set("targetId", e.record.id);
      logRecord.set("targetType", "guest");
      const status = e.record.get("isBlocked") ? "blocked" : "unblocked";
      logRecord.set("details", "Guest " + status + ": " + e.record.get("fullName"));
      $app.save(logRecord);
    } catch (err) {
      console.log("Error logging guest status change:", err);
    }
  }
  
  e.next();
}, "guests");