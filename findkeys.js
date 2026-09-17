const fs = require('fs');
const lines = fs.readFileSync('components/ResultsTable.tsx', 'utf8').split('\n');
lines.forEach((l, i) => { if(l.includes('key=')) console.log(i + ': ' + l); });
