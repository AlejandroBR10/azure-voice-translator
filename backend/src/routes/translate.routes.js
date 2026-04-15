import express from "express";
import { translateController } from "../controllers/translate.controller.js";

const router = express.Router();

router.post("/translate", translateController);

export default router;