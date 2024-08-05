import React, { useEffect, useState } from 'react';
import { getUserAuctions } from '../api'; // Import the function to fetch user auctions

const UserAuctionsPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                const data = await getUserAuctions();
                setAuctions(data);
            } catch (error) {
                console.error('Error fetching user auctions:', error); // Log the full error
                setError('Failed to fetch user auctions');
            } finally {
                setLoading(false);
            }
        };

        fetchUserAuctions();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Your Auctions</h1>
            {auctions.length === 0 ? (
                <p>You have no auctions.</p>
            ) : (
                <ul>
                    {auctions.map((auction) => (
                        <li key={auction._id}>
                            <h2>{auction.title}</h2>
                            <p>{auction.description}</p>
                            <p>Starting Bid: {auction.startingBid}</p>
                            <p>End Date: {new Date(auction.endDate).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserAuctionsPage;
