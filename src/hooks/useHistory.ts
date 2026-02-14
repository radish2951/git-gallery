import { useState, useEffect } from "react";
import { fetchHistory } from "../lib/api";
import type { CommitInfo } from "../types";

export function useHistory(repoPath: string, file: string) {
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchHistory(repoPath, file)
      .then(setCommits)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [repoPath, file]);

  return { commits, loading, error };
}
