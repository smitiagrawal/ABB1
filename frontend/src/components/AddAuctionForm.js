import React, { useState } from 'react';
import axios from 'axios';

const AddAuctionForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auctions', {
                title,
                description,
                startingBid,
                endDate,
            });
            setTitle('');
            setDescription('');
            setStartingBid('');
            setEndDate('');
            setError('');
            alert('Auction item added successfully');
        } catch (error) {
            setError('Error adding auction item');
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
            {error && <p>{error}</p>}
        </form>
    );
};

export default AddAuctionForm;
