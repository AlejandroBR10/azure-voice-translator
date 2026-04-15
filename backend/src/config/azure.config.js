import dotenv from "dotenv";

dotenv.config();

export const azureConfig = {
  speechKey: process.env.AZURE_SPEECH_KEY,
  region: process.env.AZURE_REGION,
  translatorKey: process.env.AZURE_TRANSLATOR_KEY,
  translatorEndpoint: process.env.AZURE_TRANSLATOR_ENDPOINT
};