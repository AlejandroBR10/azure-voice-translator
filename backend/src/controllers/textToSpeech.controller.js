import { textToSpeech } from "../services/speech.service.js";

export const ttsController = async (req, res) => {
  try {
    const { text } = req.body;

    const audio = await textToSpeech(text);

    res.set({
      "Content-Type": "audio/wav",
      "Content-Disposition": "inline; filename=audio.wav"
    });

    res.send(audio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};