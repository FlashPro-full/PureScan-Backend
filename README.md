# PureScan Backend

TypeScript + Express + TypeORM backend API for PureScan application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string
- `SP_API_CLIENT_ID` - Amazon SP-API Client ID
- `SP_API_CLIENT_SECRET` - Amazon SP-API Client Secret
- `JWT_SECRET` - Secret key for JWT tokens
- `SMTP_USER` or `EMAIL_USER` - Email address for sending emails (Gmail/Outlook)
- `SMTP_PASS` or `EMAIL_PASSWORD` - App password for email account
- `SMTP_HOST` (optional) - Custom SMTP host (auto-detected for Gmail/Outlook)
- `SMTP_PORT` (optional) - SMTP port (default: 587)
- `SMTP_SECURE` (optional) - Use TLS (default: false)

4. Run database migrations (auto-sync in development):
```bash
npm run dev
```

5. Start server:
```bash
npm run dev
```

Server runs on `http://localhost:5001`

Frontend runs on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/forgot-password` - Request password reset code
- `POST /api/auth/reset-password` - Reset password with code

### Products
- `POST /api/products/lookup` - Lookup product by barcode (requires auth)

### Scans
- `POST /api/scans` - Record scan (requires auth)
- `GET /api/scans` - Get scan history (requires auth)

### Inventory
- `GET /api/inventory` - Get inventory items (requires auth)
- `POST /api/inventory` - Create inventory item (requires auth)
- `PATCH /api/inventory/:id` - Update inventory item (requires auth)
- `DELETE /api/inventory/:id` - Delete inventory item (requires auth)

### Settings
- `GET /api/settings/team` - Get team members (admin only)
- `PATCH /api/settings/team/:userId` - Update user role (admin only)
- `GET /api/settings/preferences` - Get user preferences (requires auth)
- `PATCH /api/settings/preferences` - Update preferences (requires auth)
- `GET /api/settings/subscription` - Get subscription (requires auth)
- `GET /api/settings/export?type=scans` - Export data (requires auth)

## Database

Uses TypeORM with PostgreSQL. Entities are auto-synced in development mode.

## Environment Variables

See `.env.example` for required variables.

