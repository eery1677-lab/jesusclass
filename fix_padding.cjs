const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir(path.join(__dirname, 'src', 'views'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  content = content.replace(/padding:\s*'(20|24)px'/g, "padding: '16px'");
  content = content.replace(/padding:\s*(20|24),/g, "padding: 16,");
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
