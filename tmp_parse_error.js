const fs = require('fs');
try {
    const html = fs.readFileSync('tmp_error.html', 'utf16le');
    // Extract text from <title> or <h1/h2> or anything that looks like "Error: ..."
    const errorMatch = html.match(/<title>(.*?)<\/title>/);
    const errorBodyPattern = /Error: [^<]+/g;
    const bodyMatches = html.match(errorBodyPattern);

    console.log("Title:", errorMatch ? errorMatch[1] : "No title found");
    if (bodyMatches) {
        console.log("Found error messages:");
        const uniqueErrors = new Set(bodyMatches);
        uniqueErrors.forEach(err => console.log(" -", err.substring(0, 300))); // Truncate to avoid too much output
    } else {
        console.log("Could not find specific Error: string in HTML body.");
        // Output a chunk around 'Error' just in case
        const idx = html.indexOf('Error');
        if (idx !== -1) {
            console.log("Excerpt around 'Error':");
            console.log(html.substring(Math.max(0, idx - 100), idx + 1000).replace(/<[^>]+>/g, ' ').substring(0, 500));
        }
    }
} catch (e) {
    console.error("Error reading file:", e);
}
