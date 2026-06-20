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
  
  content = content.replace(/padding:\s*'32px'/g, "padding: '16px'");
  content = content.replace(/padding:\s*'30px 20px'/g, "padding: '16px'");
  content = content.replace(/padding:\s*'24px'/g, "padding: '16px'");
  content = content.replace(/padding:\s*'20px'/g, "padding: '16px'");
  content = content.replace(/gap:\s*'24px'/g, "gap: '12px'");
  content = content.replace(/gap:\s*'20px'/g, "gap: '12px'");
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated padding/gap in ${file}`);
  }
});
