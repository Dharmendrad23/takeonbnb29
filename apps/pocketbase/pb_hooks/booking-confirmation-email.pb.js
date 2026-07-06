/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only send email if status changed to 'confirmed'
  if (previousStatus !== "confirmed" && currentStatus === "confirmed") {
    const guestEmail = e.record.get("guestEmail");
    const guestFullName = e.record.get("guestFullName");
    const propertyName = e.record.get("propertyName");
    const checkInDate = e.record.get("checkInDate");
    const checkOutDate = e.record.get("checkOutDate");
    const totalAmount = e.record.get("totalAmount");
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: guestEmail }],
      subject: "Booking Confirmed - " + propertyName,
      html: "<h2>Booking Confirmed!</h2>" +
            "<p>Dear " + guestFullName + ",</p>" +
            "<p>Your booking has been confirmed. Here are your booking details:</p>" +
            "<ul>" +
            "<li><strong>Property:</strong> " + propertyName + "</li>" +
            "<li><strong>Check-in Date:</strong> " + checkInDate + "</li>" +
            "<li><strong>Check-out Date:</strong> " + checkOutDate + "</li>" +
            "<li><strong>Total Amount:</strong> $" + totalAmount + "</li>" +
            "</ul>" +
            "<p>Thank you for booking with us!</p>"
    });
    
    try {
      $app.newMailClient().send(message);
    } catch (error) {
      throw new BadRequestError("Failed to send confirmation email: " + error.message);
    }
  }
  
  e.next();
}, "bookings");