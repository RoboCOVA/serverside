const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],

  title: {
    type: String
  },
  photo:{
    type:String
  },
  bio: {
    type: String
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  avatar: { type: String },

  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  ],

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Post = mongoose.model("group", groupSchema);
