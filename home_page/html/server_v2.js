const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8099;
const directory = __dirname;

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] Request: ${req.url}`);
    
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const safeUrl = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    
    let filePath = path.join(directory, safeUrl === '/' || safeUrl === '\\' ? 'index.html' : safeUrl);
    
    try {
        if (fs.statSync(filePath).isDirectory()) {
             filePath = path.join(filePath, 'index.html');
        }
    } catch (e) {}

    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    const mimeTypes = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };

    contentType = mimeTypes[extname] || 'text/html';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT'){
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
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
