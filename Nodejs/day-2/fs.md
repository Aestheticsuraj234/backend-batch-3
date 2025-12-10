# 📌 What is the `fs` Module?

`fs` (File System) is a built-in Node.js module that allows you to **read, write, modify, delete, copy, and manage files & folders** on your computer.

---

# 📌 Why Do We Need It?

* To **store data** (logs, JSON, uploads).
* To **read config files**.
* To **create/delete folders**.
* To **build CLI tools, servers, and automation scripts**.
* To handle **file-based operations** without any external library.

---

# 📌 `fs` vs `fs/promises` (Short)

| Aspect         | `node:fs`        | `node:fs/promises` |
| -------------- | ---------------- | ------------------ |
| API Style      | Callbacks + Sync | Promise-based      |
| Modern Use     | Less preferred   | Recommended        |
| Error Handling | `err` callback   | `try/catch`        |
| Readability    | Lower            | High               |

---

# 📌 Importing

```js
import fs from "node:fs";              // callbacks + sync
import fsp from "node:fs/promises";    // promises
```

---

# 📌 Core Methods (short, meaningful, with sync + async)

## 1. **readFile / readFileSync**

Read file content.

**Async (callback):**

```js
fs.readFile("a.txt", "utf8", (err, data) => {});
```

**Sync:**

```js
const data = fs.readFileSync("a.txt", "utf8");
```

**Async (promise):**

```js
await fsp.readFile("a.txt", "utf8");
```

---

## 2. **writeFile / writeFileSync**

Create or replace a file.

**Async:**

```js
fs.writeFile("a.txt", "Hello", () => {});
```

**Sync:**

```js
fs.writeFileSync("a.txt", "Hello");
```

**Promise:**

```js
await fsp.writeFile("a.txt", "Hello");
```

---

## 3. **appendFile / appendFileSync**

Add content to end of file.

```js
fs.appendFile("log.txt", "line\n", () => {});
fs.appendFileSync("log.txt", "line\n");
await fsp.appendFile("log.txt", "line\n");
```

---

## 4. **mkdir / mkdirSync**

Create folder(s).

```js
fs.mkdir("test", () => {});
fs.mkdirSync("test");
await fsp.mkdir("test", { recursive: true });
```

---

## 5. **readdir / readdirSync**

List files in a directory.

```js
fs.readdir("folder", (err, files) => {});
fs.readdirSync("folder");
await fsp.readdir("folder");
```

---

## 6. **stat / statSync**

Get file info (size, type).

```js
fs.stat("a.txt", (err, info) => {});
fs.statSync("a.txt");
await fsp.stat("a.txt");
```

---

## 7. **access / accessSync**

Check file existence / permissions.

```js
fs.access("a.txt", () => {});
fs.accessSync("a.txt");
await fsp.access("a.txt");
```

---

## 8. **unlink / unlinkSync**

Delete a file.

```js
fs.unlink("a.txt", () => {});
fs.unlinkSync("a.txt");
await fsp.unlink("a.txt");
```

---

## 9. **rename / renameSync**

Rename or move file.

```js
fs.rename("old.txt", "new.txt", () => {});
fs.renameSync("old.txt", "new.txt");
await fsp.rename("old.txt", "new.txt");
```

---

# 📌 Final Summary (Very Short)

* `fs` = callbacks + sync.
* `fs/promises` = modern async/await.
* Used for all file/folder operations.
* Prefer `fs/promises` for cleaner code.
* Sync functions block the event loop → avoid in servers.


