import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuctionDetails, placeBid, getBiddingHistory } from '../api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Form, Alert, Row, Col, Modal, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuctionDetailsPage = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [bids, setBids] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctionDetails = async () => {
            try {
                const data = await getAuctionDetails(id);
                setAuction(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching auction details:', error);
                setError('Failed to fetch auction details. Please try again later.');
                setLoading(false);
            }
        };

        fetchAuctionDetails();
    }, [id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            setError('You must be logged in to place a bid.');
            return;
        }

        try {
            const response = await placeBid(id, Number(bidAmount));
            setAuction((prevAuction) => ({
                ...prevAuction,
                currentBid: response.currentBid
            }));
            setSuccess('Bid placed successfully');
            setBidAmount('');
        } catch (error) {
            console.error('Error placing bid:', error);
            setError('Failed to place bid. Please try again.');
        }
    };

    const isValidBid = () => {
        if (!auction) return false;
        const amount = parseFloat(bidAmount);
        return amount > auction.currentBid && amount > auction.startingBid;
    };

    const isAuctionClosed = () => {
        if (!auction || !auction.endDate) return false;
        return new Date(auction.endDate) < new Date();
    };

    const handleShowModal = async () => {
        try {
            const data = await getBiddingHistory(id);
            setBids(data.slice(0, 5));
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching bidding history:', error);
            setError('Failed to fetch bidding history. Please try again later.');
        }
    };

    const handleCloseModal = () => setShowModal(false);

    if (loading) return <Container>Loading...</Container>;

    if (error) return <Container>{error}</Container>;

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={8}>
                    <Card>
                        <Card.Img variant="top" src={auction.image} />
                        <Card.Body>
                            <Card.Title>{auction.title}</Card.Title>
                            <Card.Text>{auction.description}</Card.Text>
                            <Card.Text><strong>Starting Bid:</strong> ${auction.startingBid}</Card.Text>
                            <Card.Text><strong>Current Bid:</strong> ${auction.currentBid}</Card.Text>
                            <Card.Text><strong>End Date:</strong> {new Date(auction.endDate).toLocaleString()}</Card.Text>
                            <Button variant="info" onClick={handleShowModal}>View Bidding History</Button>
                            {user && !isAuctionClosed() && (
                                <Form onSubmit={handleBidSubmit} className="mt-4">
                                    <Form.Group controlId="formBidAmount">
                                        <Form.Label>Bid Amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            required
                                            isInvalid={bidAmount !== '' && !isValidBid()}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Bid must be higher than the current bid and starting bid.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="mt-2"
                                        disabled={!isValidBid()}
                                    >
                                        Place Bid
                                    </Button>
                                    {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                </Form>
                            )}
                            {user && isAuctionClosed() && (
                                <Alert variant="warning" className="mt-3">
                                    Bidding for this auction has ended.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bidding History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bids.length > 0 ? (
                        <ListGroup>
                            {bids.map((bid, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>Bid:</strong> ${bid.amount} - <strong>Date:</strong> {new Date(bid.date).toLocaleString()}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No bids found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => navigate(`/auction/${id}/bids`)}>
                        See More
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AuctionDetailsPage;
