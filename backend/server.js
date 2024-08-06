const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auctionRoutes = require('./routes/auctionRoutes');
const userRoutes = require('./routes/userRoutes');
const bidRoutes = require('./routes/bidRoutes');
const dotenv = require('dotenv');
const swaggerDocs = require('./swagger');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/api/auctions', auctionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bids', bidRoutes);

swaggerDocs(app);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
