const http = require("node:http");
const fs = require("node:fs");
const { Transform } = require("node:stream");

const server = http.createServer((req, res) => {
  // 1. Downloading files ( bad way)
  // fs.readFile("./sample.txt" , "utf-8" ,(err , data)=>{
  //     if(err){
  //         console.log(err);
  //         res.end()
  //     }
  //     else{
  //         res.end(data)
  //     }
  // })

  //* 2. Downloading files ( good way)
  // const readStream = fs.createReadStream("./sample2.txt" , "utf-8")

  // readStream.on("data" , (chunk)=>{
  //     res.write(chunk)
  // })

  // readStream.on("end" , ()=>{
  // res.end()
  // })

  // * Copy file from sample2.txt --> output.txt ( bad appraoch  , good appraoch)

  // bad way

  const sampleFileStream = fs.createReadStream("./sample.txt");
  const outputfileStream = fs.createWriteStream("./output.txt");

  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
     const modified =  chunk.toString().toUpperCase().replaceAll(/SURAJ/gi, "Ashwin");
      callback(null , modified)
    },
  });

//   sampleFileStream.on("data", (chunk) => {
//     const modified = chunk
//       .toString()
//       .toUpperCase()
//       .replaceAll(/SURAJ/gi, "SIGMA");

//     outputfileStream.write(modified);
//   });

sampleFileStream.pipe(transformStream).pipe(outputfileStream).on("finish" , ()=>{
    console.log('Done✅')
})


});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
