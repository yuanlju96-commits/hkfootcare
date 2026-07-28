const fs = require('fs');
const html = fs.readFileSync('C:/Users/yuanl/.openclaw/workspace/hkfootcare/index.html', 'utf-8');

// Check placeholders
const phMatches = html.match(/placeholder="[^"]+"/g) || [];
console.log('Placeholders:');
phMatches.forEach(p => console.log('  ' + p));

// Check option text
const optMatches = html.match(/<option[^>]*>[^<]+<\/option>/g) || [];
console.log('Options:');
optMatches.forEach(o => console.log('  ' + o));
