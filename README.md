# Employee Management System

## Overview
The Employee Management System is a web application designed to manage employee records efficiently. It allows users to log in, view, add, edit, and delete employee information, including personal details and an uploaded image. The application is built using the MERN stack (MongoDB, Express.js, React, Node.js) and utilizes Ant Design for the UI components.

## Features
- **User Authentication**: Secure login and session management.
- **Employee Management**: View, add, edit, and delete employee records.
- **Image Upload**: Upload images for each employee.
- **Search Functionality**: Search for employees by name.
- **Responsive Design**: Optimized for various devices.

## Tech Stack
- **Frontend**: React, Ant Design, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: VERCEl

## deployed URL 
 - Frontend : https://frontend-intern-topaz.vercel.app
 - Backend : https://intern-project-backend-z2kh.onrender.com

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance running (local or cloud).
- Access to a server for deployment (optional).

## API Endpoints
 - POST /login: Authenticate user and return a token.
 - GET /getAllEmployees: Retrieve all employee records (requires token).
 - POST /addEmployee: Add a new employee (requires token).
 - DELETE /deleteEmployee/:id: Delete an employee by ID (requires token).
  
## Usage
 - Login: Use valid credentials to log in.
 - Dashboard: View the list of employees. Use the search bar to find specific employees.
 - Add Employee: Click the "Add Employee" button, fill in the details, and upload an image if necessary.
 - Edit/Delete Employee: Use the respective buttons for each employee record.

## Contribution
 - Feel free to submit issues or pull requests for enhancements or bug fixes.

## License
This project is licensed under the MIT License.


