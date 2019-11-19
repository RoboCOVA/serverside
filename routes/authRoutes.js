const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportservice = require("../services/passport");
const bodyParser = require("body-parser");

const { validateBody, schemas } = require("../Validator/routeValidator");
const AccountController = require("../controllers/users");
const passportSignIn = passport.authenticate("local", { session: false });

router
  .route("/signup")
  .post(
    bodyParser.json(),
    validateBody(schemas.authSchema),
    AccountController.signUp
  );

router.route("/signin").post(
  bodyParser.json(),
  validateBody(schemas.authSchema),

  passportSignIn,
  AccountController.signIn
);

router
  .route("/oauth/google")
  .post(
    bodyParser.json(),
    passport.authenticate("googleToken", { session: false }),
    AccountController.googleOAuth
  );

router.post("/oauth/google", (req, res) => {
  console.log("res.headers", req);
});
router
  .route("/oauth/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    bodyParser.json(),
    AccountController.facebookOAuth
  );

module.exports = router;
