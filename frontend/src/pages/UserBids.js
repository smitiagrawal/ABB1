import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, ListGroupItem, Alert, Row, Col, Button, Badge } from 'react-bootstrap';
import ContentLoader from 'react-content-loader';
import { fetchUserBids } from '../api';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  height: 'auto',
  overflow: 'hidden',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const contentStyle = {
  padding: '10px',
  flex: 1,
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

const listGroupItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
const listGroupItemValueStyle = {
  textAlign: 'right',
  flex: 1,
};

const ListGroupItemFixed = ({ label, value }) => (
  <ListGroupItem style={listGroupItemStyle}>
    <span>{label}</span>
    <span style={listGroupItemValueStyle}>{value}</span>
  </ListGroupItem>
);

const ShimmerLoader = () => (
  <Row className="g-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Col key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
        <Card className="mb-4" style={cardStyle}>
          <ContentLoader
            speed={2}
            width={300}
            height= 'auto'
            viewBox="0 0 300 500"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{ width: '100%', height: '100%' }}
          >
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="200" />
            <rect x="10" y="210" rx="5" ry="5" width="70%" height="30" />
            <rect x="10" y="250" rx="5" ry="5" width="80%" height="15" />
            <rect x="10" y="300" rx="5" ry="5" width="80%" height="15" />
            <rect x="10" y="330" rx="5" ry="5" width="80%" height="15" />
            <rect x="10" y="360" rx="5" ry="5" width="90%" height="15" />
            <rect x="10" y="390" rx="5" ry="5" width="90%" height="15" />
            <rect x="10" y="450" rx="5" ry="5" width="30%" height="35" />

          </ContentLoader>
        </Card>
      </Col>
    ))}
  </Row>
);


const UserBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const data = await fetchUserBids();
        setBids(data);
        setLoading(false); //make this true to see loading state.
      } catch (error) {
        setError('Error fetching bids. Please try again later.');
        console.error('Error fetching bids:', error);
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const handleViewItem = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  const isAuctionOpen = (endDate) => {
    return endDate && new Date(endDate) >= new Date();
  };

  const isAuctionClosed = (endDate) => {
    return endDate && new Date(endDate) < new Date();
  };

  const latestBids = bids.reduce((acc, bid) => {
    if (bid.auction && bid.auction._id) {
      const auctionId = bid.auction._id;
      if (!acc[auctionId] || new Date(bid.date) > new Date(acc[auctionId].date)) {
        acc[auctionId] = bid;
      }
    }
    return acc;
  }, {});

  const sortedBids = Object.values(latestBids)
    .sort((a, b) => {
      const aEndDate = a.auction.endDate ? new Date(a.auction.endDate) : new Date();
      const bEndDate = b.auction.endDate ? new Date(b.auction.endDate) : new Date();
      const aIsOpen = isAuctionOpen(aEndDate);
      const bIsOpen = isAuctionOpen(bEndDate);

      if (aIsOpen && !bIsOpen) {
        return -1;
      }
      if (!aIsOpen && bIsOpen) {
        return 1;
      }
      return 0;
    });

  if (loading) {
    return (
      <Container>
        <h2>My Bids</h2>
        <ShimmerLoader />
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="my-4">My Bids</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {sortedBids.length > 0 ? (
        <Row className="g-4">
          {sortedBids.map(bid => (
            bid.auction && (
              <Col key={bid._id} xs={12} sm={6} md={4} lg={3} xl={3}>
                <Card className="mb-4" style={cardStyle}>
                  {bid.auction.image && (
                    <Card.Img
                      variant="top"
                      src={bid.auction.image}
                      alt={bid.auction.title}
                      style={imageStyle}
                    />
                  )}
                  <Card.Body style={contentStyle}>
                    {isAuctionOpen(bid.auction.endDate) && (
                      <Badge bg="success" className="position-absolute top-0 start-0">
                        Open
                      </Badge>
                    )}
                    {isAuctionClosed(bid.auction.endDate) && (
                      <Badge bg="danger" className="position-absolute top-0 start-0">
                        Closed
                      </Badge>
                    )}
                    <Card.Header>{bid.auction.title}</Card.Header>
                    <Card.Text>{truncateText(bid.auction.description, 20)}</Card.Text>
                    <ListGroup className="list-group-flush">
                      <ListGroupItemFixed
                        label="Starting Bid:"
                        value={`$${bid.auction.startingBid}`}
                      />
                      <ListGroupItemFixed
                        label="End Date:"
                        value={bid.auction.endDate ? new Date(bid.auction.endDate).toLocaleString() : 'N/A'}
                      />
                      <ListGroupItemFixed
                        label="Your Bid:"
                        value={`$${bid.amount}`}
                      />
                      <ListGroupItemFixed
                        label="Current Bid:"
                        value={`$${bid.auction.currentBid}`}
                      />
                    </ListGroup>
                    <Button
                      variant="primary"
                      onClick={() => handleViewItem(bid.auction._id)}
                      style={{ marginTop: '10px' }}
                    >
                      View Item
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          ))}
        </Row>
      ) : (
        <p>No bids found.</p>
      )}
    </Container>
  );
};

export default UserBids;
