const mongoose = require('mongoose');
const {Schema} = mongoose;

const postSchema = new Schema({
  postId: Number,
  content: String,
  postTime: Number,
  tip: Number,
  userAddress: String,
  nickname: String,
  contact: String,
  likeCount: Number,
  comment: Object
});

mongoose.model('posts', postSchema);