# 🍪 Cookies in Express.js & HTTP Status Codes🚦

---

## ✅ What are Cookies?

Cookies are small pieces of data stored on the **client-side (browser)** that the server can send and access for various purposes like:

* Authentication (e.g., remember user login)
* Storing user preferences
* Session tracking

Cookies are part of the **HTTP header**.

---

## 🍪 Setting Cookies in Express (Without Middleware)

You can set cookies using `res.cookie()`:

```js
const express = require('express');
const app = express();

app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'john_doe');
  res.send('Cookie has been set!');
});
```

By default:

* Cookies are **not signed**
* Cookies are **not HTTPOnly**, **Secure**, or **Persistent**

---

## 🧪 Reading Cookies (Without Middleware)

Express does **not** parse cookies from the request by default. You’d have to parse `req.headers.cookie` manually or use middleware like `cookie-parser`.

Example without `cookie-parser`:

```js
app.get('/read-cookie', (req, res) => {
  const rawCookies = req.headers.cookie; // 'username=john_doe'
  res.send(`Raw Cookies: ${rawCookies}`);
});
```

---

## 🔌 Using `cookie-parser` Middleware

### ✅ Installation

```bash
npm install cookie-parser
```

### ✅ Usage

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser()); // enable cookie parsing

app.get('/set', (req, res) => {
  res.cookie('theme', 'dark');
  res.send('Theme cookie set!');
});

app.get('/get', (req, res) => {
  const theme = req.cookies.theme;
  res.send(`Theme is: ${theme}`);
});
```

---

## 🔏 Signed Cookies

Signed cookies add **integrity**. Even if someone tampers with the cookie value, Express will know.

### ✅ Setup with Secret

```js
app.use(cookieParser('mySecretKey'));
```

### ✅ Setting a Signed Cookie

```js
res.cookie('token', 'secureValue', { signed: true });
```

### ✅ Reading a Signed Cookie

```js
const token = req.signedCookies.token;
res.send(`Signed Token: ${token}`);
```

🛑 If tampered, `req.signedCookies.token` will return `undefined`.

---

## 🍪 Cookie Options

```js
res.cookie('name', 'value', {
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  httpOnly: true,             // can't be accessed by JS
  secure: true,               // HTTPS only
  signed: true,               // signed cookie
  path: '/',                  // URL path where cookie is accessible
  sameSite: 'lax',            // CSRF protection
});
```

---

## ❌ Clearing Cookies

```js
res.clearCookie('name');
```

---

# 🚦 HTTP Status Codes (1xx – 5xx)

HTTP responses have **status codes** to describe the result of the request.

---

### ✅ 1xx – Informational

These are rarely used in Express directly.

| Code | Meaning             |
| ---- | ------------------- |
| 100  | Continue            |
| 101  | Switching Protocols |

---

### ✅ 2xx – Success

| Code | Meaning    |
| ---- | ---------- |
| 200  | OK         |
| 201  | Created    |
| 204  | No Content |

```js
res.status(200).send("Everything OK");
res.status(201).send("Created resource");
```

---

### ✅ 3xx – Redirection

| Code | Meaning                    |
| ---- | -------------------------- |
| 301  | Moved Permanently          |
| 302  | Found (Temporary Redirect) |
| 304  | Not Modified (from cache)  |

```js
res.redirect(302, 'https://example.com');
```

---

### ✅ 4xx – Client Errors

| Code | Meaning      |
| ---- | ------------ |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |

```js
app.use((req, res) => {
  res.status(404).send("Page not found");
});
```

---

### ✅ 5xx – Server Errors

| Code | Meaning               |
| ---- | --------------------- |
| 500  | Internal Server Error |
| 502  | Bad Gateway           |
| 503  | Service Unavailable   |

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});
```

---

## 👩‍💻 Summary

| Concept                   | Use                           |
| ------------------------- | ----------------------------- |
| `res.cookie()`            | Set a cookie                  |
| `req.cookies`             | Read cookies                  |
| `cookie-parser`           | Middleware to read cookies    |
| `signed: true`            | Protect cookie from tampering |
| `res.clearCookie()`       | Delete cookie                 |
| `res.status(code).send()` | Send custom status responses  |

---

## 💡 Example Project Structure

```bash
.
├── index.js
├── package.json
└── node_modules/
```

**index.js**

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser('secret123'));

app.get('/login', (req, res) => {
  res.cookie('userId', 'abc123', { httpOnly: true, signed: true });
  res.send('Logged in!');
});

app.get('/dashboard', (req, res) => {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.status(401).send('Unauthorized');
  }
  res.send(`Welcome back, ${userId}`);
});

app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.send('Logged out');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```