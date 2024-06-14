const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const POSTS = require('../posts/posts-model');
const USERS = require('./users-model');
const MIDDLEWARE = require('../middleware/middleware');
const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  USERS.get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    })
});

router.get('/:id', MIDDLEWARE.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user);
});

router.post('/', MIDDLEWARE.validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  USERS.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      next(err);
    })
});

router.put('/:id', MIDDLEWARE.validateUserId, MIDDLEWARE.validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  USERS.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      next(err);
    })
});

router.delete('/:id', MIDDLEWARE.validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  USERS.remove(req.params.id)
    .then(() => {
      res.status(200).json(req.user);
    })
    .catch(err => {
      next(err);
    })
});

router.get('/:id/posts', MIDDLEWARE.validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  USERS.getUserPosts(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      next(err);
    })
});

router.post('/:id/posts', MIDDLEWARE.validateUserId, MIDDLEWARE.validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.body)
  POSTS.insert({user_id: req.params.id, ...req.body})
    .then(post => {
      console.log(post)
      res.status(201).json(post);
    })
    .catch(err => {
      next(err);
    })
});

router.use((err, req, res) => {
  res.status(500).json(err);
})

// do not forget to export the router
module.exports = router;