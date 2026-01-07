CREATE TABLE classes (
  class_id INT PRIMARY KEY,
  class_name VARCHAR(50) NOT NULL
);

CREATE TABLE students (
  student_id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  class_id INT
);

INSERT INTO classes (class_id, class_name) VALUES
(101, 'JavaScript'),
(102, 'Python'),
(103, 'Java');


INSERT INTO students (student_id, name, class_id) VALUES
(1, 'Rahul', 101),
(2, 'Anjali', 102),
(3, 'Aman', 101),
(4, 'Neha', NULL);

SELECT * FROM classes;
SELECT * FROM students;


SELECT s.name, c.class_name
FROM students s
INNER JOIN classes c
ON s.class_id = c.class_id;


SELECT s.name, c.class_name
FROM students s
LEFT JOIN classes c
ON s.class_id = c.class_id;



SELECT s.name, c.class_name
FROM students s
RIGHT JOIN classes c
ON s.class_id = c.class_id;




LEFT TABLE = always full
right table = optional ( )





CREATE VIEW student_classes AS
SELECT s.name, c.class_name
FROM students s
FULL OUTER JOIN classes c
ON s.class_id = c.class_id;

SELECT * FROM student_classes




SELECT s.name, c.class_name
FROM students s
CROSS JOIN classes c;




CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  manager_id INT 
);

ALTER TABLE employees
ADD CONSTRAINT fk_manager
FOREIGN KEY (manager_id)
REFERENCES employees(employee_id)

INSERT INTO employees (employee_id, name, manager_id) VALUES
(1, 'Rahul', NULL),      -- Top-level manager
(2, 'Anjali', 1),        -- Reports to Rahul
(3, 'Aman', 1),          -- Reports to Rahul
(4, 'Neha', 243534545);          -- Reports to Anjali


SELECT 
	e.name AS employee,
	m.name AS manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.employee_id
	












SELECT class_id, COUNT(*) AS total_students
FROM students
GROUP BY class_id
HAVING COUNT(*) > 1;


