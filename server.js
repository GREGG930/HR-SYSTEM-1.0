const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const db = new sqlite3.Database(path.join(__dirname, 'data', 'hr_database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});


function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      manager TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      initials TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      status TEXT DEFAULT 'Active',
      joined_date TEXT,
      leave_balance TEXT DEFAULT '21 days',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      action TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE
    )`, [], () => {
      db.get("SELECT COUNT(*) as count FROM employees", [], (err, row) => {
        if (err || !row || row.count === 0) {
          insertSampleData();
        }
      });
    });
  });
}


function insertSampleData() {
  const sampleEmployees = [
    { initials: 'MN', name: 'Mwamba Nkandu', role: 'Senior Developer', dept: 'Engineering', email: 'mwamba.nkandu@hrhub.co.zm', phone: '+260 97 123 4567', city: 'Lusaka', status: 'Active', joined: 'Jan 15, 2021', leave: '18 days' },
    { initials: 'TM', name: 'Thandiwe Mumba', role: 'Product Manager', dept: 'Product', email: 'thandiwe.mumba@hrhub.co.zm', phone: '+260 96 987 6543', city: 'Kitwe', status: 'Active', joined: 'Mar 8, 2022', leave: '21 days' },
    { initials: 'KB', name: 'Kondwani Banda', role: 'UX Designer', dept: 'Design', email: 'kondwani.banda@hrhub.co.zm', phone: '+260 95 456 7890', city: 'Ndola', status: 'Active', joined: 'May 12, 2021', leave: '16 days' },
    { initials: 'NZ', name: 'Natasha Zulu', role: 'Marketing Manager', dept: 'Marketing', email: 'natasha.zulu@hrhub.co.zm', phone: '+260 97 234 5678', city: 'Livingstone', status: 'Active', joined: 'Aug 3, 2020', leave: '24 days' },
    { initials: 'BC', name: 'Bwalya Chilufya', role: 'HR Specialist', dept: 'HR', email: 'bwalya.chilufya@hrhub.co.zm', phone: '+260 96 876 5432', city: 'Lusaka', status: 'Onboarding', joined: 'Jun 15, 2024', leave: '5 days' }
  ];

  const sampleActivities = [
    { employee_id: 1, action: 'Requested sick leave', date: 'Today, 10:30 AM', status: 'Pending' },
    { employee_id: 2, action: 'New hire onboarding', date: 'Yesterday', status: 'Completed' },
    { employee_id: 3, action: 'Training completion', date: 'Yesterday', status: 'Completed' },
    { employee_id: 4, action: 'Updated job title', date: '2 days ago', status: 'Completed' },
    { employee_id: 5, action: 'Submitted expense report', date: '3 days ago', status: 'Pending' }
  ];

  
  const departmentStmt = db.prepare(`INSERT OR IGNORE INTO departments (name, manager, location) VALUES (?, ?, ?)`);
  const sampleDepartments = [
    { name: 'Engineering', manager: 'Mwamba Nkandu', location: 'Lusaka HQ' },
    { name: 'Product', manager: 'Thandiwe Mumba', location: 'Kitwe Branch' },
    { name: 'Design', manager: 'Kondwani Banda', location: 'Ndola Branch' },
    { name: 'Marketing', manager: 'Natasha Zulu', location: 'Livingstone Office' },
    { name: 'HR', manager: 'Bwalya Chilufya', location: 'Lusaka HQ' },
    { name: 'Finance', manager: 'Natasha Zulu', location: 'Lusaka HQ' },
    { name: 'Operations', manager: 'Kondwani Banda', location: 'Ndola Branch' }
  ];
  sampleDepartments.forEach(dep => {
    departmentStmt.run(dep.name, dep.manager, dep.location);
  });
  departmentStmt.finalize();

  const employeeStmt = db.prepare(`INSERT INTO employees (initials, name, role, department, email, phone, city, status, joined_date, leave_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  sampleEmployees.forEach(emp => {
    employeeStmt.run(emp.initials, emp.name, emp.role, emp.dept, emp.email, emp.phone, emp.city, emp.status, emp.joined, emp.leave);
  });
  employeeStmt.finalize();

  
  const activityStmt = db.prepare(`INSERT INTO activities (employee_id, action, date, status) VALUES (?, ?, ?, ?)`);
  sampleActivities.forEach(act => {
    activityStmt.run(act.employee_id, act.action, act.date, act.status);
  });
  activityStmt.finalize();

  console.log('Sample data inserted.');
}




app.get('/api/employees', (req, res) => {
  db.all(`SELECT e.*, d.name as department_name FROM employees e LEFT JOIN departments d ON e.department = d.name ORDER BY e.created_at DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/employees/:id', (req, res) => {
  db.get(`SELECT e.*, d.name as department_name FROM employees e LEFT JOIN departments d ON e.department = d.name WHERE e.id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Employee not found' });
    res.json(row);
  });
});

