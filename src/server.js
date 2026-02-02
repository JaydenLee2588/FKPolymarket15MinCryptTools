import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml"
};

let wss = null;
let httpServer = null;

export function startChartServer(port = 3000) {
    httpServer = http.createServer((req, res) => {
        let filePath = req.url === "/" ? "/chart.html" : req.url;

        // 安全检查：防止路径遍历攻击
        const safePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
        const fullPath = path.join(PUBLIC_DIR, safePath);

        // 确保路径在 PUBLIC_DIR 内
        if (!fullPath.startsWith(PUBLIC_DIR)) {
            res.writeHead(403);
            res.end("Forbidden");
            return;
        }

        const ext = path.extname(fullPath);
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Not Found");
                return;
            }
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });
    });

    wss = new WebSocketServer({ server: httpServer });

    wss.on("connection", (ws) => {
        // 静默处理连接，避免日志噪音
        ws.on("close", () => { });
    });

    httpServer.listen(port, () => {
        console.log(`[Chart] 图表服务已启动: http://localhost:${port}`);
    });

    return { httpServer, wss };
}

export function broadcastChartData(data) {
    if (!wss) return;
    const msg = JSON.stringify(data);
    for (const client of wss.clients) {
        if (client.readyState === 1) {
            client.send(msg);
        }
    }
}
