// app.test.js
const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./utils/mongoose");

describe("App", () => {
  afterAll(async () => await teardownMongoose());

  it("GET / should return JSON objects for all endpoints", async () => {
    const { body } = await request(app).get("/").expect(200);
    expect(body).toEqual({
      "0": "GET    /",
      "1": "GET    /jumplings",
      "2": "POST   /jumplings",
      "3": "GET /jumplings/:id",
      "4": "PUT /jumplings/:id",
      "5": "DELETE /jumplings/:id",
      "6": "-----------------------",
      "7": "POST   /jumplings/presenters",
      "8": "GET    /jumplings/presenters"
    });
  });
});
