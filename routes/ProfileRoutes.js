const router = require("express-promise-router")();
const passport = require("passport");

const passportJWT = passport.authenticate("jwt", { session: false });
const { validateBody, schemas } = require("../Validator/profileValidation");
validateBody(schemas.groupSchema);
const {
  userProfile,
  createOrUpdateProfile
} = require("../controllers/profile");
const { upload } = require("../services/multer");

router.route("/me").get(passportJWT, userProfile);

router.route("/").post(passportJWT, upload, createOrUpdateProfile);

module.exports = router;
