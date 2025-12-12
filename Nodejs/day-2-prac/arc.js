process.env.UV_THREADPOOL_SIZE = 5

const crypto = require("node:crypto")
const os = require("os")


let start = Date.now();

console.log(os.cpus().length) // number of cpu cores

crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
}) 


crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
}) 


crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
}) 


crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
}) 


crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
}) 