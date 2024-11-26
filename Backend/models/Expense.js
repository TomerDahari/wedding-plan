const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 }, // ברירת מחדל של 1
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
