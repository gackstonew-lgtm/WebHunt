const fs = require('fs');

function patchResolve(file, propName) {
  let c = fs.readFileSync(file, 'utf8');
  
  const resolveFunc = `
  const resolveLeadId = async () => {
    if (activeLeadId !== ${propName}.id) return activeLeadId;
    const { saveLeadToPipelineAction } = await import("@/app/actions/leads");
    const saveRes = await saveLeadToPipelineAction(${propName});
    if (saveRes.success && saveRes.data) {
      setActiveLeadId(saveRes.data.id);
      return saveRes.data.id;
    }
    return activeLeadId;
  };
`;

  // Insert resolveLeadId just before handleGenerate
  c = c.replace('  const handleGenerate = async () => {', resolveFunc + '\n  const handleGenerate = async () => {');
  
  // Update handleGenerate
  if (propName === 'job') {
    c = c.replace(
      'const res = await generateProposalAction(activeLeadId, templateType);',
      'const resolvedId = await resolveLeadId();\n    const res = await generateProposalAction(resolvedId, templateType);'
    );
  } else {
    c = c.replace(
      'const res = await generatePhysicalPitchAction(activeLeadId, templateType);',
      'const resolvedId = await resolveLeadId();\n    const res = await generatePhysicalPitchAction(resolvedId, templateType);'
    );
  }

  // Update handleSaveDraft
  c = c.replace(
    'const handleSaveDraft = async () => {\n    if (!profile) return;\n    setIsSavingDraft(true);',
    `const handleSaveDraft = async () => {\n    if (!profile) return;\n    setIsSavingDraft(true);\n    const resolvedId = await resolveLeadId();`
  );
  
  c = c.replace(
    'leadId: activeLeadId,',
    'leadId: resolvedId,'
  );

  // Update handleSendEmail (or WhatsApp)
  if (propName === 'job') {
    c = c.replace(
      'const handleSendEmail = async () => {',
      'const handleSendEmail = async () => {\n    const resolvedId = await resolveLeadId();'
    );
    // Replace activeLeadId in recordOutreachMessageAction inside handleSendEmail
    c = c.replace(
      'leadId: activeLeadId,',
      'leadId: resolvedId,'
    );
  } else {
    c = c.replace(
      'const handleOpenWhatsApp = async () => {',
      'const handleOpenWhatsApp = async () => {\n    const resolvedId = await resolveLeadId();'
    );
    c = c.replace(
      'leadId: activeLeadId,',
      'leadId: resolvedId,'
    );
    
    // Also patch handleSendEmail in PitchScriptModal just in case
    if (c.includes('const handleSendEmail = async () => {')) {
        c = c.replace(
          'const handleSendEmail = async () => {',
          'const handleSendEmail = async () => {\n    const resolvedId = await resolveLeadId();'
        );
        c = c.replace(
          'leadId: activeLeadId,',
          'leadId: resolvedId,'
        );
    }
  }
  
  fs.writeFileSync(file, c);
}

patchResolve('components/JobProposalModal.tsx', 'job');
patchResolve('components/PitchScriptModal.tsx', 'lead');
