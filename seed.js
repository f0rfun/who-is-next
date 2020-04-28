require("./utils/db");
const GovTechies = require("./src/govtechies.model");

const createGovTechiesPromise = () => {
  return GovTechies.create([
    {
      name: "Heming",
      grade: "B"
    },
    {
      name: "Edwin",
      grade: "C"
    }
  ]);
};

const seedData = async () => {
  try {
    await createGovTechiesPromise();
    console.log("Seeded govtech data");
  } catch (err) {
    console.log(err);
  }
};

seedData();
