const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
  type: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('Transaction', Transaction);
