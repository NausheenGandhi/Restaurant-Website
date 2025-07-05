require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());



mongoose.connect(dbURI)
  .then(() => {
    console.log('MongoDB connected');
    console.log('Connected to DB:', mongoose.connection.db.databaseName);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CateringSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Contact = mongoose.model('Contact', ContactSchema);
const Booking = mongoose.model('Booking', BookingSchema);
const Catering = mongoose.model('Catering', CateringSchema);

// Validators
const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').escape()
];

const validateBooking = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required').escape(),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('guests').isInt({ min: 1 }).withMessage('Guests must be at least 1')
];

// Routes

app.post('/contact', validateContact, async (req, res) => {
  console.log('Incoming contact data:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    const saved = await newContact.save();
    console.log('Saved contact:', saved);
    res.status(201).json({ success: true, message: 'Contact saved successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/book-table', validateBooking, async (req, res) => {
  console.log('Incoming booking data:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, phone, date, time, guests } = req.body;
    const newBooking = new Booking({ name, email, phone, date, time, guests });
    const saved = await newBooking.save();
    console.log('Saved booking:', saved);
    res.status(201).json({ success: true, message: 'Booking saved successfully' });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/catering', validateBooking, async (req, res) => {
  console.log('Incoming catering request:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, phone, date, time, guests } = req.body;
    const newCatering = new Catering({ name, email, phone, date, time, guests });
    const saved = await newCatering.save();
    console.log('Saved catering request:', saved);
    res.status(201).json({ success: true, message: 'Catering request saved successfully' });
  } catch (error) {
    console.error('Error saving catering request:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
