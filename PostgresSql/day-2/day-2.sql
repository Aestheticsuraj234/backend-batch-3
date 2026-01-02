CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dept VARCHAR(50) NOT NULL,
    salary NUMERIC(10, 2) CHECK (salary > 0),
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO employees (fname, lname, email, dept, salary, hire_date) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 75000.00, '2023-01-15'),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 65000.00, '2023-02-20'),
('Bob', 'Johnson', 'bob.johnson@company.com', 'Engineering', 80000.00, '2022-11-10'),
('Alice', 'Williams', 'alice.williams@company.com', 'HR', 60000.00, '2023-03-05'),
('Charlie', 'Brown', 'charlie.brown@company.com', 'Sales', 70000.00, '2023-01-25');

SELECT * FROM employees where dept = 'HR';

CREATE TABLE course_enrollments (
  enrollment_id SERIAL PRIMARY KEY,

  student_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,

  course_name VARCHAR(50) NOT NULL,
  level VARCHAR(20),

  price NUMERIC(8,2) CHECK (price > 0),

  enrolled_on DATE DEFAULT CURRENT_DATE,
  completion_status BOOLEAN DEFAULT FALSE,

  rating INT CHECK (rating BETWEEN 1 AND 5),

  course_meta JSONB,
  skills TEXT[]
 
);