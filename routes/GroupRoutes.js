const router = require("express-promise-router")();
const passport = require("passport");
const bodyParser = require("body-parser");
const passportJWT = passport.authenticate("jwt", { session: false });
const {
  validateBody,
  schemas,
  validateParams
} = require("../Validator/groupValidation");
const {
  validateAdminBody,
  groupSchemas
} = require("../Validator/groupAdminValidation");
const { upload } = require("../services/multer");

const {
  createGroup,
  getGroups,
  getGroup,
  addAdmin,
  editGroup,
  deleteGroup,
  getGroupByfollowers,
  getTopGroups,
  getrecetPost
} = require("../controllers/group");

router.route("/:name/group").post(
  passportJWT,
  upload,
  validateParams(),

  createGroup
);
router.route("/getGroupbyfollowing").get(passportJWT, getGroupByfollowers);
router.route("/:name").get(passportJWT, getGroups);

router.route("/:name/grous/:id").get(passportJWT, getGroup);

router
  .route("/:group/add-admin")
  .post(
    passportJWT,
    bodyParser.json(),
    validateAdminBody(groupSchemas.groupAdminSchema),
    addAdmin
  );

router
  .route("/:group/delete")
  .delete(passportJWT, bodyParser.json(), deleteGroup);

router.route("/:group/edit").put(passportJWT, upload, editGroup);

router.route("/group/trending").get(passportJWT, getGroupByfollowers);
module.exports = router;
