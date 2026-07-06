/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original();
  const currentStatus = e.record.get("status");
  const previousStatus = original.get("status");
  
  // Only send email if status changed to 'cancelled'
  if (previousStatus !== "cancelled" && currentStatus === "cancelled") {
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
      subject: "Booking Cancelled - " + propertyName,
      html: "<h2>Booking Cancelled</h2>" +
            "<p>Dear " + guestFullName + ",</p>" +
            "<p>Your booking has been cancelled. Here are the details:</p>" +
            "<ul>" +
            "<li><strong>Property:</strong> " + propertyName + "</li>" +
            "<li><strong>Original Check-in Date:</strong> " + checkInDate + "</li>" +
            "<li><strong>Original Check-out Date:</strong> " + checkOutDate + "</li>" +
            "<li><strong>Booking Amount:</strong> $" + totalAmount + "</li>" +
            "</ul>" +
            "<p><strong>Refund Information:</strong></p>" +
            "<p>Your refund will be processed according to our cancellation policy. Please allow 5-7 business days for the refund to appear in your account.</p>" +
            "<p>If you have any questions, please contact our support team.</p>"
    });
    
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "bookings");