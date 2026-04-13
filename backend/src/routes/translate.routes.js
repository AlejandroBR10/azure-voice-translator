import express from "express";
import { translateController, idiomasController } from "../controllers/translate.controller.js";
 
const router = express.Router();
 
router.get("/idiomas", idiomasController);
router.post("/translate", translateController);
 
export default router;
 