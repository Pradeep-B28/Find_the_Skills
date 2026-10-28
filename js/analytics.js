// What it does: GA4 and Meta Pixel event listeners and pure payload builder. No DOM.
// Uses: config.js, content/requirements.js, js/links.js.
// Used by: events.js, selftest.js, and main.js.

import { CONFIG } from "../config.js";
import { REQ_TYPES } from "../content/requirements.js";
import { missingIdsPayload } from "./links.js";

function getCharsBand(chars) {
  const c = Number(chars) || 0;
  if (c < 1000) return "under_1k";
  if (c < 3000) return "1k_3k";
  if (c <= 6000) return "3k_6k";
  return "over_6k";
}

function formatReqTypes(reqs) {
  if (!reqs) return "";
  let typesFound = new Set();
  if (Array.isArray(reqs)) {
    for (const r of reqs) {
      if (typeof r === "string") {
        const colon = r.indexOf(":");
        if (colon !== -1) typesFound.add(r.slice(0, colon));
        else typesFound.add(r);
      } else if (r && r.type) {
        typesFound.add(r.type);
      }
    }
  } else if (typeof reqs === "string") {
    reqs.split(",").forEach(s => typesFound.add(s.trim()));
  }

  const ordered = [];
  for (const rt of REQ_TYPES) {
    if (typesFound.has(rt.id)) {
      ordered.push(rt.id);
    }
  }
  return ordered.join(",");
}

export function payloadsFor(eventName, data = {}) {
  let ga4 = null;
  let meta = null;

  switch (eventName) {
    case "xray:start": {
      ga4 = {
        name: "xray_start",
        params: {
          source: data.source || "paste",
          chars_band: getCharsBand(data.chars)
        }
      };
      break;
    }

    case "xray:done": {
      const roleStr = data.roleId || data.role || "none";
      const kindStr = data.kind || "tech";
      const reqTypesStr = formatReqTypes(data.reqTypes || data.reqs);

      ga4 = {
        name: "xray_scan",
        params: {
          job_found: Number(data.jobCount ?? data.job_found ?? 0),
          soft_found: Number(data.softCount ?? data.soft_found ?? 0),
          req_types: reqTypesStr,
          role: roleStr,
          kind: kindStr
        }
      };
      meta = {
        type: "trackCustom",
        event: "XrayScan",
        params: {
          job_found: Number(data.jobCount ?? data.job_found ?? 0),
          kind: kindStr
        }
      };
      break;
    }

    case "xray:few": {
      ga4 = {
        name: "xray_few",
        params: {
          job_found: Number(data.jobCount ?? data.job_found ?? 0),
          soft_found: Number(data.softCount ?? data.soft_found ?? 0)
        }
      };
      break;
    }

    case "result:shown": {
      const kindStr = data.kind || "tech";
      const progStr = typeof data.program === "object" ? (data.program?.id || "none") : (data.program || "none");
      const roleStr = typeof data.role === "object" ? (data.role?.id || "none") : (data.roleId || data.role || "none");
      const missingStr = Array.isArray(data.missingIds) ? missingIdsPayload(data.missingIds) : (data.missing_ids || "");

      ga4 = {
        name: "match_result",
        params: {
          kind: kindStr,
          main_kind: data.mainKind || data.main_kind || "job",
          total: Number(data.total ?? 0),
          have: Number(data.have ?? 0),
          pct: Number(data.pct ?? 0),
          soft_total: Number(data.softTotal ?? data.soft_total ?? 0),
          soft_have: Number(data.softHave ?? data.soft_have ?? 0),
          program: progStr,
          covered: Number(data.covered ?? 0),
          missing_ids: missingStr,
          role: roleStr,
          source: data.source || "post"
        }
      };
      meta = {
        type: "trackCustom",
        event: "MatchResult",
        params: {
          program: progStr,
          pct: Number(data.pct ?? 0),
          kind: kindStr
        }
      };
      break;
    }

    case "cta:sales": {
      const kindStr = data.kind || "tech";
      const progStr = typeof data.program === "object" ? (data.program?.id || "none") : (data.programId || data.program || "none");

      ga4 = {
        name: "whatsapp_sales_click",
        params: {
          kind: kindStr,
          program: progStr,
          have: Number(data.have ?? 0),
          total: Number(data.total ?? 0)
        }
      };
      meta = {
        type: "track",
        event: "Lead",
        params: {}
      };
      break;
    }

    case "cta:program": {
      const progStr = typeof data.program === "object" ? (data.program?.id || "none") : (data.programId || data.program || "none");
      ga4 = {
        name: "program_click",
        params: {
          program: progStr,
          spot: data.spot || "result"
        }
      };
      break;
    }

    case "cta:website": {
      ga4 = {
        name: "website_click",
        params: {
          spot: data.spot || "home"
        }
      };
      break;
    }

    case "cta:session": {
      ga4 = {
        name: "session_click",
        params: {}
      };
      break;
    }

    case "share:image": {
      ga4 = {
        name: "share_image",
        params: {
          size: data.size || "status"
        }
      };
      break;
    }

    case "share:whatsapp": {
      ga4 = {
        name: "share_whatsapp",
        params: {}
      };
      break;
    }

    case "share:copy": {
      ga4 = {
        name: "copy_link",
        params: {}
      };
      break;
    }

    case "link:open": {
      ga4 = {
        name: "compare_link_open",
        params: {
          count: Number(data.count ?? 0),
          has_m: Boolean(data.hasM ?? data.has_m ?? false)
        }
      };
      break;
    }

    default:
      break;
  }

  const result = { ga4, meta };
  if (ga4) {
    result.name = ga4.name;
    result.params = ga4.params;
    result.missing_ids = ga4.params.missing_ids;
    result.req_types = ga4.params.req_types;
    result.kind = ga4.params.kind;
    result.program = ga4.params.program;
  }
  return result;
}

export function initAnalytics() {
  // Script loading deferred to Phase 5 per Section 11
}
