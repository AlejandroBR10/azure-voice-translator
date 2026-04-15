import "./style.css";

import { renderUI, setupEventListeners } from "./modules/ui.js";
import { cacheElements } from "./modules/state.js";

/**
 * Initialize the application
 * Renders UI, caches DOM elements, and sets up event listeners
 */
function initializeApp() {
  renderUI();
  cacheElements();
  setupEventListeners();
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
