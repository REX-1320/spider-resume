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
        } else { 
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walkDir('./src');
console.log(`Found ${files.length} jsx files`);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Convert simple cases: style={glassCard}
    content = content.replace(/style=\{glassCard\}/g, 'className="glass-panel"');
    content = content.replace(/style=\{glassBase\}/g, 'className="liquid-glass"');
    content = content.replace(/style=\{glassBtn\}/g, 'className="glass-btn"');
    content = content.replace(/style=\{glassInput\}/g, 'className="glass-input"');

    // 2. Convert merged object cases: style={{ ...glassCard, ...etc }} 
    // This is trickier if an element ALREADY has a className.
    // e.g., className="something" style={{ ...glassCard, margin: 10 }}
    // We cannot easily do regex here if they both exist. We would use AST.
    // Let's use simple string replacements for the most common patterns in this codebase.
    
    // Most elements here just have style={{ ...glassCard, something }} without a className.
    // If they have className, adding a new one is hard with regex. 
    // So let's look for `<div className="..." style={{ ...glassCard`
    // and replace to `<div className="... glass-panel" style={{`

    const classMap = {
        'glassCard': 'glass-panel',
        'glassBase': 'liquid-glass',
        'glassBtn': 'glass-btn',
        'glassInput': 'glass-input'
    };

    for (const [prop, cls] of Object.entries(classMap)) {
        // Case: className="exist" style={{ ...prop, ...
        const regexWithClass = new RegExp(`className="(.*?)"\\s+style=\\{\\{\\s*\\.\\.\\.${prop},?\\s*`, 'g');
        content = content.replace(regexWithClass, `className="$1 ${cls}" style={{ `);

        // Case: style={{ ...prop, ...
        const regexNoClass = new RegExp(`style=\\{\\{\\s*\\.\\.\\.${prop},?\\s*`, 'g');
        content = content.replace(regexNoClass, `className="${cls}" style={{ `);
        
        // Sometimes it's the last property, style={{ width: "100%", ...glassCard }}
        // we'll regex loop this later if missed. Let's do simple:
        content = content.replace(new RegExp(`\\.\\.\\.${prop},?`, 'g'), '');
    }

    // specific cleanup of empty style={{}} which might be generated
    content = content.replace(/style=\{\{\s*\}\}/g, '');

    fs.writeFileSync(file, content, 'utf8');
}
console.log("Done");
