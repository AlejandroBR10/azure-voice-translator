import express from "express";
import multer from "multer";
import { speechController } from "../controllers/speech.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/speech", upload.single("audio"), speechController);

export default router;