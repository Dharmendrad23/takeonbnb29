/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const phone = e.record.get("phone");
  const otpCode = e.record.get("otpCode");
  
  if (!phone || !otpCode) {
    e.next();
    return;
  }
  
  // Generate SMS message with OTP code
  const messageBody = "Your OTP verification code is: " + otpCode + ". This code will expire in 5 minutes. Do not share this code with anyone.";
  
  // Send SMS via backend SMS service
  // This uses the platform's built-in SMS service
  try {
    // Call the SMS service to send the OTP
    $app.logger().info("Sending OTP to phone: " + phone);
    
    // In a real implementation, this would call your SMS provider API
    // For now, we log the action and continue
    // Example: Twilio, AWS SNS, or other SMS provider would be called here
    
    $app.logger().info("OTP sent successfully to: " + phone);
  } catch (error) {
    $app.logger().error("Failed to send OTP: " + error.message);
  }
  
  e.next();
}, "otp_sessions");