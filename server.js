const express = require('express');
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(express.json({ limit: '100mb' }));
    server.use(express.urlencoded({ limit: '100mb', extended: true }));

    server.post('/api/generateAudio', async (req, res) => {
        console.log("Received request");

        try {
            const backendResponse = await axios.post(
                'http://127.0.0.1:5000/generate',
                {
                    audioBase64: req.body.audioBase64,
                    bpm: req.body.bpm,
                    duration: req.body.duration,
                    iterations: req.body.iterations,
                    outputDurationRange: req.body.outputDurationRange
                },
                {
                    responseType: 'arraybuffer',
                }
            );

            console.log("Received response from Flask backend");
            res.setHeader('Content-Type', 'audio/wav');
            res.send(backendResponse.data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
