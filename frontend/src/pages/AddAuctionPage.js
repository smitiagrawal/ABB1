import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addAuction } from '../api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddAuctionPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [bidError, setBidError] = useState(false);

  if (!user) {
    return <Container><p>You must be logged in to add auctions.</p></Container>;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setBidError(false);
    try {
      if (startingBid < 0) {
        setBidError(true);
        setLoading(false);
        return;
      }
      await addAuction({ title, description, startingBid, endDate });
      setTitle('');
      setDescription('');
      setStartingBid(0);
      setEndDate('');
      setSuccess('Auction added successfully');
    } catch (error) {
      console.error('Error adding auction:', error);
      setError('Error adding auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBidChange = (e) => {
    const value = e.target.valueAsNumber;
    setStartingBid(value);
    if (value < 0) {
      setBidError(true);
    } else {
      setBidError(false);
    }
  };

  const handleClearForm = () => {
    setTitle('');
    setDescription('');
    setStartingBid(0);
    setEndDate('');
  };

  const isFormValid = () => {
    return (
      title.trim()!== '' &&
      description.trim()!== '' &&
      startingBid > 0 &&
      endDate.trim()!== ''
    );
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={5}>
          <h2 className="mb-4">Add an item for auction</h2>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {bidError && <Alert variant="warning">Bid amount cannot be negative.</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 150))}
                required
              />
              <div style={{ textAlign: 'right', fontSize: 12 }}>{description.length}/150</div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartingBid">
              <Form.Label>Starting Bid</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter starting bid"
                value={startingBid}
                onChange={handleBidChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter end date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={!isFormValid() || loading}>
              {loading? 'Adding...' : 'Add Item to Auction'}
            </Button>
            <Button variant="secondary" type="button" onClick={handleClearForm} className="ms-2">
              Clear Form
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddAuctionPage;