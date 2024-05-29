const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const LANGUAGE_MODEL_API_KEY = process.env.LANGUAGE_MODEL_API_KEY;
const LANGUAGE_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta1/models/chat-bison-001:generateMessage?key=${LANGUAGE_MODEL_API_KEY}`;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('/prompt/:text', async (req, res) => {
    const text = req.params.text;

    const payload = {
        prompt: { "messages": [{ "content": text }]},
        temperature: 0.1,
        candidate_count: 1,
    };
    try {
        const response = await fetch(LANGUAGE_MODEL_URL, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            method: "POST",
        });
        const data = await response.json();
        console.log(data);
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
