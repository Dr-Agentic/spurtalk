# Running and Testing SpurTalk

## 🚀 Quick Start

### 1. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spurtalk"

# OpenRouter API Key (for AI services)
OPENROUTER_API_KEY="your_openrouter_api_key"

# JWT Secrets
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1h"
REFRESH_SECRET="your_refresh_secret_key"
REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development
```

### 2. Install dependencies

```bash
# Install all dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../web && npm install
```

### 3. Set up database

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Start development servers

#### Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

#### Frontend Server

```bash
cd web
npm run dev
```

The frontend will start on `http://localhost:3001`

## 🧪 Testing

### Running Tests

#### Backend Tests

```bash
cd backend
npm test
```

#### Frontend Tests

```bash
cd web
npm test
```

### Manual Testing

#### Test Document Processing

1. Navigate to `http://localhost:3001/documents`
2. Drag and drop a PDF, Word, or text file
3. Verify tasks are extracted and displayed

#### Test Core Features

1. **Focus Deck**: `http://localhost:3001/deck`
2. **Garden**: `http://localhost:3001/garden`
3. **Timeline**: `http://localhost:3001/timeline`

### Test Scripts

#### Document Processing Test

```bash
cd backend
node test-document-processing.js
```

This will test PDF, TXT, and MD file processing.

## 📱 Mobile Development

### Start Mobile App

```bash
cd mobile
npm start
```

Use the Expo Go app to scan the QR code and test on your mobile device.

## 🔧 Common Commands

### Backend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Check TypeScript types
npm run typecheck

# Lint code
npm run lint
```

### Frontend (Web)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Mobile

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/profile` - Get user profile

### Tasks

- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/deck` - Get focus deck
- `POST /api/tasks/deck/:id/swipe` - Swipe task (right/left/down)

### Documents

- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get all documents

### Timeline

- `GET /api/timeline` - Get timeline

### Garden

- `GET /api/garden` - Get garden state
- `POST /api/garden/complete/:taskId` - Mark task complete

### Unblocker

- `POST /api/unblocker/check-stalls` - Check for stalled tasks
- `POST /api/unblocker/:taskId/decompose` - Decompose task

## 🔍 Debugging

### Check server logs

```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd web && npm run dev
```

### Database access

```bash
# Connect to PostgreSQL
psql -h localhost -U user -d spurtalk

# View Prisma studio
npx prisma studio
```

### Environment variables

```bash
# Check current environment variables
printenv

# Set environment variables temporarily
export VARIABLE=value
```

## 📦 Deployment

### Production Build

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd ../web && npm run build

# Start production servers
cd backend && npm start
cd ../web && npm start
```

### Docker (if configured)

```bash
# Build Docker image
docker build -t spurtalk .

# Run Docker container
docker run -p 3000:3000 -p 3001:3001 spurtalk
```

## 🆘 Troubleshooting

### Common Issues

**Database connection failed**

- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database credentials

**Authentication failed**

- Check JWT secrets in `.env`
- Verify token expiration times
- Ensure user exists in database

**Document processing failed**

- Check OpenRouter API key
- Verify file upload permissions
- Ensure supported file types

**TypeScript errors**

- Run `npm run typecheck`
- Check import paths
- Verify type definitions

### Getting Help

```bash
# Check all running processes
ps aux | grep node

# Check port usage
lsof -i :3000
lsof -i :3001

# Kill processes on port
kill -9 $(lsof -t -i :3000)
```
