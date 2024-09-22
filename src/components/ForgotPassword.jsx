import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import config from '../Config/Config.jsx';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Forgotpassword = () => {
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();

    const submitHandler = async (values) => {
        try {
            setLoading(true);
            const url = `${config.URL}/forgotpassword`;
            const { data } = await axios.post(url, {
                email: values.email,
                password: values.password,
                confirmpassword: values.confirmpassword,
            });

            setMsg(data.message);
            setError('');
            setLoading(false);
            message.success('Password reset successful, please log in.');
            Navigate('/login');
        } catch (error) {
            setLoading(false);
            if (error.response) {
                if (error.response.status === 404) {
                    setError('User with this email does not exist');
                } else if (error.response.status >= 400 && error.response.status <= 500) {
                    setError(error.response.data.message);
                }
            } else {
                setError('An error occurred, Email is not registered or please check your email.');
            }
        }
    };

    return (
        <div className="container-password">
            
            <Form
                onFinish={submitHandler}
                layout="vertical"
                initialValues={{ remember: true }}
            >
                <h1 className='form-title'>Forgot Password</h1>
                <Form.Item
                    label="Email:"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your email!',
                        },
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Enter your registered email" />
                </Form.Item>

                <Form.Item
                    label="New Password:"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your new password!',
                        },
                        {
                            min: 6,
                            message: 'Password must be at least 6 characters!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter your new password" />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password:"
                    name="confirmpassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('The two passwords do not match!')
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm your new password" />
                </Form.Item>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {msg && <p style={{ color: 'green' }}>{msg}</p>}

                <Button
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary"
                    loading={loading}
                >
                    Submit
                </Button>
                <div className="loginlink" >
                    <Link to="/login" className="login-link" >Click here to login</Link>
               </div>
            </Form>
        </div>
    );
};

export default Forgotpassword;
