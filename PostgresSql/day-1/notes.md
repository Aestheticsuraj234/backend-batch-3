# PostgreSQL Comprehensive Guide

## 1. Installation on Windows

### Download and Install
1. Visit [PostgreSQL Official Download Page](https://www.postgresql.org/download/windows/)
2. Download the installer (recommended: latest stable version)
3. Run the installer and follow these steps:
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\16`)
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set data directory (default: `C:\Program Files\PostgreSQL\16\data`)
   - **Set superuser password** (remember this!)
   - Set port (default: 5432)
   - Set locale (default is fine)

### Verify Installation
```bash
# Open Command Prompt or PowerShell
psql --version
# Should output: psql (PostgreSQL) 16.x
```

### First Time Setup
```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# You'll be prompted for the password you set during installation
```

---

## 2. Basic psql Commands (Interactive Terminal)

### Meta-Commands (start with backslash)
```sql
\l                    -- List all databases
\l+                   -- List databases with additional info
\c database_name      -- Connect to a database
\dt                   -- List all tables in current database
\dt+                  -- List tables with additional info
\d table_name         -- Describe table structure
\du                   -- List all users/roles
\dn                   -- List all schemas
\df                   -- List all functions
\dv                   -- List all views
\q                    -- Quit psql
\?                    -- Help on meta-commands
\h                    -- Help on SQL commands
\h CREATE TABLE       -- Help on specific SQL command

-- Windows-specific commands
\! cls                -- Clear screen (Windows)
\! dir                -- Run Windows dir command
```

---

## 3. Database Operations

### Creating a Database
```sql
-- Basic creation
CREATE DATABASE company_db;

-- With specific owner
CREATE DATABASE company_db OWNER postgres;

-- With encoding and collation
CREATE DATABASE company_db
    OWNER postgres
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE template0;
```

### Connecting to a Database
```sql
-- From psql
\c company_db

-- From command line
psql -U postgres -d company_db
```

### Listing Databases
```sql
-- Using meta-command
\l

-- Using SQL query
SELECT datname FROM pg_database;

-- Detailed information
SELECT 
    datname AS database_name,
    pg_size_pretty(pg_database_size(datname)) AS size,
    datcollate AS collation
FROM pg_database;
```

### Dropping a Database
```sql
-- Must disconnect from the database first
\c postgres  -- Switch to another database

DROP DATABASE company_db;

-- With IF EXISTS clause (no error if doesn't exist)
DROP DATABASE IF EXISTS company_db;
```

---

## 4. Table Operations (CRUD)

### CREATE - Creating Tables

#### Basic Table Creation
```sql
CREATE TABLE employees (
    emp_id INTEGER,
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(100),
    dept VARCHAR(50),
    salary NUMERIC(10, 2),
    hire_date DATE
);
```

#### Table with Constraints
```sql
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dept VARCHAR(50) DEFAULT 'General',
    salary NUMERIC(10, 2) CHECK (salary > 0),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table with Foreign Key
```sql
-- Parent table
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(100)
);

-- Child table with foreign key
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dept_id INTEGER REFERENCES departments(dept_id) ON DELETE SET NULL,
    salary NUMERIC(10, 2),
    hire_date DATE NOT NULL
);
```

### READ - Selecting Data

#### Basic SELECT
```sql
-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT fname, lname, email FROM employees;

-- With WHERE clause
SELECT * FROM employees WHERE dept = 'Engineering';

-- With multiple conditions
SELECT * FROM employees 
WHERE dept = 'Engineering' AND salary > 50000;

-- Pattern matching
SELECT * FROM employees WHERE email LIKE '%@company.com';

-- Sorting
SELECT * FROM employees ORDER BY hire_date DESC;

-- Limiting results
SELECT * FROM employees LIMIT 10;

-- With offset (pagination)
SELECT * FROM employees LIMIT 10 OFFSET 20;
```

#### Advanced SELECT
```sql
-- Aggregate functions
SELECT COUNT(*) FROM employees;
SELECT AVG(salary) FROM employees;
SELECT MAX(salary), MIN(salary) FROM employees;

-- GROUP BY
SELECT dept, COUNT(*), AVG(salary) 
FROM employees 
GROUP BY dept;

-- HAVING (filter after grouping)
SELECT dept, AVG(salary) 
FROM employees 
GROUP BY dept 
HAVING AVG(salary) > 60000;

-- JOINs
SELECT e.fname, e.lname, d.dept_name 
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- Subqueries
SELECT * FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### UPDATE - Modifying Data

```sql
-- Update single column
UPDATE employees 
SET salary = 55000 
WHERE emp_id = 1;

-- Update multiple columns
UPDATE employees 
SET salary = 60000, dept = 'Senior Engineering'
WHERE emp_id = 1;

-- Update with calculation
UPDATE employees 
SET salary = salary * 1.10 
WHERE dept = 'Engineering';

-- Update all rows (be careful!)
UPDATE employees SET updated_at = CURRENT_TIMESTAMP;

-- Update with subquery
UPDATE employees 
SET salary = (SELECT AVG(salary) FROM employees WHERE dept = 'Engineering')
WHERE emp_id = 5;

-- RETURNING clause (PostgreSQL specific)
UPDATE employees 
SET salary = 65000 
WHERE emp_id = 1
RETURNING *;
```

### DELETE - Removing Data

```sql
-- Delete specific row
DELETE FROM employees WHERE emp_id = 1;

-- Delete with condition
DELETE FROM employees WHERE hire_date < '2020-01-01';

-- Delete all rows (be very careful!)
DELETE FROM employees;

-- TRUNCATE (faster for deleting all rows)
TRUNCATE TABLE employees;

-- TRUNCATE with cascade
TRUNCATE TABLE employees CASCADE;

-- DELETE with RETURNING
DELETE FROM employees 
WHERE emp_id = 1
RETURNING *;
```

---

## 5. Data Types in PostgreSQL

### Numeric Types
```sql
-- Integer types
SMALLINT          -- 2 bytes, -32768 to +32767
INTEGER or INT    -- 4 bytes, -2147483648 to +2147483647
BIGINT            -- 8 bytes, very large integers
SERIAL            -- Auto-incrementing INTEGER
BIGSERIAL         -- Auto-incrementing BIGINT

-- Decimal types
DECIMAL(p, s)     -- Exact numeric, p=precision, s=scale
NUMERIC(p, s)     -- Same as DECIMAL
REAL              -- 6 decimal digits precision
DOUBLE PRECISION  -- 15 decimal digits precision

-- Example
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2),  -- Max 10 digits, 2 after decimal
    quantity INTEGER
);
```

### Character Types
```sql
CHAR(n)           -- Fixed-length, padded with spaces
VARCHAR(n)        -- Variable-length with limit
TEXT              -- Unlimited length

