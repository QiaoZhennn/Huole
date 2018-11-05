const mongoose = require('mongoose');
const Post = mongoose.model('posts');


module.exports = (app) => {
  app.post('/createPost', (req, res) => {
    console.log(req.body);
    new Post({
      postId: req.body.postId,
      content: req.body.content,
      postTime: req.body.postTime,
      tip: req.body.tip,
      userAddress: req.body.userAddress,
      nickname: req.body.nickname,
      contact: req.body.contact,
      likeCount: req.body.likeCount,
      comment: req.body.comment
    }).save();
  });

  app.post('/readPost', (req, res) => {
    console.log(req.body.postId);
    Post.findOne({postId: req.body.postId})
      .then((post) => {
        if (post)
          return res.status(200).send(post);
        else
          return res.status(200).send('Not stored in DB');
      })
  })
};