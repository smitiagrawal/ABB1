import React, { useEffect, useState } from 'react';
import { fetchAuctions } from '../api';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllAuctions = async () => {
            try {
                const data = await fetchAuctions();
                setAuctions(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching auctions:', error);
                setError('Failed to fetch auctions. Please try again later.');
                setLoading(false);
            }
        };

        fetchAllAuctions();
    }, []);

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
                            <rect x="5" y="130" rx="5" ry="5" width="60%" height="20" />
                            <rect x="5" y="160" rx="5" ry="5" width="80%" height="15" />
                            <rect x="5" y="185" rx="5" ry="5" width="40%" height="15" />
                        </ContentLoader>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    const handleViewDetails = (auctionId) => {
        if (!user) {
            setAlertMessage(
                <>
                    You need to be logged in to view auction details.{' '}
                    <Link to="/login">Go to Login</Link>
                </>
            );
        } else {
            navigate(`/auction/${auctionId}`);
        }
    };

    return (
        <Container>
            <h1 className="mt-3">Auctions</h1>
            {loading ? (
                renderShimmer()
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : auctions.length === 0 ? (
                <Alert variant="info">No auctions available.</Alert>
            ) : (
                <Row className="g-4">
                    {alertMessage && (
                        <Alert variant="warning" className="mb-3">
                            {alertMessage}
                        </Alert>
                    )}
                    {auctions.map((auction) => (
                        <Col key={auction._id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="mb-4">
                                <Card.Img
                                    variant="top"
                                    src={auction.image}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{auction.title}</Card.Title>
                                    <Card.Text>
                                        {truncateText(auction.description, 20)}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Start Bid:</strong> ${auction.startingBid} <br />
                                        <strong>Current Bid:</strong> ${auction.currentBid} <br />
                                        <strong>End Date:</strong> {formatUTCDateToLocal(auction.endDate)}
                                    </Card.Text>
                                    <Button
                                        style={{ backgroundColor: user ? '#007bff' : '#6c757d', borderColor: user ? '#007bff' : '#6c757d' }}
                                        onClick={() => handleViewDetails(auction._id)}
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default HomePage;
