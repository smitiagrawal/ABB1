import React, { useEffect, useState } from 'react';
import { fetchAuctions } from '../api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getAuctions = async () => {
            try {
                const data = await fetchAuctions();
                setAuctions(data);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

        getAuctions();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <div>
                {user ? (
                    <h2>Welcome, {user.email}</h2>
                ) : (
                    <h2>Please log in to add auctions and place bids.</h2>
                )}
            </div>
            <div>
                {auctions.map(auction => (
                    <div key={auction._id}>
                        <h2>{auction.title}</h2>
                        <p>{auction.description}</p>
                        <p>Starting Bid: ${auction.startingBid}</p>
                        <p>End Date: {new Date(auction.endDate).toLocaleDateString()}</p>
                        {/* Show bid history and current highest bid */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
