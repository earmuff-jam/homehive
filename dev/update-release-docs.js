import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the event payload
const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"),
);

const inputs = event.inputs || {};
const releaseDocsOutboundFile = path.join(__dirname, "../public/release-docs.json");

const version = (inputs.version || "").replace(/^v/, "");
const date = inputs.date || "";
const body = inputs.body || "";

// --- Smart splitting ---
const PR_SPLIT_REGEX = /\[(feature|bugfix|maintenance)\]/gi;

const matches = [...body.matchAll(PR_SPLIT_REGEX)];
const splitPoints = matches.map((m) => m.index).filter((i) => i !== undefined);

// Cut the body using the found points
const lines = splitPoints.map((start, idx) => {
  const end = splitPoints[idx + 1] ?? body.length;
  return body.slice(start, end).trim();
});

const notes = lines
  .map((line) => {
    const match = line.match(/^\[(.*?)\]\s*-\s*(.*)$/);
    if (!match) return null;
    const [, type, value] = match;
    return {
      type: type.toLowerCase(),
      value: value.trim(),
      caption: value.trim(),
    };
  })
  .filter(Boolean);

const newEntry = {
  version,
  date,
  notes,
};

let existing = [];
if (fs.existsSync(releaseDocsOutboundFile)) {
  existing = JSON.parse(fs.readFileSync(releaseDocsOutboundFile, "utf8"));
}

const updated = [newEntry, ...existing];
fs.writeFileSync(releaseDocsOutboundFile, JSON.stringify(updated, null, 2));
