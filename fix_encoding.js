const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf-8');

// The mojibake characters for UTF-8 sequences when interpreted as Windows-1252
text = text.replace(/â€¢/g, '•'); // Bullet
text = text.replace(/ðŸ“ /g, '📍'); // Round pushpin
text = text.replace(/â€”/g, '—'); // Em dash

fs.writeFileSync('app.js', text, 'utf-8');
console.log('Fixed encoding issues in app.js');
