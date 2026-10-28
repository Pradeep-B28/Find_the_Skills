// What it does: tiny event bus for decoupling UI, audio, and analytics.
// Uses: none.
// Used by: all screens, components, analytics, sound, and selftest.

const listeners = new Map();

export function on(eventName, handler) {
  if (typeof handler !== "function") return () => {};
  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set());
  }
  listeners.get(eventName).add(handler);
  return () => off(eventName, handler);
}

export function off(eventName, handler) {
  const handlers = listeners.get(eventName);
  if (handlers) {
    handlers.delete(handler);
    if (handlers.size === 0) {
      listeners.delete(eventName);
    }
  }
}

export function emit(eventName, data) {
  const handlers = listeners.get(eventName);
  if (handlers) {
    for (const handler of Array.from(handlers)) {
      try {
        handler(data);
      } catch (err) {
        // Suppress listener errors to prevent breaking caller
      }
    }
  }
}

export function resetEvents() {
  listeners.clear();
}
