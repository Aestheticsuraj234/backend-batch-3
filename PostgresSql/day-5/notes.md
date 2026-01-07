# 📌 Stored Procedures & User Defined Functions in PostgreSQL

PostgreSQL allows us to write **server-side logic** using SQL (and PL/pgSQL) so that logic runs **inside the database** instead of the application.

This helps in:

* Reusability
* Performance
* Security
* Cleaner backend code

---

## 🧱 Sample Table (We’ll use this everywhere)

```sql
CREATE TABLE tech_youtubers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    channel VARCHAR(100),
    tech VARCHAR(50),
    subscribers_millions NUMERIC(4,2),
    active BOOLEAN DEFAULT true
);
```

### Sample Data

```sql
INSERT INTO tech_youtubers (name, channel, tech, subscribers_millions)
VALUES
('Hitesh Choudhary', 'Chai aur Code', 'JavaScript', 1.60),
('Anuj Bhaiya', 'Coding Shuttle', 'DSA', 0.85),
('Akshay Saini', 'Namaste JavaScript', 'JavaScript', 1.20),
('CodeWithHarry', 'CodeWithHarry', 'Full Stack', 5.80),
('Kunal Kushwaha', 'Kunal Kushwaha', 'DSA', 1.00);
```

---

# 🔹 User Defined Functions (UDF)

## ✅ What is a Function?

A **function**:

* Returns **a value**
* Can be used inside `SELECT`, `WHERE`, `JOIN`
* Is mostly used for **calculations & data fetching**

### 🔑 Key Points

* Must return something
* Can be used like built-in functions (`COUNT`, `SUM`)

---

## 🧠 Syntax of Function

```sql
CREATE FUNCTION function_name(parameters)
RETURNS return_type
LANGUAGE plpgsql
AS $$
BEGIN
   -- logic
   RETURN value;
END;
$$;
```

---

## 🧪 Example 1: Count Total YouTubers

```sql
CREATE FUNCTION total_youtubers()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM tech_youtubers);
END;
$$;
```

### ▶ Usage

```sql
SELECT total_youtubers();
```

---

## 🧪 Example 2: Get YouTubers by Tech

```sql
CREATE FUNCTION get_youtubers_by_tech(p_tech VARCHAR)
RETURNS TABLE(name VARCHAR, channel VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT name, channel
    FROM tech_youtubers
    WHERE tech = p_tech;
END;
$$;
```

### ▶ Usage

```sql
SELECT * FROM get_youtubers_by_tech('JavaScript');
```

---

## 🧪 Example 3: Check if Channel is Big or Small

```sql
CREATE FUNCTION channel_category(subs NUMERIC)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
    IF subs >= 1 THEN
        RETURN 'Big Channel';
    ELSE
        RETURN 'Growing Channel';
    END IF;
END;
$$;
```

### ▶ Usage

```sql
SELECT name, channel_category(subscribers_millions)
FROM tech_youtubers;
```

---

## 🟢 When to Use Functions?

✔ Calculations
✔ Data transformations
✔ Reusable logic
✔ Inside `SELECT` queries

---

# 🔹 Stored Procedures

## ✅ What is a Stored Procedure?

A **stored procedure**:

* Performs **actions**
* May or may not return data
* Supports **transactions (COMMIT / ROLLBACK)**
* Used for **insert, update, delete, workflows**

👉 Introduced properly in **PostgreSQL 11+**

---

## 🧠 Syntax of Procedure

```sql
CREATE PROCEDURE procedure_name(parameters)
LANGUAGE plpgsql
AS $$
BEGIN
   -- logic
END;
$$;
```

### ▶ Call Procedure

```sql
CALL procedure_name();
```

---

## 🧪 Example 1: Add New YouTuber

```sql
CREATE PROCEDURE add_youtuber(
    p_name VARCHAR,
    p_channel VARCHAR,
    p_tech VARCHAR,
    p_subs NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO tech_youtubers (name, channel, tech, subscribers_millions)
    VALUES (p_name, p_channel, p_tech, p_subs);
END;
$$;
```

### ▶ Usage

```sql
CALL add_youtuber('Tanay Pratap', 'Tanay Pratap', 'Web Development', 0.50);
```

---

## 🧪 Example 2: Deactivate a Channel

```sql
CREATE PROCEDURE deactivate_youtuber(p_channel VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tech_youtubers
    SET active = false
    WHERE channel = p_channel;
END;
$$;
```

### ▶ Usage

```sql
CALL deactivate_youtuber('Coding Shuttle');
```

---

## 🧪 Example 3: Transaction Handling

```sql
CREATE PROCEDURE safe_delete(p_channel VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM tech_youtubers WHERE channel = p_channel;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Channel not found';
    END IF;
END;
$$;
```

---

## 🟢 When to Use Procedures?

✔ Insert / Update / Delete
✔ Business workflows
✔ Transactions
✔ Backend logic execution

---

# ⚔️ Functions vs Procedures (Very Important)

| Feature        | Function             | Procedure              |
| -------------- | -------------------- | ---------------------- |
| Returns value  | ✅ Yes                | ❌ Optional             |
| Used in SELECT | ✅ Yes                | ❌ No                   |
| Transactions   | ❌ No                 | ✅ Yes                  |
| Call syntax    | `SELECT`             | `CALL`                 |
| Best for       | Logic & calculations | Operations & workflows |

---

# 🧠 Easy Rule to Remember

> 🔹 **Need a value? → Function**
> 🔹 **Need to do an action? → Procedure**

---

# 🔥 Real-World Use Case Mapping

| Use Case              | Use       |
| --------------------- | --------- |
| Calculate leaderboard | Function  |
| Filter data           | Function  |
| Insert user           | Procedure |
| Deactivate account    | Procedure |
| Payment workflow      | Procedure |

---

# 🧪 Practice Exercises

### 1️⃣ Create a function that returns total subscribers of all YouTubers

```sql
CREATE FUNCTION total_subscribers()
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT SUM(subscribers_millions)
        FROM tech_youtubers
    );
END;
$$;
```

### 2️⃣ Create a function that returns only active channels
```sql
CREATE FUNCTION get_active_channels()
RETURNS TABLE (
    name VARCHAR,
    channel VARCHAR,
    tech VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT name, channel, tech
    FROM tech_youtubers
    WHERE active = true;
END;
$$;

SELECT * FROM get_active_channels();

```
### 3️⃣ Create a procedure to update subscriber count
```sql
CREATE PROCEDURE update_subscribers(
    p_channel VARCHAR,
    p_new_subs NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tech_youtubers
    SET subscribers_millions = p_new_subs
    WHERE channel = p_channel;
END;
$$;

CALL update_subscribers('Chai aur Code', 1.75);
```

### 4️⃣ Create a procedure to mark all DSA channels inactive

```sql
CREATE PROCEDURE deactivate_dsa_channels()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE tech_youtubers
    SET active = false
    WHERE tech = 'DSA';
END;
$$;
