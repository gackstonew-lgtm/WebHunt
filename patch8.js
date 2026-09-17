const fs = require('fs');
let c = fs.readFileSync('lib/monitoring/opportunity-monitor.ts', 'utf8');

c = c.replace('query: "", // Broad query', 'mode: "online",\n          query: "", // Broad query');

fs.writeFileSync('lib/monitoring/opportunity-monitor.ts', c);
