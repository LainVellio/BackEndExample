const http = require("http");
const fs = require("fs");

// const app = express();
// const express = require("express");
// const favicon = require("serve-favicon");
// const path = require("path");
// app.use(express.static(path.join(__dirname, "public", "favicon.ico")));
// app.get("/", (req, res) => {
//   res.send("Hello");
// });
// app.listen(3003);

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

let requestsCount = 0;
const server = http.createServer(async (req, res) => {
  // if (req.url !== "/favicon.ico") {
  //   requestsCount++;
  //   res.write(` - Response counter: ${requestsCount}`);
  // }

  switch (req.url) {
    case "/home": {
      try {
        const data = await readFile("pages/home.html");
        res.write(data);
      } catch (err) {
        res.write("Some error");
      } finally {
        res.end();
      }
      break;
    }

    case "/about": {
      await delay(3000);
      res.write("About");
      res.end();
      break;
    }

    default: {
      res.write("Not found");
      res.end();
    }
  }
});

server.listen(3003);
