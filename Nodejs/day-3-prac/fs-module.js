const fs = require("node:fs");

// 1. write file ( sync & async)

// fs.writeFileSync("./data.txt", "Hello world suraj from this side");
// fs.writeFile(
//   "./data-async.txt",
//   "Hello",
//   (err) => {
//     console.log(err);
//   }
// );


// 2. readifle , readfilesync
// const res = fs.readFileSync()
// fs.readFile("./data.txt" , "binary" , (err , data)=>{
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log(data)
//     }
// })


// fs.appendFileSync("./data-async.txt" , "Hello suraj\n")

// fs.cpSync("./data-async.txt" , "./data-async-copy.txt")

// fs.unlinkSync("./data-async-copy.txt")

console.log(fs.statSync("./data.txt"))