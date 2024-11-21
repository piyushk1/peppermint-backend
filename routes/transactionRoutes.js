const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Add a new Transaction (Income or Expense)
router.post('/', async (req, res) => {
  try {
    const { type, date, description, amount } = req.body;
    const transaction = new Transaction({ type, date, description, amount });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Transaction by ID
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the Net Balance (Income - Expense)
router.get('/balance', async (req, res) => {
  try {
    const income = await Transaction.aggregate([
      { $match: { type: 'Income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({ netBalance: totalIncome - totalExpense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
