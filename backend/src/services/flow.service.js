import { speechToText, textToSpeech } from "./speech.service.js";
import { translateText } from "./translator.service.js";

export const fullFlow = async (filePath, targetLang) => {
  console.log("1. Iniciando speechToText");

  const text = await speechToText(filePath);
  console.log("Texto obtenido:", text);

  console.log("2. Iniciando translateText");

  const translated = await translateText(text, targetLang);
  console.log("Texto traducido:", translated);

  console.log("3. Iniciando textToSpeech");

  const audio = await textToSpeech(translated);
  console.log("Audio generado");

  return {
    originalText: text,
    translatedText: translated,
    audio
  };
};
