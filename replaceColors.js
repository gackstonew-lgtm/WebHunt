const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { pattern: /bg-\[\#08090B\]/g, replacement: 'bg-background' },
  { pattern: /bg-\[\#111214\]/g, replacement: 'bg-surface' },
  { pattern: /bg-\[\#18191D\]/g, replacement: 'bg-surface-elevated' },
  { pattern: /bg-\[\#0D0E11\]/g, replacement: 'bg-surface-subtle' },
  { pattern: /bg-\[\#22242A\]/g, replacement: 'bg-surface-secondary' },

  // Hover Backgrounds
  { pattern: /hover\:bg-\[\#18191D\]/g, replacement: 'hover:bg-surface-elevated' },
  { pattern: /hover\:bg-\[\#111214\]/g, replacement: 'hover:bg-surface' },
  { pattern: /hover\:bg-\[\#22242A\]/g, replacement: 'hover:bg-surface-secondary' },

  // Text Colors
  { pattern: /text-\[\#EEEEEE\]/g, replacement: 'text-foreground' },
  { pattern: /text-\[\#989BA3\]/g, replacement: 'text-muted-foreground' },
  { pattern: /text-\[\#08090B\]/g, replacement: 'text-primary-foreground' },

  // Hover Text
  { pattern: /hover\:text-\[\#EEEEEE\]/g, replacement: 'hover:text-foreground' },
  { pattern: /hover\:text-\[\#989BA3\]/g, replacement: 'hover:text-muted-foreground' },
  
  // Group Hover
  { pattern: /group-hover\:text-\[\#EEEEEE\]/g, replacement: 'group-hover:text-foreground' },

  // Borders
  { pattern: /border-white\/\[0\.08\]/g, replacement: 'border-border' },
  { pattern: /border-white\/\[0\.06\]/g, replacement: 'border-subtle' },
  { pattern: /border-white\/\[0\.1\]/g, replacement: 'border-strong' },
  { pattern: /border-white\/\[0\.12\]/g, replacement: 'border-strong' },
  
  // Specific arbitrary borders
  { pattern: /border-\[\#18191D\]/g, replacement: 'border-surface-elevated' },
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
