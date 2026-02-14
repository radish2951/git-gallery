import type { CommitInfo } from "../types";

function q(s: string): string {
  return encodeURIComponent(s);
}

export async function chooseFolder(): Promise<string | null> {
  const res = await fetch("/api/choose-folder");
  if (!res.ok) throw new Error("Failed to open folder dialog");
  const data = await res.json();
  return data.path as string | null;
}

export async function validateRepo(path: string): Promise<void> {
  const res = await fetch(`/api/validate?path=${q(path)}`);
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Not a git repository");
  }
}

export async function fetchImages(path: string): Promise<string[]> {
  const res = await fetch(`/api/images?path=${q(path)}`);
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json();
}

export async function fetchHistory(
  path: string,
  file: string,
): Promise<CommitInfo[]> {
  const res = await fetch(`/api/history?path=${q(path)}&file=${q(file)}`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export function getImageUrl(
  path: string,
  commit: string,
  file: string,
): string {
  return `/api/image?path=${q(path)}&commit=${q(commit)}&file=${q(file)}`;
}

export function getThumbnailUrl(
  path: string,
  commit: string,
  file: string,
): string {
  return `/api/thumbnail?path=${q(path)}&commit=${q(commit)}&file=${q(file)}`;
}
