import { execFile } from "child_process";
import { toNFC, matchPath } from "./unicode.js";

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".webp",
  ".tiff",
  ".tif",
  ".psd",
  ".svg",
]);

const MAX_BUFFER = 50 * 1024 * 1024;

function execGit(repoPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      args,
      { cwd: repoPath, maxBuffer: MAX_BUFFER },
      (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout);
      },
    );
  });
}

function execGitBuffer(repoPath: string, args: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      args,
      { cwd: repoPath, maxBuffer: MAX_BUFFER, encoding: "buffer" },
      (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout);
      },
    );
  });
}

function isImageFile(f: string): boolean {
  const ext = f.substring(f.lastIndexOf(".")).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * gitの生パスで画像一覧を返す。
 * -c core.quotePath=false で日本語パスのクォートを抑制。
 */
async function listImagesRaw(repoPath: string): Promise<string[]> {
  const output = await execGit(repoPath, [
    "-c",
    "core.quotePath=false",
    "ls-tree",
    "-r",
    "--name-only",
    "HEAD",
  ]);
  return output.trim().split("\n").filter(Boolean).filter(isImageFile);
}

export async function listImages(repoPath: string): Promise<string[]> {
  const raw = await listImagesRaw(repoPath);
  return raw.map((f) => toNFC(f));
}

export interface CommitInfo {
  hash: string;
  subject: string;
  date: string;
}

export async function getHistory(
  repoPath: string,
  filePath: string,
): Promise<CommitInfo[]> {
  // filePath(NFC)からgitの生パスを探す
  const rawPaths = await listImagesRaw(repoPath);
  const gitPath = matchPath(filePath, rawPaths) ?? filePath;

  const output = await execGit(repoPath, [
    "log",
    "--follow",
    "--format=%H|%s|%ai",
    "--",
    gitPath,
  ]);
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, date] = line.split("|", 3);
      return { hash: hash!, subject: subject!, date: date! };
    });
}

export async function getFileAtCommit(
  repoPath: string,
  commit: string,
  filePath: string,
): Promise<Buffer> {
  // filePath(NFC)からgitの生パスを探す
  const rawPaths = await listImagesRaw(repoPath);
  const gitPath = matchPath(filePath, rawPaths) ?? filePath;

  return execGitBuffer(repoPath, ["show", `${commit}:${gitPath}`]);
}
