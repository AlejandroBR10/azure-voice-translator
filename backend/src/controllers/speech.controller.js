import { speechToText } from "../services/speech.service.js";
import fs from "fs";

export const speechController = async (req, res) => {
    try {
        console.log("SIZE:", fs.statSync(req.file.path).size);
        const filePath = req.file.path;

        const text = await speechToText(filePath);
        console.log("FILE:", req.file);

        fs.unlinkSync(filePath); // borrar archivo

        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};