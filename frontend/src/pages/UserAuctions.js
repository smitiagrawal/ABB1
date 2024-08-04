import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserAuctionsPage = () => {
    const { user } = useAuth();
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                const response = await axios.get('/api/auctions/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setAuctions(response.data);
            } catch (error) {
                console.error('Error fetching user auctions:', error);
            }
        };

        if (user) {
            fetchUserAuctions();
        }
    }, [user]);

    if (!user) {
        return <p>You must be logged in to view your auctions.</p>;
    }

    return (
        <div>
            <h2>Your Auctions</h2>
            {auctions.length > 0 ? (
                <ul>
                    {auctions.map((auction) => (
                        <li key={auction._id}>
                            <h3>{auction.title}</h3>
                            <p>{auction.description}</p>
                            <p>Starting Bid: ${auction.startingBid}</p>
                            <p>End Date: {new Date(auction.endDate).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not created any auctions yet.</p>
            )}
        </div>
    );
};

export default UserAuctionsPage;
