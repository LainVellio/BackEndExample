import express, { Response } from "express";
import { CourseCreateModel } from "./models/CourseCreateModel";
import { CoursesQueryModel } from "./models/CoursesQueryModel";
import { CourseUpdateModel } from "./models/CourseUpdateModel";
import { CourseViewModel } from "./models/CourseViewModel";
import { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "./types";

export const app = express();
const port = 3003;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

let db: { courses: CourseType[] } = {
  courses: [
    { id: 1, title: "front-end", studentsCount: 10 },
    { id: 2, title: "back-end", studentsCount: 10 },
    { id: 3, title: "automation qa", studentsCount: 10 },
    { id: 4, title: "devops", studentsCount: 10 },
  ],
};

const getCourseModel = (dbCourses: CourseType): CourseViewModel => ({
  id: dbCourses.id,
  title: dbCourses.title,
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/home", (req, res) => {
  res.send("<h1>Hello Home!</h1>");
});

app.post("/home", (req, res) => {
  res.send("Create!!!");
});

app.get(
  "/courses",
  (
    req: RequestWithQuery<CoursesQueryModel>,
    res: Response<CourseViewModel[]>
  ) => {
    let foundedCourses = db.courses;

    if (req.query.title) {
      foundedCourses = foundedCourses.filter(
        (c) => c.title.indexOf(req.query.title) > -1
      );
    }

    res.json(foundedCourses.map((dbCourses) => getCourseModel(dbCourses)));
  }
);

app.get(
  "/courses/:id",
  (
    req: RequestWithParams<URIParamsCourseIdModel>,
    res: Response<CourseViewModel>
  ) => {
    const foundedCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundedCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }
    res.json(getCourseModel(foundedCourse));
  }
);

app.post(
  "/courses",
  (req: RequestWithBody<CourseCreateModel>, res: Response<CourseViewModel>) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdCourse: CourseType = {
      id: +new Date(),
      title: req.body.title,
      studentsCount: 0,
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(getCourseModel(createdCourse));
  }
);

app.delete(
  "/courses/:id",
  (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(204);
  }
);

app.put(
  "/courses/:id",
  (
    req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>,
    res
  ) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const foundedCourse = db.courses.find((c) => c.id === +req.params.id);
    if (!foundedCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    foundedCourse.title = req.body.title;
    res.status(HTTP_STATUSES.NO_CONTENT_204).json(foundedCourse);
  }
);

app.get("/error", (req, res) => {
  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

app.delete("/__test__/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
