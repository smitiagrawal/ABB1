import React, { useEffect, useState } from 'react';
import { fetchAuctions } from '../api';
import { useAuth } from '../context/AuthContext';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const getAuctions = async () => {
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

        getAuctions();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    };

    const renderShimmer = () => (
        <Row>
            {Array.from({ length: 4 }).map((_, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3}>
                    <Card className="mb-4" style={{ height: '100%', width: '100%' }}>
                        <ContentLoader
                            speed={2}
                            width={200}
                            height={160}
                            viewBox="0 0 400 160"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100" />
                            <rect x="0" y="110" rx="5" ry="5" width="60%" height="10" />
                            <rect x="0" y="130" rx="5" ry="5" width="80%" height="10" />
                        </ContentLoader>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    return (
        <Container>
            <h1>Home Page</h1>
            <div>
                {user ? (
                    <h2>Welcome, {user.name}</h2>
                ) : (
                    <h2>Please log in to add auctions and place bids.</h2>
                )}
            </div>
            {loading && renderShimmer()}
            {error && (
                <Alert variant="danger" className="my-5">
                    {error}
                </Alert>
            )}
            {!loading && !error && (
                <Row>
                    {auctions.map(auction => (
                        <Col key={auction._id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="mb-4" style={{ height: '100%' }}>
                                <Card.Img variant="top" src={auction.image} alt={auction.title} />
                                <Card.Body>
                                    <Card.Title>{auction.title}</Card.Title>
                                    <Card.Text>
                                        {truncateText(auction.description, 10)}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Starting Bid: </strong>${auction.startingBid}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>End Date: </strong>{new Date(auction.endDate).toLocaleDateString()}
                                    </Card.Text>
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
