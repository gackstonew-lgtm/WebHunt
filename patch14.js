const fs = require('fs');
let c = fs.readFileSync('components/PitchScriptModal.tsx', 'utf8');

c = c.replace(
  'const handleSaveDraft = async () => {\n    if (!profile) return;',
  'const handleSaveDraft = async () => {\n    if (!profile) return;\n    const resolvedId = await resolveLeadId();'
);

fs.writeFileSync('components/PitchScriptModal.tsx', c);
