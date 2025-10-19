# Puspa API - Deployment Guide

This project implements a comprehensive API for the Puspa application with authentication, user management, and observation systems.

## 🚀 Deployment to Vercel

### Prerequisites
1. Vercel CLI installed: `npm i -g vercel`
2. Git repository connected to Vercel

### Environment Variables Setup

After deployment, you need to set up environment variables in your Vercel dashboard:

1. **Go to your project dashboard** on Vercel
2. **Navigate to Settings** → **Environment Variables**
3. **Add the following variables:**

#### Required Variables:
- `JWT_SECRET`: A secure random string for JWT token signing (generate a strong secret)
- `NEXTAUTH_URL`: Your deployed application URL (e.g., `https://your-app.vercel.app`)
- `DATABASE_URL`: Database connection string (for future use)

#### Optional Variables (for email functionality):
- `SMTP_HOST`: SMTP server for email sending (e.g., `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (default: 587)
- `SMTP_USER`: SMTP username/email
- `SMTP_PASS`: SMTP password/app password

### Deployment Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables locally** (for development):
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your local configuration.

3. **Test locally**:
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

5. **Set environment variables in Vercel**:
   - Go to your project dashboard on Vercel
   - Navigate to **Settings** → **Environment Variables**
   - Add all required environment variables manually (see Environment Variables Setup section below)

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification/[user_id]` - Resend verification email
- `GET /api/auth/protected` - Protected route (requires auth)

### Admin Management
- `GET /api/admins` - Get all admins
- `GET /api/admins/[admin_id]` - Get admin by ID
- `POST /api/admins` - Create new admin
- `POST /api/admins/[admin_id]` - Update admin (use `_method: PUT`)
- `DELETE /api/admins/[admin_id]` - Delete admin

### Therapist Management
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/[therapist_id]` - Get therapist by ID
- `POST /api/therapists` - Create new therapist
- `POST /api/therapists/[therapist_id]` - Update therapist (use `_method: PUT`)
- `DELETE /api/therapists/[therapist_id]` - Delete therapist

### Patient/Children Management
- `GET /api/children` - Get all children
- `GET /api/children/[child_id]` - Get child by ID

### Observations
- `GET /api/observations` - Get observations (with status filter)
- `GET /api/observations/pending` - Get pending observations
- `GET /api/observations/scheduled` - Get scheduled observations
- `GET /api/observations/scheduled/[observation_id]` - Get scheduled observation detail
- `GET /api/observations/question/[observation_id]` - Get observation questions
- `POST /api/observations/submit/[observation_id]` - Submit observation answers
- `GET /api/observations/completed` - Get completed observations
- `GET /api/observations/completed/[observation_id]` - Get completed observation summary
- `GET /api/observations/answer/[observation_id]` - Get observation detail answers
- `POST /api/observations/[observation_id]` - Update observation date
- `POST /api/observations/assessment-agreement/[observation_id]` - Update assessment agreement

### User Management
- `GET /api/users/verified/[user_id]` - Verify employee

### Registration
- `POST /api/registration` - Submit patient registration

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Postman Collection

Import the provided Postman collection (`Puspa API.postman_collection.json`) to test all endpoints.

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🔧 Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Testing API Endpoints
Use the provided Postman collection or test manually with curl:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"password123"}'
```

## 📦 Project Structure

```
project_puspa/
├── src/app/api/           # API routes
│   ├── auth/             # Authentication endpoints
│   ├── admins/           # Admin management
│   ├── therapists/       # Therapist management
│   ├── children/         # Patient management
│   ├── observations/     # Observation system
│   ├── users/           # User management
│   └── registration/     # Registration endpoint
├── .env.example         # Environment variables template
├── vercel.json          # Vercel deployment config
└── next.config.ts       # Next.js configuration
```

## 🔒 Security Notes

1. All passwords are hashed using bcrypt
2. JWT tokens expire after 7 days
3. Protected routes require valid authentication
4. Role-based access control is implemented
5. Input validation is performed on all endpoints

## 🚀 Production Deployment

When deploying to Vercel:

1. Ensure all environment variables are set in the Vercel dashboard
2. The API will be available at `https://your-app.vercel.app/api/*`
3. Make sure the `NEXTAUTH_URL` matches your deployed domain
4. Update any external services (database, SMTP) to use production credentials

## 🐛 Troubleshooting

### Common Issues:

1. **CORS errors**: Ensure `NEXTAUTH_URL` is correctly set
2. **Authentication failures**: Check JWT_SECRET is properly configured
3. **Database connection errors**: Verify DATABASE_URL is correct
4. **Email sending failures**: Check SMTP configuration

### Vercel Deployment Issues:

**Environment Variable Error:**
If you see: `Environment Variable "JWT_SECRET" references Secret "jwt-secret", which does not exist.`

**Solution:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the environment variables manually:
   - `JWT_SECRET`: Generate a secure random string
   - `NEXTAUTH_URL`: Your deployed Vercel URL
   - `DATABASE_URL`: Your database connection string

**Note:** The `vercel.json` file was simplified to avoid secret reference issues. Set up environment variables directly in the Vercel dashboard.

### Logs:
Check Vercel function logs in the dashboard for debugging API issues.