# Internal Training Enrollment System

A full-stack web application for managing internal training programs within an organization. Employees can browse and enroll in training sessions, while trainers can create and manage their training offerings.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Role-Based Access**: Separate dashboards for employees and trainers
- **Training Management**: Trainers can create, update, and manage training sessions
- **Enrollment System**: Employees can view available trainings and enroll/cancel enrollments
- **Seat Management**: Limited seats per training with real-time availability
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Prisma ORM** with PostgreSQL database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

## Project Structure

```
internal-training-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internal-training-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. **Database Setup**
   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in `backend/.env` file

2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/training_db"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```

## Database Migration

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Trainings
- `GET /api/trainings` - Get all trainings
- `POST /api/trainings` - Create training (Trainer only)
- `PUT /api/trainings/:id` - Update training (Trainer only)
- `DELETE /api/trainings/:id` - Delete training (Trainer only)

### Enrollments
- `GET /api/enrollments` - Get user enrollments
- `POST /api/enrollments` - Enroll in training
- `PUT /api/enrollments/:id/cancel` - Cancel enrollment

## User Roles

- **Employee**: Can view trainings, enroll/cancel enrollments
- **Trainer**: Can create/manage trainings, view enrollment lists

## Development

- Use `npm run prisma:studio` to open Prisma Studio for database management
- The backend uses `--watch` mode for automatic restarts during development
- Frontend hot-reload is enabled with Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## License

This project is licensed under the ISC License.
