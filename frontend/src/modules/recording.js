// Recording module - Audio capture and playback functions
import { appState, updateState, MAX_RECORDING_DURATION, MAX_FILE_SIZE } from './state.js';
import {
  updateRecordingStatus,
  showStatus,
  updateRecordingButton,
  updatePlayButton,
  showDownloadButton,
  setOriginalText,
  getAudioPlayer,
} from './ui.js';
import { sendAudioToBackend } from './api.js';
import {
  analyzeAudio,
  resampleTo16kHz,
  encodeWav,
  logAudioInfo,
} from './audio.js';

/**
 * Toggle recording on/off
 */
export function toggleRecording() {
  if (appState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

/**
 * Start audio recording
 */
export async function startRecording() {
  try {
    updateState({ audioChunks: [] });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "audio/wav";

    appState.mediaRecorder = new MediaRecorder(stream, { mimeType });
    updateState({ isRecording: true, recordingTime: 0 });

    appState.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        appState.audioChunks.push(event.data);
      }
    };

    appState.mediaRecorder.onstop = async () => {
      const mimeType = appState.mediaRecorder.mimeType;
      const audioBlob = new Blob(appState.audioChunks, { type: mimeType });

      console.log("\n===== GRABACION COMPLETADA =====");
      console.log("Tamaño del blob:", audioBlob.size, "bytes");
      console.log("MIME type:", mimeType);
      console.log("Chunks capturados:", appState.audioChunks.length);

      if (audioBlob.size < 1000) {
        console.warn("Audio muy corto (< 1KB)");
        showStatus(
          "Error: Audio muy corto. Habla mas fuerte o mas tiempo.",
          "error"
        );
        updateRecordingStatus("Click to record");
        return;
      }

      if (audioBlob.size > MAX_FILE_SIZE) {
        showStatus("Error: Archivo muy grande. Maximo 50MB.", "error");
        return;
      }

      updateRecordingStatus("Convirtiendo a WAV...");
      const wavBlob = await convertBlobToWav(audioBlob, mimeType);

      if (!wavBlob) {
        showStatus("Error: No se pudo convertir el audio", "error");
        updateRecordingStatus("Click to record");
        return;
      }

      showDownloadButton(true);

      updateRecordingStatus("Enviando al servidor...");
      await sendAudioToBackend(wavBlob);
    };

    appState.mediaRecorder.start();

    updateRecordingButton(true);
    updateRecordingStatus("Recording...");

    setTimeout(() => {
      if (appState.isRecording) {
        stopRecording();
      }
    }, MAX_RECORDING_DURATION);

    const recordingInterval = setInterval(() => {
      updateState({ recordingTime: appState.recordingTime + 1 });
      const secs = appState.recordingTime;
      const time = `${Math.floor(secs / 60)}:${(secs % 60)
        .toString()
        .padStart(2, "0")}`;
      updateRecordingStatus(`Recording... ${time}`);
    }, 1000);

    updateState({ recordingInterval });
  } catch (error) {
    showStatus(
      `Error: No se pudo acceder al micrófono: ${error.message}`,
      "error"
    );
    updateState({ isRecording: false });
  }
}

/**
 * Stop audio recording
 */
export function stopRecording() {
  if (appState.mediaRecorder && appState.isRecording) {
    appState.mediaRecorder.stop();
    updateState({ isRecording: false });
    clearInterval(appState.recordingInterval);
    appState.mediaRecorder.stream.getTracks().forEach((track) => track.stop());

    updateRecordingButton(false);
    updateRecordingStatus("Procesando...");
  }
}

/**
 * Convert audio blob to WAV format
 * @param {Blob} audioBlob - Audio blob to convert
 * @param {string} mimeType - MIME type of the blob
 * @returns {Promise<Blob>} Converted WAV blob
 */
export async function convertBlobToWav(audioBlob, mimeType) {
  if (mimeType && mimeType.includes("wav")) {
    console.log("Ya es WAV, sin conversión necesaria");
    return audioBlob;
  }

  try {
    console.log("\n===== INICIANDO CONVERSION A WAV =====");
    console.log("Blob original - Tamaño:", audioBlob.size, "bytes");
    console.log("MIME type:", mimeType);

    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    console.log("Decodificando audio...");
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    analyzeAudio(audioBuffer);

    let targetBuffer = audioBuffer;

    if (audioBuffer.sampleRate !== 16000) {
      console.log("Sample rate no es 16kHz, resampling...");
      targetBuffer = await resampleTo16kHz(audioBuffer);
      analyzeAudio(targetBuffer);
    }

    console.log("Codificando a WAV...");
    const wavBlob = encodeWav(targetBuffer, targetBuffer.sampleRate);

    console.log("WAV generado - Tamaño:", wavBlob.size, "bytes");
    console.log("=====================================\n");

    updateState({ lastWavBlob: wavBlob });

    return wavBlob;
  } catch (error) {
    console.error("Error al convertir a WAV:", error);
    showStatus(`Error en conversión: ${error.message}`, "error");
    return audioBlob;
  }
}

/**
 * Play audio from audio player
 */
export function playAudio() {
  try {
    const audioPlayer = getAudioPlayer();
    if (!audioPlayer.src) {
      showStatus("No hay audio disponible", "error");
      return;
    }

    audioPlayer.play().catch((error) => {
      console.error("Error reproduciendo audio:", error);
      showStatus(`Error al reproducir: ${error.message}`, "error");
    });

    showStatus("Reproduciendo audio", "info");
  } catch (error) {
    console.error("Error en playAudio:", error);
    showStatus(`Error: ${error.message}`, "error");
  }
}

/**
 * Download WAV file
 */
export function downloadWav() {
  if (!appState.lastWavBlob) {
    showStatus("Error: No hay audio WAV para descargar", "error");
    return;
  }

  const url = URL.createObjectURL(appState.lastWavBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audio_${Date.now()}.wav`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showStatus("Archivo WAV descargado", "success");
  console.log(
    "WAV descargado:",
    link.download,
    "Tamaño:",
    appState.lastWavBlob.size
  );
}
