const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Profile = require("../models/Profile");
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
  dashbord: async (req, res, next) => {
    try {
      console.log(req.user);

      const user = await User.findById(req.user.id)
        .select("-password")
        .populate({
          path: "groups",
          populate: ["admins", "members", "creator", "post"]
        });

      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  profile: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user"
      );

      res.json(profile);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  }
};
