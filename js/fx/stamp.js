// What it does: renders and animates the tier stamp next to the match ring.
// Uses: none.
// Used by: js/screens/result.js.

export function renderStamp(container, tierText) {
  const stamp = document.createElement("div");
  stamp.className = "tier-stamp";
  stamp.textContent = tierText;

  // Scale down from 1.4 to 1 rotated -6deg over 220ms
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    stamp.style.transform = "rotate(-6deg) scale(1)";
  } else {
    stamp.style.transform = "rotate(-6deg) scale(1.4)";
    requestAnimationFrame(() => {
      stamp.style.transition = "transform 220ms cubic-bezier(0, 0, 0.2, 1)";
      stamp.style.transform = "rotate(-6deg) scale(1)";
    });
  }

  container.appendChild(stamp);
  return stamp;
}
