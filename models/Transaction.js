const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Income", "Expense"], 
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be positive"],
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
