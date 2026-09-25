const fs = require('fs');
let code = fs.readFileSync('src/data/pathologyData.js', 'utf8');

// The kn: array contains strings where the closing quote became '[KN] 
// Also inside the strings, double quotes became "[KN] 
// Let's just fix it without regex by parsing the file!
// Since the file is just a module exporting arrays/objects, we could theoretically do some AST stuff,
// but let's just do a string replacement on the KN array values specifically.
// Notice that the bad syntax only appears in lines starting with `        '[KN] ` inside `kn:` arrays.
// For example:
// `        '[KN] Premature defoliation exposing developing tomatoes to sunscald.'[KN] `
// `        '[KN] Dark brown to black necrotic spots with characteristic concentric rings ("[KN] target board"[KN]  pattern).'[KN] ,`

let lines = code.split('\n');
let insideKn = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('kn: [')) {
        insideKn = true;
    }
    
    if (insideKn) {
        if (lines[i].includes(']')) {
            // Check if this is the closing bracket for kn: [
            // Usually it's `      ]` or `    ]`
            if (lines[i].trim() === ']' || lines[i].trim() === '],') {
                insideKn = false;
            }
        }
        
        // Fix the string on this line
        if (lines[i].includes("'[KN] ") && lines[i].trim().startsWith("'[KN]")) {
            // Replace the end `'[KN] ,` with `',`
            lines[i] = lines[i].replace(/'\[KN\] ,/g, "',");
            // Replace the end `'[KN] ` with `'`
            lines[i] = lines[i].replace(/'\[KN\] $/g, "'");
            lines[i] = lines[i].replace(/'\[KN\]$/g, "'");
            
            // Replace internal `"[KN] ` with `"`
            lines[i] = lines[i].replace(/"\[KN\] /g, '"');
            lines[i] = lines[i].replace(/"\[KN\]/g, '"');
        }
    }
}

fs.writeFileSync('src/data/pathologyData.js', lines.join('\n'));
console.log('Fixed lines!');
