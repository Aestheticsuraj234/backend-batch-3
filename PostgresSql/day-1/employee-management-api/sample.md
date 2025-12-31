// ============================================
// EMPLOYEE MANAGEMENT API - EXPRESS + POSTGRESQL
// ============================================

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'company_db',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL database');
        release();
    }
});

// ============================================
// ROUTES
// ============================================

// Home route - API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'Employee Management API',
        version: '1.0.0',
        endpoints: {
            'GET /api/employees': 'Get all employees',
            'GET /api/employees/:id': 'Get employee by ID',
            'GET /api/employees/dept/:dept': 'Get employees by department',
            'POST /api/employees': 'Create new employee',
            'PUT /api/employees/:id': 'Update employee',
            'DELETE /api/employees/:id': 'Delete employee',
            'GET /api/stats': 'Get employee statistics',
            'GET /api/employees/search': 'Search employees (query params: name, dept, min_salary, max_salary)'
        }
    });
});

// ============================================
// 1. GET ALL EMPLOYEES
// ============================================
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM employees ORDER BY emp_id ASC'
        );

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
});

// ============================================
// 2. GET EMPLOYEE BY ID
// ============================================
app.get('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM employees WHERE emp_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employee',
            error: error.message
        });
    }
});

// ============================================
// 3. GET EMPLOYEES BY DEPARTMENT
// ============================================
app.get('/api/employees/dept/:dept', async (req, res) => {
    try {
        const { dept } = req.params;

        const result = await pool.query(
            'SELECT * FROM employees WHERE dept = $1 ORDER BY emp_id ASC',
            [dept]
        );

        res.json({
            success: true,
            department: dept,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching employees by department:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees by department',
            error: error.message
        });
    }
});

// ============================================
// 4. CREATE NEW EMPLOYEE
// ============================================
app.post('/api/employees', async (req, res) => {
    try {
        const { fname, lname, email, dept, salary, hire_date } = req.body;

        // Validation
        if (!fname || !lname || !email || !dept || !salary) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: fname, lname, email, dept, salary'
            });
        }

        // Insert with RETURNING clause to get the created employee
        const result = await pool.query(
            `INSERT INTO employees (fname, lname, email, dept, salary, hire_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [fname, lname, email, dept, salary, hire_date || new Date()]
        );

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating employee:', error);

        // Handle unique constraint violation (duplicate email)
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
});

// ============================================
// 5. UPDATE EMPLOYEE
// ============================================
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fname, lname, email, dept, salary, hire_date } = req.body;

        // Check if employee exists
        const checkResult = await pool.query(
            'SELECT * FROM employees WHERE emp_id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (fname) {
            updates.push(`fname = $${paramCount++}`);
            values.push(fname);
        }
        if (lname) {
            updates.push(`lname = $${paramCount++}`);
            values.push(lname);
        }
        if (email) {
            updates.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (dept) {
            updates.push(`dept = $${paramCount++}`);
            values.push(dept);
        }
        if (salary) {
            updates.push(`salary = $${paramCount++}`);
            values.push(salary);
        }
        if (hire_date) {
            updates.push(`hire_date = $${paramCount++}`);
            values.push(hire_date);
        }

        // Always update updated_at
        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        if (updates.length === 1) { // Only updated_at
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(id);

        const result = await pool.query(
            `UPDATE employees
             SET ${updates.join(', ')}
             WHERE emp_id = $${paramCount}
             RETURNING *`,
            values
        );

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating employee:', error);

        // Handle unique constraint violation
        if (error.code === '23505') {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
});

// ============================================
// 6. DELETE EMPLOYEE
// ============================================
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM employees WHERE emp_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
});

// ============================================
// 7. GET EMPLOYEE STATISTICS
// ============================================
app.get('/api/stats', async (req, res) => {
    try {
        // Get department statistics
        const deptStatsResult = await pool.query(
            `SELECT
                dept,
                COUNT(*) as employee_count,
                AVG(salary)::NUMERIC(10,2) as avg_salary,
                MIN(salary) as min_salary,
                MAX(salary) as max_salary
             FROM employees
             GROUP BY dept
             ORDER BY employee_count DESC`
        );

        // Get overall statistics
        const overallResult = await pool.query(
            `SELECT
                COUNT(*) as total_employees,
                AVG(salary)::NUMERIC(10,2) as avg_salary,
                MIN(salary) as min_salary,
                MAX(salary) as max_salary,
                MIN(hire_date) as earliest_hire_date,
                MAX(hire_date) as latest_hire_date
             FROM employees`
        );

        res.json({
            success: true,
            overall: overallResult.rows[0],
            by_department: deptStatsResult.rows
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// ============================================
// 8. SEARCH EMPLOYEES (BONUS)
// ============================================
app.get('/api/employees/search', async (req, res) => {
    try {
        const { name, dept, min_salary, max_salary } = req.query;

        let query = 'SELECT * FROM employees WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (name) {
            query += ` AND (fname ILIKE $${paramCount} OR lname ILIKE $${paramCount})`;
            values.push(`%${name}%`);
            paramCount++;
        }

        if (dept) {
            query += ` AND dept = $${paramCount}`;
            values.push(dept);
            paramCount++;
        }

        if (min_salary) {
            query += ` AND salary >= $${paramCount}`;
            values.push(min_salary);
            paramCount++;
        }

        if (max_salary) {
            query += ` AND salary <= $${paramCount}`;
            values.push(max_salary);
            paramCount++;
        }

        query += ' ORDER BY emp_id ASC';

        const result = await pool.query(query, values);

        res.json({
            success: true,
            count: result.rows.length,
            filters: { name, dept, min_salary, max_salary },
            data: result.rows
        });
    } catch (error) {
        console.error('Error searching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching employees',
            error: error.message
        });
    }
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`📚 Documentation: http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏳ Shutting down gracefully...');
    await pool.end();
    console.log('✅ Database connections closed');
    process.exit(0);
});
