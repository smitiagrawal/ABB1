import React, { useState } from 'react';
import { registerUser } from '../api';
// import { useAuth } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, password });
            setName('');
            setEmail('');
            setPassword('');
            setError('');
            alert('User registered successfully');
            navigate('/'); // Navigate to the homepage

        } catch (error) {
            setError('Error registering user');
        }
    };

    return (
        // <form onSubmit={handleSubmit}>
        //     <label>Name:
        //         <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        //     </label>
        //     <label>Email:
        //         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        //     </label>
        //     <label>Password:
        //         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        //     </label>
        //     <button type="submit">Register</button>
        //     {error && <p>{error}</p>}
        // </form>
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2 className="mb-4">Register</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
