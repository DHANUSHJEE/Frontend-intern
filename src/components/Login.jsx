// Login Component
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../Config/Config.jsx';
import '../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    }, [navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${config.URL}/login`, values);

            // Check if the response contains a specific error related to email
            if (data.error && data.error === 'Email does not exist') {
                message.error('Email does not exist. Kindly register and try logging in.');
                return; // Exit the function if the email doesn't exist
            }

            message.success('Login Successfully');
            localStorage.setItem('user', JSON.stringify({ ...data, password: '' }));
            navigate('/');
        } catch (error) {
            message.error('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="user-management-page">
            <div className="form-container">
                <h1 className="form-title">Login Form</h1>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Email :" name="email" required>
                        <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item label="Password :" name="password" required>
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    <Link to="/password-reset">Forgot password? Click here to reset</Link>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} className="btn">
                            Login
                        </Button>
                        <div className="link">
                            <Link to="/register">Not a User? Click here to Register</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;