-- Example
CREATE TABLE users (
    username VARCHAR(50),      -- Max 50 characters
    bio TEXT,                  -- Unlimited length
    country_code CHAR(2)       -- Exactly 2 characters
);
```

### Date/Time Types
```sql
DATE              -- Date only (YYYY-MM-DD)
TIME              -- Time only (HH:MM:SS)
TIMESTAMP         -- Date and time
TIMESTAMPTZ       -- Timestamp with timezone
INTERVAL          -- Time interval

-- Example
CREATE TABLE events (
    event_date DATE,
    event_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_at TIMESTAMPTZ,
    duration INTERVAL
);

-- Usage
INSERT INTO events (event_date, event_time, duration) 
VALUES ('2025-12-31', '14:30:00', INTERVAL '2 hours');
```

### Boolean Type
```sql
BOOLEAN           -- TRUE, FALSE, or NULL

CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE
);
```

### JSON Types
```sql
JSON              -- Text-based JSON
JSONB             -- Binary JSON (faster, recommended)

CREATE TABLE api_logs (
    log_id SERIAL PRIMARY KEY,
    request_data JSONB,
    response_data JSONB
);

-- Inserting JSON
INSERT INTO api_logs (request_data) 
VALUES ('{"user": "john", "action": "login"}');

-- Querying JSON
SELECT request_data->>'user' FROM api_logs;
```

### Array Types
```sql
-- Any type can be an array
INTEGER[]
TEXT[]
VARCHAR(50)[]

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    tags TEXT[],
    ratings INTEGER[]
);

-- Inserting arrays
INSERT INTO posts (tags, ratings) 
VALUES (ARRAY['tech', 'programming'], ARRAY[5, 4, 5]);

-- Or using curly braces
INSERT INTO posts (tags) VALUES ('{"tech", "programming"}');
```

---

## 6. Constraints

### PRIMARY KEY
```sql
-- Single column
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50)
);

-- Composite primary key
CREATE TABLE order_items (
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

### FOREIGN KEY
```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    order_date DATE
);

-- With referential actions
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) 
        ON DELETE CASCADE          -- Delete orders when user is deleted
        ON UPDATE CASCADE,         -- Update if user_id changes
    order_date DATE
);
```

### UNIQUE
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50) UNIQUE
);

-- Multi-column unique constraint
CREATE TABLE user_roles (
    user_id INTEGER,
    role_id INTEGER,
    UNIQUE (user_id, role_id)
);
```

### NOT NULL
```sql
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);
```

### CHECK
```sql
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    age INTEGER CHECK (age >= 18 AND age <= 65),
    salary NUMERIC(10, 2) CHECK (salary > 0),
    email VARCHAR(100) CHECK (email LIKE '%@%')
);

