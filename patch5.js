const fs = require('fs');
let c = fs.readFileSync('app/actions/outreach.ts', 'utf8');

c = c.replace(/lead\.aiTaskCategory \? \[lead\.aiTaskCategory\] : \[\]/g, 'lead.category ? [lead.category] : []');
c = c.replace(/lead\.city && lead\.country \? `\$\{lead\.city\}, \$\{lead\.country\}`/g, 'lead.city ? `${lead.city}`');
c = c.replace(/category: lead\.aiTaskCategory/g, 'category: lead.category');
c = c.replace(/country: lead\.country \|\| ""/g, 'country: ""');

fs.writeFileSync('app/actions/outreach.ts', c);
