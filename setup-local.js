#!/usr/bin/env node

// Employee Management System - Local Setup Script
// Run this after copying files to automatically set up the project

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Employee Management System...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Make sure you copied all files.');
  process.exit(1);
}

console.log('✅ Project files found');

// Create .env.example file
const envExample = `# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/employee_db

# Development
NODE_ENV=development

# Instructions:
# 1. Copy this file to .env
# 2. Replace the DATABASE_URL with your actual database connection string
# 3. For cloud databases, use services like Neon, Supabase, or Railway
`;

fs.writeFileSync('.env.example', envExample);
console.log('✅ Created .env.example file');

// Create .gitignore if it doesn't exist
const gitignore = `node_modules/
.env
dist/
.vscode/
*.log
.DS_Store
`;

if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', gitignore);
  console.log('✅ Created .gitignore file');
}

console.log('\n📋 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Copy .env.example to .env and configure your database');
console.log('3. Run: npm run db:push');
console.log('4. Run: npm run dev');
console.log('\n🎉 Your Employee Management System will be ready at http://localhost:5000');