const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const links = new Set();
const images = new Set();

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath);
        } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
            const content = fs.readFileSync(fullPath, 'utf8');

            // href
            const hrefRegex = /href=[\"'{`]+([^\"'{`]+)[\"'{`]+/g;
            let match;
            while ((match = hrefRegex.exec(content)) !== null) {
                let link = match[1];
                if (link.startsWith('/')) {
                    links.add(link);
                }
            }

            // src (images)
            const srcRegex = /src=[\"'{`]+([^\"'{`]+)[\"'{`]+/g;
            while ((match = srcRegex.exec(content)) !== null) {
                let imgSrc = match[1];
                if (imgSrc.startsWith('/')) {
                    images.add(imgSrc);
                }
            }
        }
    }
}

walk(srcDir);

console.log("=== Internal Links (href) ===");
Array.from(links).sort().forEach(l => console.log(l));

console.log("\n=== Internal Images (src) ===");
Array.from(images).sort().forEach(i => console.log(i));
