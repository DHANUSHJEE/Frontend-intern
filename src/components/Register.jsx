import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../Config/Config.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); // Using Form hooks
    const Navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await axios.post(`${config.URL}/signup`, values);
            message.success('Registration successful. Please login.');
            setLoading(false);
            form.resetFields();
            Navigate('/login');
        } catch (error) {
            setLoading(false);
            if (error.response?.status === 400 && error.response.data.message === 'User already exists') {
                message.error('User already exists');
            } else {
                message.error('Error occurred during registration');
            }
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="user-management-page">
            <div className="form-container">
              
                <h1 className="form-title ">Register Form</h1>
                <Form
                    form={form} // Set the form instance
                    name="register"
                    layout='vertical'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Name:"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email:"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password:"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters long!' },
                            { max: 20, message: 'Password must not exceed 20 characters!' },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to="/login">Already have an account? Click here to login</Link>
                            <Button type="primary" htmlType="submit" loading={loading} className="btn btn-primary" >
                                Register
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;
