const express = require('express');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

const commentsByPostId = {};


app.get('/posts/:id/comments', function (req, res, next) {

    res.send(commentsByPostId[req.params.id] || []);

})

app.post('/posts/:id/comments', async function (req, res) {

    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    const newComment = { id: commentId, content: content, status: 'pending', postId: req.params.id };
    comments.push(newComment);
    commentsByPostId[req.params.id] = comments;


    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: newComment
    })

    res.status(200).send(commentsByPostId[req.params.id])
})

app.post('/events', async (req, res) => {
    console.log('Recevied Evenet', req.body.type);

    const { type, data } = req.body;



    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => comment.id === id);
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: { id, status, postId, content },
        })


    }
    res.send({})
});

app.listen('4001', console.log('comments server running on 4001 port'))