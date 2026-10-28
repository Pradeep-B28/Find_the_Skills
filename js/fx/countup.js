// What it does: animates a number counting up smoothly from 0 to target.
// Uses: none.
// Used by: js/fx/ring.js, js/screens/result.js.

export function countUp(element, targetNum, durationMs = 900) {
  if (!element) return;
  const target = Math.round(targetNum);
  if (target <= 0) {
    element.textContent = "0";
    return;
  }

  // If reduced motion, jump immediately
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = String(target);
    return;
  }

  let startTime = null;

  function step(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(1.0, elapsed / durationMs);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = String(current);

    if (progress < 1.0) {
      requestAnimationFrame(step);
    } else {
      element.textContent = String(target);
    }
  }

  requestAnimationFrame(step);
}
