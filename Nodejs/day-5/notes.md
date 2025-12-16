# Node.js Streams - Complete Guide

## What are Streams?

Streams let you process data piece by piece (in chunks) instead of loading everything into memory at once. Think of it like drinking water through a straw vs. drinking the whole glass at once.

**Benefits:**
- Memory efficient (handles large files easily)
- Faster (start processing before all data arrives)
- Better for large files, videos, logs, etc.

---

## 1. Readable Streams

**Purpose:** Read data from a source (files, HTTP requests, etc.)

### Basic Example:
```javascript
const fs = require("fs");
const readStream = fs.createReadStream("./sample.txt", "utf-8");

readStream.on("data", (chunk) => {
    console.log("Received chunk:", chunk);
});

readStream.on("end", () => {
    console.log("Finished reading");
});
```

### Creating Custom Readable Stream:
```javascript
const { Readable } = require("stream");

const readableStream = new Readable({
    highWaterMark: 2,  // Buffer size (how much data to hold)
    read() {}          // Required method (can be empty)
});

// Push data into stream
readableStream.push("Hello");
readableStream.push("World");
readableStream.push(null);  // Signals end of stream

readableStream.on("data", (chunk) => {
    console.log(chunk.toString());
});
```

**Key Events:**
- `data` - fires when chunk is available
- `end` - fires when no more data
- `error` - fires on errors

---

## 2. Writable Streams

**Purpose:** Write data to a destination (files, HTTP responses, etc.)

### Basic Example:
```javascript
const fs = require("fs");
const writeStream = fs.createWriteStream("./output.txt");

writeStream.write("First line\n");
writeStream.write("Second line\n");
writeStream.end("Last line");  // Ends stream after writing
```

### Creating Custom Writable Stream:
```javascript
const { Writable } = require("stream");

const writableStream = new Writable({
    write(chunk, encoding, callback) {
        console.log("Writing:", chunk.toString());
        callback();  // Signal write is complete
    }
});

writableStream.write("Hello");
writableStream.write("World");
writableStream.end();
```

**Key Methods:**
- `write(chunk)` - write data
- `end()` - finish writing and close stream

---

## 3. Transform Streams

**Purpose:** Modify data as it passes through (read → modify → write)

### Example: Convert to Uppercase
```javascript
const { Transform } = require("stream");
const fs = require("fs");

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        // Modify the chunk
        const modified = chunk.toString().toUpperCase();
        callback(null, modified);  // null = no error
    }
});

// Use it
const readStream = fs.createReadStream("./input.txt");
const writeStream = fs.createWriteStream("./output.txt");

readStream
    .pipe(transformStream)
    .pipe(writeStream);
```

### Your Example (Replace SURAJ with SIGMA):
```javascript
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const modified = chunk
            .toString()
            .toUpperCase()
            .replaceAll(/SURAJ/gi, "SIGMA");
        callback(null, modified);
    }
});

sampleFileStream
    .pipe(transformStream)
    .pipe(outputFileStream)
    .on("finish", () => {
        console.log("Done!");
    });
```

---

## 4. Piping Streams

**Piping** connects streams together automatically (cleaner than manual events).

### Without Pipe (Manual Way):
```javascript
readStream.on("data", (chunk) => {
    writeStream.write(chunk);
});

readStream.on("end", () => {
    writeStream.end();
});
```

### With Pipe (Better Way):
```javascript
readStream.pipe(writeStream);
```

### Chaining Multiple Pipes:
```javascript
readStream
    .pipe(transformStream1)
    .pipe(transformStream2)
    .pipe(writeStream)
    .on("finish", () => {
        console.log("All done!");
    });
```

---

## Real-World Use Cases

### 1. File Reading (Your HTTP Server Example)

**❌ Bad Way (Loads entire file in memory):**
```javascript
fs.readFile("./sample.txt", "utf-8", (err, data) => {
    if (err) return res.end("Error");
    res.end(data);  // Sends entire file at once
});
```

**✅ Good Way (Streams data):**
```javascript
const readStream = fs.createReadStream("./sample.txt", "utf-8");
readStream.pipe(res);  // Sends file in chunks
```

### 2. Processing Large Files
```javascript
const fs = require("fs");
const { Transform } = require("stream");

const inputStream = fs.createReadStream("./large-log.txt");
const outputStream = fs.createWriteStream("./filtered-log.txt");

const filterStream = new Transform({
    transform(chunk, encoding, callback) {
        // Only keep lines with "ERROR"
        const lines = chunk.toString().split("\n");
        const filtered = lines.filter(line => line.includes("ERROR")).join("\n");
        callback(null, filtered);
    }
});

inputStream.pipe(filterStream).pipe(outputStream);
```

---

## Important Concepts

### highWaterMark
Controls internal buffer size (in bytes for binary, in objects for object mode).

```javascript
const stream = new Readable({
    highWaterMark: 16,  // 16 bytes buffer
    read() {}
});
```

### Backpressure
When writable stream can't keep up with readable stream, Node.js automatically pauses reading.

```javascript
const canContinue = writeStream.write(chunk);
if (!canContinue) {
    // Stream is full, pause reading
    readStream.pause();
}
writeStream.on("drain", () => {
    readStream.resume();  // Resume when ready
});
```

**Using `.pipe()` handles backpressure automatically!**

---

## Common Stream Events

| Event | Description |
|-------|-------------|
| `data` | New chunk available (Readable) |
| `end` | No more data (Readable) |
| `finish` | All data written (Writable) |
| `drain` | Ready for more data (Writable) |
| `error` | Error occurred |
| `close` | Stream closed |

---

## Quick Reference

```javascript
// Readable
const readable = fs.createReadStream("file.txt");
readable.on("data", chunk => {});

// Writable
const writable = fs.createWriteStream("file.txt");
writable.write("data");
writable.end();

// Transform
const transform = new Transform({
    transform(chunk, encoding, callback) {
        callback(null, chunk.toString().toUpperCase());
    }
});

// Pipe them together
readable.pipe(transform).pipe(writable);
```

---

## Summary

- **Readable**: Read data in chunks (files, HTTP requests)
- **Writable**: Write data in chunks (files, HTTP responses)
- **Transform**: Modify data as it passes through
- **Pipe**: Connect streams together (automatic backpressure handling)
- **Custom Streams**: Create your own using `Readable`, `Writable`, `Transform` classes

**Pro Tip:** Always use `.pipe()` when connecting streams - it handles errors and backpressure automatically!