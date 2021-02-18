import { SpeechToTextDriver } from "./speech-to-text-driver";
const sdk = require("microsoft-cognitiveservices-speech-sdk");

export interface CognitiveSpeechConfig {
  key: string;
  region: string;
}

export class AzureDriver implements SpeechToTextDriver {
  config: any;
  speechConfig: any;
  recognizer: any;
  format: any;
  pushStream: any;
  audioConfig: any;

  constructor(config: any = {}) {
    this.config = config;
    this.speechConfig = sdk.SpeechConfig.fromSubscription(
      this.config.azureCognitiveSpeech.key,
      this.config.azureCognitiveSpeech.region
    );

    this.format = sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1);
    this.pushStream = sdk.AudioInputStream.createPushStream(this.format);
    this.audioConfig = sdk.AudioConfig.fromStreamInput(this.pushStream);
    this.recognizer = new sdk.SpeechRecognizer(
      this.speechConfig,
      this.audioConfig
    );
    this.recognizer.startContinuousRecognitionAsync(
      function (result: any) {},
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

  /**
   * @inheritdoc
   */
  destroy() {
    this.recognizer.close();
  }

  /**
   * @deprecated Replaced with this.stream
   * @param msg WebSocket message that is really an audio block
   */
  async write(msg: string) {
    this.stream(msg);
  }

  /**
   * @inheritdoc
   */
  stream(audio: string): void {
    this.pushStream.write(audio);
  }

  /**
   * @inheritdoc
   */
  transcribeFile(path: string): string {
    return "Hello World";
  }
}
