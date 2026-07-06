/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const guestFullName = e.record.get("guestFullName");
  const guestEmail = e.record.get("guestEmail");
  const guestMobileNumber = e.record.get("guestMobileNumber");
  const propertyName = e.record.get("propertyName");
  const checkInDate = e.record.get("checkInDate");
  const checkOutDate = e.record.get("checkOutDate");
  const guestCount = e.record.get("guestCount");
  const totalAmount = e.record.get("totalAmount");
  const specialRequests = e.record.get("specialRequests") || "None";
  const bookingId = e.record.id;
  
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: "admin@site.com" }],
    subject: "New Booking - " + propertyName,
    html: "<h2>New Booking Received</h2>" +
          "<p><strong>Booking ID:</strong> " + bookingId + "</p>" +
          "<p><strong>Guest Information:</strong></p>" +
          "<ul>" +
          "<li><strong>Name:</strong> " + guestFullName + "</li>" +
          "<li><strong>Email:</strong> " + guestEmail + "</li>" +
          "<li><strong>Phone:</strong> " + guestMobileNumber + "</li>" +
          "</ul>" +
          "<p><strong>Booking Details:</strong></p>" +
          "<ul>" +
          "<li><strong>Property:</strong> " + propertyName + "</li>" +
          "<li><strong>Check-in Date:</strong> " + checkInDate + "</li>" +
          "<li><strong>Check-out Date:</strong> " + checkOutDate + "</li>" +
          "<li><strong>Number of Guests:</strong> " + guestCount + "</li>" +
          "<li><strong>Total Amount:</strong> $" + totalAmount + "</li>" +
          "</ul>" +
          "<p><strong>Special Requests:</strong></p>" +
          "<p>" + specialRequests + "</p>" +
          "<p>Please review and confirm this booking in the admin panel.</p>"
  });
  
  $app.newMailClient().send(message);
  
  e.next();
}, "bookings");