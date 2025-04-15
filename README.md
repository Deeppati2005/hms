# HMS - Hospital Management System

## Overview

HMS is a comprehensive Hospital Management System designed to streamline hospital operations by managing patients, doctors, appointments, and more. This system comprises a frontend built with React.js and a backend powered by Java and Spring Boot, ensuring a robust and scalable architecture.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Register and manage users with different roles (Admin, Doctor, Patient).
- **Appointment Scheduling**: Book, view, and manage appointments.
- **Doctor Management**: Add, update, and remove doctor profiles.
- **Patient Records**: Maintain comprehensive patient information.
- **Authentication & Authorization**: Secure login and role-based access control.

## Architecture

The HMS system follows a client-server architecture:

- **Frontend**: Developed using React.js, providing an interactive user interface.
- **Backend**: Built with Java and Spring Boot, exposing RESTful APIs for data operations.
- **Database**: Utilizes PostgreSQL for data persistence.

## Technology Stack

- **Frontend**:
  - React.js
  - Axios (for API calls)
  - React Router (for routing)
- **Backend**:
  - Java
  - Spring Boot
  - PostgreSQL (Database)
  - JPA/Hibernate (ORM)

## Setup Instructions

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Deeppati2005/hms.git
   cd hms/backend
   ```

2. **Configure the database**:
   - Create a PostgreSQL database named `hms`.
   - Update the `application.properties` file with your PostgreSQL credentials:


     ```properties 
     spring.datasource.url=jdbc:postgresql://localhost:5432/hms
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. **Build and run the backend**:
   ```bash
   mvn spring-boot:run
   ```
   - The backend will start on `http://localhost:8080`.

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```
   - The frontend will start on `http://localhost:5173`.

## API Endpoints

Below is a comprehensive list of API endpoints exposed by the backend:

| Method | Endpoint                 | Description                          | Request Body          | Response         |
|--------|--------------------------|--------------------------------------|-----------------------|------------------|
| POST   | `/api/auth/register`     | Register a new user                  | User details (JSON)   | Success message  |
| POST   | `/api/auth/login`        | Authenticate user and obtain token   | Credentials (JSON)    | JWT token        |
| GET    | `/api/users`             | Retrieve all users (Admin only)      | None                  | List of users    |
| GET    | `/api/users/{id}`        | Retrieve user by ID                  | None                  | User details     |
| PUT    | `/api/users/{id}`        | Update user information              | Updated details (JSON)| Success message  |
| DELETE | `/api/users/{id}`        | Delete user by ID                    | None                  | Success message  |
| GET    | `/api/doctors`           | Retrieve all doctors                 | None                  | List of doctors  |
| POST   | `/api/doctors`           | Add a new doctor                     | Doctor details (JSON) | Success message  |
| PUT    | `/api/doctors/{id}`      | Update doctor information            | Updated details (JSON)| Success message  |
| DELETE | `/api/doctors/{id}`      | Delete doctor by ID                  | None                  | Success message  |
| GET    | `/api/patients`          | Retrieve all patients                | None                  | List of patients |
| POST   | `/api/patients`          | Add a new patient                    | Patient details (JSON)| Success message  |
| PUT    | `/api/patients/{id}`     | Update patient information           | Updated details (JSON)| Success message  |
| DELETE | `/api/patients/{id}`     | Delete patient by ID                 | None                  | Success message  |
| GET    | `/api/appointments`      | Retrieve all appointments            | None                  | List of appointments |
| POST   | `/api/appointments`      | Schedule a new appointment           | Appointment details (JSON) | Success message |
| PUT    | `/api/appointments/{id}` | Update appointment details           | Updated details (JSON)| Success message  |
| DELETE | `/api/appointments/{id}` | Cancel appointment by ID             | None                  | Success message  |

> **Note**: All endpoints under `/api/users`, `/api/doctors`, `/api/patients`, and `/api/appointments` require authentication.
> ```

## Project Structure

```
hms/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── hms/
│   │   │   │           ├── controller/
│   │   │   │           ├── model/
│   │   │   │           ├── repository/
│   │   │   │           ├── service/
│   │   │   │           └── BackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── App.jsx
```

- **backend/controller**: Contains REST controllers handling HTTP requests.
- **backend/model**: Defines the data models/entities.
- **backend/repository**: Interfaces for database operations.
- **backend/service**: Business logic and service layer.
- **frontend/components**: Reusable UI components.
- **frontend/pages**: Route-based components for different dashboards.
- **frontend/services**: Axios-based service files for API interaction.

## Contributing

Contributions are welcome! Feel free to open issues, create pull requests, or fork the repo.
