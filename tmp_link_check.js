const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const extractedLinks = new Set();
const nextjsRoutes = new Set();

// appディレクトリの全ルートをスキャンして記録
function scanRoutes(dir, basePath = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            scanRoutes(path.join(dir, entry.name), `${basePath}/${entry.name}`);
        } else if (entry.isFile() && (entry.name === 'page.tsx' || entry.name === 'route.ts')) {
            nextjsRoutes.add(basePath || '/');
        }
    }
}
scanRoutes(path.join(srcDir, 'app'));

function scanFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scanFiles(fullPath);
        } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // href="..." or href={'...'} or href={`...`}
            const regexes = [
                /href=["']([^"']+)["']/g,
                /href=\{["']([^"']+)["']\}/g,
                /href=\{`([^`]+)`\}/g
            ];

            regexes.forEach(regex => {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    let link = match[1];
                    // Strip query params and hash
                    link = link.split('?')[0].split('#')[0];
                    if (link.startsWith('/')) {
                        extractedLinks.add({ link, file: fullPath.replace(__dirname, '') });
                    }
                }
            });
        }
    }
}
scanFiles(srcDir);

// Check links against routes
let hasError = false;
const uniqueLinks = new Set();

extractedLinks.forEach(item => {
    uniqueLinks.add(item.link);
});

console.log("--- Extracted Unique Internal Links ---");
let brokenLinks = [];
uniqueLinks.forEach(link => {
    // Dynamic routes handling (e.g. /facilities/${facility.id})
    // We roughly transform ${...} into [id] or [slug] to match app router paths
    let routeToMatch = link.replace(/\$\{[^}]+\}/g, '[id]'); // Very naive, but lets see

    // Some custom replacements since our regex extracted `${...}` literally
    if (link.includes('${')) {
        let parts = link.split('/');
        parts = parts.map(p => p.includes('${') ? '[id]' : p);
        routeToMatch = parts.join('/');
    }

    let isMatch = false;
    for (let route of nextjsRoutes) {
        // Simple match, replace [id] and [slug] with a generic matcher
        const routeRegexStr = '^' + route.replace(/\[[a-zA-Z0-9_]+\]/g, '[^/]+') + '$';
        const routeRegex = new RegExp(routeRegexStr);
        if (routeRegex.test(link)) {
            isMatch = true;
            break;
        }
    }

    if (!isMatch) {
        brokenLinks.push(link);
    }
});

console.log(`Found ${uniqueLinks.size} unique internal links.`);
console.log("Potential Broken Links:");
if (brokenLinks.length === 0) {
    console.log("None found! All links seem to match a route.");
} else {
    brokenLinks.forEach(bl => {
        // Find which files have this broken link
        let files = Array.from(extractedLinks).filter(i => i.link === bl).map(i => i.file);
        console.log(`- ${bl} (Found in: ${[...new Set(files)].join(', ')})`);
    });
}

// Check if all routes are used? Not necessary for this audit.
