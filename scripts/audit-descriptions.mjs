// scripts/audit-descriptions.mjs
// Finds blog posts whose description exceeds the SERP-friendly 160-char limit.
// Run: node scripts/audit-descriptions.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = './src/content/blog';
const SERP_LIMIT = 160;
const HARD_LIMIT = 300;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith('.md') || full.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const files = walk(BLOG_DIR);
const rows = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const match = src.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) continue;
  const fm = match[1];
  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (!descMatch) continue;
  const desc = descMatch[1].replace(/^["']|["']$/g, '').trim();
  const len = desc.length;
  if (len > SERP_LIMIT) {
    rows.push({ file: file.replace(BLOG_DIR + '/', ''), len, hard: len > HARD_LIMIT });
  }
}

rows.sort((a, b) => b.len - a.len);

if (rows.length === 0) {
  console.log(`✅ All descriptions are ≤ ${SERP_LIMIT} chars.`);
  process.exit(0);
}

console.log(`\n${rows.length} description(s) over ${SERP_LIMIT} chars:\n`);
for (const r of rows) {
  const flag = r.hard ? '❌ BUILD-BREAKING' : '⚠️  SERP-TRUNCATED';
  console.log(`${flag}  ${String(r.len).padStart(3)} chars  ${r.file}`);
}
console.log(`\nHard limit (build-breaking): ${HARD_LIMIT} chars`);
console.log(`SERP truncation limit: ${SERP_LIMIT} chars\n`);