// implement your posts router here
const express = require("express");
const router = express.Router();
const POST = require("./posts-model")

router.get('/', (req, res) => {
    POST.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
});

router.get('/:id', (req, res) => {
    POST.findById(req.params.id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                res.status(200).json(posts)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
});

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        POST.insert({title, contents})
            .then(id => {
                res.status(201).json({...id, title, contents})
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        POST.findById(id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                return POST.update(id, {title, contents});
            }
        })
        .then(post => {
            if (post === 1) {
                return POST.findById(id);
            }
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    POST.findById(id)
    .then(posts => {
        if (!posts) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(posts)
            return POST.remove(id)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The post could not be removed" })
    })
})

router.get('/:id/comments', (req, res) => {
    POST.findById(req.params.id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                return POST.findPostComments(req.params.id)
            }
        })
        .then(comments => {
            res.status(200).json(comments)
        })
        .catch(err => {
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})

module.exports = router;

// #### 3 [POST] /api/posts
// - If the request body is missing the `title` or `contents` property:
//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.
// - If the information about the _post_ is valid:
//   - save the new _post_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _post_.
// - If there's an error while saving the _post_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON: `{ message: "There was an error while saving the post to the database" }`.

// #### 4 [PUT] /api/posts/:id
// - If the _post_ with the specified `id` is not found:
//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.
// - If the request body is missing the `title` or `contents` property:
//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.
// - If there's an error when updating the _post_:
//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be modified" }`.
// - If the post is found and the new information is valid:
//   - update the post document in the database using the new information sent in the `request body`.
//   - return HTTP status code `200` (OK).
//   - return the newly updated _post_.