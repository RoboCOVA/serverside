const User = require("../models/user");
const GroupModel = require("../models/group");
const PostModel = require("../models/Post");
const UserModel = require("../models/user");
exports.search = async (req, res, next) => {
  try {
    let name = req.body.name;
    let user = await User.find({ name: { $regex: name, $options: "i" } });
    user.password = undefined;
    console.log(user);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
//adding group id into users group list
exports.addGroup = async (req, res, next) => {
  try {
    console.log("req.params.group", req.params.group, " ", req.user.id);
    const user = await User.findById(req.user.id);
    user.groups.filter(userGroups => {
      console.log("userGroups", userGroups);
    });
    if (
      user.groups.filter(userGroups => {
        if (userGroups) return userGroups.toString() == req.params.group;
      }).length > 0
    ) {
      console.log("reached here");

      return res.status(400).json({
        error: "User is already a member of this group"
      });
    }
    user.groups.unshift(req.params.group);
    await user.save();

    next();
  } catch (error) {
    console.error(error, error.message);
    res.status(500).send("Server Error");
  }
};
//adding user id into group members array

exports.addMember = async (req, res) => {
  console.log('req.params.group.split(":")[1]', req.params.group);
  try {
    const group = await GroupModel.findById(req.params.group).populate([
      "admins",
      "members",
      "creator",
      ,
      "post"
    ]);

    group.members.unshift(req.user.id);
    await group.save();
    res.json(group);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.removeGroup = async (req, res, next) => {
  console.log("req.params.group", req.params.group);
  User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: {
        groups: req.params.group
      }
    },
    { new: true, useFindAndModify: false },
    (err, result) => {
      console.log("result", err);
      // if (err) {
      //   return res.status(400).json({ error: err });
      // }

      next();
    }
  );
};

exports.removeMember = async (req, res) => {
  console.log("req.user.id,req.params.group", req.user.id, req.params.group);
  GroupModel.findByIdAndUpdate(
    req.params.group,
    {
      $pull: {
        members: req.user.id
      }
    },
    { new: true, useFindAndModify: false }
  )
    .populate(["admins", "members", "creator", "post"])
    .exec((err, result) => {
      if (err) {
        console.log("err", err);
        return res.status(400).json({
          error: err
        });
      }

      res.json(result);
    });
};

exports.getUserPost = async (req, res) => {
  try {
    const post = await PostModel.find({ user: req.user.id });
    res.json(post);
  } catch (error) {
    res.status(500).send("server error");
  }
};

exports.getUserGroup = async (req, res) => {
  try {
    // const group = await GroupModel.find({ members: req.user.id }).populate([
    //   "admins",
    //   "members",
    //   "creator",
    //   "post"
    // ]);

    const group = await User.findById(req.user.id).populate({
      path: "groups",
      populate: ["admins", "members", "creator", "post"]
    });

    res.json(group.groups);
  } catch (error) {
    res.status(500).send("server error");
  }
};
exports.getrecentposts = async (req, res) => {
  try {
    let posts = [];
    const group = await User.findById(req.user.id).populate({
      path: "groups",
      populate: ["admins", "members", "creator", "post"]
    });
    group.groups.map(gr => {
      gr.post.map(po => {
        posts.push(po);
      });
      // posts = [...posts, gr.post];
    });
    posts.sort((a, b) => b.date - a.date);
    console.log("posts.sort", posts);
    console.log("group gf", posts);
    res.json(posts);
  } catch (error) {
    console.log("error", error);
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).send("server error");
  }
};
