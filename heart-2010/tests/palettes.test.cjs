const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const members = JSON.parse(fs.readFileSync(path.join(__dirname, '../members.json')));
function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return channels.reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
}
function contrast(a, b) {
  const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (light + .05) / (dark + .05);
}
const pairs = [['#392827', '#fffaf3'], ['#654735', '#fffaf3'], ['#322020', '#edb69e']];
for (const member of members) {
  assert.equal(member.palette.length, 2, member.name);
  for (const color of member.palette) {
    assert.match(color, /^#[a-f0-9]{6}$/i);
    for (const text of ['#594238', '#392827', '#654735']) pairs.push([text, color]);
  }
}
const minimum = Math.min(...pairs.map(([text, background]) => contrast(text, background)));
assert.ok(minimum >= 4.5, `Text contrast ${minimum}:1 falls below 4.5:1`);
console.log(`PASS: ${members.length} portrait palettes; minimum text contrast ${minimum.toFixed(2)}:1.`);
