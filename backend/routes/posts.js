const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts


    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize, (request, response) => {
    const userID = request.currentUser.id;
    const text = request.body.text;
    const type = request.body.media.type;
    const url = request.body.media.url;
    let post = {
        userId: userID,
        text: text,
        media: {
            url: url,
            type: type
        }
    };
    PostModel.create(post, (postIds) => {
        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])
    });
    // Endpoint to create a new post
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    let userId = request.currentUser.id;
    let postId = request.params.postId;

    PostModel.like(userId, postId, () => {
        response.status(201).json();
    })

});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    let userId = request.currentUser.id;
    let postId = request.params.postId;

    PostModel.unlike(userId, postId, () => {
        response.status(201).json();
    })

});

module.exports = router;