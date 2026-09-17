const fs = require('fs');

const filePath = "components/PitchScriptModal.tsx";
let content = fs.readFileSync(filePath, "utf-8");

content = content.replace(
    'import { getUserProfileAction, UserProfileData } from "@/app/actions/profile";',
    'import { getUserProfileAction, UserProfileData } from "@/app/actions/profile";\nimport { fetchProposalDraftsAction, generatePhysicalPitchAction } from "@/app/actions/outreach";'
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
      }

      // Check if lead was contacted recently
      const targetPhone = lead.phoneFormatted || lead.phone;
      if (targetPhone) {
        const dupCheck = await checkDuplicateOutreachAction(targetPhone, "whatsapp", 7);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(\`You contacted this lead via WhatsApp on \${dupCheck.lastContactedAt ? new Date(dupCheck.lastContactedAt).toLocaleDateString() : "recently"}.\`);
        }
      }
    }
    load();
  }, [lead, templateType]);`;

const newUseEffect = `  useEffect(() => {
    async function load() {
      const res = await getUserProfileAction();
      if (res.success && res.data) {
        setProfile(res.data);
      }

      const draftsRes = await fetchProposalDraftsAction(lead.id);
      if (draftsRes.success && draftsRes.data && draftsRes.data.length > 0) {
        const draft = draftsRes.data.find(d => d.templateType === templateType) || draftsRes.data[0];
        setDraftId(draft.id);
        setSubject(draft.subject);
        setBody(draft.body);
      }

      // Check if lead was contacted recently
      const targetPhone = lead.phoneFormatted || lead.phone;
      if (targetPhone) {
        const dupCheck = await checkDuplicateOutreachAction(targetPhone, "whatsapp", 7);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(\`You contacted this lead via WhatsApp on \${dupCheck.lastContactedAt ? new Date(dupCheck.lastContactedAt).toLocaleDateString() : "recently"}.\`);
        }
      }
    }
    load();
  }, [lead]);`;

content = content.replace(oldUseEffect, newUseEffect);

const oldHandleTemplateChange = `  const handleTemplateChange = (type: "local_website_pitch" | "agency_modernization") => {
    setTemplateType(type);
    if (profile) {
      const pitch = generateTruthfulPhysicalPitch(lead, profile, type);
      setSubject(pitch.subject);
      setBody(\`\${pitch.greeting}\\n\\n\${pitch.body}\\n\\n\${pitch.callToAction}\`);
    }
  };`;

const newHandleTemplateChange = `  const handleTemplateChange = (type: "local_website_pitch" | "agency_modernization") => {
    setTemplateType(type);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const res = await generatePhysicalPitchAction(lead.id, templateType);
    if (res.success && res.data) {
      setSubject(res.data.subject);
      setBody(\`\${res.data.greeting}\\n\\n\${res.data.body}\\n\\n\${res.data.callToAction}\`);
    } else {
      alert("Failed to generate pitch: " + (res.error || "Unknown error"));
    }
    setIsGenerating(false);
  };`;

content = content.replace(oldHandleTemplateChange, newHandleTemplateChange);

const oldHandleSaveDraft = `  const handleSaveDraft = async () => {
    if (!profile) return;
    await saveProposalDraftAction({
      leadId: lead.id,
      title: \`Website Pitch - \${lead.businessName}\`,
      templateType,
      subject,
      body,
      callToAction: "",
      fullText: \`SUBJECT: \${subject}\\n\\n\${body}\`,
    });
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };`;

const newHandleSaveDraft = `  const handleSaveDraft = async () => {
    if (!profile) return;
    const res = await saveProposalDraftAction({
      draftId: draftId || undefined,
      leadId: lead.id,
      title: \`Website Pitch - \${lead.businessName}\`,
      templateType,
      subject,
      body,
      callToAction: "",
      fullText: \`SUBJECT: \${subject}\\n\\n\${body}\`,
    });
    
    if (res.success && res.data) {
      setDraftId(res.data.id);
    }
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };`;

content = content.replace(oldHandleSaveDraft, newHandleSaveDraft);

const generateUi = `          {/* Editable Subject & Body */}`;
const generateUiNew = `          {/* Generate Action */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-[#EEEEEE] hover:bg-white text-black font-semibold text-xs shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? "Generating pitch..." : "Generate Pitch"}</span>
            </button>
          </div>

          {/* Editable Subject & Body */}`;

content = content.replace(generateUi, generateUiNew);

fs.writeFileSync(filePath, content);
