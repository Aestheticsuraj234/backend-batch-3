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

INSERT INTO course_enrollments (student_name, email, course_name, level, price, enrolled_on, completion_status, rating, course_meta, skills) VALUES
('Suraj Jha', 'suraj@chaicode.com', 'Next.js Mastery', 'Advanced', 299.99, '2025-12-01', TRUE, 5, '{"duration": "30 hours", "instructor": "Suraj"}', ARRAY['React','Next.js','TypeScript']),
('Priya Singh', 'priya@example.com', 'React Native Basics', 'Beginner', 149.00, '2025-11-15', FALSE, NULL, '{"duration": "20 hours", "platform": "Expo"}', ARRAY['React Native','JavaScript']),
('Amit Kumar', 'amit.dev@outlook.com', 'Node.js APIs', 'Intermediate', 249.50, '2025-12-20', TRUE, 4, '{"duration": "25 hours", "tools": ["Prisma","Express"]}', ARRAY['Node.js','Prisma','REST']),
('Neha Patel', 'neha@tech.com', 'Full-Stack React', 'Advanced', 399.99, '2025-11-10', TRUE, 5, '{"duration": "40 hours", "projects": 5}', ARRAY['React','Next.js','PostgreSQL']),
('Rahul Gupta', 'rahul.gupta@gmail.com', 'Python for AI', 'Intermediate', 199.00, '2025-12-05', FALSE, 3, '{"duration": "22 hours", "libs": ["LangChain"]}', ARRAY['Python','AI/ML']),
('Deepika Rani', 'deepika.rani@yahoo.com', 'Docker Essentials', 'Beginner', 129.99, '2025-11-25', TRUE, 4, '{"duration": "15 hours", "cloud": "Cloudflare"}', ARRAY['Docker','DevOps']),
('Vikram Singh', 'vikram@codearmy.com', 'Advanced SQL', 'Intermediate', 179.50, '2025-12-15', FALSE, NULL, '{"duration": "18 hours", "db": "PostgreSQL"}', ARRAY['SQL','PostgreSQL','Indexes']),
('Anita Joshi', 'anita.joshi@edu.in', 'TypeScript Pro', 'Advanced', 279.00, '2025-11-30', TRUE, 5, '{"duration": "28 hours", "focus": "Generics"}', ARRAY['TypeScript','Advanced JS']),
('Karan Mehra', 'karan.mehra@freelancer.com', 'Cloudflare Workers', 'Intermediate', 225.75, '2025-12-10', TRUE, 4, '{"duration": "24 hours", "serverless": true}', ARRAY['Cloudflare','Workers','Edge']),
('Sonia Verma', 'sonia.verma@startup.in', 'AI Integration', 'Advanced', 349.99, '2025-12-25', FALSE, 2, '{"duration": "35 hours", "apis": ["OpenAI"]}', ARRAY['AI','LangChain','Vercel']);



select * from course_enrollments;

SELECT course_meta->>'platform'
FROM course_enrollments;




SELECT *
FROM course_enrollments
WHERE skills @> Array['React'];




SELECT * FROM course_enrollments
WHERE level = 'Beginner';


SELECT DISTINCT course_name
FROM course_enrollments;




SELECT student_name, price
FROM course_enrollments
ORDER BY price DESC;


SELECT *
FROM course_enrollments
WHERE student_name LIKE 'a%';


SELECT *
FROM course_enrollments
WHERE student_name LIKE '%ngh';


SELECT *
FROM course_enrollments
WHERE student_name LIKE '____a';




SELECT *
FROM course_enrollments
WHERE level = 'Intermediate'
AND completion_status = true;



SELECT *
FROM course_enrollments
WHERE level = 'Beginner'
OR level = 'Advanced';


SELECT *
FROM course_enrollments
WHERE course_name IN ('Next.js Mastery', 'Node.js Pro');


-- Total enrollments
SELECT COUNT(*) FROM course_enrollments;

SELECT SUM(price) FROM course_enrollments;


SELECT course_name, SUM(price) AS revenue
FROM course_enrollments
GROUP BY course_name;

SELECT course_name, AVG(rating) as avg_rating
FROM course_enrollments
GROUP BY course_name ;

SELECT completion_status, COUNT(*)
FROM course_enrollments
GROUP BY completion_status;


SELECT UPPER(student_name)
FROM course_enrollments;













