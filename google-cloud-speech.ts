const speech = require('@google-cloud/speech');

export interface GoogleCloudConfig {
    keyFileName: string;
    projectId: string;
}

export class GoogleCloudSpeechDriver {
    config: any;
    client: any;
    request: any;
    recognizeStream: any;

    constructor(config: any = {}) {
        this.config = config;
        this.client = new speech.SpeechClient(this.config.gCloudSpeech);

        if (this.config.audioRate === 'audio/l16;rate=16000') {
            this.request = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US'
            },
            interimResults: false,
            };

            this.recognizeStream = this.client
                .streamingRecognize(this.request)
                .on('error', console.error)
                .on('data', (data: any) => {
                this.config.handler(data.results[0].alternatives[0].transcript)
                })
            ;
        }
    }

    destroy() {
        this.recognizeStream.destroy();
    }

    write(msg: string) {
        // console.log(msg);
        this.recognizeStream.write(msg);
    }
}
