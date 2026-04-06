/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = parseInt(process.env.PORT || "7100", 10);
const backendUrl = process.env.BACKEND_URL || "http://localhost:7101";

// When using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // Proxy /api/* to backend
      if (parsedUrl.pathname?.startsWith("/api/")) {
        const targetUrl = `${backendUrl}${parsedUrl.pathname}${parsedUrl.search || ""}`;
        const http = require("http");
        const proxyReq = http.request(targetUrl, {
          method: req.method,
          headers: { ...req.headers, host: parse(backendUrl).host },
        }, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
          proxyRes.pipe(res);
        });
        req.pipe(proxyReq);
        return;
      }


      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
