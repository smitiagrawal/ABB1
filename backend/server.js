const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auctionRoutes = require('./routes/auctionRoutes');
const userRoutes = require('./routes/userRoutes');
const bidRoutes = require('./routes/bidRoutes');
const dotenv = require('dotenv');
const { getAuctionsForUser } = require('./config/db'); // Adjust the path as necessary
const { protect } = require('./middleware/authMiddleware');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/api/auctions/user', protect, async (req, res) => {
    try {
        const userId = req.user.id; // This should now be defined
        const auctions = await getAuctionsForUser(userId);
        res.json(auctions);
    } catch (error) {
        console.error('Error fetching auctions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
app.use('/api/auctions', auctionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bids', bidRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
