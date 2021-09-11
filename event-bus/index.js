const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

app.post('/events', (req, res) => {
    const event = req.body;

    axios.post('http://localhost:4000/events', event);
    axios.post('http://localhost:4001/events', event);
    axios.post('http://localhost:4002/events', event);
    axios.post('http://localhost:4003/events', event);
    res.send({ status: 'ok' });
})

app.listen(4005,console.log('listening on 4005'))