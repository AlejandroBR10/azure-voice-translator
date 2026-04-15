import { speechToText } from "../services/speech.service.js";
import fs from "fs";
import path from "path";

export const speechController = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileSize = fs.statSync(filePath).size;

    console.log("===== AUDIO RECIBIDO =====");
    console.log("Tamaño:", fileSize, "bytes");
    console.log("Nombre original:", req.file.originalname);
    console.log("Tipo MIME:", req.file.mimetype);
    console.log("Ruta temporal:", filePath);

    // Crear directorio de debug si no existe
    const debugDir = "uploads/debug";
    if (!fs.existsSync(debugDir)) {
      fs.mkdirSync(debugDir, { recursive: true });
    }

    // Guardar copia para análisis
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const debugPath = path.join(debugDir, `audio_${timestamp}.wav`);
    fs.copyFileSync(filePath, debugPath);
    console.log("Guardado para análisis en:", debugPath);

    // Validar header RIFF
    const buffer = fs.readFileSync(filePath);
    const header = buffer.toString("ascii", 0, 4);
    console.log("Header RIFF:", header);

    if (header !== "RIFF") {
      console.warn("ADVERTENCIA: No es un archivo RIFF válido");
      console.log("Primeros bytes:", buffer.slice(0, 16));
    }

    // Validar estructura WAVE
    const waveHeader = buffer.toString("ascii", 8, 12);
    console.log("Header WAVE:", waveHeader);

    // Información del audio
    if (buffer.length > 24) {
      const channels = buffer.readUInt16LE(22);
      const sampleRate = buffer.readUInt32LE(24);
      console.log("Canales:", channels);
      console.log("Sample rate:", sampleRate, "Hz");
    }

    // Procesar audio
    console.log("Enviando a Azure Speech Recognition...");
    const text = await speechToText(filePath);
    console.log("Texto reconocido:", text);

    // Limpiar archivo temporal
    fs.unlinkSync(filePath);

    res.json({ text });
  } catch (error) {
    console.error("===== ERROR EN SPEECH CONTROLLER =====");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    // Intentar limpiar el archivo temporal
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error(
          "Error al limpiar archivo temporal:",
          cleanupError.message,
        );
      }
    }

    res.status(500).json({ error: error.message });
  }
};
