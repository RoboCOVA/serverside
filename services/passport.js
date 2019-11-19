const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const Localstrategy = require("passport-local").Strategy;
const GoogleTokenStrategy = require("passport-google-id-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const { JWT_SECRET } = require("../config/jwt");

const crypto = require("crypto");

const Usermodel = require("../models/user");

const config = require("config");
// const clientID = config.get('clientID');
// const clientSecret = config.get('clientSecret');

//JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        //get the user token
        const user = await Usermodel.findById(payload.sub).populate({
          path: "groups",
          populate: ["admins", "members", "creator", "post"]
        });

        //handle if the user not exists.
        if (!user) {
          return done(null, false);
        }

        //return user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// google Strategy
passport.use(
  "googleToken",
  new GoogleTokenStrategy(
    {
      clientID: config.clientID
    },
    async (parsedToken, googleId, done) => {
      try {
        console.log("parsedToken", parsedToken);
        //check if user is already exists
        const checkUserexist = await Usermodel.findOne({
          googleid: googleId
        });
        if (checkUserexist) {
          return done(null, checkUserexist);
        }

        //create new account
        const newUser = new Usermodel({
          method: "google",
          name: parsedToken.payload.name,
          googleid: parsedToken.payload.id,
          email: parsedToken.payload.email,
          photo: parsedToken.payload.picture
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// facebook strategy:

passport.use(
  "facebookToken",
  new FacebookTokenStrategy(
    {
      clientID: config.FbClientID,
      clientSecret: config.FbClientSecret,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("[profile]", profile);

        if (req.user) {
          // We're already logged in, time for linking account!
          // Add Google's data to an existing account
          req.user.methods.push("facebook");
          req.user.facebookid = profile.id;
          req.user.name = profile.name;
          req.user.photo = profile.photos[0].value;

          if (profile.emails[0].value) req.user.email = profile.emails[0].value;
          else {
            req.user.email = profile.id + "@mediabox.com";
          }
          //await req.user.save();
          return done(null, req.user);
        }

        const checkUserexist = await Usermodel.findOne({
          facebookid: profile.id
        }).populate({
          path: "groups",
          populate: ["admins", "members", "creator", "post"]
        });
        if (checkUserexist) {
          return done(null, checkUserexist);
        }
        const newUser = new Usermodel({
          method: "facebook",
          name: profile.displayName,
          facebookid: profile.id,
          email: profile.emails[0].value
        });

        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

//Local Strategy
passport.use(
  new Localstrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        //find the user with this eamil

        const user = await Usermodel.findOne({ email: email }).populate({
          path: "groups",
          populate: ["admins", "members", "creator", "post"]
        });

        //did't get? handle it
        if (!user) {
          return done("Invalid Credentials", false);
        }

        const hash = crypto
          .createHmac("sha1", user.salt)
          .update(password)
          .digest("hex");
        if (hash != user.password) {
          return done("Invalid Credentials", false);
        }

        //is not match, handle it

        //is match, return user.
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//  authenticate= (planText)=> {
//     console.log("[NEW]", this.encryptPassword(planText));
//     console.log("[OLD]", this.password);
//     return encryptPassword(planText) === this.password;
// },
//  encryptPassword=(password)=> {
//     if (!password) return "";
//     try {
//         // console.log("[SALT]", this.salt);
//         // console.log("[NEWPA]",password);

//         const hash = crypto.createHmac('sha1', this.salt)
//             .update(password)
//             .digest('hex');
//         return hash;
//     } catch (error) {
//         return "";
//     }
// }
