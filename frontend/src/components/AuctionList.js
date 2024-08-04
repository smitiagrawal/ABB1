import React from 'react';

const AuctionList = ({ auctions }) => {
    return (
        <div>
            {auctions.length === 0 ? (
                <p>No auctions available</p>
            ) : (
                <ul>
                    {auctions.map((auction) => (
                        <li key={auction._id}>
                            <h2>{auction.title}</h2>
                            <p>{auction.description}</p>
                            <p>Starting Bid: ${auction.startingBid}</p>
                            <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AuctionList;
