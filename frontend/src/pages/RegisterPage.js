import React, { useState } from 'react';
import { registerUser } from '../api';
// import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ name, email, password });
            setName('');
            setEmail('');
            setPassword('');
            setError('');
            alert('User registered successfully');
        } catch (error) {
            setError('Error registering user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default RegisterPage;
