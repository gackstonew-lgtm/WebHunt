const fs = require("fs");

let content = fs.readFileSync("components/ResultsTable.tsx", "utf-8");

if (!content.includes("import PhysicalCard")) {
    content = content.replace("import JobCard from \"./JobCard\";", "import JobCard from \"./JobCard\";\nimport PhysicalCard from \"./PhysicalCard\";");
}

const target = "<div className=\"bg-surface border border-subtle/50 rounded-2xl shadow-2xl overflow-hidden\">";

const replacement = `          {/* Mobile Card Layout (Hidden on MD+) */}
          <div className="grid grid-cols-1 md:hidden gap-4">
            {filteredLeads.map((item, i) => {
              const lead = item as PhysicalLead;
              return (
                <PhysicalCard
                  key={\`\${lead.id}-\${lead.sourceProvider || "prov"}-\${i}\`}
                  lead={lead}
                  isSaved={savedLeadIds.has(lead.id)}
                  isSelected={selectedLeadIds.has(lead.id)}
                  onToggleSelect={toggleSelect}
                  onSave={onSaveLead}
                  onPitch={setPitchLead}
                  onNotes={setNotesLead}
                />
              );
            })}
          </div>

          {/* Desktop Table Layout (Hidden on mobile) */}
          <div className="hidden md:block bg-surface border border-subtle/50 rounded-2xl shadow-2xl overflow-hidden">`;

content = content.replace(target, replacement);

fs.writeFileSync("components/ResultsTable.tsx", content, "utf-8");
console.log("Patch applied.");
