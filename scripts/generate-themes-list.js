#!/usr/bin/env node

const fs = require('fs');

try {
  if (!fs.existsSync('.gitmodules')) {
    throw new Error('File .gitmodules not found in current directory');
  }

  const fileContent = fs.readFileSync('.gitmodules', 'utf8');
  const lines = fileContent.split('\n');

  const links = [];
  let currentName = null;

  lines.forEach(line => {
    line = line.trim();
    
    if (line.startsWith('[submodule "themes/')) {
      currentName = line.split('/').pop().slice(0, -2);
    } else if (line.startsWith('url = ') && currentName) {
      const url = line.replace('url = ', '').trim().replace('.git', '');
      links.push(`- [${currentName}](${url})`);
      currentName = null;
    }
  });

  if (links.length === 0) {
    throw new Error('No themes found in .gitmodules');
  }

  const sortedLinks = links.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const output = '# Themes\n\n' + sortedLinks.join('\n');

  fs.writeFileSync('THEMES.md', output);
  console.log('\x1b[32m%s\x1b[0m', '✓ Successfully generated THEMES.md');
  console.log(`  Found and processed ${links.length} themes`);

} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', '✗ Error:', error.message);
  process.exit(1);
} 
