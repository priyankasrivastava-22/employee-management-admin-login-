# Employee Management System

## Prerequisites

* Node.js 18+
* PostgreSQL database or cloud service
* VS Code (recommended)

## Project Structure

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

## Installation Steps

### 1. Clone the repository

```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following placeholders:

```env
DATABASE_URL=your_database_url_here
NODE_ENV=development
```

### 4. Initialize database

```bash
npm run db:push
```

### 5. Run the application

```bash
npm run dev
```

The app will run locally.

## Available Scripts

* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run db:push` - Push database schema changes

## Features

* CRUD operations for employees
* Responsive design with Tailwind CSS
* Dark mode support
* Employee search and filtering
* Statistics dashboard
* Employee details modal with edit functionality

## Tech Stack

* **Frontend**: React, TypeScript, Tailwind CSS
* **Backend**: Express.js, TypeScript
* **Database**: PostgreSQL with ORM
* **UI Components**: Shadcn/ui
* **Build Tool**: Vite

## Customization

* Modify styles in `client/src/index.css`
* Add new components in `client/src/components/`
* Extend database schema in `shared/schema.ts`
* Add new API routes in `server/routes.ts`

## Deployment

* Frontend: Any static hosting service
* Backend: Any Node.js hosting service
* Database: Any managed PostgreSQL service

## Troubleshooting

1. Verify database connection in `.env`
2. Ensure dependencies are installed
3. Adjust ports in server if conflicts occur

---
