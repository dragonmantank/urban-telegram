import { GoogleCloudConfig, GoogleCloudSpeechDriver } from './google-cloud-speech';
import { AzureConfig, AzureDriver } from './azure';

interface TranscribeCallbackFunction {
  (text: string): void;
}

interface Config {
  audioRate: string;
  handler: TranscribeCallbackFunction;
  gCloudSpeech: GoogleCloudConfig;
  azure: AzureConfig;
}

class SpeechToText {
    config: Config;
    driver: any;

    constructor(config: Config) {
        this.config = config;
        if (config.gCloudSpeech !== undefined) {
          this.driver = new GoogleCloudSpeechDriver(this.config);
        }

        if (config.azure !== undefined) {
          this.driver = new AzureDriver(this.config);
        }
    }

    createNCCO(callbackUrl: string): object {
        return [
          {
              'action': 'connect',
              'endpoint': [
                  {
                      'type': 'websocket',
                      'uri': callbackUrl,
                      'content-type': this.config.audioRate
                  }
              ]
          }
      ]
    }

    destroy(): void {
      this.driver.destroy();
    }

    write(msg: string): void {
      this.driver.write(msg);
    }
}

module.exports = {
  SpeechToText: SpeechToText
}