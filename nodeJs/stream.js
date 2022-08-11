// Readable - чтение, Writable - запить, Duplex - Для чтения и записи Readable + Writable, Transform - Такой же как Duplex, но может изменить данные по мере чтения

const fs = require("fs");
const path = require("path");

p = path.resolve(__dirname, "uploadFile.txt");

fs.readFile(p, (err, data) => {
  if (err) throw err;
  console.log(data);
});

const stream = fs.createReadStream(p);

stream.on("open", () => console.log("Начали читать"));
stream.on("data", (chunk) => {
  console.log(chunk);
});
stream.on("error", (err) => console.log(err));
stream.on("end", () => console.log("Закончили читать"));

const writebleStream = fs.createWriteStream(p);
for (let i = 0; i < 10; i++) {
  writebleStream.write(i + "\n");
}
writebleStream.end();

const http = require("http");

http.createServer((req, res) => {
  // req - readable stream
  // res - writable stream
  const stream = fs.createReadStream(p);

  stream.pipe(res);
});
