/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  // Only send if status changed to 'checked-in'
  if (oldStatus !== "checked-in" && newStatus === "checked-in") {
    const propertyId = booking.get("propertyId");
    const guestId = booking.get("guestId");
    
    // Get property details
    const property = $app.findRecordById("properties", propertyId);
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    
    const guestName = booking.get("guestFullName");
    const propertyName = booking.get("propertyName");
    
    // Send email to host
    const emailMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: host.get("email") }],
      subject: "Guest Check-in - " + propertyName,
      html: "<h2>Guest Check-in Notification</h2><p><strong>" + guestName + "</strong> has checked in to <strong>" + propertyName + "</strong>.</p>"
    });
    $app.newMailClient().send(emailMessage);
    
    // Create WhatsApp notification record
    const whatsappRecord = new Record($app.findCollectionByNameOrId("whatsapp_messages"));
    whatsappRecord.set("recipientPhone", booking.get("guestMobileNumber"));
    whatsappRecord.set("recipientName", guestName);
    whatsappRecord.set("messageType", "checkin_reminder");
    whatsappRecord.set("bookingId", booking.id);
    whatsappRecord.set("messageBody", "Guest Check-in Notification: " + guestName + " has checked in to " + propertyName + ".");
    whatsappRecord.set("status", "pending");
    $app.save(whatsappRecord);
  }
  
  e.next();
}, "bookings");