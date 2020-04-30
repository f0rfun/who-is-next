const request = require("supertest");
const app = require("../../app");
const User = require("../user.model");
const { teardownMongoose } = require("../../utils/mongoose");
jest.mock("jsonwebtoken");
const jwt = require("jsonwebtoken");

const mockTesters = [
  {
    username: "Jim Tan",
    password: "someverystrongpassword"
  },
  {
    username: "Jim Carrey",
    password: "someverystrongpassword"
  }
];

describe("User route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await User.create(mockTesters);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await User.deleteMany();
  });

  describe("POST /user/login", () => {
    it("should log user in if password is correct", async () => {
      signedInAgent = request.agent(app);
      const { text } = await signedInAgent
        .post(`/user/login`)
        .send(mockTesters[1])
        .expect("set-cookie", /token=.*; Path=\/; Expires=.* HttpOnly/)
        .expect(200);

      expect(text).toEqual("You are now logged in!");
    });

    it("should not log user in if password is incorrect", async () => {
      const jimCarreyWrongPassword = {
        username: "Jim Carrey",
        password: "someveryweakpassword"
      };
      const { text } = await request(app)
        .post(`/user/login`)
        .send(jimCarreyWrongPassword)
        .expect(400);

      expect(text).toEqual("Login failed");
    });
  });

  describe("POST /user/signup", () => {
    it("should add a new user", async () => {
      const expectedUser = {
        username: "tester1",
        password: "someverystrongpassword"
      };

      const { body: user } = await request(app)
        .post("/user/signup")
        .send(expectedUser)
        .expect(200);

      expect(user.username).toBe(expectedUser.username);
    });
  });

  describe("Get /user/:username", () => {
    it("should return only authorised user", async () => {
      jwt.verify.mockReturnValueOnce({ username: mockTesters[0].username });

      const { body: user } = await signedInAgent
        .get(`/user/${mockTesters[0].username}`)
        .expect(200);

      // .set("Cookie", "token=valid-token")

      expect(jwt.verify).toHaveBeenCalledTimes(1);

      expect(user.username).toEqual(mockTesters[0].username.toLowerCase());
    });

    it("should respond with incorrect user message", async () => {
      jwt.verify.mockReturnValueOnce({ username: mockTesters[0].username });

      const { text } = await signedInAgent
        .get(`/user/${mockTesters[1].username}`)
        .expect(403);

      expect(text).toEqual("Forbidden");
    });

    it("should deny access when no token is provided", async () => {
      jwt.verify.mockReturnValueOnce({ username: mockTesters[0].username });
      await request(app).get(`/user/${mockTesters[0].username}`).expect(401);

      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should deny access when invalid token is provided", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error();
      });
      await signedInAgent.get(`/user/${mockTesters[0].username}`).expect(401);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
    });
  });

  describe("/POST logout", () => {
    it("should log out and clear cookie", async () => {
      const response = await request(app).post(`/user/logout`).expect(200);

      expect(response.text).toBe("You are now logged out!");
      expect(response.headers["set-cookie"][0]).toMatch(/^token=/);
    });
  });
});
