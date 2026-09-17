const fs = require('fs');
const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
const leadMatch = schema.match(/model Lead \{[\s\S]*?\}/);
console.log(leadMatch[0]);
