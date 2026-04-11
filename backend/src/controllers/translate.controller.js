import { translateText } from "../services/translator.service.js";

export const translateController = async (req, res) => {
  try {
    const { text, to } = req.body;

    const result = await translateText(text, to);

    res.json({ translated: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};