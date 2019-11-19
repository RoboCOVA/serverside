const router = require("express-promise-router")();
const passport = require("passport");
const bodyParser = require("body-parser");
const { upload } = require("../services/multer");

const { validateBody, schemas } = require("../Validator/postValidator");
const {
  createPost,
  getPosts,
  getPost,
  comment,
  like,
  unlike,
  getPostsBasedOnFollowing,
  postPhoto
} = require("../controllers/post");
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/:group/create").post(passportJWT, upload, createPost);

router.route("/").get(passportJWT, getPosts);

router.route("/followingPosts").get(passportJWT, getPostsBasedOnFollowing);

router.route("/:id").get(passportJWT, getPost);

router
  .route("/comment/:id")
  .post(
    passportJWT,
    bodyParser.json(),
    validateBody(schemas.authSchema),
    comment
  );

router.route("/like/:id").put(passportJWT, bodyParser.json(), like);

router.route("/unlike/:id").put(passportJWT, bodyParser.json(), unlike);

router.route("/photo/:id").get(postPhoto);

module.exports = router;
