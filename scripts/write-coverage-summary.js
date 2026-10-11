#!/usr/bin/env node
/**
 * Writes coverage.md from Playwright JSON reporter output for Aiden Evidence Bar.
 */
const fs = require("fs");
const path = require("path");

const resultsPath = path.join(__dirname, "..", "test-results", "results.json");
const outPath = path.join(__dirname, "..", "coverage.md");

if (!fs.existsSync(resultsPath)) {
  fs.writeFileSync(
    outPath,
    "# Test coverage\n\nNo results.json — run `npm test` first.\n"
  );
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const specs = [];

function walk(suite) {
  for (const s of suite.suites || []) walk(s);
  for (const spec of suite.specs || []) {
    const ok = (spec.tests || []).every((t) =>
      (t.results || []).some((r) => r.status === "passed" || r.status === "expected")
    );
    const failed = (spec.tests || []).some((t) =>
      (t.results || []).some((r) => r.status === "failed" || r.status === "timedOut")
    );
    specs.push({
      title: spec.title,
      pass: ok && !failed,
    });
  }
}

for (const s of data.suites || []) walk(s);

const passed = specs.filter((s) => s.pass).length;
const total = specs.length || 5;
const lines = [
  "# Test coverage",
  "",
  `- Suite: otel-astronomy-preview-e2e`,
  `- Result: **${passed}/${total} passed**`,
  "",
];
specs.forEach((s, i) => {
  lines.push(`${i + 1}. ${s.pass ? "PASS" : "FAIL"} — ${s.title}`);
});
lines.push("");
fs.writeFileSync(outPath, lines.join("\n"));
console.log(lines.join("\n"));
