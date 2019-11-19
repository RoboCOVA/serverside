const User = require("../models/user");
const Profile = require("../models/Profile");
const { upload } = require("../services/multer");

exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user"
    );
    if (!profile) {
      return res.status(400).json({
        msg: "There is no profile for this user"
      });
    }
    console.log("profile", profile);
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.createOrUpdateProfile = async (req, res) => {
  try {
    let imagePath;
    if (req.file) imagePath = req.file.filename;

    const { bio, country, city, birthdate, gender, name, email } = req.body;

    //Build profile object
    const user = await User.findById(req.user.id);
    user.name = name;
    user.email = email;
    if (imagePath) user.photo = imagePath;
    await user.save();

    const profileFields = {};
    profileFields.user = req.user.id;
    if (bio) profileFields.bio = bio;
    if (country) profileFields.country = country;
    if (city) profileFields.city = city;
    if (birthdate) profileFields.birthdate = birthdate;
    if (gender) profileFields.gender = gender;

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      console.log("profile", profile);

      return res.json(profile);
    }
    //Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
