## Installation
1. `npm install git+https://github.com/dragonmantank/urban-telegram.git`
1. `cd node_modules/@vonage/stt-connector`
1. `npm install`
1. `npm run build`

## Sample Usage

```js
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const port = 3000;
const { SpeechToText } = require('@vonage/stt-connector');

const STTConnector = new SpeechToText({
    audioRate: 'audio/l16;rate=16000',
    handler: data => {
        console.log(`Vonage Transcription: ${data}`);
    },
    // gCloudSpeech: {
    //     keyFilename: './keys.json',
    //     projectId: 'project-name'
    // },
    azure: {
        key: 'azure-key',
        region: 'region'
    }
});

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(STTConnector.createNCCO(`${req.protocol}://${req.hostname}/echo`)));
});

app.get('/events', (req, res) => {
    // console.log(req);
});

app.ws('/echo', async (ws, req) => {
    ws.on('message', async (msg) => {
        if (typeof msg === 'string') {
            console.log(msg);
        } else {
            STTConnector.write(msg);
        }
    });

    ws.on('close', () => {
        STTConnector.destroy();
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
```