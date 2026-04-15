// State module - Centralized application state and constants
export const API_URL = "http://localhost:3000/api";
export const MAX_RECORDING_DURATION = 30000; // 30 seconds
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const appState = {
  isRecording: false,
  mediaRecorder: null,
  audioChunks: [],
  originalText: "",
  translatedText: "",
  targetLanguage: "en",
  recordingTime: 0,
  recordingInterval: null,
  audioContext: null,
  lastWavBlob: null,
};

// DOM Elements cache
export const domElements = {
  recordBtn: null,
  playBtn: null,
  targetLang: null,
  originalText: null,
  translatedText: null,
  recordingStatus: null,
  generalStatus: null,
  audioPlayer: null,
  downloadBtn: null,
};

/**
 * Update application state
 * @param {Partial<typeof appState>} updates - State updates
 */
export function updateState(updates) {
  Object.assign(appState, updates);
}

/**
 * Cache DOM elements
 */
export function cacheElements() {
  domElements.recordBtn = document.getElementById("recordBtn");
  domElements.playBtn = document.getElementById("playBtn");
  domElements.targetLang = document.getElementById("targetLang");
  domElements.originalText = document.getElementById("originalText");
  domElements.translatedText = document.getElementById("translatedText");
  domElements.recordingStatus = document.getElementById("recordingStatus");
  domElements.generalStatus = document.getElementById("generalStatus");
  domElements.audioPlayer = document.getElementById("audioPlayer");
  domElements.downloadBtn = document.getElementById("downloadBtn");
}

/**
 * Reset application state
 */
export function resetState() {
  updateState({
    isRecording: false,
    mediaRecorder: null,
    audioChunks: [],
    originalText: "",
    translatedText: "",
    recordingTime: 0,
    recordingInterval: null,
    lastWavBlob: null,
  });
}
