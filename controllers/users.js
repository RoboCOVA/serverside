const JWT = require("jsonwebtoken");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");

const Usermodel = require("../models/user");
const { JWT_SECRET } = require("../config/jwt");

signToken = user => {
  return JWT.sign(
    {
      iss: "tomo",
      sub: user.id,
      iat: new Date().getTime() // current time
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { name, email, password } = req.value.body;
    console.log("req.value.body", req.value.body);
    //check if email already exists
    const Emailisexist = await Usermodel.findOne({ email: email });
    if (Emailisexist) {
      return res.status(403).json({ error: "The email is already exists" });
    }
    const salt = uuidv1();
    const hash = crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex");
    //create a new user
    const newUser = new Usermodel({
      method: "local",
      name: name,
      email: email,
      password: hash,
      salt: salt
    });
    await newUser.save();

    //Generate the token
    const token = signToken(newUser);

    //Respond with token
    res.json({
      token,
      user: newUser
    });
  },

  signIn: async (req, res, next) => {
    //token create
    console.log("ollo");
    const token = signToken(req.user);
    res.json({
      token,
      user: req.user
    });
  },

  googleOAuth: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);
    res.json({
      token,
      user: req.user
    });
  },

  facebookOAuth: async (req, res, next) => {
    const token = signToken(req.user);
    res.json({
      token,
      user: req.user
    });
  }
};
