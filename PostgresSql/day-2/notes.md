
# 📊 Sample Table (Single Source of Truth)

We will use **one table** so students don’t get confused.

### 🎓 Course Platform Example

```sql
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
  skills TEXT[],
  embedding VECTOR(3)
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

```

---

# 1️⃣ Datatypes in PostgreSQL (Core + Modern)

PostgreSQL supports **multiple data models**.

---

## 🔹 Core Datatypes (Most Used)

| Type         | Use Case                           |
| ------------ | ---------------------------------- |
| SERIAL       | Auto-increment IDs                 |
| INT          | Counts, ratings                    |
| NUMERIC(p,s) | Money (exact)                      |
| VARCHAR(n)   | Limited text                       |
| TEXT         | Unlimited text                     |
| BOOLEAN      | true / false                       |
| DATE         | Date only                          |
| TIMESTAMP    | Date + time                        |
| JSONB        | Semi-structured data, querying     |
| ARRAY        | Lists of values (e.g., tags[])     |
| ENUM         | Fixed set of values (e.g., status) |

```sql
price NUMERIC(8,2)
rating INT
completion_status BOOLEAN
```

---

## 🔹 JSON / JSONB (Modern Backend)

### JSON vs JSONB

| Feature  | JSON | JSONB  |
| -------- | ---- | ------ |
| Storage  | Text | Binary |
| Speed    | Slow | Fast   |
| Indexing | ❌    | ✅      |

✅ **Always use JSONB**

### Insert JSON Data

```sql
UPDATE course_enrollments
SET course_meta = '{
  "duration": "8 weeks",
  "mentor": "Hitesh",
  "projects": 5
}'
WHERE course_name = 'JavaScript Mastery';
```

### Query JSON

```sql
SELECT course_meta->>'mentor'
FROM course_enrollments;
```

```sql
SELECT *
FROM course_enrollments
WHERE course_meta->>'projects' = '5';
```

📌 Use cases:

* Metadata
* Feature flags
* API configs

---

## 🔹 ARRAY Type

```sql
UPDATE course_enrollments
SET skills = ARRAY['JavaScript', 'Async', 'DOM']
WHERE course_name = 'JavaScript Mastery';
```

```sql
SELECT *
FROM course_enrollments
WHERE 'React' = ANY(skills);
```

📌 Use cases:

* Tags
* Small fixed lists

⚠️ Not for large relations.

---

## 🔹 ENUM (Controlled Values)

```sql
CREATE TYPE course_level AS ENUM
('Beginner', 'Intermediate', 'Advanced');

ALTER TABLE course_enrollments
ALTER COLUMN level TYPE course_level
USING level::course_level;
```

📌 Safer than VARCHAR for states.

---


# 2️⃣ Constraints (Data Safety)

Constraints **prevent bad data**.

| Constraint    | Purpose        |
| ------------- | -------------- |
| `PRIMARY KEY` | Unique row     |
| `NOT NULL`    | Mandatory      |
| `UNIQUE`      | No duplicates  |
| `CHECK`       | Business rules |
| `DEFAULT`     | Auto value     |

```sql
email VARCHAR(100) UNIQUE NOT NULL
price CHECK (price > 0)
rating CHECK (rating BETWEEN 1 AND 5)
```

---

# 3️⃣ SELECT & Clauses

## 🔹 WHERE (Filtering rows based on conditions)
Filters rows returned by SELECT to match specified criteria, using operators like =, >, AND, OR.[1]

```sql
SELECT * FROM course_enrollments
WHERE level = 'Beginner';
```

## 🔹 DISTINCT (Removing duplicate rows)
Eliminates duplicate values from the result set, applied to all selected columns or specific ones.[1]

```sql
SELECT DISTINCT course_name
FROM course_enrollments;
```

## 🔹 ORDER BY (Sorting results)
Sorts the result set by one or more columns in ascending (ASC) or descending (DESC) order.[1]

```sql
SELECT student_name, price
FROM course_enrollments
ORDER BY price DESC;
```

