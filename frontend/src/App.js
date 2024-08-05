import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddAuctionPage from './pages/AddAuctionPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import UserAuctions from './pages/UserAuctions';
import AuctionDetailsPage from './pages/AuctionDetailsPage';
import BiddingHistoryPage from './pages/BiddingHistoryPage';
import UserBids from './pages/UserBids';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/add-auction" element={<AddAuctionPage />} />
                <Route path="/my-auctions" element={<UserAuctions />} />
                <Route path="/auction/:id" element={<AuctionDetailsPage />} />
                <Route path="/auction/:id/bids" element={<BiddingHistoryPage />} />
                <Route path="/bids" element={<UserBids />} />
            </Routes>
        </Router>
    );
};

export default App;
