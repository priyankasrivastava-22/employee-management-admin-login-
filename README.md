**Employee Management System (EMS)**

A full-stack Employee Management System designed to manage employees, departments, attendance, and salary records through a centralized web application. The system follows modern web development and DevOps deployment practices, making it suitable for academic submission as well as portfolio demonstration.


## 1. Overview

The Employee Management System (EMS) is a full-stack web application designed to manage employee and department information in a centralized and efficient manner. It helps organizations reduce manual record-keeping by providing a structured, secure, and scalable digital solution.

The system supports employee records, department management, attendance tracking, and salary management through a modern web interface.

## 2. Objectives

``Digitize employee and department records
``Improve data accuracy and accessibility
``Provide a centralized management platform
``Demonstrate full-stack and DevOps deployment skills

## 3. Core Modules

``Employee Module  -  Manage employee details such as name, contact, role, department, and status
``Employee Records Module   -   Maintain historical and operational employee data
``Department Module  -  Manage departments and role mapping
``Department Records Module   -   Store department-wise structured information

## 4. Tech Stack

-**Frontend** -  React.js, TypeScript, Tailwind CSS, Vite
-**Backend** -Node.js, Express.js,RESTful APIs
-**Database** - MySQL (Relational Database)
-**DevOps & Cloud** - Git & GitHub (Version Control), Git Bash (CLI workflow), Render (Cloud Deployment),CI/CD via GitHub → Render auto-

## 5. System Architecture

- Client–Server architecture
- React frontend communicates with Express APIs
- MySQL database stores structured relational data
- Production build served via Node.js
- Cloud-hosted on Render

## 6. Deployment

The application is deployed on Render using a GitHub-based CI/CD pipeline.
Every push to the main branch automatically triggers a new deployment.

🔗 Live Application:
https://employee-management-admin-login.onrender.com/


## 7. Environment Configuration

Sensitive configuration values are managed using environment variables and are not committed to the repository.

Example:
DATABASE_URL=***
NODE_ENV=production
PORT=****

## 8. Project Architecture

Employee Management System
│
├── client/                     # Frontend (React + TS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── employee-data-table.tsx
│   │   │   ├── employee-details-modal.tsx
│   │   │   ├── employee-registration-form.tsx
│   │   │   ├── navigation-header.tsx
│   │   │   └── statistics-dashboard.tsx
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
│
├── server/                     # Backend (Express + TS)
│   ├── index.ts
│   ├── routes.ts
│   ├── db.ts
│   ├── storage.ts
│   └── vite.ts
│
├── shared/                     # Shared types & schemas
│   └── schema.ts
│
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
└── components.json
