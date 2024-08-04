import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addAuction } from '../api';

const AddAuctionPage = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [endDate, setEndDate] = useState('');

    if (!user) {
        return <p>You must be logged in to add auctions.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAuction({ title, description, startingBid, endDate });
            setTitle('');
            setDescription('');
            setStartingBid('');
            setEndDate('');
            alert('Auction added successfully');
        } catch (error) {
            console.error('Error adding auction:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Description:
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Starting Bid:
                <input type="number" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} />
            </label>
            <label>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <button type="submit">Add Auction</button>
        </form>
    );
};

export default AddAuctionPage;
