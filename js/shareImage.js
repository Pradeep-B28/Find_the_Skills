// What it does: draws the share image for phone status (1080x1920) and feed post (1080x1350) on canvas.
// Uses: config.js, js/copy.js, js/score.js, content/skills.js, content/roles.js.
// Used by: js/share.js, js/cards/share.js.

import { CONFIG } from "../config.js";
import { COPY, t } from "./copy.js";
import { tier } from "./score.js";
import { SKILLS } from "../content/skills.js";
import { ROLES } from "../content/roles.js";

export function drawShareImage({
  mainScore,
  jobSkills = [],
  softSkills = [],
  tickedIds = [],
  roleId = null,
  size = "status" // "status" (1080x1920) or "post" (1080x1350)
}) {
  const width = 1080;
  const height = size === "status" ? 1920 : 1350;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // 1. Background gradient (--bg-grad)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#ECFDF5");
  bgGrad.addColorStop(0.45, "#FFFFFF");
  bgGrad.addColorStop(1.0, "#ECFEFF");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 6px Top Brand Gradient Bar
  const topGrad = ctx.createLinearGradient(0, 0, width, 0);
  topGrad.addColorStop(0, "#059669");
  topGrad.addColorStop(0.5, "#0D9488");
  topGrad.addColorStop(1.0, "#06B6D4");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 8);

  const startY = size === "status" ? 240 : 80;

  // 3. Header text & Logo
  ctx.fillStyle = "#059669";
  ctx.font = "bold 32px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("Wrench Wise", 80, startY);

  const roleObj = roleId ? ROLES.find(r => r.id === roleId) : null;
  const roleText = roleObj ? `${roleObj.name} job post` : COPY.share.imageAny;

  // Title: "Job Post X-Ray"
  ctx.font = "800 64px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#111827";
  ctx.fillText(COPY.home.title, 80, startY + 70);

  // Subtitle: Role name
  ctx.font = "600 36px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#059669";
  ctx.fillText(roleText, 80, startY + 125);

  // 4. Dark Film Card
  const filmX = 80;
  const filmY = startY + 180;
  const filmW = width - 160; // 920px
  const filmH = size === "status" ? 640 : 420;

  ctx.save();
  ctx.fillStyle = "#050B16";
  ctx.beginPath();
  ctx.roundRect(filmX, filmY, filmW, filmH, 24);
  ctx.fill();

  // Faint grid in film card
  ctx.strokeStyle = "rgba(34, 211, 238, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = filmX; x <= filmX + filmW; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, filmY);
    ctx.lineTo(x, filmY + filmH);
    ctx.stroke();
  }
  for (let y = filmY; y <= filmY + filmH; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(filmX, y);
    ctx.lineTo(filmX + filmW, y);
    ctx.stroke();
  }

  // Corner brackets
  ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
  ctx.lineWidth = 3;
  const cLen = 20;
  const pad = 16;
  // TL
  ctx.beginPath();
  ctx.moveTo(filmX + pad, filmY + pad + cLen);
  ctx.lineTo(filmX + pad, filmY + pad);
  ctx.lineTo(filmX + pad + cLen, filmY + pad);
  ctx.stroke();
  // TR
  ctx.beginPath();
  ctx.moveTo(filmX + filmW - pad - cLen, filmY + pad);
  ctx.lineTo(filmX + filmW - pad, filmY + pad);
  ctx.lineTo(filmX + filmW - pad, filmY + pad + cLen);
  ctx.stroke();
  // BL
  ctx.beginPath();
  ctx.moveTo(filmX + pad, filmY + filmH - pad - cLen);
  ctx.lineTo(filmX + pad, filmY + filmH - pad);
  ctx.lineTo(filmX + pad + cLen, filmY + filmH - pad);
  ctx.stroke();
  // BR
  ctx.beginPath();
  ctx.moveTo(filmX + filmW - pad - cLen, filmY + filmH - pad);
  ctx.lineTo(filmX + filmW - pad, filmY + filmH - pad);
  ctx.lineTo(filmX + filmW - pad, filmY + filmH - pad - cLen);
  ctx.stroke();

  // 5. Skill Chips inside Film Card
  const allSkillsList = [
    ...jobSkills.map(id => ({ id, kind: "job" })),
    ...softSkills.map(id => ({ id, kind: "soft" }))
  ];

  const maxDisplay = 12;
  const displayedSkills = allSkillsList.slice(0, maxDisplay);
  const remaining = allSkillsList.length - maxDisplay;

  let curX = filmX + 36;
  let curY = filmY + 48;
  const lineH = 68;

  ctx.font = "bold 26px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.textBaseline = "middle";

  for (const item of displayedSkills) {
    const sObj = SKILLS.find(s => s.id === item.id);
    const sName = sObj ? sObj.name : item.id;
    const isHave = tickedIds.includes(item.id);
    const label = isHave ? `✓  ${sName}` : sName;
    const textW = ctx.measureText(label).width;
    const chipW = textW + 36;

    if (curX + chipW > filmX + filmW - 36) {
      curX = filmX + 36;
      curY += lineH;
      if (curY + lineH > filmY + filmH - 30) {
        break;
      }
    }

    ctx.beginPath();
    ctx.roundRect(curX, curY, chipW, 46, 23);

    if (isHave) {
      if (item.kind === "job") {
        ctx.fillStyle = "rgba(34, 211, 238, 0.22)";
        ctx.strokeStyle = "#22D3EE";
      } else {
        ctx.fillStyle = "rgba(52, 211, 153, 0.22)";
        ctx.strokeStyle = "#34D399";
      }
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = item.kind === "job" ? "#ECFEFF" : "#ECFDF5";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#94A3B8";
    }

    ctx.textAlign = "center";
    ctx.fillText(label, curX + chipW / 2, curY + 23);
    curX += chipW + 16;
  }

  // +N more badge if there are more
  if (remaining > 0 && curY + lineH <= filmY + filmH) {
    const moreLabel = t("share.imageMore", { n: remaining });
    const moreW = ctx.measureText(moreLabel).width + 36;
    if (curX + moreW > filmX + filmW - 36) {
      curX = filmX + 36;
      curY += lineH;
    }
    if (curY + lineH <= filmY + filmH + 10) {
      ctx.beginPath();
      ctx.roundRect(curX, curY, moreW, 46, 23);
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#CBD5E1";
      ctx.textAlign = "center";
      ctx.fillText(moreLabel, curX + moreW / 2, curY + 23);
    }
  }

  ctx.restore();

  // 6. Huge Main Score (e.g. 7/19)
  const scoreY = filmY + filmH + (size === "status" ? 180 : 130);

  ctx.font = "800 130px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";

  // Score text
  const haveStr = String(mainScore.have);
  const totalStr = `/${mainScore.total}`;

  const haveW = ctx.measureText(haveStr).width;
  const totalW = ctx.measureText(totalStr).width;
  const fullScoreW = haveW + totalW;

  const scoreStartX = width / 2 - fullScoreW / 2;

  // Have number in brand gradient
  const numGrad = ctx.createLinearGradient(scoreStartX, scoreY - 80, scoreStartX + haveW, scoreY);
  numGrad.addColorStop(0, "#059669");
  numGrad.addColorStop(1, "#06B6D4");
  ctx.fillStyle = numGrad;
  ctx.textAlign = "left";
  ctx.fillText(haveStr, scoreStartX, scoreY);

  // Total in muted dark
  ctx.fillStyle = "#374151";
  ctx.fillText(totalStr, scoreStartX + haveW, scoreY);

  // Subtitle under score: "job skills matched"
  const kindLabel = mainScore.kind === "job" ? COPY.result.matchedJob : COPY.result.matchedSoft;
  ctx.font = "bold 34px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#4B5563";
  ctx.textAlign = "center";
  ctx.fillText(kindLabel, width / 2, scoreY + 65);

  // 7. Tier Badge Stamp
  const tierText = tier(mainScore.have, mainScore.total);
  const stampY = scoreY + 145;

  ctx.font = "800 32px ui-sans-serif, system-ui, -apple-system, sans-serif";
  const stampW = ctx.measureText(tierText.toUpperCase()).width + 48;
  const stampH = 54;

  ctx.save();
  ctx.translate(width / 2, stampY);
  ctx.rotate(-6 * Math.PI / 180);

  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-stampW / 2, -stampH / 2, stampW, stampH, 8);
  ctx.stroke();

  ctx.fillStyle = "#059669";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(tierText.toUpperCase(), 0, 0);
  ctx.restore();

  // 8. Footer: "How many do you have?" and website address
  const footerY = size === "status" ? height - 260 : height - 60;

  ctx.font = "700 34px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.fillText(COPY.share.imageAsk, width / 2, footerY);

  ctx.font = "600 24px ui-sans-serif, system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#059669";
  const siteDisplay = CONFIG.siteUrl ? CONFIG.siteUrl.replace(/^https?:\/\//, "") : "wrench-wise.com";
  ctx.fillText(siteDisplay, width / 2, footerY + 45);

  return canvas;
}

export function generateShareImageBlob(params) {
  return new Promise((resolve) => {
    const canvas = drawShareImage(params);
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}
