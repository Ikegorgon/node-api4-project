const USERS = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req.method, req.url, (new Date()));
  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  console.log("Validating User ID");
  USERS.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        throw Error("user not found");
      }
    })
    .catch(() => {
      res.status(404).json({ message: "user not found" });
    })
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  console.log("Validating User");
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  console.log("Validating Post");
  if (req.body.text) {
    next();
  } else {
    res.status(400).json({ message: "missing required text field" });
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}