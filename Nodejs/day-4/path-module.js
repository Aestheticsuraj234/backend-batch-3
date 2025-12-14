const path = require("node:path");

// console.log(__filename);
// console.log(__dirname);

// . Join
const filepath = path.join(__dirname , "data" , "students" , "data.txt");

console.log(filepath);


console.log(path.parse(filepath));

console.log(path.resolve(filepath));
console.log(path.extname(filepath))


console.log(path.basename(filepath))

console.log(path.dirname(filepath))