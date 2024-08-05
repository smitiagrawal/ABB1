import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Dropdown, Alert, Container, Row, Col } from 'react-bootstrap';
import { fetchUserProfile, updateUserProfile } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updateType, setUpdateType] = useState(null); // 'name', 'email', 'password'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Add confirmPassword
        currentPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setProfile(userProfile);
                setFormData({
                    name: userProfile.name,
                    email: userProfile.email,
                    password: '',
                    confirmPassword: '', // Reset confirmPassword
                    currentPassword: '',
                });
            } catch (err) {
                setError(err.message);
            }
        };

        getProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        try {
            // Validate current password for all updates
            if (!formData.currentPassword) {
                alert('Current password is required.');
                return;
            }

            // Validate password if updating it
            if (updateType === 'password') {
                if (!validatePassword(formData.password)) {
                    alert('Password does not meet the criteria');
                    return;
                }
                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
            }

            // Send request to update profile
            await updateUserProfile(formData);

            // Refetch the profile and update state
            const updatedProfile = await fetchUserProfile();
            setProfile(updatedProfile);

            // Update success state and close modal
            setSuccess('Profile updated successfully!');
            setShowModal(false);
            clearFormData();
        } catch (err) {
            let message = 'An error occurred. Please try again later.';

            // Log the error response for debugging
            console.error('Error response:', err.response);

            if (err.response && err.response.data && err.response.data.message) {
                message = err.response.data.message;

                // Check for specific messages and alert accordingly
                if (message.includes('Email already exists')) {
                    alert('Email already exists. Please use a different email address.');
                } else if (message.includes('Invalid email')) {
                    alert('The provided email is invalid. Please enter a valid email address.');
                } else if (message.includes('Invalid current password')) {
                    alert('The current password you entered is incorrect. Please try again.');
                } else {
                    // For other messages, show a generic alert
                    alert(message);
                }
            } else {
                // Handle unexpected errors or no message case
                alert(message);
            }

            setError(message);
        }
    };

    const clearFormData = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '', // Clear confirmPassword
            currentPassword: '',
        });
        setUpdateType(null);
    };

    const handleModalClose = () => {
        setShowModal(false);
        clearFormData();
    };

    const isUpdateButtonDisabled = () => {
        // Check if currentPassword is filled
        if (!formData.currentPassword) return true;

        // Check if required fields are filled based on update type
        if (updateType === 'name') {
            return !formData.name;
        } else if (updateType === 'email') {
            return !formData.email;
        } else if (updateType === 'password') {
            return !formData.password || !validatePassword(formData.password) || formData.password !== formData.confirmPassword;
        }

        // Disable button if no update type is selected
        return true;
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

    const passwordCriteria = checkPasswordCriteria(formData.password);

    return (
        <Container>
            <h1 className="my-4">Profile</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row className="mb-4">
                <Col md={6}>
                    <div className="border p-4 rounded shadow-sm">
                        <p><strong>Name:</strong> {profile?.name}</p>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        <Button variant="primary" onClick={() => setShowModal(true)}>Edit Profile</Button>
                    </div>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown className="mb-3">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Update Type
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setUpdateType('name')}>Update Name</Dropdown.Item>
                            <Dropdown.Item onClick={() => setUpdateType('email')}>Update Email</Dropdown.Item>
                            <Dropdown.Item onClick={() => setUpdateType('password')}>Update Password</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {updateType && (
                        <Form>
                            <Form.Group controlId="formCurrentPassword">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter your current password"
                                />
                            </Form.Group>

                            {updateType === 'name' && (
                                <Form.Group controlId="formName">
                                    <Form.Label>New Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter new name"
                                    />
                                </Form.Group>
                            )}

                            {updateType === 'email' && (
                                <Form.Group controlId="formEmail">
                                    <Form.Label>New Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter new email"
                                    />
                                </Form.Group>
                            )}

                            {updateType === 'password' && (
                                <>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter new password"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formConfirmPassword">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Re-enter new password"
                                        />
                                    </Form.Group>
                                    <Form.Text className="text-muted">
                                        Your password should be at least 8 characters long and contain:
                                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
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
                                                At least one special character
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ width: 20, marginRight: 5 }}>
                                                    <FontAwesomeIcon
                                                        icon={passwordCriteria.hasMinLength ? faCheck : faTimes}
                                                        style={{ color: passwordCriteria.hasMinLength ? 'green' : 'red' }}
                                                    />
                                                </span>
                                                At least 8 characters
                                            </div>
                                        </div>
                                    </Form.Text>
                                </>
                            )}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateProfile}
                        disabled={isUpdateButtonDisabled()}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProfilePage;
