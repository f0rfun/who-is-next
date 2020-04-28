// app.test.js
const request = require("supertest");
const app = require("../../app");
const gModel = require("../govtechies.model");
const { teardownMongoose } = require("../../utils/mongoose");

const fakeGovTechies = [
  {
    name: "James",
    grade: "G"
  },
  {
    name: "Ash",
    grade: "D"
  }
];

describe("gtechies", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await gModel.create(fakeGovTechies);
  });

  afterEach(async () => {
    await gModel.deleteMany();
  });

  it("GET should respond with all pokemons", async () => {
    const expectedGovTechies = [
      {
        name: "James",
        grade: "G"
      },
      {
        name: "Ash",
        grade: "D"
      }
    ];

    const { body: actualGovTechies } = await request(app)
      .get("/gtechies")
      .expect(200);
    expect(actualGovTechies).toMatchObject(expectedGovTechies);
  });

  //   it("GET /gtechies should return array object of all 9 gtechies", async () => {
  //     const response = await request(app).get("/gtechies").expect(200);
  //     expect(response.body).toHaveLength(9);
  //     expect(response.body).toMatchObject(gtechies);
  //   });

  //   it("POST /gtechies should respond with status 400 and correct string when receiving non-json", async () => {
  //     const { text } = await request(app)
  //       .post("/gtechies")
  //       .send("This is not json!")
  //       .expect(400);
  //     expect(text).toEqual("Server wants application/json!");
  //   });

  //   it("POST /getices should respond correctly when receiving json", async () => {
  //     const { text } = await request(app)
  //       .post("/gtechies")
  //       .send({ thisIsJson: "json!" })
  //       .expect(200);
  //     expect(text).toEqual("success!");
  //   });
});
