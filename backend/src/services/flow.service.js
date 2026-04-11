import { speechToText, textToSpeech } from "./speech.service.js";
import { translateText } from "./translator.service.js";

export const fullFlow = async (filePath, targetLang) => {
  // 1. voz → texto
  const text = await speechToText(filePath);

  // 2. texto → traducción
  const translated = await translateText(text, targetLang);

  // 3. texto → voz
  const audio = await textToSpeech(translated);

  return {
    originalText: text,
    translatedText: translated,
    audio
  };
};