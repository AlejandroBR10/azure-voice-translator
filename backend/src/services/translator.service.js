import axios from "axios";
import { azureConfig } from "../config/azure.config.js";

export const translateText = async (text, to) => {
    try{
  const response = await axios.post(
    `${azureConfig.translatorEndpoint}/translate?api-version=3.0&to=${to}`,
    [{ Text: text }],
    {
      headers: {
        "Ocp-Apim-Subscription-Key": azureConfig.translatorKey,
         "Ocp-Apim-Subscription-Region": "westus2",
        "Content-Type": "application/json"
      }
    }
  );

  return response.data[0].translations[0].text;
}catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Error en traducción");
  }
};