import sharp from "sharp";

const cache = new Map<string, Buffer>();

export async function getThumbnail(
  imageBuffer: Buffer,
  cacheKey: string,
): Promise<Buffer> {
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const thumbnail = await sharp(imageBuffer)
    .resize({ width: 200 })
    .jpeg({ quality: 80 })
    .toBuffer();

  cache.set(cacheKey, thumbnail);
  return thumbnail;
}
