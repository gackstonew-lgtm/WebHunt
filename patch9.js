const fs = require('fs');
let c = fs.readFileSync('components/ResultsTable.tsx', 'utf8');

c = c.replace(/key=\{lead\.id\}/g, 'key={`${lead.id}-${lead.sourceProvider || "prov"}-${i}`}');
c = c.replace(/key=\{job\.id\}/g, 'key={`${job.id}-${job.source || "prov"}-${i}`}');

fs.writeFileSync('components/ResultsTable.tsx', c);
