import express from "express";
import multer from "multer";
import { flowController } from "../controllers/flow.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/full-flow", upload.single("audio"), flowController);

export default router;