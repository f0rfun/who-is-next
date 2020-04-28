const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());
const GovTechie = require("../govtechies.model");
const {
  getAll,
  addNewGovTechie
} = require("../controller/gtechies.controller");

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Server wants application/json!");
  } else {
    next();
  }
};

router.get("/", getAll);

router.post("/", addNewGovTechie);

router.get("/:id", function (req, res) {
  const idParam = req.params.id;
  const requestedID = gtechies.find((aTechie) => aTechie.id === idParam);
  res.status(200);
  res.send(requestedID);
});

router.put("/:id", function (req, res) {
  let techieWithMatchingId = gtechies.filter(
    (aTechie) => aTechie.id === req.params.id
  );
  let techieToBeUpdated = techieWithMatchingId[0];

  techieToBeUpdated["name"] = req.body.name;

  res.status(200);
  res.send(techieToBeUpdated);
});

router.delete("/:id", function (req, res) {
  let remainingTechies = gtechies.filter(
    (aTechie) => aTechie.id !== req.params.id
  );

  res.status(200);
  res.send(remainingTechies);
});

router.post("/presenters", requireJsonContent, (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  gtechies.push({ id: String(gtechies.length + 1), name: name });

  res.status(200);
  res.send("success!");
});

module.exports = router;
