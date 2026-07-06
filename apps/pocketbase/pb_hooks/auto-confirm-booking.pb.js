/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  // Check if paymentStatus was just set to 'verified'
  const paymentStatus = e.record.get("paymentStatus");
  const bookingStatus = e.record.get("bookingStatus");
  
  if (paymentStatus === "verified" && bookingStatus !== "confirmed") {
    // Update bookingStatus to confirmed
    e.record.set("bookingStatus", "confirmed");
    $app.save(e.record);
  }
  
  // Send confirmation email if booking is now confirmed
  if (e.record.get("bookingStatus") === "confirmed") {
    const guestEmail = e.record.get("guestEmail");
    const propertyName = e.record.get("propertyName");
    const checkInDate = e.record.get("checkInDate");
    const checkOutDate = e.record.get("checkOutDate");
    const bookingId = e.record.id;
    
    if (guestEmail && propertyName && checkInDate && checkOutDate) {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName
        },
        to: [{ address: guestEmail }],
        subject: "Booking Confirmation - " + bookingId,
        html: "<h2>Your Booking is Confirmed!</h2>" +
              "<p><strong>Confirmation Number:</strong> " + bookingId + "</p>" +
              "<p><strong>Property:</strong> " + propertyName + "</p>" +
              "<p><strong>Check-in Date:</strong> " + checkInDate + "</p>" +
              "<p><strong>Check-out Date:</strong> " + checkOutDate + "</p>" +
              "<p>Thank you for your booking. We look forward to hosting you!</p>"
      });
      $app.newMailClient().send(message);
    }
  }
  
  e.next();
}, "bookings");