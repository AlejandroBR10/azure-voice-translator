import { textToSpeech } from "../services/speech.service.js";

const voiceMap = {
  en: "en-US-JennyNeural",
  es: "es-ES-AlvaroNeural",
  pt: "pt-BR-FranciscaNeural",
  fr: "fr-FR-DeniseNeural",
  de: "de-DE-ConradNeural",
  it: "it-IT-IsabellaNeural",
  ja: "ja-JP-NanamiNeural",
};

export const ttsController = async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const lang = language || "en";
    const voice = voiceMap[lang] || voiceMap["en"];

    console.log("\n===== TEXT TO SPEECH =====");
    console.log("Texto:", text);
    console.log("Idioma solicitado:", lang);
    console.log("Voz seleccionada:", voice);

    const audio = await textToSpeech(text, voice);

    console.log("Audio generado - Tamaño:", audio.length, "bytes");
    console.log("==========================\n");

    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": "inline; filename=audio.wav",
    });

    res.send(audio);
  } catch (error) {
    console.error("Error en TTS Controller:", error.message);
    res.status(500).json({ error: error.message });
  }
};
