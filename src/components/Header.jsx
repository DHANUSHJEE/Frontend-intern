import React, { useEffect, useState } from 'react';
import { Button } from 'antd'; // For logout button
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import '../styles/Header.css'

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user data from local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.user) {
            setUser(userData.user);
        }
    }, []);

    const handleLogout = () => {
        // Remove the user data from localStorage on logout
        localStorage.removeItem('user');
        message.success("Logged out successfully!");
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="header">
            <div className="title">EMPLOYEE MANAGEMENT</div>
            <div className="user-section">
                {user ? (
                    <>
                       
                        <span className="username" >
                           Welcome! {typeof user.name === 'string' ? user.name : "Anonymous User"}
                        </span>
                        <Button onClick={handleLogout} type="primary">Logout</Button>
                    </>
                ) : (
                    <span>Loading...</span> // Fallback while user is being loaded
                )}
            </div>
        </div>
    );
};

export default Header;
