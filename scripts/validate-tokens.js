const fs = require('fs');
const path = require('path');

const tokensFile = path.resolve(__dirname, '../themes/gold-elite.tokens.json');

let raw;
try {
  raw = fs.readFileSync(tokensFile, 'utf-8');
} catch (err) {
  console.error(`FAIL: Could not read tokens file at ${tokensFile}`);
  process.exit(1);
}

let tokens;
try {
  tokens = JSON.parse(raw);
} catch (err) {
  console.error('FAIL: tokens file is not valid JSON');
  process.exit(1);
}

const hexRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;
const errors = [];
const seenKeys = new Set();

for (const [key, entry] of Object.entries(tokens)) {
  if (key.startsWith('_')) continue;

  if (seenKeys.has(key)) {
    errors.push(`Duplicate key: "${key}"`);
  }
  seenKeys.add(key);

  if (!entry || typeof entry !== 'object') {
    errors.push(`Key "${key}" is not a valid token object`);
    continue;
  }

  if (!entry.value || typeof entry.value !== 'string') {
    errors.push(`Key "${key}" is missing or has an invalid "value" field`);
    continue;
  }

  if (!hexRegex.test(entry.value)) {
    errors.push(`Key "${key}" has invalid hex value: "${entry.value}" (must match /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)`);
  }
}

if (errors.length > 0) {
  console.error('FAIL: Token validation errors found:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}

const tokenCount = Object.keys(tokens).filter(k => !k.startsWith('_')).length;
console.log(`All ${tokenCount} tokens valid.`);
process.exit(0);
