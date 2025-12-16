const http = require("http");
const fs = require("fs");
const { Transform } = require("node:stream");
const server = http.createServer((req, res) => {
  //     // 1. Downloading files (bad way)
  //    fs.readFile("./sample.txt" , "utf-8" , (err , data)=>{
  //         if(err){
  //             console.log(err);
  //             res.end()
  //         }
  //         else{
  //             res.end(data)
  //         }
  //     })

  // 2. Streaming files (good way)
  // const readStream = fs.createReadStream("./sample.txt" , "utf-8");
  // readStream.on("data" , (chunk)=>{
  //     res.write(chunk)
  // })
  // readStream.on("end" , ()=>{
  //     res.end()
  // })

  const sampleFileStream = fs.createReadStream("./sample.txt");
  const outputFileStream = fs.createWriteStream("./output.txt");
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      const modified = chunk
        .toString()
        .toUpperCase()
        .replaceAll(/SURAJ/gi, "SIGMA");
      callback(null, modified);
    },
  });

  // Badway

//   sampleFileStream.on("data", (chunk) => {
//     // 1. convert to upper case and suraj to sigma
//     const modified = chunk
//       .toString()
//       .toUpperCase()
//       .replaceAll(/SURAJ/gi, "SIGMA");

//     // 2. write to output file
//     outputFileStream.write(modified);
//   });

// pipe

sampleFileStream
  .pipe(transformStream)
  .pipe(outputFileStream)
  .on("finish", () => {
    console.log("Done");
  });
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
