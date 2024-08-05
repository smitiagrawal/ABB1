import React, { useEffect, useState } from 'react';
import { getUserAuctions, updateAuction, deleteAuction } from '../api';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Alert, Button, Modal, Form } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        image: ''  // Added for image URL
    });
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                const data = await getUserAuctions();
                setAuctions(data);
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
        const endDate = new Date(auction.endDate);
        setEditingAuction(auction);
        setNewDetails({
            title: auction.title,
            description: auction.description,
            startingBid: auction.startingBid,
            endDate: formatDateForInput(endDate), // Convert to local time for the input
            image: auction.image  // Added for image URL
        });
        setShowEditModal(true);
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
        setLoading(true);
        setError('');
        try {
            const updatedEndDate = new Date(newDetails.endDate).toISOString(); // Convert to UTC for storage
            await updateAuction(editingAuction._id, { ...newDetails, endDate: updatedEndDate });
            setAuctions(auctions.map(auction =>
                auction._id === editingAuction._id ? { ...auction, ...newDetails, endDate: updatedEndDate } : auction
            ));
            setShowEditModal(false);
            setEditingAuction(null);
        } catch (error) {
            setError('Failed to update auction');
        }
        setLoading(false);
    };

    const formatDateForInput = (date) => {
        // Convert local date to the format expected by the input
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatUTCDateToLocal = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Adjust as needed for your locale
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
            <h1 className="my-4">Your Auctions</h1>
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
                            <Card className="mb-4 d-flex flex-column" style={{ width: '100%', height: '100%', maxWidth: '300px' }}>
                                <Card.Img 
                                    variant="top" 
                                    src={auction.image} 
                                    alt={auction.title} 
                                    style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        objectFit: 'cover' // Ensures the image covers the area without stretching
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
                                        <strong>End Date: </strong>{formatUTCDateToLocal(auction.endDate)}
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => handleEditClick(auction)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(auction._id)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            {editingAuction && (
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
                                    placeholder="Enter title"
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
                                    placeholder="Enter description"
                                    value={newDetails.description}
                                    onChange={(e) => setNewDetails({ ...newDetails, description: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formStartingBid">
                                <Form.Label>Starting Bid</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter starting bid"
                                    value={newDetails.startingBid}
                                    onChange={(e) => setNewDetails({ ...newDetails, startingBid: e.target.value })}
                                    required
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
                                    placeholder="Enter image URL"
                                    value={newDetails.image}
                                    onChange={(e) => setNewDetails({ ...newDetails, image: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Update Auction
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default UserAuctions;
