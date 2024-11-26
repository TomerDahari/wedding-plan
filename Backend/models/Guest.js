const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  side: { type: String, required: true },
  additionalGuests: { type: Number, required: true, default: 0 },
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
