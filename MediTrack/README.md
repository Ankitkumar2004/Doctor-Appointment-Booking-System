# MediTrack - Medical Appointment Management System

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Running locally on port 27017)

## Setup

1.  **Clone the repository** (if not already done).
2.  **Install Dependencies**:

    ```bash
    # Backend
    cd server
    npm install

    # Frontend
    cd ../client
    npm install
    ```

3.  **Environment Variables**:
    - Ensure `server/.env` exists with the following content:
        ```
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/meditrack
        JWT_SECRET=your_secret_key_here
        ```

## Running the Application

1.  **Start MongoDB**:
    - Make sure your local MongoDB server is running.
    - If you have MongoDB installed, run `mongod` in a terminal.

2.  **Start the Backend Server**:
    ```bash
    cd server
    node index.js
    ```
    Server runs on `http://localhost:5000`.

3.  **Start the Frontend Client**:
    ```bash
    cd client
    npm run dev
    ```
    Client runs on `http://localhost:5173`.

## Verification

You can run the included verification script to test the backend API:

```bash
node verify_setup.js
```

## Features
- **Patient**: Register, Login, Book Appointment, View Own Appointments.
- **Doctor**: Register, Login, View Assigned Appointments, Approve/Reject Appointments.
