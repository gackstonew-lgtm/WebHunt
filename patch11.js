const fs = require('fs');

function patchModal(file, propName) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Add activeLeadId state
  c = c.replace(
    'const [draftId, setDraftId] = useState<string | null>(null);',
    `const [draftId, setDraftId] = useState<string | null>(null);\n  const [activeLeadId, setActiveLeadId] = useState<string>(${propName}.id);`
  );
  
  // Add saveLeadToPipelineAction import if not there
  if (!c.includes('saveLeadToPipelineAction')) {
    c = c.replace(
      'import { saveProposalDraftAction',
      'import { saveLeadToPipelineAction } from "@/app/actions/leads";\nimport { saveProposalDraftAction'
    );
  }
  
  // Patch load() inside useEffect
  const loadMatch = c.match(/async function load\(\) \{/);
  if (loadMatch) {
    c = c.replace(
      'async function load() {',
      `async function load() {
      const saveRes = await saveLeadToPipelineAction(${propName});
      let realId = ${propName}.id;
      if (saveRes.success && saveRes.data) {
        realId = saveRes.data.id;
        setActiveLeadId(realId);
      }`
    );
  }
  
  // Replace propName.id with activeLeadId inside fetchProposalDraftsAction
  c = c.replace(
    new RegExp(`fetchProposalDraftsAction\\(${propName}\\.id\\)`, 'g'),
    'fetchProposalDraftsAction(realId)'
  );
  
  // Replace propName.id with activeLeadId inside handleGenerate
  if (propName === 'job') {
    c = c.replace(/generateProposalAction\([^,]+, templateType\)/, 'generateProposalAction(activeLeadId, templateType)');
  } else {
    c = c.replace(/generatePhysicalPitchAction\([^,]+, templateType\)/, 'generatePhysicalPitchAction(activeLeadId, templateType)');
  }
  
  // Replace propName.id with activeLeadId inside saveProposalDraftAction
  c = c.replace(/leadId: [^,]+,/, 'leadId: activeLeadId,');

  fs.writeFileSync(file, c);
}

patchModal('components/JobProposalModal.tsx', 'job');
patchModal('components/PitchScriptModal.tsx', 'lead');
