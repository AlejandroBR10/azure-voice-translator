import { fullFlow } from "../services/flow.service.js";
import fs from "fs";

export const flowController = async (req, res) => {
  try {
    console.log("REQ OK");

    const filePath = req.file.path;
    console.log("Archivo:", filePath);

    // 🔥 prueba directa sin Azure
    fs.unlinkSync(filePath);

    res.set({
      "Content-Type": "audio/wav"
    });

    res.send(Buffer.from("test"));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
