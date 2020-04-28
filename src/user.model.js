const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: String,
  lastName: String,
  salutation: {
    type: String,
    enum: ["Dr", "Mr", "Mrs", "Ms", "Miss", "Mdm"]
  }
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
