const router = require("express-promise-router")();
const passport = require("passport");
const bodyParser = require("body-parser");

const { validateBody, schemas } = require("../Validator/postValidator");
const passportJWT = passport.authenticate("jwt", { session: false });

const {
  addGroup,
  addMember,
  removeMember,
  removeGroup,
  getUserPost,
  getUserGroup,
  getUser,
  search,
  getrecentposts
} = require("../controllers/user");

router.route("/").get(passportJWT, getUser);
router
  .route("/join/:group")
  .put(passportJWT, bodyParser.json(), addGroup, addMember);

router
  .route("/leave/:group")
  .put(passportJWT, bodyParser.json(), removeGroup, removeMember);

router.route("/search").post(passportJWT, bodyParser.json(), search);

router.route("/post").get(passportJWT, getUserPost);

router.route("/following").get(passportJWT, getUserGroup);

router.route("/my_group").get(passportJWT, getUserGroup);
router.route("/getrecentposts").get(passportJWT, getrecentposts);

router.get("/get-groups-seed", passportJWT, (req, res) => {
  require("../models/user")
    .findById(req.user.id)
    .populate("groups")
    .exec((err, user) => {
      res.json(user);
    });
});

module.exports = router;
