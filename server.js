/**
 * Custom HTTPS Development Server for LazorKit
 * 
 * Required for WebAuthn/Passkey functionality during local development.
 * WebAuthn requires HTTPS to sign transactions (origin matching).
 * 
 * Usage: npm run dev:https
 * 
 * @see https://docs.lazorkit.com/troubleshooting
 */

const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Load mkcert certificates
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs/localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs/localhost+2.pem')),
};

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    })
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`\n🔐 HTTPS Server running at https://${hostname}:${port}\n`);
            console.log('   WebAuthn/Passkey transactions will now work locally!\n');
        });
});
