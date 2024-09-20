const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Middleware to parse incoming JSON
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" folder

// MongoDB connection string (update with your credentials)
const mongoURI = 'mongodb+srv://shifub:kaka@cluster0.md4ff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Order schema and model
const orderSchema = new mongoose.Schema({
    drinks: Object,
    totalAmount: Number,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Route to handle the order submission
app.post('/submit-order', async (req, res) => {
    const { drinks, totalAmount } = req.body;

    // Create a new order and save it to the database
    const newOrder = new Order({ drinks, totalAmount });
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json({ message: 'Order submitted successfully', order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit order', error });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