-- Named constraint
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2),
    CONSTRAINT positive_price CHECK (price > 0)
);
```

### DEFAULT
```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SERIAL and Auto-increment

```sql
-- SERIAL is shorthand for:
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY
);

-- Which is equivalent to:
CREATE SEQUENCE users_user_id_seq;
CREATE TABLE users (
    user_id INTEGER NOT NULL DEFAULT nextval('users_user_id_seq'),
    PRIMARY KEY (user_id)
);

-- Manual sequence control
CREATE SEQUENCE emp_id_seq START 1000 INCREMENT 1;

CREATE TABLE employees (
    emp_id INTEGER DEFAULT nextval('emp_id_seq') PRIMARY KEY,
    fname VARCHAR(50)
);

-- Get next value
SELECT nextval('emp_id_seq');

-- Get current value
SELECT currval('emp_id_seq');

-- Reset sequence
ALTER SEQUENCE emp_id_seq RESTART WITH 1;
```

---

## 7. Advanced Operations

### Indexes
```sql
-- Create index
CREATE INDEX idx_employees_email ON employees(email);

-- Unique index
CREATE UNIQUE INDEX idx_employees_email ON employees(email);

-- Multi-column index
CREATE INDEX idx_employees_name ON employees(fname, lname);

-- Partial index
CREATE INDEX idx_high_salary ON employees(salary) WHERE salary > 100000;

-- List indexes
\di

-- Drop index
DROP INDEX idx_employees_email;
```

### Views
```sql
-- Create view
CREATE VIEW employee_summary AS
SELECT emp_id, fname, lname, dept, salary
FROM employees
WHERE salary > 50000;

-- Query view
SELECT * FROM employee_summary;

-- Materialized view (cached results)
CREATE MATERIALIZED VIEW dept_stats AS
SELECT dept, COUNT(*), AVG(salary)
FROM employees
GROUP BY dept;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW dept_stats;
```

### Transactions
```sql
-- Start transaction
BEGIN;

-- Execute queries
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- Commit (save changes)
COMMIT;

-- Or rollback (undo changes)
ROLLBACK;

-- Savepoints
BEGIN;
UPDATE employees SET salary = salary * 1.1;
SAVEPOINT before_delete;
DELETE FROM employees WHERE emp_id = 5;
ROLLBACK TO before_delete;  -- Undo delete but keep update
COMMIT;
```

---

## 8. Useful Queries and Tips

### Getting Table Information
```sql
-- Table structure
\d employees

-- Table size
SELECT pg_size_pretty(pg_total_relation_size('employees'));

-- All tables with sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup and Restore
```bash
# Backup database (from command line)
pg_dump -U postgres company_db > backup.sql

# Backup with custom format
pg_dump -U postgres -Fc company_db > backup.dump

# Restore from SQL file
psql -U postgres company_db < backup.sql

# Restore from custom format
pg_restore -U postgres -d company_db backup.dump
```

### Connection String Format
```
postgresql://username:password@localhost:5432/database_name
```

---

## 9. Best Practices

1. **Always use SERIAL for auto-incrementing IDs**
2. **Add NOT NULL constraints to required fields**
3. **Create indexes on frequently queried columns**
4. **Use transactions for multiple related operations**
5. **Use TIMESTAMPTZ over TIMESTAMP for timezone awareness**
6. **Name constraints explicitly for easier debugging**
7. **Use VARCHAR over CHAR unless fixed-length is required**
8. **Regular backups using pg_dump**
9. **Use prepared statements to prevent SQL injection**
10. **Keep PostgreSQL updated to latest stable version**

---

## 10. Common Errors and Solutions

### "database does not exist"
```sql
-- Create it first
CREATE DATABASE company_db;
```

### "relation already exists"
```sql
-- Drop and recreate, or use IF NOT EXISTS
CREATE TABLE IF NOT EXISTS employees (...);
```

### "permission denied"
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE company_db TO username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
```

### "cannot drop database because it is being accessed"
```sql
-- Disconnect all users first
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'company_db';

DROP DATABASE company_db;
```

---

## Quick Reference Card

```sql
-- Database
CREATE DATABASE dbname;
\c dbname
DROP DATABASE dbname;

-- Table
CREATE TABLE tbl (...);
\d tbl
DROP TABLE tbl;

-- CRUD
INSERT INTO tbl VALUES (...);
SELECT * FROM tbl WHERE condition;
UPDATE tbl SET col=val WHERE condition;
DELETE FROM tbl WHERE condition;

-- Constraints
PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT

-- Types
SERIAL, INTEGER, VARCHAR(n), TEXT, DATE, TIMESTAMP, BOOLEAN, JSONB
```