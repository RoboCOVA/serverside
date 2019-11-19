const formidable = require("formidable");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const Post = require("../models/Post");
const { upload } = require("../services/multer");
const Group = require("../models/group");

module.exports = {
  createPost: async (req, res) => {
    try {
      let imagePath;
      //IMAGE UPLOAD
      if (req.file) imagePath = req.file.filename;

      const { text } = req.body;
      let post = new Post();
      const user = await User.findById(req.user.id).select("-password");
      //console.log(user);

      post.name = user.name;
      post.user = req.user.id;
      imagePath ? (post.photo = imagePath) : null;
      post.text = text;
      console.log("post", post);

      post.save((err, result) => {
        if (err) {
          console.log("err", err.message);
          return res.status(400).json({
            error: err
          });
        }
        Group.findById(req.params.group).then(res => {
          res.post.push(post);
          res.save();
        });

        res.json(result);
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Server Error");
    }
  },
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ date: -1 })
        .populate("user");
      console.log("posts", posts);
      res.json(posts);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  getPostsBasedOnFollowing: async (req, res) => {
    try {
      var post = await Post.find().sort({ date: -1 });

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          msg: "Post not found"
        });
      }
      res.json(post);
    } catch (error) {
      console.error(err.message);
      if (error.kind == "ObjectId") {
        return res.status(404).json({
          msg: "Post not found"
        });
      }
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
  comment: async (req, res) => {
    try {
      const { text } = req.value.body;
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.id);
      const newComment = {
        text: text,
        name: user.name,
        user: req.user.id,
        photo: user.photo
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(500).send("Server Error");
    }
  },
  like: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (
        post.likes.filter(like => like.user.toString() == req.user.id).length >
        0
      ) {
        return res.status(400).json({
          msg: "Post already liked"
        });
      }
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
  unlike: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (
        post.likes.filter(like => like.user.toString() == req.user.id).length ==
        0
      ) {
        return res.status(400).json({
          msg: "Post has not yet been liked"
        });
      }
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);

      await post.save();
      res.json(post.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
  postPhoto: async (req, res, next) => {
    var postId = req.params.id;
    console.log(postId);
    var post = await Post.findById(postId);
    if (post.photo) {
      res.set("Content-Type", post.photo.contentType);
      return res.send(post.photo.data);
    }
    next();
  }
};
