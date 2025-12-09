# Node.js vs Browser JavaScript Engines

## JavaScript Engines: The Core Difference

Both Node.js and browsers run JavaScript, but they use different **JavaScript engines** and provide different **runtime environments**.

### Browser JavaScript Engine
- **Engine**: V8 (Chrome), SpiderMonkey (Firefox), JavaScriptCore (Safari)
- **Purpose**: Execute JavaScript in web pages
- **Environment**: Has access to DOM, Window object, browser APIs

```javascript
// Browser-only code
console.log(window.location.href); // Access current URL
document.getElementById('myDiv'); // Manipulate DOM
localStorage.setItem('key', 'value'); // Browser storage
fetch('https://api.example.com'); // Web APIs
```

### Node.js JavaScript Engine
- **Engine**: V8 (same as Chrome)
- **Purpose**: Execute JavaScript on servers/computers
- **Environment**: No DOM, has file system, network APIs, OS interactions

```javascript
// Node.js-only code
const fs = require('fs'); // File system access
const http = require('http'); // Create servers
process.env.PATH; // Access environment variables
fs.readFile('file.txt'); // Read files from disk
```

### Key Differences Table

| Feature | Browser | Node.js |
|---------|---------|---------|
| **Global Object** | `window` | `global` |
| **DOM Access** | ✅ Yes | ❌ No |
| **File System** | ❌ No | ✅ Yes |
| **Module System** | ES6 Modules | CommonJS + ES6 |
| **APIs** | Web APIs (DOM, Fetch) | Node APIs (fs, http) |

---

# Understanding Node.js Modules

## What are Modules?

Modules are **reusable blocks of code** that help organize your application into smaller, manageable pieces. Think of them as building blocks.

### Why Use Modules?
1. **Organization**: Keep related code together
2. **Reusability**: Use the same code in multiple places
3. **Maintainability**: Easier to find and fix bugs
4. **Avoid Conflicts**: Prevent variable name collisions

## Types of Modules in Node.js

### 1. Core Modules (Built-in)
Pre-installed with Node.js, no installation needed.

```javascript
const fs = require('fs'); // File system
const http = require('http'); // HTTP server
const path = require('path'); // Path utilities
const os = require('os'); // Operating system info

// Example: Using path module
const filePath = path.join(__dirname, 'data', 'users.json');
console.log(filePath); // /home/project/data/users.json
```

### 2. Local Modules (Your Own)
Files you create in your project.

```javascript
// math.js - Creating a module
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Export functions
module.exports = { add, subtract };

// app.js - Using the module
const math = require('./math'); // ./ means current directory

console.log(math.add(5, 3)); // 8
console.log(math.subtract(10, 4)); // 6
```

### 3. Third-Party Modules (NPM Packages)
Installed via npm (Node Package Manager).

```javascript
// Install first: npm install express
const express = require('express');

const app = express();
app.listen(3000);
```

## Module Wrapper Function

**Every module in Node.js is wrapped in a special function** before execution. This is invisible to you but very important!

### The Wrapper Function
```javascript
(function(exports, require, module, __filename, __dirname) {
  // Your module code here
});
```

### What This Provides

```javascript
// myModule.js
console.log(__filename); // Full path to current file
console.log(__dirname);  // Directory of current file
console.log(module);     // Object with info about current module
console.log(exports);    // Shortcut to module.exports
console.log(require);    // Function to import other modules

// Example output:
// __filename: /home/user/project/myModule.js
// __dirname: /home/user/project
```

### Why the Wrapper Function Exists

1. **Scope Isolation**: Variables don't leak to global scope
2. **Provides Utilities**: Gives you `require`, `module`, etc.
3. **Module Privacy**: Code is private by default

```javascript
// Without wrapper (bad - pollutes global scope)
var secretPassword = '12345'; // Would be global

// With wrapper (good - stays private)
// secretPassword is only accessible within this module
```

### Exporting from Modules

```javascript
// user.js - Method 1: module.exports
module.exports = {
  name: 'John',
  age: 30,
  greet: function() {
    console.log('Hello!');
  }
};

// user.js - Method 2: exports shortcut
exports.name = 'John';
exports.age = 30;
exports.greet = function() {
  console.log('Hello!');
};

// app.js - Importing
const user = require('./user');
console.log(user.name); // John
user.greet(); // Hello!
```

**Important**: Don't reassign `exports` directly!

```javascript
// ❌ WRONG - This breaks the reference
exports = { name: 'John' };

// ✅ CORRECT
module.exports = { name: 'John' };
// OR
exports.name = 'John';
```

