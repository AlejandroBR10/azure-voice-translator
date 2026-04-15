import sdk from "microsoft-cognitiveservices-speech-sdk";
import { azureConfig } from "../config/azure.config.js";
import fs from "fs";

export const speechToText = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        reject(new Error(`Archivo no encontrado: ${filePath}`));
        return;
      }

      const audioBuffer = fs.readFileSync(filePath);
      console.log("Buffer tamaño:", audioBuffer.length);

      if (audioBuffer.length < 44) {
        reject(new Error("Archivo WAV muy pequeño (menor a 44 bytes header)"));
        return;
      }

      const riffHeader = audioBuffer.toString("ascii", 0, 4);
      const waveHeader = audioBuffer.toString("ascii", 8, 12);

      console.log("RIFF:", riffHeader, "WAVE:", waveHeader);

      if (riffHeader !== "RIFF" || waveHeader !== "WAVE") {
        reject(new Error("Archivo no es WAV válido"));
        return;
      }

      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureConfig.speechKey,
        azureConfig.region,
      );

      speechConfig.speechRecognitionLanguage = "es-MX";

      speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs,
        "5000",
      );

      speechConfig.setProperty(
        sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs,
        "1000",
      );

      const pushStream = sdk.AudioInputStream.createPushStream();
      const chunkSize = 4096;
      let offset = 0;

      while (offset < audioBuffer.length) {
        const chunk = audioBuffer.slice(offset, offset + chunkSize);
        pushStream.write(chunk);
        offset += chunkSize;
      }

      pushStream.close();

      const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(
        (result) => {
          console.log("===== RESULTADO AZURE =====");
          console.log("Reason:", result.reason);
          console.log("ResultId:", result.resultId);

          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            console.log("Texto:", result.text);
            resolve(result.text);
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            console.log("No se reconoció texto");
            reject(new Error("No se reconoció texto en el audio"));
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result);
            console.log("Cancelado. Razón:", cancellation.reason);
            console.log("Detalles:", cancellation.errorDetails);
            reject(
              new Error(
                `Cancelado: ${cancellation.errorDetails || cancellation.reason}`,
              ),
            );
          }
        },
        (error) => {
          console.error("Error en reconocimiento:", error);
          reject(error);
        },
      );
    } catch (error) {
      console.error("Error en speechToText:", error.message);
      reject(error);
    }
  });
};

export const textToSpeech = (text, voiceName = "en-US-JennyNeural") => {
  return new Promise((resolve, reject) => {
    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        azureConfig.speechKey,
        azureConfig.region,
      );

      speechConfig.speechSynthesisVoiceName = voiceName;

      console.log("Configurando síntesis con voz:", voiceName);

      const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          console.log("===== RESULTADO SINTESIS =====");
          console.log("Reason:", result.reason);

          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioBuffer = Buffer.from(result.audioData);
            console.log(
              "Audio generado correctamente - Tamaño:",
              audioBuffer.length,
            );
            console.log("================================");
            resolve(audioBuffer);
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result);
            console.log("Síntesis cancelada:", cancellation.errorDetails);
            reject(
              new Error(`Síntesis cancelada: ${cancellation.errorDetails}`),
            );
          } else {
            reject(new Error("No se pudo generar audio"));
          }
        },
        (error) => {
          console.error("Error en síntesis:", error);
          reject(error);
        },
      );
    } catch (error) {
      console.error("Error en textToSpeech:", error.message);
      reject(error);
    }
  });
};
