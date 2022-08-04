import express from "express";
const app = express();
const port = 3003;

app.get("/", (req, res) => {
  const a = 4;
  if (a > 5) res.send("OK!");
  else res.send("Hello World!");
});

app.get("/home", (req, res) => {
  res.send("Hello Home!");
});

app.post("/home", (req, res) => {
  res.send("Create!!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
