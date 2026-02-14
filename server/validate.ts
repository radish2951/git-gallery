import { execFile } from "child_process";

/**
 * 指定パスがgitリポジトリかどうかを検証する。
 * `git rev-parse --git-dir` が成功すればgitリポジトリ。
 */
export function validateRepoPath(repoPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      ["rev-parse", "--git-dir"],
      { cwd: repoPath },
      (err) => {
        if (err) reject(new Error(`Not a git repository: ${repoPath}`));
        else resolve();
      },
    );
  });
}

export function validateCommitHash(hash: string): void {
  if (hash === "HEAD") return;
  if (!/^[0-9a-f]{4,40}$/i.test(hash)) {
    throw new Error(`Invalid commit hash: ${hash}`);
  }
}

export function validateFilePath(filePath: string): void {
  if (filePath.includes("..")) {
    throw new Error(`Invalid file path: ${filePath}`);
  }
}
