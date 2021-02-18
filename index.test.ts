import { GoogleCloudSpeechDriver } from "./google-cloud-speech";
import { AzureDriver } from "./azure";
import { mock } from "jest-mock-extended";
import { SpeechToTextDriver } from "./speech-to-text-driver";

const { SpeechToText } = require("./index");

beforeAll((done) => {
  done();
});

test("Creates a Google driver", () => {
  const stt = new SpeechToText({
    gCloudSpeech: {
      keyFileName: "./test",
      projectId: "abcd123",
    },
  });

  const driver = stt.getDriver();
  expect(driver).toBeInstanceOf(GoogleCloudSpeechDriver);
});

test("Creates an Azure driver", () => {
  const stt = new SpeechToText({
    azureCognitiveSpeech: {
      key: "./test",
      region: "abcd123",
    },
  });

  const driver = stt.getDriver();
  expect(driver).toBeInstanceOf(AzureDriver);
});

test("Accepts a passed driver", () => {
  const mockDriver = mock<SpeechToTextDriver>();
  const stt = new SpeechToText({
    driver: mockDriver,
  });

  expect(stt.getDriver()).toBe(mockDriver);
});

test("Generates a proper NCCO", () => {
  const mockDriver = mock<SpeechToTextDriver>();
  const stt = new SpeechToText({
    driver: mockDriver,
  });

  const expected = [
    {
      action: "connect",
      endpoint: [
        {
          type: "websocket",
          uri: "https://test.com/answer",
          "content-type": "audio/l16;rate=16000",
        },
      ],
    },
  ];

  expect(JSON.stringify(stt.createNCCO("https://test.com/answer"))).toBe(
    JSON.stringify(expected)
  );
});
