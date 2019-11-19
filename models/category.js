const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  sport: {
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "group"
      }
    ],

    name: {
      type: String,
      default: "sport"
    }
  },
  diaspora: {
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "group"
      }
    ],

    name: {
      type: String,
      default: "diaspora"
    }
  },
  jobopportunity: {
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "group"
      }
    ],

    name: {
      type: String,
      default: "jobopportunity"
    }
  },
  startup: {
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "group"
      }
    ],

    name: {
      type: String,
      default: "startup"
    }
  },
  shaibuna: {
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "group"
      }
    ],

    name: {
      type: String,
      default: "shaibuna"
    }
  }
});
module.exports = Post = mongoose.model("category", categorySchema);
