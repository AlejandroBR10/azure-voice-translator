import express from "express";
import { ttsController } from "../controllers/textToSpeech.controller.js";

const router = express.Router();

router.post("/tts", ttsController);

export default router;