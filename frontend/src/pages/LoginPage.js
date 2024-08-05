import React, { useState } from 'react';
import { loginUser } from '../api';
import { useAuth as useLogin } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            setEmail('');
            setPassword('');
            setError('');
            navigate('/'); // Navigate to the dashboard
        } catch (error) {
            setError('Error logging in');
        }
    };

    const isFormValid = () => {
        return email !== '' && password !== '';
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container className="auth-container h-100">
            <Row className="justify-content-start align-items-center h-100">
                <Col md={6} lg={4} className="ml-0">
                    <div className="auth-card">
                        <h2 className="my-4">Log In</h2>
                        <p style={{ fontSize: 12, color: 'grey', marginTop: -15 }}>
                            Welcome back! Enter your login credentials to access your account
                        </p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Form.Text style={{ fontSize: 12 }} className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <div className="password-input" style={{ position: 'relative' }}>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            paddingRight: 40, // Add some padding to make room for the eye icon
                                            boxSizing: 'border-box', // Ensure the padding is included in the width
                                        }}
                                    />
                                    <span
                                        className="password-eye"
                                        onClick={handleShowPassword}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: '50%', // Adjust the top position to align with the input field
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            zIndex: 1, // Ensure the eye icon is on top of the input field
                                        }}
                                    >
                                        {showPassword ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </span>
                                </div>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={!isFormValid()}
                            >
                                Log In
                            </Button>
                        </Form>
                        <div className="mt-3 text-center">
                            <p style={{ fontSize: 12, color: 'grey'}}>
                                Don't have an account? <Link to="/register">Sign up here</Link>.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