## 🔹 LIMIT (Restricting number of rows)
Limits the number of rows returned, often combined with ORDER BY for pagination; OFFSET skips rows.[1]

```sql
SELECT *
FROM course_enrollments
ORDER BY enrolled_on DESC
LIMIT 5;
```

## 🔹 LIKE (Pattern matching in strings)
Matches text patterns using wildcards % (zero or more chars) and _ (single char), case-sensitive by default.[1]

```sql
-- Names starting with 'A'
SELECT *
FROM course_enrollments
WHERE student_name LIKE 'A%';

-- Names ending with 'son'
SELECT *
FROM course_enrollments
WHERE student_name LIKE '%son';

-- Names containing 'an' anywhere
SELECT *
FROM course_enrollments
WHERE student_name LIKE '%an%';

-- Names with exactly 5 characters (4 any + 'a')
SELECT *
FROM course_enrollments
WHERE student_name LIKE '____a';

-- Names starting with 'A' or 'B', 3 chars long
SELECT *
FROM course_enrollments
WHERE student_name LIKE '[AB]__';

-- Case-insensitive (PostgreSQL uses ILIKE)
SELECT *
FROM course_enrollments
WHERE student_name ILIKE 'a%';

-- Exclude names starting with 'Z'
SELECT *
FROM course_enrollments
WHERE student_name NOT LIKE 'Z%';

```

| Pattern | Meaning          |
|---------|------------------|
| `%`     | Any characters   |
| `_`     | One character    |


# 4️⃣ Conditions & Operators

## 🔹 Comparison (Evaluating relational values)
Uses operators like = (equal), != or <> (not equal), > (greater), < (less), >=, <= to compare values.[1]

```sql
price > 3000
rating >= 4
```

## 🔹 Logical Operators (Combining conditions)
AND requires all to be true; OR needs at least one true; NOT inverts a condition for complex filtering.[1]

```sql
SELECT *
FROM course_enrollments
WHERE level = 'Intermediate'
AND completion_status = true;
```

```sql
SELECT *
FROM course_enrollments
WHERE level = 'Beginner'
OR level = 'Advanced';
```

## 🔹 IN (Checking membership in a set)
Tests if a value matches any in a list, shorthand for multiple OR conditions; efficient for fixed lists.[1]

```sql
SELECT *
FROM course_enrollments
WHERE course_name IN ('React Bootcamp', 'Node.js Pro');
```

## 🔹 BETWEEN (Range testing inclusive)
Checks if a value lies within a range (inclusive), equivalent to col >= min AND col <= max; works on dates too.[1]

```sql
SELECT *
FROM course_enrollments
WHERE price BETWEEN 3000 AND 5000;
```


# 5️⃣ Aggregate Functions

Aggregates work on **multiple rows → single result**.

| Function  | Use          |
|-----------|--------------|
| `COUNT()` | Total rows   |
| `SUM()`   | Total value  |
| `AVG()`   | Average      |
| `MIN()`   | Lowest       |
| `MAX()`   | Highest      |

## Examples
```sql
-- Total enrollments
SELECT COUNT(*) FROM course_enrollments;
```

```sql
-- Total revenue
SELECT SUM(price) FROM course_enrollments;
```

```sql
-- Average price
SELECT AVG(price) FROM course_enrollments;
```

```sql
-- Cheapest course price
SELECT MIN(price) FROM course_enrollments;
```

```sql
-- Most expensive course price
SELECT MAX(price) FROM course_enrollments;
```

## Grouping Tip
Combine with GROUP BY for per-group stats, like `SELECT level, AVG(price) FROM course_enrollments GROUP BY level;`.[1]


# 6️⃣ GROUP BY (Analytics Core)

Groups rows with identical values in specified columns into summary rows for aggregate computations. Used **only with aggregates**.[1]

## Revenue Per Course
```sql
SELECT course_name, SUM(price) AS revenue
FROM course_enrollments
GROUP BY course_name;
```

