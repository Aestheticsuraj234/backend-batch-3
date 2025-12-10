const crypto = require("crypto")

process.env.UV_THREADPOOL_SIZE = 16

const os = require("os")

console.log(os.cpus().length)

let start = Date.now();


crypto.pbkdf2("password-1" , "salt1" , 100000 , 1024 , "sha512" , () => {
    console.log(`Time taken ${Date.now() - start} ms`);
  
})