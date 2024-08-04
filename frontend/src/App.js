import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddAuctionPage from './pages/AddAuctionPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import UserAuctionsPage from './pages/UserAuctions';
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path='/add-auction' element={<AddAuctionPage/>}/>
                <Route path="/my-auctions" element={<UserAuctionsPage />} />

            </Routes>
        </Router>
    );
};

export default App;
