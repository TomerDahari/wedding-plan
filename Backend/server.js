const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const User = require('./models/User'); // ייבוא המודל של משתמשים
const Guest = require('./models/Guest'); // ייבוא המודל של מוזמנים
const Expense = require('./models/Expense'); // ייבוא המודל של הוצאות
const Layout = require('./models/Layout');
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes

// הרשמה
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// התחברות
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// מוזמנים
app.post('/guests', async (req, res) => {
  const { userId, firstName, lastName, side, additionalGuests } = req.body;
  try {
    const newGuest = new Guest({ userId, firstName, lastName, side, additionalGuests });
    await newGuest.save();
    res.status(201).json({ message: 'Guest added successfully', guest: newGuest });
  } catch (error) {
    console.error('Error adding guest:', error);
    res.status(500).json({ message: 'Error adding guest', error });
  }
});

app.get('/guests/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const guests = await Guest.find({ userId });
    res.status(200).json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guests', error });
  }
});

app.delete('/guests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Guest.findByIdAndDelete(id);
    res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    res.status(500).json({ message: 'Error deleting guest', error });
  }
});

// הוצאות
app.post('/expenses', async (req, res) => {
  const { userId, name, price, quantity } = req.body;
  try {
    const newExpense = new Expense({ userId, name, price, quantity });
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense', error });
  }
});

app.get('/expenses/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const expenses = await Expense.find({ userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});


// *** יצירת/עדכון סקיצה ***
app.post('/layouts', async (req, res) => {
  const { userId, elements } = req.body;

  try {
    const existingLayout = await Layout.findOne({ userId });
    if (existingLayout) {
      existingLayout.elements = elements;
      await existingLayout.save();
      return res.status(200).json({ message: 'Layout updated successfully', layout: existingLayout });
    }

    const newLayout = new Layout({ userId, elements });
    await newLayout.save();
    res.status(201).json({ message: 'Layout created successfully', layout: newLayout });
  } catch (error) {
    res.status(500).json({ message: 'Error creating/updating layout', error });
  }
});

// *** שליפת סקיצה לפי userId ***
app.get('/layouts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const layout = await Layout.findOne({ userId });
    if (!layout) {
      return res.status(404).json({ message: 'No layout found for this user.' });
    }
    res.status(200).json(layout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching layout', error });
  }
});

// *** מחיקת סקיצה לפי userId ***
app.delete('/layouts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedLayout = await Layout.findOneAndDelete({ userId });
    if (!deletedLayout) {
      return res.status(404).json({ message: 'No layout found for this user.' });
    }
    res.status(200).json({ message: 'Layout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting layout', error });
  }
});


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
