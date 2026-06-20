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
  
  // Replace 2-column grids with 1-column grids
  content = content.replace(/gridTemplateColumns:\s*'repeat\(2,\s*1fr\)'/g, "gridTemplateColumns: '1fr'");
  content = content.replace(/gridTemplateColumns:\s*'1fr\s+1fr'/g, "gridTemplateColumns: '1fr'");
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
