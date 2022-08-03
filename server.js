const http = require("http");

let requestsCount = 0;
const server = http.createServer((req, res) => {
  if (req.url !== "/favicon.ico") requestsCount++;

  switch (req.url) {
    case "/students":
      res.write("Students");
      break;

    case "/":
    case "/courses":
      res.write("Courses");
      break;
    default:
      res.write("Not found");
  }

  res.write(` - Response counter: ${requestsCount}`);
  res.end();
});

server.listen(3003);
