const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let difficulty = 1; // Default difficulty

// Look for difficulty parameter
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--difficulty' || args[i] === '-d') {
        const difficultyArg = parseInt(args[i + 1]);
        if (!isNaN(difficultyArg) && difficultyArg >= 1 && difficultyArg <= 5) {
            difficulty = difficultyArg;
            console.log(`Setting initial difficulty to: ${difficulty}`);
        } else {
            console.log('Invalid difficulty value. Using default: 1');
        }
        break;
    }
}

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    console.log(`Request for ${req.url}`);
    
    // Normalize URL to prevent directory traversal attacks
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Page not found
                fs.readFile('./index.html', (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            if (filePath === './index.html' || filePath === './') {
                // Inject difficulty parameter into HTML
                let htmlContent = content.toString('utf-8');
                
                // Add a script tag to set the initial difficulty
                const difficultyScript = `
                <script>
                    window.initialDifficulty = ${difficulty};
                </script>`;
                
                // Insert the script right before the closing head tag
                htmlContent = htmlContent.replace('</head>', `${difficultyScript}\n</head>`);
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(htmlContent, 'utf-8');
            } else {
                // For other files, serve as is
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to stop the server');
});
