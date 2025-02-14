# Leave Management System

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Google OAuth, JWT (for admin)
- **Cron Jobs**: Node-cron (for scheduled tasks)

## Prerequisites

To run this project locally, you need to have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher) or **yarn**
- **PostgreSQL** (or any database supported by Prisma)

## Installation

Follow these steps to get your development environment up and running:

1. **Clone the repository**:

   ```bash
   git clone "github or bitbucket repository url"
   cd leave-management-system
   ```

2. **Install dependencies**:

   For the backend:

   ```bash
   cd backend
   npm install
   ```

   For the frontend:

   ```bash
   cd frontend
   npm install
   ```

3. **Setup environment variables**:

   Create a `.env` file in the backend root directory and add the following variables:

   ```plaintext
   PORT=5000
   DATABASE_URL=""
   SESSION_SECRET_KEY=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GOOGLE_CALLBACK_URL=""
   ADMIN_EMAIL=""
   ADMIN_PASSWORD=""
   JWT_SECRET_KEY=""
   FRONTEND_URL=http://localhost:5173
   ```

Create a `.env`file in the frontend root directory and add the following
variables :

    VITE_GOOGLE_CLIENT_ID=""

add your own values in the .env files in the frontend and backend.

4. **Set up the database**:

   - Create a PostgreSQL database.
   - Run the following Prisma commands to generate the schema and migrate the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```

5. **Start the application**:

   - To run the backend, execute the following command:

   ```bash
   npm start
   ```

   - To run the frontend, navigate to the `frontend` folder and run:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`, and the backend at `http://localhost:5000`.
