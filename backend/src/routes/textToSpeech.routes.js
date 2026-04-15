import express from "express";
import { ttsController } from "../controllers/textToSpeech.controller.js";

const router = express.Router();

router.post("/text-to-speech", ttsController);

export default router;
