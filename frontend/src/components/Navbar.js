import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavigationBar = () => {
    const { user, logout } = useAuth();
    const navStyle = {
        marginLeft: 'auto',
    };

    return (
        <Navbar style={{
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 50,
            paddingRight: 50,
            backgroundColor: "pink",
            color: 'black',

        }}>
            <Navbar.Brand href="/" >Genix Auctions</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={navStyle} >
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Nav.Link as={Link} to="/add-auction">Create Auction</Nav.Link>
                            <Nav.Link as={Link} to="/my-auctions">My Auctions</Nav.Link>
                            <Button variant="outline-danger" onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/login" style={{
                                color: 'blue',
                            }}>Login</Nav.Link>
                            {/* <Nav.Link as={Link} to="/register">Register</Nav.Link> */}
                            <Button style={{
                                background: 'linear-gradient(45deg, #4d3f8c, #00f2fe)',
                                color: 'white',
                                border: 'none',
                            }} as={Link} to="/register">Get Stared</Button>

                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
