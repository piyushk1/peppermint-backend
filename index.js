const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactionRoutes');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET, POST, PUT, DELETE', 
  allowedHeaders: 'Content-Type, Authorization' 
}));
app.use(express.json()); 


const mongoURI = "mongodb+srv://admin:admin@peppermint.wcomh.mongodb.net/"; 

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));


app.use('/api/transactions', transactionRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
