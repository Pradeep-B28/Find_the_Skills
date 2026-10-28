// What it does: manages screen lifecycle and transitions, showing one screen at a time.
// Uses: js/screens/home.js, js/screens/scan.js, js/screens/check.js, js/screens/result.js.
// Used by: js/main.js.

import * as homeScreen from "./screens/home.js";
import * as scanScreen from "./screens/scan.js";
import * as checkScreen from "./screens/check.js";
import * as resultScreen from "./screens/result.js";

const screens = {
  home: homeScreen,
  scan: scanScreen,
  check: checkScreen,
  result: resultScreen
};

let rootElement = null;
let currentScreenName = null;

export function init(rootEl) {
  rootElement = rootEl;
}

export function navigate(screenName, params = {}) {
  if (!rootElement) return;
  const nextScreen = screens[screenName];
  if (!nextScreen) {
    console.error(`Unknown screen: ${screenName}`);
    return;
  }

  if (currentScreenName && screens[currentScreenName]) {
    try {
      screens[currentScreenName].leave();
    } catch (e) {
      console.error(`Error leaving screen ${currentScreenName}:`, e);
    }
  }

  currentScreenName = screenName;

  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }

  window.scrollTo(0, 0);

  nextScreen.mount(rootElement);
  nextScreen.enter(params);
}

export function current() {
  return currentScreenName;
}
