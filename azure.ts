const sdk = require("microsoft-cognitiveservices-speech-sdk");

export interface AzureConfig {
    key: string;
    region: string;
}

export class AzureDriver {
    config: any;
    pushStream: any;
    speechConfig: any;
    recognizer: any;
    format: any;
    stream: any;
    audioConfig: any;

    constructor(config: any = {}) {
        this.config = config;
        this.speechConfig = sdk.SpeechConfig.fromSubscription(this.config.azure.key, this.config.azure.region);

        this.format = sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
        this.stream = sdk.AudioInputStream.createPushStream(this.format);
        this.audioConfig = sdk.AudioConfig.fromStreamInput(this.stream);
        this.recognizer = new sdk.SpeechRecognizer(this.speechConfig, this.audioConfig);
        this.recognizer.startContinuousRecognitionAsync(
            function (result: any) {
              },
              function (err: any) {
                console.trace("err - " + err);
              }
        );
        this.recognizer.recognized = (reco: any, e: any) => {
            try {
                const res = e.result;
                this.config.handler(res.text);
            } catch (error) {
                console.error("error", error);
            }
          };
    }

    destroy() {
        this.recognizer.close();
    }

    async write(msg: string) {
        this.stream.write(msg);
    }
}
