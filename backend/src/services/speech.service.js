import sdk from "microsoft-cognitiveservices-speech-sdk";
import { azureConfig } from "../config/azure.config.js";
import fs from "fs";

export const speechToText = (filePath) => {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      azureConfig.speechKey,
      azureConfig.region
    );

    speechConfig.speechRecognitionLanguage = "es-MX";

    // --- CAMBIO AQUÍ ---
    // En lugar de PushStream, pasamos directamente el archivo
    const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(filePath));
    // O mejor aún, si tienes la ruta:
    // const audioConfig = sdk.AudioConfig.fromWavFilePath(filePath);

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
      (result) => {
        recognizer.close();
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          resolve(result.text);
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          reject("No se reconoció ninguna palabra. Revisa el formato del audio.");
        } else {
          reject("Error de reconocimiento: " + result.errorDetails);
        }
      },
      (err) => {
        recognizer.close();
        reject(err);
      }
    );
  });
};

export const textToSpeech = (text) => {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      azureConfig.speechKey,
      azureConfig.region
    );

    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        synthesizer.close(); // IMPORTANTE

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBuffer = Buffer.from(result.audioData);
          resolve(audioBuffer);
        } else {
          reject("No se pudo generar audio");
        }
      },
      (error) => {
        synthesizer.close(); // IMPORTANTE
        reject(error);
      }
    );
  });
};
