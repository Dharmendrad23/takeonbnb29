import express from 'express';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /invoices/generate - Generate invoice for a booking
router.post('/generate', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'bookingId is required' });
  }

  // Fetch booking details
  const booking = await pb.collection('bookings').getOne(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  // Generate PDF invoice
  const doc = new PDFDocument();
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  // Add invoice header
  doc.fontSize(20).text('INVOICE', 100, 50);
  doc.fontSize(10).text(`Invoice Number: INV-${booking.id.substring(0, 8).toUpperCase()}`, 100, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 95);

  // Add property and guest details
  doc.fontSize(12).text('Property Details:', 100, 130);
  doc.fontSize(10).text(`Property: ${booking.propertyName}`, 100, 150);
  doc.text(`Property ID: ${booking.propertyId}`, 100, 165);

  doc.fontSize(12).text('Guest Details:', 100, 200);
  doc.fontSize(10).text(`Name: ${booking.guestFullName}`, 100, 220);
  doc.text(`Email: ${booking.guestEmail}`, 100, 235);
  doc.text(`Phone: ${booking.guestMobileNumber}`, 100, 250);
  doc.text(`Guest Count: ${booking.guestCount}`, 100, 265);

  // Add booking dates
  doc.fontSize(12).text('Booking Details:', 100, 300);
  doc.fontSize(10).text(`Check-in: ${booking.checkInDate}`, 100, 320);
  doc.text(`Check-out: ${booking.checkOutDate}`, 100, 335);

  // Add special requests if any
  if (booking.specialRequests) {
    doc.text(`Special Requests: ${booking.specialRequests}`, 100, 350);
  }

  // Add amount details
  const subtotal = booking.totalAmount;
  const tax = (subtotal * 0.1).toFixed(2); // 10% tax
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  doc.fontSize(12).text('Amount Details:', 100, 400);
  doc.fontSize(10).text(`Subtotal: $${subtotal}`, 100, 420);
  doc.text(`Tax (10%): $${tax}`, 100, 435);
  doc.fontSize(12).text(`Total: $${total}`, 100, 455);

  // Add payment status
  doc.fontSize(10).text(`Payment Status: ${booking.paymentStatus}`, 100, 490);

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const invoiceNumber = `INV-${booking.id.substring(0, 8).toUpperCase()}`;

        // Create invoice record in PocketBase
        const invoice = await pb.collection('invoices').create(
          {
            bookingId,
            invoiceNumber,
            totalAmount: total,
            taxAmount: tax,
            status: 'generated',
          },
          { 'invoice_pdf': new File([pdfBuffer], `${invoiceNumber}.pdf`, { type: 'application/pdf' }) }
        );

        // Update booking with invoice URL
        const invoiceUrl = `${pb.baseUrl}/api/files/invoices/${invoice.id}/invoice_pdf`;
        await pb.collection('bookings').update(bookingId, { invoiceUrl });

        logger.info(`Invoice generated for booking ${bookingId}`);
        resolve(res.json({ invoiceUrl, invoiceNumber }));
      } catch (error) {
        reject(error);
      }
    });
  });
});

// GET /invoices/:invoiceId/download - Download invoice PDF
router.get('/:invoiceId/download', async (req, res) => {
  const { invoiceId } = req.params;

  const invoice = await pb.collection('invoices').getOne(invoiceId);

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const fileUrl = `${pb.baseUrl}/api/files/invoices/${invoice.id}/invoice_pdf`;

  res.json({ downloadUrl: fileUrl, invoiceNumber: invoice.invoiceNumber });
});

export default router;