import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import { execFile } from "child_process";
import {
  validateRepoPath,
  validateCommitHash,
  validateFilePath,
} from "./validate.js";
import { listImages, getHistory, getFileAtCommit } from "./git.js";
import { getThumbnail } from "./thumbnail.js";

function parseQuery(url: string): URLSearchParams {
  const idx = url.indexOf("?");
  if (idx === -1) return new URLSearchParams();
  return new URLSearchParams(url.substring(idx));
}

function getPathname(url: string): string {
  const idx = url.indexOf("?");
  return idx === -1 ? url : url.substring(0, idx);
}

function sendJson(res: ServerResponse, data: unknown): void {
  const body = JSON.stringify(data);
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendError(res: ServerResponse, status: number, message: string): void {
  const body = JSON.stringify({ error: message });
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendBuffer(
  res: ServerResponse,
  buf: Buffer,
  contentType: string,
): void {
  res.writeHead(200, {
    "Content-Type": contentType,
    "Content-Length": buf.length,
  });
  res.end(buf);
}

function guessContentType(filePath: string): string {
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".webp": "image/webp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
    ".svg": "image/svg+xml",
    ".psd": "application/octet-stream",
  };
  return map[ext] ?? "application/octet-stream";
}

function chooseFolder(): Promise<string | null> {
  return new Promise((resolve) => {
    execFile(
      "osascript",
      ["-e", 'POSIX path of (choose folder with prompt "gitリポジトリを選択")'],
      (err, stdout) => {
        if (err) resolve(null);
        else resolve(stdout.trim().replace(/\/$/, ""));
      },
    );
  });
}

async function handleApi(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  const url = req.url ?? "";
  if (!url.startsWith("/api/")) return false;

  const pathname = getPathname(url);
  const query = parseQuery(url);

  try {
    if (pathname === "/api/choose-folder") {
      const path = await chooseFolder();
      if (!path) {
        sendJson(res, { path: null });
        return true;
      }
      await validateRepoPath(path);
      sendJson(res, { path });
      return true;
    }

    if (pathname === "/api/validate") {
      const repoPath = query.get("path");
      if (!repoPath) {
        sendError(res, 400, "Missing path parameter");
        return true;
      }
      await validateRepoPath(repoPath);
      sendJson(res, { ok: true });
      return true;
    }

    if (pathname === "/api/images") {
      const repoPath = query.get("path");
      if (!repoPath) {
        sendError(res, 400, "Missing path parameter");
        return true;
      }
      await validateRepoPath(repoPath);
      const images = await listImages(repoPath);
      sendJson(res, images);
      return true;
    }

    if (pathname === "/api/history") {
      const repoPath = query.get("path");
      const file = query.get("file");
      if (!repoPath || !file) {
        sendError(res, 400, "Missing path or file parameter");
        return true;
      }
      await validateRepoPath(repoPath);
      validateFilePath(file);
      const history = await getHistory(repoPath, file);
      sendJson(res, history);
      return true;
    }

    if (pathname === "/api/image") {
      const repoPath = query.get("path");
      const commit = query.get("commit");
      const file = query.get("file");
      if (!repoPath || !commit || !file) {
        sendError(res, 400, "Missing path, commit, or file parameter");
        return true;
      }
      await validateRepoPath(repoPath);
      validateCommitHash(commit);
      validateFilePath(file);
      const buf = await getFileAtCommit(repoPath, commit, file);
      sendBuffer(res, buf, guessContentType(file));
      return true;
    }

    if (pathname === "/api/thumbnail") {
      const repoPath = query.get("path");
      const commit = query.get("commit");
      const file = query.get("file");
      if (!repoPath || !commit || !file) {
        sendError(res, 400, "Missing path, commit, or file parameter");
        return true;
      }
      await validateRepoPath(repoPath);
      validateCommitHash(commit);
      validateFilePath(file);
      const buf = await getFileAtCommit(repoPath, commit, file);
      const cacheKey = `${repoPath}:${commit}:${file}`;
      const thumbnail = await getThumbnail(buf, cacheKey);
      sendBuffer(res, thumbnail, "image/jpeg");
      return true;
    }

    sendError(res, 404, "Not found");
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    sendError(res, 500, message);
    return true;
  }
}

export function apiMiddleware(): Plugin {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApi(req, res).then((handled) => {
          if (!handled) next();
        }).catch(() => {
          sendError(res, 500, "Internal server error");
        });
      });
    },
  };
}