app.put('/api/employees/:id', (req, res) => {
  const { name, role, department, email, phone, city, status, leave_balance } = req.body;
  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
    updates.push('initials = ?');
    const nameParts = name.split(' ');
    params.push(nameParts.map(part => part.charAt(0).toUpperCase()).join(''));
  }
  if (role) {
    updates.push('role = ?');
    params.push(role);
  }
  if (department) {
    updates.push('department = ?');
    params.push(department);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (phone !== undefined) {
    updates.push('phone = ?');
    params.push(phone);
  }
  if (city !== undefined) {
    updates.push('city = ?');
    params.push(city);
  }
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (leave_balance) {
    updates.push('leave_balance = ?');
    params.push(leave_balance);
  }

  if (!updates.length) {
    return res.status(400).json({ error: 'No employee fields to update' });
  }

  params.push(req.params.id);
  db.run(`UPDATE employees SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.get(`SELECT * FROM employees WHERE id = ?`, [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Employee updated successfully', employee: row });
    });
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  db.run(`DELETE FROM activities WHERE employee_id = ?`, [employeeId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    db.run(`DELETE FROM employees WHERE id = ?`, [employeeId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully' });
    });
  });
});

app.post('/api/employees', (req, res) => {
  const { name, role, department, email, phone, city, status = 'Active', joined_date, leave_balance = '21 days' } = req.body;

  if (!name || !role || !department || !email) {
    return res.status(400).json({ error: 'Name, role, department, and email are required' });
  }

  
  const nameParts = name.split(' ');
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');

  
  const currentDate = new Date();
  const defaultJoinedDate = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const sql = `INSERT INTO employees (initials, name, role, department, email, phone, city, status, joined_date, leave_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [initials, name, role, department, email, phone || '', city || 'Lusaka', status, joined_date || defaultJoinedDate, leave_balance || '21 days'];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    
    db.get(`SELECT * FROM employees WHERE id = ?`, [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Employee added successfully', employee: row });
    });
  });
});


app.get('/api/activities', (req, res) => {
  const { employee_id } = req.query;
  let query = `SELECT a.*, e.name as employee_name, e.initials FROM activities a LEFT JOIN employees e ON a.employee_id = e.id`;
  const params = [];
  if (employee_id) {
    query += ` WHERE a.employee_id = ?`;
    params.push(employee_id);
  }
  query += ` ORDER BY a.created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/activities/:id', (req, res) => {
  db.get(`SELECT a.*, e.name as employee_name, e.initials FROM activities a LEFT JOIN employees e ON a.employee_id = e.id WHERE a.id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Activity not found' });
    res.json(row);
  });
});

app.post('/api/activities', (req, res) => {
  const { employee_id, action, status } = req.body;

  if (!employee_id || !action) {
    return res.status(400).json({ error: 'Employee ID and action are required' });
  }

  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const sql = `INSERT INTO activities (employee_id, action, date, status) VALUES (?, ?, ?, ?)`;
  const params = [employee_id, action, dateStr, status || 'Completed'];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Activity added successfully', id: this.lastID });
  });
});

app.put('/api/activities/:id', (req, res) => {
  const { action, status } = req.body;
  const updates = [];
  const params = [];

  if (action) {
    updates.push('action = ?');
    params.push(action);
  }
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (!updates.length) {
    return res.status(400).json({ error: 'No activity fields to update' });
  }

  params.push(req.params.id);

  db.run(`UPDATE activities SET ${updates.join(', ')} WHERE id = ?`, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity updated successfully' });
  });
});

app.delete('/api/activities/:id', (req, res) => {
  db.run(`DELETE FROM activities WHERE id = ?`, [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  });
});

app.get('/api/departments', (req, res) => {
  db.all(`SELECT * FROM departments ORDER BY name`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/reports/summary', (req, res) => {
  const summary = {};
  db.get(`SELECT COUNT(*) AS totalEmployees FROM employees`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    summary.totalEmployees = row.totalEmployees;

    db.get(`SELECT COUNT(*) AS pendingLeave FROM activities WHERE action LIKE '%leave%' AND status = 'Pending'`, [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      summary.pendingLeave = row.pendingLeave;

      db.get(`SELECT COUNT(*) AS totalActivities FROM activities`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        summary.totalActivities = row.totalActivities;

        db.get(`SELECT COUNT(*) AS completedActivities FROM activities WHERE status = 'Completed'`, [], (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          summary.completedActivities = row.completedActivities;
          summary.pendingActivities = summary.totalActivities - summary.completedActivities;
          res.json(summary);
        });
      });
    });
  });
});

app.get('/api/reports/departments', (req, res) => {
  db.all(`SELECT department AS name, COUNT(*) AS employeeCount FROM employees GROUP BY department ORDER BY employeeCount DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};

  db.get(`SELECT COUNT(*) as count FROM employees`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalEmployees = row.count;

    db.get(`SELECT COUNT(*) as count FROM activities WHERE action LIKE '%leave%' AND status = 'Pending'`, [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.pendingLeave = row.count;

      db.get(`SELECT COUNT(*) as count FROM departments`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.openPositions = Math.max(12, row.count * 2);

        stats.monthlyPayroll = `K${(stats.totalEmployees * 18000).toLocaleString()}`;
        res.json(stats);
      });
    });
  });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});