## Average Rating Per Course
```sql
SELECT course_name, AVG(rating)
FROM course_enrollments
GROUP BY course_name;
```

## Completion Status Count
```sql
SELECT completion_status, COUNT(*)
FROM course_enrollments
GROUP BY completion_status;
```

⚠️ Rule:

> Any column in `SELECT` without aggregate → must be in `GROUP BY`


# 7️⃣ String Functions

## 🔹 UPPER / LOWER (Case conversion)
Converts strings to uppercase (UPPER) or lowercase (LOWER) for consistent comparisons or display.

```sql
SELECT UPPER(student_name)
FROM course_enrollments;
```

## 🔹 LENGTH (String length)
Returns the number of characters in a string.

```sql
SELECT student_name, LENGTH(student_name)
FROM course_enrollments;
```

## 🔹 CONCAT (String concatenation)
Joins two or more strings into one; use `||` operator alternatively.

```sql
SELECT CONCAT(student_name, ' enrolled in ', course_name)
FROM course_enrollments;
```

## 🔹 SUBSTRING (Extract part of string)
Extracts a substring starting at position, for length chars, or using patterns like regex.

```sql
SELECT SUBSTRING(email FROM 1 FOR 5)
FROM course_enrollments;
```

## 🔹 TRIM (Remove whitespace)
Removes leading/trailing spaces (TRIM), or specific sides (LTRIM/RTRIM).

```sql
SELECT TRIM('   PostgreSQL   ');
```


# 🧠 PostgreSQL Coding Exercises (With Answers)


## 🧩 Exercise 1: Filter + Sorting

### ❓ Problem

Get the **top 3 most expensive enrollments** where the course level is **Intermediate**.

### 🔍 Concepts Tested

* `WHERE`
* `ORDER BY`
* `LIMIT`

### ✅ Answer

```sql
SELECT student_name, course_name, price
FROM course_enrollments
WHERE level = 'Intermediate'
ORDER BY price DESC
LIMIT 3;
```

---

## 🧩 Exercise 2: Aggregate + GROUP BY

### ❓ Problem

Find the **total revenue generated by each course**.

### 🔍 Concepts Tested

* `SUM()`
* `GROUP BY`

### ✅ Answer

```sql
SELECT course_name, SUM(price) AS total_revenue
FROM course_enrollments
GROUP BY course_name;
```

---

## 🧩 Exercise 3: JSONB Query

### ❓ Problem

Fetch all enrollments where the **mentor name is "Hitesh"** from `course_meta`.

### 🔍 Concepts Tested

* `JSONB`
* `->>` operator
* Filtering JSON data

### ✅ Answer

```sql
SELECT student_name, course_name
FROM course_enrollments
WHERE course_meta->>'mentor' = 'Hitesh';
```

---

## 🧩 Exercise 4: ARRAY Condition

### ❓ Problem

Find all students enrolled in courses that include **"JavaScript"** in the `skills` array.

### 🔍 Concepts Tested

* `ARRAY`
* `ANY()`

### ✅ Answer

```sql
SELECT student_name, course_name
FROM course_enrollments
WHERE 'JavaScript' = ANY(skills);
```

---

## 🧩 Exercise 5: GROUP BY + Condition

### ❓ Problem

For **completed enrollments only**, find the **average rating per course**, sorted by highest rating first.

### 🔍 Concepts Tested

* `WHERE`
* `AVG()`
* `GROUP BY`
* `ORDER BY`

### ✅ Answer

```sql
SELECT course_name, AVG(rating) AS avg_rating
FROM course_enrollments
WHERE completion_status = true
GROUP BY course_name
ORDER BY avg_rating DESC;
```

---

# 🏁 Bonus Challenge (Optional – Interview Level)

### ❓ Problem

Find the **course name that has the highest number of enrollments**.

### ✅ Answer

```sql
SELECT course_name, COUNT(*) AS total_enrollments
FROM course_enrollments
GROUP BY course_name
ORDER BY total_enrollments DESC
LIMIT 1;
```


