import React, { useEffect, useState } from 'react';
import { getUserAuctions, updateAuction, deleteAuction, getBiddingHistory } from '../api'; // Adjust the import path as necessary
import { Card, Container, Row, Col, Alert, Button, Modal, Form, ListGroup, Badge } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import 'bootstrap/dist/css/bootstrap.min.css';

// Helper function to check if an auction is open
const isAuctionOpen = (endDate) => {
    return endDate && new Date(endDate) >= new Date();
};

// Helper function to check if an auction is closed
const isAuctionClosed = (endDate) => {
    return endDate && new Date(endDate) < new Date();
};

// Sort auctions: open first, then closed
const sortAuctions = (auctions) => {
    return auctions.sort((a, b) => {
        const aIsOpen = isAuctionOpen(a.endDate);
        const bIsOpen = isAuctionOpen(b.endDate);
        if (aIsOpen && !bIsOpen) return -1;
        if (!aIsOpen && bIsOpen) return 1;
        return 0;
    });
};

const UserAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingAuction, setEditingAuction] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newDetails, setNewDetails] = useState({
        title: '',
        description: '',
        startingBid: 0,
        endDate: '',
        image: '',
    });
    const [showBiddingHistoryModal, setShowBiddingHistoryModal] = useState(false);
    const [currentBiddingHistory, setCurrentBiddingHistory] = useState([]);

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                const data = await getUserAuctions();
                console.log('Fetched Auctions:', data);
                setAuctions(sortAuctions(data));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user auctions:', error);
                setError('Failed to fetch your auctions. Please try again later.');
                setLoading(false);
            }
        };
        fetchUserAuctions();
    }, []);

    const handleEditClick = (auction) => {
        if (auction) {
            const endDate = new Date(auction.endDate);
            setEditingAuction(auction);
            setNewDetails({
                title: auction.title,
                description: auction.description,
                startingBid: auction.startingBid,
                endDate: formatDateForInput(endDate),
                image: auction.image,
            });
            setShowEditModal(true);
        }
    };

    const handleDeleteClick = async (auctionId) => {
        if (window.confirm('Are you sure you want to delete this auction?')) {
            setLoading(true);
            setError('');
            try {
                await deleteAuction(auctionId);
                setAuctions(auctions.filter(auction => auction._id !== auctionId));
            } catch (error) {
                setError('Failed to delete auction');
            }
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingAuction) return; // Guard clause
        setLoading(true);
        setError('');
        try {
            const updatedEndDate = new Date(newDetails.endDate).toISOString();
            await updateAuction(editingAuction._id, { ...newDetails, endDate: updatedEndDate });
            setAuctions(sortAuctions(auctions.map(auction =>
                auction._id === editingAuction._id ? { ...auction, ...newDetails, endDate: updatedEndDate } : auction
            )));
            setShowEditModal(false);
            setEditingAuction(null);
        } catch (error) {
            setError('Failed to update auction');
        }
        setLoading(false);
    };

    const handleViewBiddingHistory = async (auctionId) => {
        try {
            const history = await getBiddingHistory(auctionId);
            setCurrentBiddingHistory(history);
            setShowBiddingHistoryModal(true);
        } catch (error) {
            console.error('Error fetching bidding history:', error);
            setError('Failed to fetch bidding history. Please try again later.');
        }
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatUTCDateToLocal = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    const renderShimmer = () => (
        <Row className="g-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="mb-4" style={{ width: '100%', height: '100%' }}>
                        <ContentLoader
                            speed={2}
                            width={300}
                            height={200}
                            viewBox="0 0 300 200"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                            style={{ width: '100%', height: '100%' }}
                        >
                            <rect x="5" y="0" rx="5" ry="5" width="100%" height="120" />
                            <rect x="5" y="130" rx="5" ry="5" width="100%" height="20" />
                            <rect x="5" y="160" rx="5" ry="5" width="100%" height="20" />
                        </ContentLoader>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <Container>
            <h1 className="my-4">My Auctions</h1>
            {loading && renderShimmer()}
            {error && (
                <Alert variant="danger" className="my-5">
                    {error}
                </Alert>
            )}
            {!loading && !error && (
                <Row className="g-4">
                    {auctions.map(auction => (
                        <Col key={auction._id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="mb-4 d-flex flex-column" style={{ width: '100%', height: '100%', maxWidth: '300px', position: 'relative' }}>
                                {isAuctionOpen(auction.endDate) && (
                                    <Badge bg="success" className="position-absolute top-0 start-0">
                                        Open
                                    </Badge>
                                )}
                                {isAuctionClosed(auction.endDate) && (
                                    <Badge bg="danger" className="position-absolute top-0 start-0">
                                        Closed
                                    </Badge>
                                )}
                                <Card.Img
                                    variant="top"
                                    src={auction.image}
                                    alt={auction.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{auction.title}</Card.Title>
                                    <Card.Text className="flex-fill">
                                        {truncateText(auction.description, 20)}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Starting Bid: </strong>${auction.startingBid}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Current Bid: </strong>${auction.currentBid}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>End Date: </strong>{formatUTCDateToLocal(auction.endDate)}
                                    </Card.Text>
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleEditClick(auction)}
                                        disabled={isAuctionClosed(auction.endDate)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => handleDeleteClick(auction._id)} 
                                        className="mt-2"
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        variant="info" 
                                        onClick={() => handleViewBiddingHistory(auction._id)} 
                                        className="mt-2"
                                    >
                                        View Bidding History
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Auction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newDetails.title}
                                onChange={(e) => setNewDetails({ ...newDetails, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newDetails.description}
                                onChange={(e) => setNewDetails({ ...newDetails, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formStartingBid">
                            <Form.Label>Starting Bid</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={newDetails.startingBid}
                                onChange={(e) => setNewDetails({ ...newDetails, startingBid: parseFloat(e.target.value) })}
                                required
                                disabled={editingAuction && editingAuction.currentBid > 0} // Disable if current bid exists
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newDetails.endDate}
                                onChange={(e) => setNewDetails({ ...newDetails, endDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                value={newDetails.image}
                                onChange={(e) => setNewDetails({ ...newDetails, image: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3" disabled={isAuctionClosed(newDetails.endDate)}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showBiddingHistoryModal} onHide={() => setShowBiddingHistoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Bidding History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentBiddingHistory.length > 0 ? (
                        <ListGroup>
                            {currentBiddingHistory.map((bid, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>Bid Amount:</strong> ${bid.amount}<br />
                                    <strong>Date:</strong> {formatUTCDateToLocal(bid.date)}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <Alert variant="info">No bids placed yet.</Alert>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default UserAuctions;
