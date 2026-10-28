// What it does: Web Audio synthesiser for scan beam hum, skill blips, and requirement ticks.
// Uses: config.js, js/events.js, js/store.js.
// Used by: js/main.js, screens/scan.js.

import { CONFIG } from "../../config.js";
import { on, emit } from "../events.js";
import { getMuted, setMuted } from "../store.js";

let audioCtx = null;
let beamOsc = null;
let beamGain = null;
let jobBlipCount = 0;
let softBlipCount = 0;
let lastBlipTime = 0;

function getAudioContext() {
  if (CONFIG.features && CONFIG.features.sound === false) return null;
  if (getMuted()) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function startBeamHum(durationSec = 2.0) {
  const ctx = getAudioContext();
  if (!ctx) return;
  stopBeamHum();

  try {
    beamOsc = ctx.createOscillator();
    beamGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    beamOsc.type = "sine";
    beamOsc.frequency.setValueAtTime(110, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + durationSec * 0.5);
    filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + durationSec);

    beamGain.gain.setValueAtTime(0, ctx.currentTime);
    beamGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.12);
    beamGain.gain.setValueAtTime(0.05, ctx.currentTime + Math.max(0.12, durationSec - 0.12));
    beamGain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);

    beamOsc.connect(filter);
    filter.connect(beamGain);
    beamGain.connect(ctx.destination);

    beamOsc.start();
    beamOsc.stop(ctx.currentTime + durationSec);
  } catch (err) {
    // Ignore audio errors
  }
}

export function stopBeamHum() {
  if (beamOsc) {
    try {
      beamOsc.stop();
      beamOsc.disconnect();
    } catch (e) {}
    beamOsc = null;
  }
  if (beamGain) {
    try {
      beamGain.disconnect();
    } catch (e) {}
    beamGain = null;
  }
}

export function playJobBlip() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = performance.now();
  if (now - lastBlipTime < 50) return;
  lastBlipTime = now;

  try {
    const semitones = (jobBlipCount % 8) * 2;
    jobBlipCount++;
    const baseFreq = 880 * Math.pow(2, semitones / 12);
    const endFreq = 1320 * Math.pow(2, semitones / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {}
}

export function playSoftBlip() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = performance.now();
  if (now - lastBlipTime < 50) return;
  lastBlipTime = now;

  try {
    const semitones = (softBlipCount % 8) * 2;
    softBlipCount++;
    const baseFreq = 440 * Math.pow(2, semitones / 12);
    const endFreq = 660 * Math.pow(2, semitones / 12);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (e) {}
}

export function playReqTick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(660, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

export function initSoundListener() {
  on("sound:toggle", ({ muted }) => {
    if (muted) {
      stopBeamHum();
    }
  });

  on("xray:start", (data) => {
    jobBlipCount = 0;
    softBlipCount = 0;
  });

  on("xray:done", () => {
    stopBeamHum();
  });

  on("xray:few", () => {
    stopBeamHum();
  });
}
