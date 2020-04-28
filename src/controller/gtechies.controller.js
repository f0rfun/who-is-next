const GovTechie = require("../govtechies.model");

const getAll = async (req, res, next) => {
  res.status(200);
  const foundGovTechies = await GovTechie.find();
  res.json(foundGovTechies);
};

const addNewGovTechie = async (req, res) => {
  const newcomer = { name: req.body.name, grade: req.body.grade };
  const newGovTechies = new GovTechie(newcomer);
  newGovTechies.save();
  res.status(200);
  res.send("success!");
};

module.exports = { getAll, addNewGovTechie };
