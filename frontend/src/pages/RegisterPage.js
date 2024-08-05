import React, { useState } from 'react';
import { registerUser } from '../api';
import { useAuth as useLogin } from '../context/AuthContext';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validatePassword(password)) {
                setError('Password does not meet the criteria');
                return;
            }
            await registerUser({ name, email, password });
            setName('');
            setEmail('');
            setPassword('');
            setError('');
            alert('User registered successfully');
            await login({ email, password });
            navigate('/');
        } catch (error) {
            setError('Error registering user');
        }
    };

    const isFormValid = () => {
        return name !== '' && email !== '' && password !== '';
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const checkPasswordCriteria = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        const hasMinLength = password.length >= 8;
        return {
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            hasMinLength,
        };
    };

    const passwordCriteria = checkPasswordCriteria(password);

    return (
        <Container className="auth-container h-100">
            <Row className="justify-content-start align-items-center h-100">
                <Col md={6} lg={4} className="ml-0">
                    <div className="auth-card">
                        <h2 className="my-4">Sign Up</h2>
                        <p style={{ fontSize: 14, color: 'grey', marginTop: -15 }}>
                            New Bidders, as soon as you have submitted your information you will be eligible to bid in the auction.
                        </p>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Group>
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
                                <Form.Text style={{ fontSize: 12 }} className="text-muted">
                                    Your password should be at least 8 characters long and contain:
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 20, marginRight: 5 }}>
                                            <FontAwesomeIcon
                                                icon={passwordCriteria.hasUppercase ? faCheck : faTimes}
                                                style={{ color: passwordCriteria.hasUppercase ? 'green' : 'red' }}
                                            />
                                        </span>
                                        At least one uppercase letter
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 20, marginRight: 5 }}>
                                            <FontAwesomeIcon
                                                icon={passwordCriteria.hasLowercase ? faCheck : faTimes}
                                                style={{ color: passwordCriteria.hasLowercase ? 'green' : 'red' }}
                                            />
                                        </span>
                                        At least one lowercase letter
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 20, marginRight: 5 }}>
                                            <FontAwesomeIcon
                                                icon={passwordCriteria.hasNumber ? faCheck : faTimes}
                                                style={{ color: passwordCriteria.hasNumber ? 'green' : 'red' }}
                                            />
                                        </span>
                                        At least one number
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 20, marginRight: 5 }}>
                                            <FontAwesomeIcon
                                                icon={passwordCriteria.hasSpecialChar ? faCheck : faTimes}
                                                style={{ color: passwordCriteria.hasSpecialChar ? 'green' : 'red' }}
                                            />
                                        </span>
                                        At least one special character (@, $,!, %, *,?, &)
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ width: 20, marginRight: 5 }}>
                                            <FontAwesomeIcon
                                                icon={passwordCriteria.hasMinLength ? faCheck : faTimes}
                                                style={{ color: passwordCriteria.hasMinLength ? 'green' : 'red' }}
                                            />
                                        </span>
                                        At least 8 characters long
                                    </div>
                                </Form.Text>
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={!isFormValid()}
                            >
                                Register
                            </Button>
                        </Form>
                        <div className="mt-3 text-center">
                            <p style={{ fontSize: 12, color: 'grey' }}>
                                Already have an account? <Link to="/login">Log in here</Link>.
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
