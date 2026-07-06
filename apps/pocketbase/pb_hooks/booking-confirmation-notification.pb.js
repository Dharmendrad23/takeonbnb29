/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const booking = e.record;
  const original = e.record.original();
  const oldStatus = original.get("status");
  const newStatus = booking.get("status");
  
  // Only send if status changed to 'confirmed'
  if (oldStatus !== "confirmed" && newStatus === "confirmed") {
    const propertyId = booking.get("propertyId");
    const guestId = booking.get("guestId");
    
    // Get property details
    const property = $app.findRecordById("properties", propertyId);
    const hostId = property.get("hostId");
    const host = $app.findRecordById("users", hostId);
    
    const guestName = booking.get("guestFullName");
    const propertyName = booking.get("propertyName");
    const checkInDate = booking.get("checkInDate");
    const totalAmount = booking.get("totalAmount");
    
    // Send email to host
    const emailMessage = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: host.get("email") }],
      subject: "Booking Confirmed - " + propertyName,
      html: "<h2>Booking Confirmed!</h2><p>Guest <strong>" + guestName + "</strong> has confirmed booking for <strong>" + propertyName + "</strong>.</p><p>Check-in: " + checkInDate + "</p><p>Amount: <strong>₹" + totalAmount + "</strong></p>"
    });
    $app.newMailClient().send(emailMessage);
    
    // Create WhatsApp notification record
    const whatsappRecord = new Record($app.findCollectionByNameOrId("whatsapp_messages"));
    whatsappRecord.set("recipientPhone", booking.get("guestMobileNumber"));
    whatsappRecord.set("recipientName", guestName);
    whatsappRecord.set("messageType", "booking_confirmation");
    whatsappRecord.set("bookingId", booking.id);
    whatsappRecord.set("messageBody", "Booking Confirmed! Guest " + guestName + " has confirmed booking for " + propertyName + ". Check-in: " + checkInDate + ". Amount: ₹" + totalAmount + ".");
    whatsappRecord.set("status", "pending");
    $app.save(whatsappRecord);
  }
  
  e.next();
}, "bookings");