# Frontend Modules Architecture

## Overview

The frontend has been refactored into a modular architecture to improve maintainability, testability, and scalability. Each module handles a specific domain of functionality.

## Module Structure

```
frontend/src/
├── main.js                 # Application entry point
├── style.css              # Global styles
└── modules/
    ├── state.js           # State management & constants
    ├── ui.js              # UI rendering & DOM handling
    ├── audio.js           # Audio processing functions
    ├── recording.js       # Recording & playback logic
    └── api.js             # Backend communication
```

## Module Documentation

### 1. **state.js** - State Management & Constants

Manages centralized application state and constants.

**Exports:**
- `API_URL` - Backend API base URL
- `MAX_RECORDING_DURATION` - Maximum recording time (30 seconds)
- `MAX_FILE_SIZE` - Maximum audio file size (50MB)
- `appState` - Reactive state object
- `domElements` - Cached DOM element references
- `cacheElements()` - Cache DOM elements
- `updateState(updates)` - Update application state
- `resetState()` - Reset state to initial values

**State Properties:**
```javascript
{
  isRecording: boolean,
  mediaRecorder: MediaRecorder | null,
  audioChunks: Blob[],
  originalText: string,
  translatedText: string,
  targetLanguage: string,
  recordingTime: number,
  recordingInterval: number | null,
  audioContext: AudioContext | null,
  lastWavBlob: Blob | null
}
```

### 2. **ui.js** - UI Rendering & DOM Handling

Handles all UI rendering and DOM event listeners.

**Exports:**
- `renderUI()` - Render main application structure
- `setupEventListeners()` - Attach event handlers
- `updateRecordingStatus(text)` - Update status text
- `showStatus(message, type)` - Show status message
- `updateRecordingButton(isRecording)` - Update button state
- `updatePlayButton(enabled)` - Enable/disable play button
- `showDownloadButton(show)` - Show/hide download button
- `setOriginalText(text)` - Update recognized text
- `setTranslatedText(text)` - Update translated text
- `setAudioSource(src)` - Set audio player source
- `getAudioPlayer()` - Get audio player element

**Features:**
- Responsive UI structure
- Status message display with styling
- Button state management
- Text area synchronization

### 3. **audio.js** - Audio Processing Functions

Handles audio analysis, encoding, and resampling.

**Exports:**
- `analyzeAudioBuffer(audioBuffer)` - Analyze audio metrics
- `logAudioInfo(label, audioBuffer)` - Log audio info to console
- `analyzeAudio(audioBuffer)` - Analyze and log audio
- `resampleTo16kHz(audioBuffer)` - Resample audio to 16kHz
- `encodeWav(audioBuffer, sampleRate)` - Encode to WAV format

**Audio Analysis Returns:**
```javascript
{
  rms: string,           // RMS amplitude percentage
  peak: string,          // Peak amplitude percentage
  duration: string,      // Duration in seconds
  channels: number,      // Number of channels
  sampleRate: number,    // Sample rate in Hz
  length: number         // Number of samples
}
```

### 4. **recording.js** - Recording & Playback Logic

Handles audio recording, conversion, and playback.

**Exports:**
- `toggleRecording()` - Start/stop recording
- `startRecording()` - Begin audio capture
- `stopRecording()` - End audio capture
- `convertBlobToWav(audioBlob, mimeType)` - Convert to WAV
- `playAudio()` - Play audio
- `downloadWav()` - Download WAV file

**Features:**
- Microphone access via getUserMedia
- Audio format detection
- Automatic WAV conversion
- Recording duration tracking
- Error handling with user feedback

### 5. **api.js** - Backend Communication

Handles all communication with the backend API.

**Exports:**
- `sendAudioToBackend(audioBlob)` - Send audio for speech-to-text
- `translateText()` - Translate recognized text
- `generateAudio()` - Generate text-to-speech audio

**API Endpoints:**
- `POST /api/speech` - Speech recognition
- `POST /api/translate` - Text translation
- `POST /api/text-to-speech` - Text-to-speech generation

**Error Handling:**
- Request timeout (30 seconds)
- Automatic abort on timeout
- User-friendly error messages

## Data Flow

```
User clicks record
    ↓
startRecording() [recording.js]
    ↓
Microphone access → Audio capture
    ↓
stopRecording() [recording.js]
    ↓
convertBlobToWav() [recording.js]
    ↓
sendAudioToBackend() [api.js]
    ↓
Backend returns recognized text
    ↓
translateText() [api.js]
    ↓
Backend returns translation
    ↓
generateAudio() [api.js]
    ↓
Backend returns audio blob
    ↓
setAudioSource() [ui.js]
    ↓
User can play audio
```

## Module Dependencies

```
main.js
  ├── ui.js
  │   ├── state.js
  │   ├── recording.js
  │   │   ├── state.js
  │   │   ├── ui.js
  │   │   ├── api.js
  │   │   └── audio.js
  │   └── api.js
  │       ├── state.js
  │       ├── ui.js
  │       └── audio.js
  └── state.js

audio.js
  └── state.js

recording.js
  ├── state.js
  ├── ui.js
  ├── api.js
  └── audio.js

api.js
  ├── state.js
  ├── ui.js
  └── audio.js

ui.js
  ├── state.js
  ├── recording.js
  └── api.js
```

## Benefits

✅ **Separation of Concerns** - Each module has a single responsibility
✅ **Maintainability** - Easy to locate and update functionality
✅ **Testability** - Each module can be tested independently
✅ **Reusability** - Modules can be imported and used elsewhere
✅ **Scalability** - New features can be added with minimal impact
✅ **Code Organization** - Clear structure and naming conventions

## Import Examples

```javascript
// Import from multiple modules
import { appState, updateState } from './state.js';
import { showStatus, setOriginalText } from './ui.js';
import { analyzeAudio, encodeWav } from './audio.js';
import { playAudio, downloadWav } from './recording.js';
import { translateText, generateAudio } from './api.js';

// Use in your code
updateState({ targetLanguage: 'es' });
showStatus('Processing...', 'info');
await translateText();
playAudio();
```

## Adding New Features

1. **Determine the module** - Which domain does it belong to?
2. **Create the function** - Add the functionality to the appropriate module
3. **Export it** - Add to module exports
4. **Import where needed** - Use in other modules
5. **Test** - Verify it works with existing functionality

## Performance Considerations

- **Lazy Loading** - Modules are only loaded when needed
- **Tree Shaking** - Unused functions can be removed in builds
- **Caching** - DOM elements are cached to avoid repeated queries
- **Event Delegation** - Event listeners are attached once
- **Memory Management** - State is properly cleaned up on reset

## Future Improvements

- [ ] Add TypeScript for type safety
- [ ] Implement proper event bus for inter-module communication
- [ ] Add unit tests for each module
- [ ] Create storage module for persistence
- [ ] Add error handling module
- [ ] Implement logging module