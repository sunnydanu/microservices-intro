const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts)
});

const handelEvent = (type,data) => {

    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };

    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }
    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }

}

app.post('/events', (req, res) => {

    const { type, data } = req.body;
    handelEvent(type, data);
    console.log(posts);
    res.send({})

});

app.listen(4002, async () => {
    console.log('listening on http://localhost:4002')
    const res = await axios.get('http://event-bus-srv:4005/events');
    for (const event of res.data) {
        console.log('Processing Event: ' + event.type);
        handelEvent(event.type, event.data)
    }

});