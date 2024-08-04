import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from '../api';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setProfile(userProfile);
            } catch (err) {
                setError(err.message);
            }
        };

        getProfile();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
        </div>
    );
};

export default ProfilePage;
