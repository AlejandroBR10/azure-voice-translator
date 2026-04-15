// API module - Backend communication functions
import { appState, updateState, API_URL } from "./state.js";
import {
  updateRecordingStatus,
  showStatus,
  setOriginalText,
  setTranslatedText,
  setAudioSource,
  updatePlayButton,
} from "./ui.js";
import { analyzeAudio } from "./audio.js";

/**
 * Send audio blob to backend for speech-to-text conversion
 * @param {Blob} audioBlob - Audio blob to send
 * @returns {Promise<void>}
 */
export async function sendAudioToBackend(audioBlob) {
  try {
    updateRecordingStatus("Enviando a servidor...");

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    console.log("\n===== ENVIANDO AUDIO AL BACKEND =====");
    console.log("Tamaño:", audioBlob.size, "bytes");
    console.log("Tipo:", audioBlob.type);
    console.log("URL API:", `${API_URL}/speech`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${API_URL}/speech`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Respuesta recibida. Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error del servidor:", errorData);
      throw new Error(
        errorData.error || `Error del servidor: ${response.status}`,
      );
    }

    const data = await response.json();
    console.log("Texto reconocido:", data.text);
    console.log("=====================================\n");

    updateState({ originalText: data.text });
    setOriginalText(data.text);

    updateRecordingStatus("Texto reconocido");
    showStatus("Speech to text completado", "success");

    await translateText();
  } catch (error) {
    if (error.name === "AbortError") {
      showStatus("Error: Tiempo de espera agotado", "error");
    } else {
      console.error("Error enviando audio:", error);
      showStatus(`Error: ${error.message}`, "error");
    }
    updateRecordingStatus("Click to record");
  }
}

/**
 * Translate text to target language
 * @returns {Promise<void>}
 */
export async function translateText() {
  try {
    if (!appState.originalText) {
      showStatus("Error: No hay texto para traducir", "error");
      return;
    }

    showStatus("Traduciendo...", "info");

    console.log("\n===== TRADUCIENDO TEXTO =====");
    console.log("Texto original:", appState.originalText);
    console.log("Idioma destino:", appState.targetLanguage);

    const response = await fetch(`${API_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: appState.originalText,
        to: appState.targetLanguage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Error de traducción");
    }

    const data = await response.json();
    updateState({ translatedText: data.translated });
    setTranslatedText(data.translated);

    console.log("Texto traducido:", data.translated);
    console.log("==============================\n");

    showStatus("Traducción completada", "success");

    await generateAudio();
  } catch (error) {
    console.error("Error en traducción:", error);
    showStatus(`Error: ${error.message}`, "error");
    updatePlayButton(false);
  }
}

/**
 * Generate audio from translated text using text-to-speech
 * @returns {Promise<void>}
 */
export async function generateAudio() {
  try {
    if (!appState.translatedText) {
      console.log("No hay texto traducido para generar audio");
      return;
    }

    showStatus("Generando audio...", "info");

    console.log("\n===== GENERANDO AUDIO =====");
    console.log("Texto a convertir:", appState.translatedText);
    console.log("Idioma destino:", appState.targetLanguage);

    const response = await fetch(`${API_URL}/text-to-speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: appState.translatedText,
        language: appState.targetLanguage,
      }),
    });

    console.log("Respuesta status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error del servidor:", errorData);
      throw new Error(errorData.error || `Error de audio: ${response.status}`);
    }

    const audioBlob = await response.blob();

    if (audioBlob.size === 0) {
      throw new Error("Audio recibido vacío");
    }

    console.log("Audio recibido - Tamaño:", audioBlob.size, "bytes");

    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioSource(audioUrl);

    updatePlayButton(true);

    showStatus("Audio listo para reproducir", "success");
    console.log("Audio URL generada exitosamente");
    console.log("============================\n");
  } catch (error) {
    console.error("Error generando audio:", error);
    showStatus(`Error: ${error.message}`, "error");
    updatePlayButton(false);
  }
}
