

import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, Radio, Upload, Table, Input as AntInput, Checkbox, DatePicker, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import LayoutC from '../components/Layout';
import config from '../Config/Config.jsx';
import '../styles/Homepage.css';
import { useNavigate } from 'react-router-dom';
import "../styles/Homepage.css"

const { Option } = Select;

const Homepage = () => {
    const [employees, setEmployees] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [existingEmails, setExistingEmails] = useState([]);
    const [existingMobileNumbers, setExistingMobileNumbers] = useState([]);

    const [form] = Form.useForm();
    const apiUrl = config.URL;
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('user');
        if (storedData) {
            fetchEmployees();
        } else {
            navigate('/login');
        }
    }, []);

   const fetchEmployees = async () => {
    try {
        const storedData = localStorage.getItem('user');
        const user = JSON.parse(storedData);
        const token = user?.token;

        if (!token) {
            console.error('Token not found, please login again.');
            return;
        }

        const response = await axios.get(`${apiUrl}/getAllEmployees`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setEmployees(response.data.employees);
        const emails = response.data.employees.map(emp => emp.email);
        const mobileNumbers = response.data.employees.map(emp => emp.mobile);
        setExistingEmails(emails);
        setExistingMobileNumbers(mobileNumbers);
    } catch (error) {
        console.error('Error fetching employees:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to fetch employee details.');
    }
};

    const handleAddEmployee = async (employeeData) => {
        try {
            // Check for duplicate email or mobile number
            if (existingEmails.includes(employeeData.email)) {
                message.error('This email already exists.'); // Show error in prompt
                return;
            }
            if (existingMobileNumbers.includes(employeeData.mobile)) {
                message.error('This mobile number already exists.'); // Show error in prompt
                return;
            }

            const storedData = localStorage.getItem('user');
            const user = JSON.parse(storedData);
            const token = user?.token;

            if (!token) {
                console.error('Token not found, please login again.');
                return;
            }

            const formData = new FormData();
            if (uploadedImage) {
                formData.append('image', uploadedImage);
            }

            Object.keys(employeeData).forEach(key => {
                if (key === 'date' && employeeData[key]) {
                    const formattedDate = moment(employeeData[key]).format('YYYY-MM-DD');
                    formData.append(key, formattedDate);
                } else {
                    formData.append(key, employeeData[key]);
                }
            });

            formData.append('userid', user._id);

            await axios.post(
                `${apiUrl}/addEmployee`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            message.success("Employee added successfully!");
            fetchEmployees();
            handleCancel(); // Close modal
        } catch (error) {
            console.error("Error saving employee:", error.response ? error.response.data : error.message);
            message.error('Error adding employee.'); // Show error in prompt
        }
    };


    const handleEditEmployee = async (employeeData) => {
        try {
            // Check for duplicate email or mobile number, excluding the current employee
            if (existingEmails.includes(employeeData.email) && employeeData.email !== employees[editIndex]?.email) {
                message.error('This email already exists.'); // Show error in prompt
                return;
            }
            if (existingMobileNumbers.includes(employeeData.mobile) && employeeData.mobile !== employees[editIndex]?.mobile) {
                message.error('This mobile number already exists.'); // Show error in prompt
                return;
            }

            const storedData = localStorage.getItem('user');
            const user = JSON.parse(storedData);
            const token = user?.token;

            if (!token) {
                console.error('Token not found, please login again.');
                return;
            }

            if (!employeeData._id) {
                console.error("Employee ID is missing.");
                return;
            }

            const formData = new FormData();
            if (uploadedImage) {
                formData.append('image', uploadedImage);
            }

            Object.keys(employeeData).forEach(key => {
                if (key === 'date' && employeeData[key]) {
                    const formattedDate = moment(employeeData[key]).format('YYYY-MM-DD');
                    formData.append(key, formattedDate);
                } else {
                    formData.append(key, employeeData[key]);
                }
            });

            await axios.put(
                `${apiUrl}/updateEmployee/${employeeData._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            message.success("Employee updated successfully!");
            fetchEmployees(); // Refresh employee list
            handleCancel(); // Close modal
        } catch (error) {
            console.error("Error updating employee:", error.response ? error.response.data : error.message);
            message.error('Error updating employee.'); // Show error in prompt
        }
    };



    const handleDelete = async (id) => {
            try {
                const storedData = localStorage.getItem('user');
                const user = JSON.parse(storedData);
                const token = user?.token;

                if (!token) {
                    console.error('Token not found, please login again.');
                    return;
                }

                await axios.delete(
                    `${apiUrl}/deleteEmployee/${id}`, // Pass the employee _id here
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                message.success('Employee deleted successfully!');
                fetchEmployees(); // Refresh the employee list after deletion
            } catch (error) {
                console.error('Error deleting employee:', error.response ? error.response.data : error.message);
                message.error('Failed to delete employee');
            }
        };



   

    const handleSubmit = (values) => {
        if (editIndex !== null) {
            // If we are in edit mode, call handleEditEmployee
            handleEditEmployee({ ...values, _id: editIndex });
        } else {
            // Otherwise, add a new employee
            handleAddEmployee(values);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditIndex(null);
        form.resetFields();
        setUploadedImage(null);
        setErrorMessage('');
    };

    const handleAddClick = () => {
        setIsModalVisible(true);
        setEditIndex(null);
        form.resetFields();
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageUpload = (file) => {
        setUploadedImage(file);
        return false; // Prevent auto upload
    };

    const openEditModal = (employee) => {
        const date = employee.date ? moment(employee.date) : null;
        const formattedEmployee = {
            ...employee,
            date,
        };

        setEditIndex(employee._id);
        form.setFieldsValue(formattedEmployee);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            render: (_, __, index) => <>{index + 1}</>,
        },
        {
            title: 'Image',
            key: 'image',
            render: (_, record) => (
                record.image ? <img src={record.image} alt="employee" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /> : 'No Image'
            ),
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Mobile No', dataIndex: 'mobile', key: 'mobile' },
        { title: 'Designation', dataIndex: 'designation', key: 'designation' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        { title: 'Courses', dataIndex: 'course', key: 'course' },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => (text ? moment(text).format('DD-MM-YYYY') : 'No Date'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button onClick={() => openEditModal(record)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <LayoutC>
            <div>

                <div className="header-HP">
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                <h4>Employee Count: {filteredEmployees.length}</h4>
                <AntInput.Search
                   
                    placeholder="Search Employee"
                    onSearch={(value) => setSearchTerm(value)}
                   
                />
                <Button type="primary"   onClick={handleAddClick} icon={<PlusOutlined />}>
                    Add Employee
                    </Button>
                </div>

                <Table dataSource={filteredEmployees} columns={columns} rowKey="_id" />

                <Modal
                    title={editIndex !== null ? 'Edit Employee' : 'Add Employee'}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form form={form} onFinish={handleSubmit}>
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mobile No" name="mobile" rules={[{ required: true, message: 'Please input your mobile number!' }]}>
                            <Input type="tel" />
                        </Form.Item>
                        <Form.Item label="Designation" name="designation" rules={[{ required: true, message: 'Please select your designation!' }]}>
                            <Select placeholder="Select a designation">
                                <Option value="HR">HR</Option>
                                <Option value="Manager">Manager</Option>
                                <Option value="Sales">Sales</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                            <Radio.Group>
                                <Radio value="Male">Male</Radio>
                                <Radio value="Female">Female</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Courses" name="course">
                            <Checkbox.Group>
                                <Checkbox value="MCA">MCA</Checkbox>
                                <Checkbox value="BCA">BCA</Checkbox>
                                <Checkbox value="BSC">BSC</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label="Date" name="date">
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>

                        <Form.Item label="Upload Image" name="image">
                            <Upload beforeUpload={handleImageUpload} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </LayoutC>
    );
};

export default Homepage;