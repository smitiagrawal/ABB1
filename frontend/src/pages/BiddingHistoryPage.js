import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBiddingHistory } from '../api';
import { Container, ListGroup, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BiddingHistoryPage = () => {
    const { id } = useParams();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBiddingHistory = async () => {
            try {
                const data = await getBiddingHistory(id);
                setBids(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bidding history:', error);
                setError('Failed to fetch bidding history. Please try again later.');
                setLoading(false);
            }
        };

        fetchBiddingHistory();
    }, [id]);

    if (loading) return <Container>Loading...</Container>;

    if (error) return <Container>{error}</Container>;

    return (
        <Container>
            <h1 className="my-4">Bidding History</h1>
            <ListGroup>
                {bids.map((bid, index) => (
                    <ListGroup.Item key={index}>
                        <strong>User:</strong> {bid.user.username} - <strong>Bid:</strong> ${bid.amount} - <strong>Date:</strong> {new Date(bid.date).toLocaleString()}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default BiddingHistoryPage;
