const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const govtechSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true
    },
    grade: String
  },
  { timestamps: true }
);

const GovTechies = mongoose.model("GovTechies", govtechSchema);

module.exports = GovTechies;
