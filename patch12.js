const fs = require('fs');

function patchEmail(file, propName) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(new RegExp(`leadId: ${propName}\\.id,`, 'g'), 'leadId: activeLeadId,');
  fs.writeFileSync(file, c);
}

patchEmail('components/JobProposalModal.tsx', 'job');
patchEmail('components/PitchScriptModal.tsx', 'lead');
