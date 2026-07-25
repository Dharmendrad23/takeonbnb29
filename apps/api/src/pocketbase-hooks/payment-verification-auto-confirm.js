/**
 * PocketBase Hook: payment-verification-auto-confirm
 * 
 * Triggers on bookings collection update.
 * When paymentStatus changes to 'verified', automatically:
 * 1. Set bookingStatus='confirmed' and status='confirmed' on the booking record
 * 2. Send booking confirmation email via API
 * 3. Send booking WhatsApp notification via API
 * 
 * This hook should be registered in PocketBase admin panel:
 * - Collection: bookings
 * - Event: Update
 * - Hook Type: Before save (or After save)
 * - URL: https://takeonbnb.com/hcgi/api/bookings/send-booking-confirmation-email
 */

export default async (e) => {
  // Check if paymentStatus changed to 'verified'
  const previousPaymentStatus = e.data.paymentStatus;
  const currentPaymentStatus = e.record.paymentStatus;

  if (currentPaymentStatus === 'verified') {
    try {
      // 1. Update booking status to confirmed
      e.record.set('status', 'confirmed');
      e.record.set('bookingStatus', 'confirmed');

      // 2. Send booking confirmation email
      try {
        const emailResponse = await fetch('https://takeonbnb.com/hcgi/api/bookings/send-booking-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: e.record.id,
          }),
        });

        if (!emailResponse.ok) {
          console.error(`Failed to send confirmation email for booking ${e.record.id}: ${emailResponse.statusText}`);
        } else {
          console.log(`Confirmation email sent for booking ${e.record.id}`);
        }
      } catch (emailError) {
        console.error(`Error sending confirmation email for booking ${e.record.id}:`, emailError.message);
      }

      // 3. Send booking WhatsApp notification
      try {
        const whatsappResponse = await fetch('https://takeonbnb.com/hcgi/api/bookings/send-booking-whatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: e.record.id,
            businessPhone: '+91 9058682991',
          }),
        });

        if (!whatsappResponse.ok) {
          console.error(`Failed to send WhatsApp notification for booking ${e.record.id}: ${whatsappResponse.statusText}`);
        } else {
          console.log(`WhatsApp notification sent for booking ${e.record.id}`);
        }
      } catch (whatsappError) {
        console.error(`Error sending WhatsApp notification for booking ${e.record.id}:`, whatsappError.message);
      }
    } catch (error) {
      console.error(`Error in payment-verification-auto-confirm hook for booking ${e.record.id}:`, error.message);
    }
  }

  // Continue with the normal save operation
  e.next();
};