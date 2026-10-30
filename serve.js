// Local web server for the Asnani Footwear site — works without internet.
// Usage: node serve.js [port]   (default port 8080), then open http://localhost:8080
// Other devices on the same Wi-Fi can open http://<this-computer's-IP>:8080
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.argv[2] || 8080);
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  if (rel.endsWith("/")) rel += "index.html";
  const file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Asnani Footwear site running at http://localhost:${port}`);
  console.log("Keep this window open while browsing. Press Ctrl+C to stop.");
});
