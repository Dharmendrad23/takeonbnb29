/// <reference path="../pb_data/types.d.ts" />
onRecordUpdate((e) => {
  const paymentStatus = e.record.get("paymentStatus");
  const previousPaymentStatus = e.record.original().get("paymentStatus");
  
  // Only send email when payment status changes to 'paid'
  if (paymentStatus === "paid" && previousPaymentStatus !== "paid") {
    const guestEmail = e.record.get("guestEmail");
    const guestFullName = e.record.get("guestFullName");
    const propertyName = e.record.get("propertyName");
    const totalAmount = e.record.get("totalAmount");
    const invoiceUrl = e.record.get("invoiceUrl");
    
    let htmlBody = "<h2>Payment Confirmation</h2>" +
                   "<p>Dear " + guestFullName + ",</p>" +
                   "<p>Your payment has been received and confirmed.</p>" +
                   "<h3>Payment Details:</h3>" +
                   "<ul>" +
                   "<li><strong>Property:</strong> " + propertyName + "</li>" +
                   "<li><strong>Amount Paid:</strong> $" + totalAmount + "</li>" +
                   "</ul>";
    
    if (invoiceUrl) {
      htmlBody += "<p><a href='" + invoiceUrl + "'>Download Invoice</a></p>";
    }
    
    htmlBody += "<p>Thank you for your payment!</p>";
    
    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: guestEmail }],
      subject: "Payment Confirmation - " + propertyName,
      html: htmlBody
    });
    
    $app.newMailClient().send(message);
  }
  
  e.next();
}, "bookings");