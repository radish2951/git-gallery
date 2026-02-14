import { useState, useEffect } from "react";
import { fetchImages } from "../lib/api";

export function useImages(repoPath: string) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchImages(repoPath)
      .then(setImages)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [repoPath]);

  return { images, loading, error };
}
