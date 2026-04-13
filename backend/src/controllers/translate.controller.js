import { translateText, IDIOMAS } from "../services/translator.service.js";
 
export const translateController = async (req, res) => {
  const { text, to = ["en", "fr", "de"] } = req.body;
 
  if (!text) {
    return res.status(400).json({ error: "Falta el texto" });
  }
 
  try {
    const translated = await translateText(text, to);
    res.json({ original: text, translated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
export const idiomasController = (req, res) => {
  res.json({ idiomas: IDIOMAS });
};
 