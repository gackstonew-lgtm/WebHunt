const fs = require('fs');
['components/ResultsTable.tsx', 'components/LeadPipeline.tsx'].forEach(file => {
  const c = fs.readFileSync(file, 'utf8').split('\n');
  c.forEach((l, i) => { if (l.includes('setProposalJob')) console.log(`${file}:${i+1}: ${l}`); });
});
