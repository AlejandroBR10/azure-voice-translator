import express from "express";
import cors from "cors";
import translateRoutes from "./routes/translate.routes.js"
import speechRoutes from "./routes/speech.routes.js"
import ttsRoutes from "./routes/textToSpeech.routes.js";
import flowRoutes from "./routes/flow.routes.js";




const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});
app.use("/api", translateRoutes);
app.use("/api", speechRoutes);

app.use("/api", ttsRoutes);
app.use("/api", flowRoutes);

export default app;