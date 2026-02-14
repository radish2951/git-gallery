export function toNFC(str: string): string {
  return str.normalize("NFC");
}

/**
 * リクエストパスに一致するgitの生パスを返す。
 * 両方NFC正規化して比較し、一致したらgitの元パスを返す。
 */
export function matchPath(
  requestPath: string,
  gitPaths: string[],
): string | undefined {
  const normalizedRequest = toNFC(requestPath);
  return gitPaths.find((p) => toNFC(p) === normalizedRequest);
}
