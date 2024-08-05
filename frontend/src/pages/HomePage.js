import React, { useEffect, useState } from 'react';
import { fetchAuctions } from '../api';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

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
            <h1 className="my-4">Upcoming Auctions</h1>
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
                                    {user && (
                                        <Button variant="info" className="mt-auto">View Details</Button>
                                    )}
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
