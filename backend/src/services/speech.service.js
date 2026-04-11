import sdk from "microsoft-cognitiveservices-speech-sdk";
import { azureConfig } from "../config/azure.config.js";
import fs from "fs";

export const speechToText = (filePath) => {
    return new Promise((resolve, reject) => {

        const speechConfig = sdk.SpeechConfig.fromSubscription(
            azureConfig.speechKey,
            azureConfig.region
        );
        speechConfig.setProperty(
            sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
            "15000"
        );


        speechConfig.speechRecognitionLanguage = "es-MX";

        const pushStream = sdk.AudioInputStream.createPushStream();
        const audioBuffer = fs.readFileSync(filePath);

        pushStream.write(audioBuffer);
        pushStream.close();

        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

        const recognizer = new sdk.SpeechRecognizer(
            speechConfig,
            audioConfig
        );

        recognizer.recognizeOnceAsync(
            (result) => {
                console.log("RESULT:", result);

                if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                    resolve(result.text);
                } else {
                    reject("No se pudo reconocer voz");
                }
            },
            (err) => {
                console.error("ERROR:", err);
                reject(err);
            }
        );
    });
};