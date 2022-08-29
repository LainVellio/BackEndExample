const http = require("http");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-type": "text/html; charset=utf-8" });
  res.end("Сервер работает!");
});

server.listen(PORT, () => console.log(`Server srarted on PORT ${PORT}`));
