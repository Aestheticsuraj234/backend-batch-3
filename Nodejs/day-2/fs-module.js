// -------------------------------------
// FS MODULE REFERENCE (callbacks + sync)
// -------------------------------------
import fs from "node:fs";
import fsp from "node:fs/promises";

// ----------------------------
// 1. READ FILE
// ----------------------------

// async (callback)
fs.readFile("readme.txt", "utf8", (err, data) => {
  if (err) console.error(err);
  else console.log("CB READ:", data);
});

// sync
const dataSync = fs.readFileSync("readme.txt", "utf8");
console.log("SYNC READ:", dataSync);

// promise
const dataPromise = await fsp.readFile("readme.txt", "utf8");
console.log("PROMISE READ:", dataPromise);


// ----------------------------
// 2. WRITE FILE
// ----------------------------

// async
fs.writeFile("out.txt", "Hello World", (err) => {
  if (err) console.error(err);
});

// sync
fs.writeFileSync("out.txt", "Hello Sync");

// promise
await fsp.writeFile("out.txt", "Hello Promise");


// ----------------------------
// 3. APPEND FILE
// ----------------------------
fs.appendFile("log.txt", "New line\n", () => {});
fs.appendFileSync("log.txt", "Sync line\n");
await fsp.appendFile("log.txt", "Promise line\n");


// ----------------------------
// 4. CREATE FOLDER
// ----------------------------
fs.mkdir("test-folder", () => {});
fs.mkdirSync("test-folder-sync");
await fsp.mkdir("test-folder-promises", { recursive: true });


// ----------------------------
// 5. READ DIRECTORY
// ----------------------------
fs.readdir(".", (err, list) => {});
fs.readdirSync(".");
await fsp.readdir(".");


// ----------------------------
// 6. FILE STATS
// ----------------------------
fs.stat("out.txt", (err, stats) => {});
fs.statSync("out.txt");
await fsp.stat("out.txt");


// ----------------------------
// 7. CHECK FILE ACCESS
// ----------------------------
fs.access("out.txt", (err) => {});
fs.accessSync("out.txt");
await fsp.access("out.txt");


// ----------------------------
// 8. DELETE FILE
// ----------------------------
fs.unlink("delete-me.txt", () => {});
fs.unlinkSync("delete-me-sync.txt");
await fsp.unlink("delete-me-promise.txt");


// ----------------------------
// 9. RENAME / MOVE FILE
// ----------------------------
fs.rename("old.txt", "new.txt", () => {});
fs.renameSync("old-sync.txt", "new-sync.txt");
await fsp.rename("old-promise.txt", "new-promise.txt");


// ----------------------------
// 10. COPY FILE
// ----------------------------
fs.copyFile("src.txt", "dest.txt", () => {});
fs.copyFileSync("src-sync.txt", "dest-sync.txt");
await fsp.copyFile("src-promise.txt", "dest-promise.txt");


// ----------------------------
// 11. STREAMS
// ----------------------------
const readStream = fs.createReadStream("bigfile.mp4");
const writeStream = fs.createWriteStream("copy.mp4");
readStream.pipe(writeStream);


// ----------------------------
// 12. FILEHANDLE (low-level)
// ----------------------------
const fh = await fsp.open("file.bin", "w");
await fh.write("Hello FileHandle\n");
await fh.close();


// ----------------------------
// DONE
// ----------------------------
console.log("FS Reference Operations Finished");
