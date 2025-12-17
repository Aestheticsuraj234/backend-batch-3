# 📘 EXPRESS + REST API (START → END NOTES)

---

## 1️⃣ What is an API?

### Definition

An **API (Application Programming Interface)** is a way for two applications to **talk to each other**.

* Frontend → Backend
* Mobile App → Server
* Server → Server

The client **requests data**, the server **responds**.

---

## 2️⃣ What is a REST API?

### REST = Representational State Transfer

A **REST API** follows a set of rules for designing APIs using **HTTP**.

---

### Why REST?

* Simple
* Scalable
* Platform independent
* Works over HTTP
* Used everywhere (web, mobile, cloud)

---

### REST Core Concepts

#### 1. Resource

Everything is treated as a **resource**.

Example:

```
/tools
/tools/123
```

Here, **tool** is a resource.

---

#### 2. HTTP Methods

| Method | Purpose             |
| ------ | ------------------- |
| GET    | Fetch data          |
| POST   | Create data         |
| PUT    | Update entire data  |
| PATCH  | Update partial data |
| DELETE | Remove data         |

---

#### 3. Stateless

* Server does **not remember client**
* Every request is independent
* Auth data must be sent with every request

---

## 3️⃣ What is Express.js?

### Definition

**Express.js** is a **Node.js framework** that helps us:

* Create HTTP servers
* Build APIs
* Handle routes, requests, and responses easily

---

### Why Express over Node HTTP?

* Less code
* Cleaner syntax
* Middleware support
* Routing system

---

### Without Express (Node HTTP)

```js
http.createServer((req, res) => {});
```

### With Express

```js
app.get("/", (req, res) => {});
```

---

## 4️⃣ What is an HTTP Server?

An **HTTP Server**:

* Listens for requests
* Processes them
* Sends responses

Express internally uses **Node’s http module**.

---

## 5️⃣ Setting Up Express Server

### Step 1: Initialize Project

```bash
npm init -y
npm install express
```

---

### Step 2: Import Express

```js
import express from "express";
```

---

### Step 3: Create App Instance

```js
const app = express();
```

This `app` represents your backend application.

---

### Step 4: Start Server

```js
app.listen(3000);
```

This makes the server **listen on a port**.

---

## 6️⃣ Middleware in Express

### What is Middleware?

Middleware is a **function that runs before routes**.

Flow:

```
Request → Middleware → Route → Response
```

---

### JSON Middleware

```js
app.use(express.json());
```

* Parses JSON request body
* Required for `POST` & `PUT`
* Without it, `req.body` = `undefined`

---

## 7️⃣ Understanding Request & Response

### Request (`req`)

Contains:

* Params → `req.params`
* Query → `req.query`
* Body → `req.body`
* Headers → `req.headers`

---

### Response (`res`)

Used to send data back:

* `res.send()`
* `res.json()`
* `res.status()`

---

## 8️⃣ Modern Dataset (AI Tools)

### Why This Dataset?

* Real-world
* Scalable
* Easy to understand
* Relatable to modern devs

---

### Sample Data

```js
let aiTools = [
  {
    id: "tool_001",
    name: "ChatGPT",
    category: "AI Assistant",
    company: "OpenAI",
    pricing: "Freemium",
    rating: 4.8,
    tags: ["chat", "nlp"],
    isActive: true
  }
];
```

This is **temporary storage (in-memory)**.

---

## 9️⃣ CRUD Concept

### CRUD = Database Operations

| Operation | Meaning     |
| --------- | ----------- |
| Create    | Add data    |
| Read      | Fetch data  |
| Update    | Modify data |
| Delete    | Remove data |

---

## 1️⃣0️⃣ CREATE (POST)

### Purpose

Add a new tool.

---

### Route

```http
POST /tools
```

---

### Code

```js
app.post("/tools", (req, res) => {
  const { name, category, company } = req.body;

  if (!name || !category || !company) {
    return res.status(400).json({
      message: "Required fields missing"
    });
  }

  const newTool = {
    id: `tool_${Date.now()}`,
    name,
    category,
    company,
    pricing: "Freemium",
    rating: 0,
    tags: [],
    isActive: true
  };

  aiTools.push(newTool);
  res.status(201).json(newTool);
});
```

---

### Key Concepts

* Validation
* `req.body`
* `201 Created`
* Unique ID generation

---

## 1️⃣1️⃣ READ ALL (GET)

### Purpose

Fetch all tools.

---

### Route

```http
GET /tools
```

---

### Code

```js
app.get("/tools", (req, res) => {
  res.json(aiTools);
});
```

---

### Key Concepts

* No request body
* Read-only operation

---

## 1️⃣2️⃣ READ ONE (GET by ID)

### Route

```http
GET /tools/:id
```

---

### Code

```js
app.get("/tools/:id", (req, res) => {
  const tool = aiTools.find(
    t => t.id === req.params.id
  );

  if (!tool) {
    return res.status(404).json({
      message: "Tool not found"
    });
  }

  res.json(tool);
});
```

---

### Key Concepts

* Route params
* 404 error handling

---

## 1️⃣3️⃣ UPDATE (PUT)

### Purpose

Modify existing tool.

---

### Route

```http
PUT /tools/:id
```

---

### Code

```js
app.put("/tools/:id", (req, res) => {
  const index = aiTools.findIndex(
    t => t.id === req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Tool not found"
    });
  }

  aiTools[index] = {
    ...aiTools[index],
    ...req.body
  };

  res.json(aiTools[index]);
});
```

---

### Key Concepts

* Partial updates
* Spread operator
* Safe merging

---

## 1️⃣4️⃣ DELETE (DELETE)

### Route

```http
DELETE /tools/:id
```

---

### Code

```js
app.delete("/tools/:id", (req, res) => {
  aiTools = aiTools.filter(
    t => t.id !== req.params.id
  );

  res.json({
    message: "Tool deleted successfully"
  });
});
```

---

## 1️⃣5️⃣ HTTP Status Codes (Important)

| Code | Meaning      |
| ---- | ------------ |
| 200  | Success      |
| 201  | Created      |
| 400  | Bad Request  |
| 404  | Not Found    |
| 500  | Server Error |

---

## 1️⃣6️⃣ Why Single File First?

✔ Easy for beginners
✔ Clear learning flow
✔ No confusion
✔ Perfect for demos

Later → split into:

* routes
* controllers
* services

---

## 1️⃣7️⃣ Limitations of This Approach

* Data resets on server restart
* No persistence
* Not scalable


## 🎯 Final Mental Model

```
Client
  ↓ HTTP Request
Express Server
  ↓ Middleware
Route Handler
  ↓ Business Logic
Response (JSON)
```

