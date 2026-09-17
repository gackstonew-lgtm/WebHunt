const fs = require('fs');

const filePath = "components/JobProposalModal.tsx";
let content = fs.readFileSync(filePath, "utf-8");

content = content.replace(
    'import { getUserProfileAction, UserProfileData } from "@/app/actions/profile";',
    'import { getUserProfileAction, UserProfileData } from "@/app/actions/profile";\nimport { fetchProposalDraftsAction, generateProposalAction } from "@/app/actions/outreach";'
);

content = content.replace(
    'const [isEditing, setIsEditing] = useState(false);',
    'const [isEditing, setIsEditing] = useState(false);\n  const [draftId, setDraftId] = useState<string | null>(null);\n  const [isGenerating, setIsGenerating] = useState(false);'
);

const oldUseEffect = `  useEffect(() => {
    async function load() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setProfile(res.data);
        const proposal = generateTruthfulJobProposal(job, res.data, templateType);
        setSubject(proposal.subject);
        setBody(\`\${proposal.greeting}\\n\\n\${proposal.body}\\n\\n\${proposal.callToAction}\`);
      }

      // Check if candidate reached out recently
      if (job.email) {
        const dupCheck = await checkDuplicateOutreachAction(job.email, "email", 7);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(\`You contacted \${job.email} on \${dupCheck.lastContactedAt ? new Date(dupCheck.lastContactedAt).toLocaleDateString() : "recently"}.\`);
        }
      }
    }
    load();
  }, [job, templateType]);`;

const newUseEffect = `  useEffect(() => {
    async function load() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setProfile(res.data);
      }

      // Load draft if it exists
      const draftsRes = await fetchProposalDraftsAction(job.id);
      if (draftsRes.success && draftsRes.data && draftsRes.data.length > 0) {
        // Find a draft matching this templateType, or just take the first one
        const draft = draftsRes.data.find(d => d.templateType === templateType) || draftsRes.data[0];
        setDraftId(draft.id);
        setSubject(draft.subject);
        setBody(draft.body);
      }

      // Check if candidate reached out recently
      if (job.email) {
        const dupCheck = await checkDuplicateOutreachAction(job.email, "email", 7);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(\`You contacted \${job.email} on \${dupCheck.lastContactedAt ? new Date(dupCheck.lastContactedAt).toLocaleDateString() : "recently"}.\`);
        }
      }
    }
    load();
  }, [job]); // Only run on mount or job change, NOT on templateType change to preserve edits
`;
content = content.replace(oldUseEffect, newUseEffect);

const oldHandleTemplateChange = `  const handleTemplateChange = (type: ProposalTemplateType) => {
    setTemplateType(type);
    if (profile) {
      const proposal = generateTruthfulJobProposal(job, profile, type);
      setSubject(proposal.subject);
      setBody(\`\${proposal.greeting}\\n\\n\${proposal.body}\\n\\n\${proposal.callToAction}\`);
    }
  };`;

const newHandleTemplateChange = `  const handleTemplateChange = (type: ProposalTemplateType) => {
    setTemplateType(type);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const res = await generateProposalAction(job.id, templateType);
    if (res.success && res.data) {
      setSubject(res.data.subject);
      setBody(\`\${res.data.greeting}\\n\\n\${res.data.body}\\n\\n\${res.data.callToAction}\`);
    } else {
      alert("Failed to generate proposal: " + (res.error || "Unknown error"));
    }
    setIsGenerating(false);
  };`;
content = content.replace(oldHandleTemplateChange, newHandleTemplateChange);

const oldHandleSaveDraft = `  const handleSaveDraft = async () => {
    if (!profile) return;
    setIsSavingDraft(true);
    await saveProposalDraftAction({
      leadId: job.id,
      title: \`\${job.title} @ \${job.company}\`,
      templateType,
      subject,
      body,
      callToAction: "",
      fullText: \`SUBJECT: \${subject}\\n\\n\${body}\`,
    });
    setIsSavingDraft(false);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };`;

const newHandleSaveDraft = `  const handleSaveDraft = async () => {
    if (!profile) return;
    setIsSavingDraft(true);
    const res = await saveProposalDraftAction({
      draftId: draftId || undefined,
      leadId: job.id,
      title: \`\${job.title} @ \${job.company}\`,
      templateType,
      subject,
      body,
      callToAction: "",
      fullText: \`SUBJECT: \${subject}\\n\\n\${body}\`,
    });
    
    if (res.success && res.data) {
      setDraftId(res.data.id);
    }
    
    setIsSavingDraft(false);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };`;
content = content.replace(oldHandleSaveDraft, newHandleSaveDraft);

const generateUi = `          {/* Subject Line */}`;
const generateUiNew = `          {/* Generate Action */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-[#EEEEEE] hover:bg-white text-black font-semibold text-xs shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? "Generating proposal..." : "Generate Proposal"}</span>
            </button>
          </div>

          {/* Subject Line */}`;
content = content.replace(generateUi, generateUiNew);

fs.writeFileSync(filePath, content);
