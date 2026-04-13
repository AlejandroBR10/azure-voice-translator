import axios from "axios";
import { azureConfig } from "../config/azure.config.js";
 
const IDIOMAS = {
  en: "Inglés",
  fr: "Francés",
  de: "Alemán",
};
 
export const translateText = async (text, to = ["en", "fr", "de"]) => {
  const idiomas = Array.isArray(to) ? to : [to];
 
  const params = new URLSearchParams({ "api-version": "3.0" });
  idiomas.forEach((lang) => params.append("to", lang));
 
  const response = await axios.post(
    `${azureConfig.translatorEndpoint}/translate?${params.toString()}`,
    [{ Text: text }],
    {
      headers: {
        "Ocp-Apim-Subscription-Key": azureConfig.translatorKey,
        "Ocp-Apim-Subscription-Region": azureConfig.region,
        "Content-Type": "application/json",
      },
    }
  );
 
  const resultado = {};
  response.data[0].translations.forEach((t) => {
    resultado[t.to] = t.text;
  });
 
  return resultado;
};
 
export { IDIOMAS };