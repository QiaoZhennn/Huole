const mongoose = require('mongoose');
const Post = mongoose.model('posts');


module.exports = (app) => {
  app.post('/createPost', (req, res) => {
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
    Post.findOne({postId: req.body.postId})
      .then((post) => {
        if (post)
          return res.status(200).send(post);
        else
          return res.status(200).send({error:'Not stored in DB'});
      })
  });

  app.post('/likePost', (req, res) => {
    Post.findOneAndUpdate({postId: req.body.postId}, {$set:{likeCount : req.body.likeCount}})
      .then((post) => {
        if (post)
          return res.status(200).send({newLikeCount:req.body.likeCount});
        else
          return res.status(200).send({error:'Not stored in DB'});
      })
  });

  app.post('/commentPost', (req, res) => {
    Post.findOneAndUpdate({postId: req.body.postId}, {$push:{comment : req.body.comment}})
      .then((post) => {
        if (post)
          return res.status(200).send({newComment:req.body.comment});
        else
          return res.status(200).send({error:'Not stored in DB'});
      })
  })
};