const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const Schema = mongoose.Schema;

//create schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    lowercase: true
  },
  salt: {
    type: String
  },
  password: {
    type: String
  },
  googleid: {
    type: String
  },
  facebookid: {
    type: String
  },
  photo: {
    type: String,
    default: "user_6.png"
  },
  groups: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "group"
    }
  ]
});

//model create
const Usermodel = mongoose.model("user", userSchema);

//export model
module.exports = Usermodel;
