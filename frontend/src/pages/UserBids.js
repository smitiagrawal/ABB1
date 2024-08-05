import React, { useEffect, useState } from 'react';
import { Container, Card, ListGroup, ListGroupItem, Alert, Row, Col, Button } from 'react-bootstrap';
import ContentLoader from 'react-content-loader'; // Import ContentLoader
import { fetchUserBids } from '../api'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Define fixed dimensions and styles for the card and image
const cardStyle = {
  height: 'auto', // Auto height to accommodate content
  overflow: 'hidden', // Prevent content from overflowing
  marginBottom: '20px', // Add spacing between cards
  display: 'flex', // Flexbox for image and content alignment
};

const imageStyle = {
  width: '300px', // Fixed width for image
  height: '200px', // Fixed height for image
  objectFit: 'cover', // Cover the area without distorting the image
};

const contentStyle = {
  padding: '10px', // Fixed padding
  flex: 1, // Allow content to take up remaining space
};

// Truncate text to a specified length
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
    textAlign: 'right', // Align the text to the right
    flex: 1, // Allow the value to take up remaining space
  };

// Truncate text in a list item
const ListGroupItemFixed = ({ label, value }) => (
    <ListGroupItem style={listGroupItemStyle}>
      <span>{label}</span>
      <span style={listGroupItemValueStyle}>{value}</span>
    </ListGroupItem>
  );


const ShimmerLoader = () => (
  <Row className="g-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Col key={index} xs={12} sm={6} md={4} lg={3}>
        <Card className="mb-4" style={cardStyle}>
          <ContentLoader
            speed={2}
            width={1000}
            height={200}
            viewBox="0 0 1000 200"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{ width: '100%', height: '100%' }}
          >
            <rect x="0" y="0" rx="5" ry="5" width="300" height="200" />
            <rect x="310" y="10" rx="5" ry="5" width="60%" height="20" />
            <rect x="310" y="40" rx="5" ry="5" width="80%" height="15" />
            <rect x="310" y="60" rx="5" ry="5" width="40%" height="15" />
            <rect x="310" y="80" rx="5" ry="5" width="90%" height="15" />
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
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true); // Set loading state to true when starting fetch
        const data = await fetchUserBids();
        setBids(data);
        setLoading(false); // Set loading state to false when fetch completes
      } catch (error) {
        setError('Error fetching bids. Please try again later.');
        console.error('Error fetching bids:', error);
        setLoading(false); // Ensure loading is set to false even if there's an error
      }
    };

    fetchBids();
  }, []);

  const handleViewItem = (auctionId) => {
    navigate(`/auction/${auctionId}`); // Navigate to auction detail page
  };

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
      <h2>My Bids</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {bids.length > 0 ? (
        <Row className="g-4">
          {bids.map(bid => (
            bid.auction && ( // Ensure auction is defined
              <Col key={bid._id} xs={12} sm={6} md={4} lg={3} xl={3}> {/* Adjust column size based on screen size */}
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
                    <Card.Header>{bid.auction.title}</Card.Header>
                    <Card.Text>{truncateText(bid.auction.description, 20)}</Card.Text>
                    <ListGroup className="list-group-flush">
                      <ListGroupItemFixed 
                        label="Starting Bid:" 
                        value={`$${bid.auction.startingBid}`} 
                      />
                      <ListGroupItemFixed 
                        label="End Date:" 
                        value={new Date(bid.auction.endDate).toLocaleString()} 
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
