const formidable = require("formidable");
const fs = require("fs");

const GroupModel = require("../models/group");
const CategoryModel = require("../models/category");
const Post = require("../models/Post");
const User = require("../models/user");
const Category = require("../models/category");
const { upload } = require("../services/multer");

module.exports = {
  getGroupByfollowers: async (req, res) => {
    try {
      const group = await GroupModel.find()
        .sort({ members: -1 })
        .limit(10)
        .populate(["admins", "members", "creator", "post"]);

      res.json(group);
    } catch (error) {
      console.log("error", error);
      res.status(404).send("server error");
    }
  },
  createGroup: async (req, res) => {
    try {
      let imagePath;
      if (req.file) imagePath = req.file.filename;

      let category = await CategoryModel.find({});
      //instantiate categories for the first time
      if (Object.keys(category).length == 0) {
        category = new CategoryModel();
        await category.save();
      } else {
        category = category[0];
      }
      const user = await User.findById(req.user.id).select("-password");
      console.log("req.value", req.body);
      const { title, bio } = req.body;

      const categoryName = req.params.name;

      const newGroup = new GroupModel({
        title,
        bio,
        creator: req.user,
        photo: imagePath
      });

      newGroup.members.push(user._id);
      //assigning the creator as admin
      newGroup.admins.push(user._id);

      await newGroup.save();

      await category[categoryName].group.push(newGroup._id);
      user.groups.push(newGroup._id);
      await user.save();
      category.save();
      newGroup.populate({
        path: param + ".group",
        populate: ["admins", "members", "creator", "post"]
      });
      res.json(newGroup);
    } catch (error) {
      console.log("error", error);
      res.status(500).send("server error");
    }
  },

  getGroups: async (req, res) => {
    try {
      const param = req.params.name;
      const categories = await Category.find().populate({
        path: param + ".group",
        populate: ["admins", "members", "creator", "post"]
      });

      res.json(categories[0][param].group);
    } catch (error) {
      console.log("error kukulu", error);
      res.status(500).send("server wiha error");
    }
  },
  getGroup: async (req, res) => {
    try {
      const group = await GroupModel.findById(req.params.id);
      res.json(group);
    } catch (error) {
      res.status(500).send("server error");
    }
  },

  addAdmin: async (req, res) => {
    try {
      const { _id } = req.value.body;
      //find group
      const group = await GroupModel.findById(req.params.group);

      if (group) {
        try {
          const user = await User.findById(_id).select("-password");
          //check if the assigned user exists
          if (user) {
            //check if the assigned user is already not an admin
            if (
              group.admins.filter(admin => admin.toString() == _id).length > 0
            ) {
              console.log("already admin");
              return res.status(400).json({
                error: "user is already an admin"
              });
            }
            //push user id into admins array

            group.admins.push(_id);
            await group.save();
            return res.json(group);
          }
        } catch (err) {
          console.log("err", err);
          res.status(400).json({ error: "user not found" });
        }
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).send("server error");
    }
  },
  deleteGroup: async (req, res) => {
    try {
      //check if user is creator
      const creator = await GroupModel.findById(req.params.group);
      if (creator.creator == req.user.id) {
        await GroupModel.findByIdAndRemove(req.params.group);
        res.json("group deleted!");
      } else {
        res.status(400).json("you cannot delete this group!");
      }
      //
    } catch (error) {
      console.log("error:", error);
      res.status(500).send("server error");
    }
  },
  editGroup: async (req, res) => {
    try {
      let imagePath;
      if (req.file) imagePath = req.file.filename;

      const { bio, title } = req.body;
      console.log("body", req.body);
      //Build profile object
      const group = await GroupModel.findById(req.params.group);

      group.title = title;
      group.bio = bio;
      if (imagePath) group.photo = imagePath;
      await group.save();
      console.log("group", group);
      res.json(group);
    } catch (error) {
      console.log("error", error);
      res.status(500).send("server error");
    }
  }
};
