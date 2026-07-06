/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const booking = e.record;
  const propertyId = booking.get("propertyId");
  const guestId = booking.get("guestId");
  
  // Get property details
  const property = $app.findRecordById("properties", propertyId);
  const hostId = property.get("hostId");
  const host = $app.findRecordById("users", hostId);
  
  // Get guest details
  const guest = $app.findRecordById("users", guestId);
  
  const guestName = booking.get("guestFullName");
  const propertyName = booking.get("propertyName");
  const checkInDate = booking.get("checkInDate");
  const checkOutDate = booking.get("checkOutDate");
  const totalAmount = booking.get("totalAmount");
  
  // Send email to host
  const emailMessage = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: host.get("email") }],
    subject: "New Booking Request from " + guestName,
    html: "<h2>New Booking Request</h2><p>Guest: <strong>" + guestName + "</strong></p><p>Property: <strong>" + propertyName + "</strong></p><p>Check-in: " + checkInDate + "</p><p>Check-out: " + checkOutDate + "</p><p>Amount: <strong>₹" + totalAmount + "</strong></p><p>Action required: Accept or Reject booking.</p>"
  });
  $app.newMailClient().send(emailMessage);
  
  // Create WhatsApp notification record
  const whatsappRecord = new Record($app.findCollectionByNameOrId("whatsapp_messages"));
  whatsappRecord.set("recipientPhone", booking.get("guestMobileNumber"));
  whatsappRecord.set("recipientName", guestName);
  whatsappRecord.set("messageType", "booking_confirmation");
  whatsappRecord.set("bookingId", booking.id);
  whatsappRecord.set("messageBody", "New Booking Request from " + guestName + " for " + propertyName + " (" + checkInDate + " to " + checkOutDate + "). Amount: ₹" + totalAmount + ". Action required: Accept or Reject booking.");
  whatsappRecord.set("status", "pending");
  $app.save(whatsappRecord);
  
  e.next();
}, "bookings");