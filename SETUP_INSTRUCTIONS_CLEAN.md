# HR Hub Zambia - Setup and Installation Instructions

## System Requirements

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
  - Download from: https://nodejs.org/
  - Check installation: node --version
  
- npm (v6.0.0 or higher) - comes with Node.js
  - Check installation: npm --version

- SQLite3 (v3.27.0 or higher) - database system
  - For Windows: Usually included with Node.js
  - For Mac: brew install sqlite3
  - For Linux: sudo apt-get install sqlite3

## Quick Start Guide

### Step 1: Navigate to Project Directory

```bash
cd "path/to/New folder"
```

### Step 2: Install Dependencies

```bash
npm install
```

What this does:
- Downloads all required npm packages
- Creates node_modules folder with all dependencies
- Dependencies installed:
  - express (4.18.2) - Web framework
  - sqlite3 (5.1.6) - Database driver
  - cors (2.8.5) - Cross-origin resource sharing
  - body-parser (1.20.2) - JSON request parsing
  - nodemon (3.0.1) - Auto-reload during development

### Step 3: Verify Installation

```bash
npm list
```

You should see all packages listed without errors.

### Step 4: Start the Application Server

Development Mode (with auto-reload on file changes):
```bash
npm run dev
```

Production Mode (standard start):
```bash
npm start
```

Expected Output:
```
Connected to SQLite database.
Server running on http://localhost:3000
Sample data inserted.
```

### Step 5: Access the Application

1. Open your web browser
2. Navigate to: http://localhost:3000
3. You should see the HR Hub Zambia dashboard with 5 sample employees

### Step 6: Stop the Server

Press Ctrl + C in the terminal where the server is running.

---

## Project Structure

```
New folder/
├── server.js                        Express backend (Main application file)
├── package.json                     Project metadata and dependencies
├── package-lock.json                Locked versions of dependencies
├── SETUP_INSTRUCTIONS.md            This file
├── IMPLEMENTATION_SUMMARY.md        Project completion documentation
├── public/
│   ├── index.html                  Frontend UI (HTML, CSS, modals)
│   ├── app.js                      Frontend JavaScript logic
│   └── style.css                   Inline Tailwind CSS styles
├── sql/
│   └── init.sql                    Database schema and sample data
├── data/
│   └── hr_database.db              SQLite database file (auto-created)
└── node_modules/                   All npm dependencies (auto-created)
```

---

## Database Setup (Automatic)

No manual database setup is required. The application handles everything:

### Auto-Initialization Process:

1. First Start:
   - Database file data/hr_database.db is automatically created
   - Three tables are created:
     - departments - Department information and managers
     - employees - Employee records with contact details
     - activities - Employee activity log

2. Sample Data:
   - 5 sample employees are automatically inserted
   - 7 departments are created
   - 5 sample activities are logged
   - This happens only on the very first run

3. Subsequent Starts:
   - Database loads existing data
   - No duplicate data is inserted

### Database Tables:

#### departments
```
- id (INTEGER, Primary Key, Auto-increment)
- name (TEXT, Unique, Required)
- manager (TEXT)
- location (TEXT)
- created_at (DATETIME, Auto-generated)
```

#### employees
```
- id (INTEGER, Primary Key, Auto-increment)
- initials (TEXT, Required, Auto-generated from name)
- name (TEXT, Required)
- role (TEXT, Required)
- department (TEXT, Required)
- email (TEXT, Unique, Required)
- phone (TEXT)
- city (TEXT, Default: 'Lusaka')
- status (TEXT, Default: 'Active')
- joined_date (TEXT, Auto-generated)
- leave_balance (TEXT, Default: '21 days')
- created_at (DATETIME, Auto-generated)
```

#### activities
```
- id (INTEGER, Primary Key, Auto-increment)
- employee_id (INTEGER, Foreign Key to employees.id, Cascade Delete)
- action (TEXT, Required)
- date (TEXT, Required)
- status (TEXT, Default: 'Completed')
- created_at (DATETIME, Auto-generated)
```

---

## Testing the Application

After starting the server, test all features:

### Test 1: View Dashboard
- Navigate to home page
- Check summary statistics display (Total Employees, Pending Leave, etc.)
- Verify live data updates

### Test 2: Create New Employee
1. Click "Add New Employee" button
2. Fill in form:
   - Full Name: John Doe
   - Role: Project Manager
   - Department: Engineering
   - Email: john.doe@hrhub.co.zm
   - Phone: +260 97 111 2222
3. Click "Add Employee"
4. Verify: Employee appears in the list, count increases

### Test 3: View Employee List
- Navigate to "Employees" page
- See all employees with details (name, role, department, contact info)
- Each employee has Edit and Delete buttons

### Test 4: Edit Employee
1. Click Edit button on any employee
2. Modal shows "Edit Employee" title
3. Form pre-populated with current data
4. Change any field (e.g., role)
5. Click "Update Employee"
6. Verify: Changes saved and displayed

### Test 5: Delete Employee
1. Click Delete button on any employee
2. Confirm deletion dialog appears
3. Click Confirm
4. Verify: Employee removed from list, count decreases

