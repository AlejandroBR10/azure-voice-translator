

import { fullFlow } from "../services/flow.service.js";
import fs from "fs";

export const flowController = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { lang } = req.body;

    const result = await fullFlow(filePath, lang);

    fs.unlinkSync(filePath);

    res.set({
      "Content-Type": "audio/wav"
    });

    res.send(result.audio);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};