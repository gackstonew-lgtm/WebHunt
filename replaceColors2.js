const fs = require('fs');
const path = require('path');

const replacements = [
  // Remaining backgrounds
  { pattern: /bg-\[\#EEEEEE\]/g, replacement: 'bg-primary' },
  { pattern: /bg-\[\#111A14\]/g, replacement: 'bg-success/10' },

  // Text Colors
  { pattern: /text-\[\#EEEEEE\]/g, replacement: 'text-primary-foreground' },
  { pattern: /text-\[\#34D399\]/g, replacement: 'text-success' },
  { pattern: /text-\[\#989BA3\]/g, replacement: 'text-muted-foreground' },
  { pattern: /placeholder-\[\#989BA3\]/g, replacement: 'placeholder-muted-foreground' },

  // Hover
  { pattern: /hover\:text-\[\#EEEEEE\]/g, replacement: 'hover:text-primary-foreground' },
  
  // Custom focus rings
  { pattern: /focus\:ring-white\/20/g, replacement: 'focus:ring-ring' },
  { pattern: /focus\:border-white\/30/g, replacement: 'focus:border-primary' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { pattern, replacement } of replacements) {
        content = content.replace(pattern, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'components'));
processDirectory(path.join(__dirname, 'app'));
