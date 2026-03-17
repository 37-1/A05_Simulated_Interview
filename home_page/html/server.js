const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8095;
const directory = __dirname;

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] Request: ${req.url}`);
    
    // Parse URL and decode URI component
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    
    // Normalize URL to prevent directory traversal
    const safeUrl = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    
    let filePath = path.join(directory, safeUrl === '/' || safeUrl === '\\' ? 'index.html' : safeUrl);
    
    // Check if it is a directory, if so look for index.html
    try {
        if (fs.statSync(filePath).isDirectory()) {
             filePath = path.join(filePath, 'index.html');
        }
    } catch (e) {
        // file not found, will be handled by readFile
    }

    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.webp':
            contentType = 'image/webp';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.woff':
            contentType = 'font/woff';
            break;
        case '.woff2':
            contentType = 'font/woff2';
            break;
        case '.ttf':
            contentType = 'font/ttf';
            break;
        case '.eot':
            contentType = 'application/vnd.ms-fontobject';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT'){
                console.error(`[${new Date().toISOString()}] 404 Not Found: ${filePath}`);
                // Try to serve 404.html if it exists
                const fourOhFour = path.join(directory, '404.html');
                fs.readFile(fourOhFour, (err404, content404) => {
                    if (!err404) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content404, 'utf-8');
                    } else {
                        res.writeHead(404);
                        res.end('404 Not Found');
                    }
                });
            }
            else {
                console.error(`[${new Date().toISOString()}] 500 Server Error: ${error.code} on ${filePath}`);
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
