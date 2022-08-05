import express from "express";
const app = express();
const port = 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let db = {
  courses: [
    { id: 1, title: "front-end" },
    { id: 2, title: "back-end" },
    { id: 3, title: "automation qa" },
    { id: 4, title: "devops" },
  ],
};

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/home", (req, res) => {
  res.send("<h1>Hello Home!</h1>");
});

app.post("/home", (req, res) => {
  res.send("Create!!!");
});

app.get("/courses", (req, res) => {
  let foundedCourse = db.courses;

  if (req.query.title) {
    foundedCourse = foundedCourse.filter(
      (c) => c.title.indexOf(req.query.title as string) > -1
    );
  }

  res.json(foundedCourse);
});

app.get("/courses/:id", (req, res) => {
  const foundedCourse = db.courses.find((c) => c.id === +req.params.id);
  if (!foundedCourse) {
    res.sendStatus(404);
    return;
  }
  res.json(foundedCourse);
});

app.post("/courses", (req, res) => {
  if (!req.body.title) {
    res.sendStatus(400);
    return;
  }

  const createdCourse = {
    id: +new Date(),
    title: req.body.title,
  };
  db.courses.push(createdCourse);
  res.status(201).json(createdCourse);
});

app.delete("/courses/:id", (req, res) => {
  db.courses = db.courses.filter((c) => c.id !== +req.params.id);
  res.sendStatus(204);
});

app.put("/courses/:id", (req, res) => {
  if (!req.body.title) {
    res.sendStatus(400);
    return;
  }

  const foundedCourse = db.courses.find((c) => c.id === +req.params.id);
  if (!foundedCourse) {
    res.sendStatus(404);
    return;
  }

  foundedCourse.title = req.body.title;
  res.status(204).json(foundedCourse);
});

app.get("/error", (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
