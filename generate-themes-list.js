#!/usr/bin/env node

const fs = require('fs');

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

const sortedLinks = links.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
const output = '# Themes\n\n' + sortedLinks.join('\n');

fs.writeFileSync('THEMES.md', output); 