---

# Blocking vs Non-Blocking Code Execution

## Blocking Code (Synchronous)

**Blocking code stops everything** until the current operation completes. Like standing in a single-file line at a store.

### Example: Blocking File Read

```javascript
const fs = require('fs');

console.log('1. Start');

// Blocks here - waits for file to be read
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log('2. File content:', data);

console.log('3. End');

// Output order (always the same):
// 1. Start
// 2. File content: [content]
// 3. End
```

### Problems with Blocking Code

```javascript
const fs = require('fs');

console.log('Reading file 1...');
const file1 = fs.readFileSync('file1.txt'); // Takes 2 seconds
console.log('Reading file 2...');
const file2 = fs.readFileSync('file2.txt'); // Takes 2 seconds
console.log('Done!');

// Total time: 4 seconds (2 + 2)
// Server can't handle other requests during this time!
```

## Non-Blocking Code (Asynchronous)

**Non-blocking code continues executing** while waiting for operations to complete. Like ordering online while doing other things.

### Example 1: Non-Blocking with Callbacks

```javascript
const fs = require('fs');

console.log('1. Start');

// Doesn't block - continues immediately
fs.readFile('large-file.txt', 'utf8', function(err, data) {
  if (err) throw err;
  console.log('3. File content:', data);
});

console.log('2. End');

// Output order:
// 1. Start
// 2. End
// 3. File content: [content]
```

### Example 2: Multiple Non-Blocking Operations

```javascript
const fs = require('fs');

console.log('Starting file reads...');

fs.readFile('file1.txt', 'utf8', (err, data1) => {
  console.log('File 1 done:', data1);
});

fs.readFile('file2.txt', 'utf8', (err, data2) => {
  console.log('File 2 done:', data2);
});

console.log('Continued without waiting!');

// Output order:
// Starting file reads...
// Continued without waiting!
// File 1 done: [content]
// File 2 done: [content]
// Both files read in parallel!
```

### Example 3: Real-World Scenario

```javascript
const fs = require('fs');

// ❌ BLOCKING - Bad for servers
function getUserDataBlocking(userId) {
  const data = fs.readFileSync(`user-${userId}.json`);
  return JSON.parse(data);
}

// If 100 users request at once, they wait in line!
// User 100 waits for users 1-99 to finish

// ✅ NON-BLOCKING - Good for servers
function getUserDataNonBlocking(userId, callback) {
  fs.readFile(`user-${userId}.json`, 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
}

// All 100 users get processed concurrently!
getUserDataNonBlocking('123', (err, user) => {
  if (err) console.error(err);
  else console.log(user);
});
```

## Comparison: Blocking vs Non-Blocking

### Blocking (Synchronous)
```javascript
console.log('Step 1');
const result = fs.readFileSync('file.txt'); // WAIT HERE
console.log('Step 2');
// Simple, predictable order
// Bad for I/O operations (files, network)
```

### Non-Blocking (Asynchronous)
```javascript
console.log('Step 1');
fs.readFile('file.txt', (err, result) => {
  console.log('Step 3 - File done');
});
console.log('Step 2');
// More complex, unpredictable order
// Great for I/O operations
// Keeps server responsive
```

## When to Use Each

### Use Blocking (Synchronous)
- Startup configuration loading
- Simple scripts
- When you truly need to wait

```javascript
// OK for startup - runs once
const config = require('./config.json');
const port = config.port;
startServer(port);
```

### Use Non-Blocking (Asynchronous)
- Web servers
- File operations during runtime
- Database queries
- Network requests

```javascript
// Server handling requests
app.get('/users/:id', (req, res) => {
  // Non-blocking - server stays responsive
  db.findUser(req.params.id, (err, user) => {
    res.json(user);
  });
});
```

## Modern Async Patterns

### Using Promises
```javascript
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Using Async/Await
```javascript
const fs = require('fs').promises;

async function readFiles() {
  try {
    const data1 = await fs.readFile('file1.txt', 'utf8');
    const data2 = await fs.readFile('file2.txt', 'utf8');
    console.log(data1, data2);
  } catch (err) {
    console.error(err);
  }
}

readFiles();
```

---

## Key Takeaways

1. **Node.js uses V8 engine** but provides server-side APIs instead of browser APIs
2. **Modules organize code** into reusable, maintainable pieces
3. **Module wrapper function** provides scope isolation and useful variables
4. **Blocking code waits** for operations (bad for servers)
5. **Non-blocking code continues** while operations run (good for servers)
6. **Use async/non-blocking for I/O operations** to keep your server fast and responsive