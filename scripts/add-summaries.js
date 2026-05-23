const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data', 'subjects');

const processDir = (dir) => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (entry.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      let modified = false;
      if (data.templates && Array.isArray(data.templates)) {
        data.templates.forEach((t) => {
          if (typeof t === 'object' && t !== null) {
            // Keep Hogwarts Legacy custom summaries if already set
            if (data.id === 'hogwarts-legacy' && t.summary) return;

            // Generate an elegant combination of variables for other subjects
            t.summary = `${t.description || ''} under {{timeOfDay}} light, rendered in {{imageStyle}} style. The atmosphere is {{tone}}, aiming to capture a {{goal}} view.`;
            modified = true;
          }
        });
      }
      if (modified) {
        fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated templates with variables in ${entry}`);
      }
    }
  }
};

processDir(dataDir);
console.log('Successfully updated all subject templates with premium variable combinations!');
