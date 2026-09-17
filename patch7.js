const fs = require('fs');
let c = fs.readFileSync('lib/monitoring/opportunity-monitor.ts', 'utf8');

c = c.replace(/query: "software",\s+country: "worldwide"/g, 'mode: "online",\n          query: "software",\n          country: "worldwide"');

fs.writeFileSync('lib/monitoring/opportunity-monitor.ts', c);
