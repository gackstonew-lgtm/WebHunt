const fs = require('fs');
const filePath = "components/PitchScriptModal.tsx";
let content = fs.readFileSync(filePath, "utf-8");

content = content.replace(
    'const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);',
    'const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);\n  const [draftId, setDraftId] = useState<string | null>(null);\n  const [isGenerating, setIsGenerating] = useState(false);'
);

fs.writeFileSync(filePath, content);
