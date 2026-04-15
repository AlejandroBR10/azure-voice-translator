// Audio module - Audio processing and encoding functions
import { appState } from './state.js';

/**
 * Analyze audio buffer and return audio metrics
 * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
 * @returns {Object} Audio analysis metrics
 */
export function analyzeAudioBuffer(audioBuffer) {
  const data = audioBuffer.getChannelData(0);
  let sum = 0;
  let max = 0;
  let min = 0;

  for (let i = 0; i < data.length; i++) {
    const sample = data[i];
    sum += sample * sample;
    if (sample > max) max = sample;
    if (sample < min) min = sample;
  }

  const rms = Math.sqrt(sum / data.length);
  const peak = Math.max(Math.abs(max), Math.abs(min));
  const duration = audioBuffer.duration;

  return {
    rms: (rms * 100).toFixed(2),
    peak: (peak * 100).toFixed(2),
    duration: duration.toFixed(2),
    channels: audioBuffer.numberOfChannels,
    sampleRate: audioBuffer.sampleRate,
    length: audioBuffer.length,
  };
}

/**
 * Log audio information to console
 * @param {string} label - Label for the log
 * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
 * @returns {Object} Audio analysis info
 */
export function logAudioInfo(label, audioBuffer) {
  const info = analyzeAudioBuffer(audioBuffer);
  console.log(`\n===== ${label} =====`);
  console.log("RMS (amplitud RMS):", info.rms, "%");
  console.log("Peak (pico máximo):", info.peak, "%");
  console.log("Duración:", info.duration, "segundos");
  console.log("Canales:", info.channels);
  console.log("Sample Rate:", info.sampleRate, "Hz");
  console.log("Muestras:", info.length);
  console.log("====================\n");

  return info;
}

/**
 * Analyze audio and log metrics
 * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
 * @returns {Object} Audio analysis with RMS, max, duration
 */
export function analyzeAudio(audioBuffer) {
  const channelData = audioBuffer.getChannelData(0);
  let sum = 0;
  let max = 0;

  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.abs(channelData[i]);
    sum += sample * sample;
    if (sample > max) max = sample;
  }

  const rms = Math.sqrt(sum / channelData.length);

  console.log("ANALISIS DE AUDIO:");
  console.log("  RMS (amplitud):", (rms * 100).toFixed(2), "%");
  console.log("  Peak (maximo):", (max * 100).toFixed(2), "%");
  console.log("  Duracion:", audioBuffer.duration.toFixed(2), "segundos");
  console.log("  Sample rate:", audioBuffer.sampleRate, "Hz");
  console.log("  Canales:", audioBuffer.numberOfChannels);

  if (rms < 0.05) {
    console.warn("ADVERTENCIA: Audio muy silencioso (RMS < 5%)");
  }

  return { rms, max, duration: audioBuffer.duration };
}

/**
 * Resample audio buffer to 16kHz
 * @param {AudioBuffer} audioBuffer - Audio buffer to resample
 * @returns {Promise<AudioBuffer>} Resampled audio buffer
 */
export async function resampleTo16kHz(audioBuffer) {
  const originalSampleRate = audioBuffer.sampleRate;

  if (originalSampleRate === 16000) {
    console.log("Sample rate ya es 16kHz");
    return audioBuffer;
  }

  console.log("Resampling de", originalSampleRate, "Hz a 16kHz");

  const ratio = 16000 / originalSampleRate;
  const newLength = Math.round(audioBuffer.length * ratio);

  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    16000
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  const resampledBuffer = await offlineContext.startRendering();
  console.log("Resampling completado. Nuevas muestras:", resampledBuffer.length);

  return resampledBuffer;
}

/**
 * Encode audio buffer to WAV format
 * @param {AudioBuffer} audioBuffer - Audio buffer to encode
 * @param {number} sampleRate - Sample rate for WAV
 * @returns {Blob} WAV audio blob
 */
export function encodeWav(audioBuffer, sampleRate) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const channelData = [];

  for (let i = 0; i < numberOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  const length = audioBuffer.length * numberOfChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const byteRate = sampleRate * numberOfChannels * 2;
  const blockAlign = numberOfChannels * 2;

  writeString(0, "RIFF");
  view.setUint32(4, 36 + length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, length, true);

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = channelData[channel][i];
      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
