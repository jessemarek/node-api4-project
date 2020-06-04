const express = require('express');

const router = express.Router();

const Posts = require('./postDb')

router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
    .then(posts => {
      if (posts.length) {
        res.status(200).json(posts)
      }
      else {
        res.status(404).json({ message: "no posts found" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "error getting posts from the server" })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json(req.post)
      }
      else {
        res.status(500).json({ message: "post was not removed from the database" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "post was not removed from the database" })
    })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  // do your magic!
  Posts.update(req.post.id, req.body)
    .then(count => {
      res.status(200).json({ ...req.post, text: req.body.text })
    })
    .catch(err => {
      res.status(500).json({ message: "error could not update post on server" })
    })
});

// custom middleware

function validatePost(req, res, next) {
  // do your magic!
  if (req.body['text']) {
    next()
  }
  else if (req.body) {
    res.status(400).json({ message: "missing required text field" })
  }
  else {
    res.status(400).json({ message: "missing post data" })
  }
}

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params
  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post
        next()
      }
      else {
        res.status(400).json({ message: "invalid post id" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "error finding post by id on the server" })
    })
}

module.exports = router;
