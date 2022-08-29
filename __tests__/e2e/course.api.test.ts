import request from "supertest";
import { app, HTTP_STATUSES } from "../../src";
import { CourseCreateModel } from "../../src/models/CourseCreateModel";
import { CourseUpdateModel } from "../../src/models/CourseUpdateModel";

describe("/courses", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/data");
  });

  it("should return 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("should return 404 for not existing course", async () => {
    await request(app)
      .get("/courses/*****")
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("shouldn't create course with incorrect input data", async () => {
    const data: CourseCreateModel = { title: "" };
    await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  let createdCourse1 = { id: 0, title: "" };
  it("should create course with correct input data", async () => {
    const data: CourseCreateModel = { title: "title1" };

    const createResponse = await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);
    createdCourse1 = createResponse.body;
    expect(createdCourse1).toEqual({
      id: expect.any(Number),
      title: data.title,
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK_200, [createdCourse1]);
  });

  let createdCourse2 = { id: 0, title: "" };

  it("create one more course", async () => {
    const data: CourseCreateModel = { title: "title2" };

    const createResponse = await request(app)
      .post("/courses")
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);
    createdCourse2 = createResponse.body;
    expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: data.title,
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2]);
  });

  it("shouldn't update course with incorrect input data", async () => {
    const data: CourseUpdateModel = { title: "" };

    await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse1);
  });

  it("shouldn't update that not exist", async () => {
    const data: CourseUpdateModel = { title: "New title" };

    await request(app)
      .put(`/courses/-1`)
      .send(data)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should update course with correct input data", async () => {
    const data: CourseUpdateModel = { title: "New title" };

    await request(app)
      .put(`/courses/${createdCourse1.id}`)
      .send(data)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse2.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse2);

    await request(app)
      .get(`/courses/${createdCourse1.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdCourse1,
        title: data.title,
      });
  });
});
