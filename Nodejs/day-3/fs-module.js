const fs = require("fs");


// 1. writeFile and writeFileSync
// fs.writeFileSync("./test.txt" , "Hello world suraj from this side how it is going" , )


// // 2. fs.writefile

// fs.writeFile("./test.txt" , "Hello world suraj from this side how it is going" , (err) => {
//     console.log(err);
// });


// 2. readfile , readFileSync

// const res = fs.readFileSync("./contacts.txt" , "utf-8" , (err , data) => {
//     console.log(data);
// })

// fs.readFile("./contacts.txt" , "utf-8" , (err , res)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(res);
//     }

// })

// console.log(res);

// 3. appendFile

fs.appendFileSync("./test.txt" , new Date().getDate().toLocaleString()); 

fs.cpSync("./test.txt" , "./test2.txt");

fs.unlinkSync("./test2.txt");

console.log(fs.statSync("./test.txt"));