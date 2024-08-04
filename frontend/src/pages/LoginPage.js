import React, { useState } from 'react';
// import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
            setEmail('');
            setPassword('');
            setError('');
            alert('User logged in successfully');
        } catch (error) {
            setError('Error logging in user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default LoginPage;
