const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

const events =  [];
app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);
    axios.post('http://post-clusterip-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);
    res.send({ status: 'ok' });
})

app.get('/events', function(req, res){
    res.send(events);
})

app.listen(4005,console.log('listening on 4005'))