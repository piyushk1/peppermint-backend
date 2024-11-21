const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();
const { check, validationResult } = require("express-validator");

// Add Transaction
router.post(
  "/",
  [
    check("type").isIn(["Income", "Expense"]).withMessage("Invalid type"),
    check("date").isISO8601().withMessage("Invalid date"),
    check("description").notEmpty().withMessage("Description is required"),
    check("amount").isFloat({ gt: 0 }).withMessage("Amount must be positive"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const transaction = new Transaction(req.body);
      await transaction.save();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);


// Get All Transaction
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Transaction
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Balance
router.get("/balance", async (req, res) => {
  try {
    const income = await Transaction.aggregate([
      { $match: { type: "Income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expense = await Transaction.aggregate([
      { $match: { type: "Expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({ netBalance: totalIncome - totalExpense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
