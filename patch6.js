const fs = require('fs');
let c = fs.readFileSync('lib/monitoring/opportunity-monitor.ts', 'utf8');

c = c.replace(/location:\s*"remote"/g, 'country: "worldwide"');

fs.writeFileSync('lib/monitoring/opportunity-monitor.ts', c);
