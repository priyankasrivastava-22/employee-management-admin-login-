# Employee Management System - Local Setup Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use PostgreSQL cloud service)
- VS Code (recommended)

## 1. Project Structure
```
employee-management-system/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── components.json
```

## 2. Installation Steps

### Step 1: Create New Project Directory
```bash
mkdir employee-management-system
cd employee-management-system
```

### Step 2: Copy all files from this Replit project

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Set up Database
You have two options:

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb employee_db`
3. Set environment variable:
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/employee_db"
```

#### Option B: Cloud Database (Recommended)
Use services like:
- Neon (neon.tech) - Free tier available
- Supabase (supabase.com) - Free tier available
- Railway (railway.app) - Free tier available

Get your DATABASE_URL and set it as environment variable.

### Step 5: Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_database_url_here
NODE_ENV=development
```

### Step 6: Initialize Database
```bash
npm run db:push
```

### Step 7: Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 3. Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

## 4. Features Included
- Complete CRUD operations for employees
- PostgreSQL database integration
- Responsive design with Tailwind CSS
- Dark mode support
- Real-time data updates
- Employee search and filtering
- Statistics dashboard
- Employee details modal with edit functionality

## 5. Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Shadcn/ui
- **Build Tool**: Vite

## 6. Customization
- Modify colors in `client/src/index.css`
- Add new components in `client/src/components/`
- Extend database schema in `shared/schema.ts`
- Add new API routes in `server/routes.ts`

## 7. Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, or any Node.js hosting
- **Database**: Neon, Supabase, or managed PostgreSQL

## Troubleshooting
1. **Database Connection Issues**: Verify DATABASE_URL is correct
2. **Build Errors**: Ensure all dependencies are installed
3. **Port Conflicts**: Change port in `server/index.ts` if needed