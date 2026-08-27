const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Transporter for Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verification Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Natan Paint Backend API Running' });
});

/**
 * 1. CONTACT & INQUIRY FORM ENDPOINT
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message, serviceType } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please provide name, email, and message.' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER}>`,
    replyTo: email,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Inquiry from ${name} [${serviceType || 'General'}]`,
    html: `
      <h3>New Customer Inquiry - Natan Paint</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Service Requested:</strong> ${serviceType || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Mail Error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

/**
 * 2. PAINT CALCULATOR API ENDPOINT
 */
app.post('/api/calculate', (req, res) => {
  const { areaSqMeters, coats = 2, coveragePerLiter = 10 } = req.body;

  if (!areaSqMeters || areaSqMeters <= 0) {
    return res.status(400).json({ error: 'Please enter a valid wall area in square meters.' });
  }

  // Calculation Logic
  const totalAreaToCover = areaSqMeters * coats;
  const totalLitersRequired = Math.ceil(totalAreaToCover / coveragePerLiter);
  
  // Natan Paint standard drum sizes (20L and 4L)
  const drums20L = Math.floor(totalLitersRequired / 20);
  const remainingLiters = totalLitersRequired % 20;
  const gallons4L = Math.ceil(remainingLiters / 4);

  return res.status(200).json({
    success: true,
    input: { areaSqMeters, coats, coveragePerLiter },
    result: {
      totalLiters: totalLitersRequired,
      recommendedContainers: {
        drums20L: drums20L,
        gallons4L: gallons4L
      }
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Natan Paint Backend Server running on port ${PORT}`);
});