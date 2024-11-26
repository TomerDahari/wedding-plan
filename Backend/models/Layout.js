const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  elements: [
    {
      id: { type: String, required: true },
      type: { type: String, enum: ['rectangle', 'circle'], required: true }, // סוג האובייקט
      x: { type: Number, required: true }, // מיקום x
      y: { type: Number, required: true }, // מיקום y
      width: { type: Number, required: true }, // רוחב
      height: { type: Number, required: true }, // גובה
      text: { type: String, default: '' }, // טקסט
    },
  ],
});

module.exports = mongoose.model('Layout', LayoutSchema);