### Test 6: View Reports
- Navigate to "Reports" page
- Click "Refresh" button
- Verify statistics update:
  - Total Employees (should match count)
  - Pending Activities (activities with status='Pending')
  - Completed Activities (activities with status='Completed')
  - Department breakdown with employee counts

### Test 7: Manage Activities
1. Click "Activities" in navigation
2. View all employee activities
3. Activities show employee names, actions, dates, and status
4. Verify: Activities properly linked to employees

---

## API Endpoints

### Employee Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | Get all employees with department info |
| GET | /api/employees/:id | Get single employee by ID |
| POST | /api/employees | Create new employee |
| PUT | /api/employees/:id | Update employee details |
| DELETE | /api/employees/:id | Delete employee (cascade deletes activities) |

### Activity Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/activities | Get all activities |
| GET | /api/activities/:id | Get single activity by ID |
| POST | /api/activities | Create new activity |
| PUT | /api/activities/:id | Update activity status/action |
| DELETE | /api/activities/:id | Delete activity |

### Department Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/departments | Get all departments |

### Reports and Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/summary | Get summary statistics |
| GET | /api/reports/departments | Get employee count by department |
| GET | /api/dashboard/stats | Get dashboard statistics with payroll |

---

## Troubleshooting

### Issue: "npm: command not found"
Solution: Node.js and npm are not installed. Download from https://nodejs.org/

### Issue: "sqlite3 module not found"
Solution: Run npm install in the project directory

### Issue: "Port 3000 already in use"
Solution: 
- Option 1: Stop the other process using port 3000
- Option 2: Set a different port: PORT=3001 npm start

### Issue: "Cannot GET /"
Solution: Ensure public/index.html exists and server is running. Check console for errors.

### Issue: Database file not created
Solution: Ensure data/ folder exists. If not, create it manually before running the server.

### Issue: Blank database (no sample data)
Solution: Delete data/hr_database.db and restart the server. New database will be created with sample data.

### Issue: "Cannot find module" errors
Solution: Run npm install and ensure node_modules/ folder is created

---

## Sample Test Data

The application comes with pre-loaded test data:

### Sample Employees:
1. Mwamba Nkandu - Senior Developer (Engineering)
2. Thandiwe Mumba - Product Manager (Product)
3. Kondwani Banda - UX Designer (Design)
4. Natasha Zulu - Marketing Manager (Marketing)
5. Bwalya Chilufya - HR Specialist (HR)

### Sample Departments:
- Engineering, Product, Design, Marketing, HR, Finance, Operations

### Sample Activities:
- Sick leave requests
- Onboarding completions
- Training activities
- Job title updates
- Expense reports

---

## Security Notes

- Database: SQLite database file is stored locally. Keep data/hr_database.db safe.
- Unique Constraints: Email addresses are unique per employee (database enforces this)
- CORS Enabled: API accepts requests from any origin (configurable in server.js)
- Input Validation: Required fields checked at both frontend and backend
- Error Handling: All errors logged to console, safe responses sent to frontend

---

## Development Tips

### Auto-reload During Development:
```bash
npm run dev
```
This uses nodemon to automatically restart the server when you modify files.

### Manual Database Inspection:
To view database directly, install sqlite3 CLI:
```bash
sqlite3 data/hr_database.db
```

Then query data:
```sql
SELECT * FROM employees;
SELECT * FROM activities;
SELECT * FROM departments;
```

### Reset Database:
To start fresh with sample data:
1. Stop the server (Ctrl + C)
2. Delete data/hr_database.db
3. Restart server: npm start

---

## Verification Checklist

After setup, verify the following:

- Node.js and npm are installed
- npm install completed without errors
- Server starts with npm start or npm run dev
- Browser opens to http://localhost:3000
- Dashboard displays with sample data (5 employees)
- All navigation tabs work (Employees, Activities, Reports)
- Add Employee form works and creates new records
- Edit Employee modal opens correctly
- Delete confirmation dialog appears
- Reports page loads and Refresh button updates stats
- No console errors in browser (F12 Developer Tools)
- No errors in server console

---

## Support

If you encounter issues:

1. Check Console Errors:
   - Browser: Press F12, go to Console tab
   - Server: Check terminal/console output

2. Review Logs:
   - Server logs show database and API errors
   - Browser console shows frontend JavaScript errors

3. Verify All Components:
   - node_modules folder exists
   - data folder exists
   - public folder contains index.html, app.js
   - server.js is in root directory

4. Try a Clean Restart:
   ```bash
   # Stop server (Ctrl + C)
   # Delete database
   rm data/hr_database.db
   # Restart
   npm start
   ```

---

## You Are All Set

Your HR Hub Zambia application is ready to use. The system is fully functional with:

- Complete CRUD operations (Create, Read, Update, Delete)
- Real-time database connectivity
- Responsive web interface
- Comprehensive reporting and analytics
- Professional dashboard with statistics
- Activity logging and tracking

Start the server and explore the application!

---

Last Updated: May 14, 2026
Version: 1.0.0
Status: Production Ready
