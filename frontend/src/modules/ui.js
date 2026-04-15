// UI module - Rendering and DOM event handling
import { domElements, appState, updateState } from './state.js';
import { toggleRecording, playAudio, downloadWav } from './recording.js';
import { translateText } from './api.js';

/**
 * Render the main UI structure
 */
export function renderUI() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="app">
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-text">Voice Translator</span>
          </div>
        </div>
      </header>

      <main class="main">
        <div class="translator-container">
          <div class="column input-column">
            <div class="language-selector">
              <span class="language-label">From</span>
              <div class="language-badge">Spanish</div>
            </div>

            <div class="input-area">
              <div class="voice-input">
                <button id="recordBtn" class="record-button" data-recording="false">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 16.91c-1.48 1.45-3.76 2.36-6 2.36s-4.51-.91-6-2.36l-1.1 1.1c1.86 1.86 4.41 2.86 7.1 2.86s5.24-1 7.1-2.86l-1.1-1.1z"/>
                  </svg>
                </button>
                <div id="recordingStatus" class="recording-status">Click to record</div>
              </div>

              <textarea
                id="originalText"
                class="text-input"
                readonly
                placeholder="Speak something..."
              ></textarea>

              <div class="input-actions">
                <button id="downloadBtn" class="action-button" style="display: none;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Download WAV
                </button>
              </div>
            </div>
          </div>

          <div class="column output-column">
            <div class="language-selector">
              <span class="language-label">To</span>
              <select id="targetLang" class="language-select">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            <div class="output-area">
              <textarea
                id="translatedText"
                class="text-output"
                readonly
                placeholder="Translation will appear here..."
              ></textarea>

              <div class="output-actions">
                <button id="playBtn" class="action-button play-button" disabled>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
                <audio id="audioPlayer" style="display: none;"></audio>
              </div>
            </div>
          </div>
        </div>

        <div id="generalStatus" class="status-container"></div>
      </main>

      <footer class="footer">
        <p>Powered by Azure Speech and Translator Services</p>
      </footer>
    </div>
  `;
}

/**
 * Setup event listeners for all interactive elements
 */
export function setupEventListeners() {
  if (domElements.recordBtn) {
    domElements.recordBtn.addEventListener("click", toggleRecording);
  }

  if (domElements.playBtn) {
    domElements.playBtn.addEventListener("click", playAudio);
  }

  if (domElements.downloadBtn) {
    domElements.downloadBtn.addEventListener("click", downloadWav);
  }

  if (domElements.targetLang) {
    domElements.targetLang.addEventListener("change", async (e) => {
      updateState({ targetLanguage: e.target.value });
      console.log("Idioma seleccionado:", e.target.value);

      if (appState.originalText) {
        console.log("Retraducciendo con nuevo idioma...");
        showStatus("Retraducciendo...", "info");
        await translateText();
      }
    });
  }
}

/**
 * Update recording status text
 * @param {string} text - Status text to display
 */
export function updateRecordingStatus(text) {
  if (domElements.recordingStatus) {
    domElements.recordingStatus.textContent = text;
  }
}

/**
 * Show status message with type styling
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'info', 'success', 'error'
 */
export function showStatus(message, type = "info") {
  if (domElements.generalStatus) {
    domElements.generalStatus.innerHTML = `<div class="status ${type}">${message}</div>`;
  }
}

/**
 * Update recording button state
 * @param {boolean} isRecording - Recording state
 */
export function updateRecordingButton(isRecording) {
  if (domElements.recordBtn) {
    domElements.recordBtn.dataset.recording = isRecording ? "true" : "false";
    if (isRecording) {
      domElements.recordBtn.classList.add("recording");
    } else {
      domElements.recordBtn.classList.remove("recording");
    }
  }
}

/**
 * Update play button state
 * @param {boolean} enabled - Enable/disable state
 */
export function updatePlayButton(enabled) {
  if (domElements.playBtn) {
    domElements.playBtn.disabled = !enabled;
  }
}

/**
 * Show/hide download button
 * @param {boolean} show - Show/hide state
 */
export function showDownloadButton(show) {
  if (domElements.downloadBtn) {
    domElements.downloadBtn.style.display = show ? "inline-flex" : "none";
  }
}

/**
 * Update original text area
 * @param {string} text - Text to display
 */
export function setOriginalText(text) {
  if (domElements.originalText) {
    domElements.originalText.value = text;
  }
}

/**
 * Update translated text area
 * @param {string} text - Text to display
 */
export function setTranslatedText(text) {
  if (domElements.translatedText) {
    domElements.translatedText.value = text;
  }
}

/**
 * Set audio player source
 * @param {string} src - Audio source URL
 */
export function setAudioSource(src) {
  if (domElements.audioPlayer) {
    domElements.audioPlayer.src = src;
  }
}

/**
 * Get audio player element
 * @returns {HTMLAudioElement} Audio player element
 */
export function getAudioPlayer() {
  return domElements.audioPlayer;
}
