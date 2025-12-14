const path = require("node:path");
const fs = require("node:fs")
// console.log(__filename)
// console.log(__dirname)

// // Custom paths -- 


// // console.log(filename)


// // fs.writeFileSync(filename, 'data');
// fs.mkdirSync(filename,{recursive:true})

// fs.mkdir(path.join(__dirname, "data", "students", "data.json"), {recursive:true} , (err)=>{
//     console.log(err)
// })

// const folderPath = path.join(__dirname, "txt", "data", "users");


// fs.mkdir(folderPath, { recursive: true }, (err) => {
//   if (err) {
//     console.error("Error creating folder:", err);
//   } else {
//     console.log("Folder created successfully!");
//   }
// });

 const filename = path.join(__dirname , "data" , "students" , "data.json")

// console.log(path.parse(filename))

// console.log(path.resolve(filename))

console.log(path.extname(filename))

console.log(path.basename(filename))

console.log(path.dirname(filename))