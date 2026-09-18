const fs = require('fs');
const path = require('path');

const replacements = [
  // Remove ring-white and old hardcoded borders
  { pattern: /border-white\/20/g, replacement: 'border-border' },
  { pattern: /border-white\/30/g, replacement: 'border-primary' },

  // Replace primary button classes with Yardly shadow and hover styling
  { pattern: /bg-primary hover\:bg-primary-hover text-primary-foreground/g, replacement: 'bg-primary hover:bg-primary-hover text-primary-foreground shadow-brand-btn transition-all duration-300' },
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
