import { getThumbnailUrl } from "../lib/api";
import type { CommitInfo } from "../types";

interface Props {
  repoPath: string;
  file: string;
  commit: CommitInfo;
  previousCommit: CommitInfo | null;
  onSelect: (commitHash: string, previousHash: string) => void;
}

export function TimelineItem({
  repoPath,
  file,
  commit,
  previousCommit,
  onSelect,
}: Props) {
  const disabled = !previousCommit;

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded border transition-colors ${
        disabled
          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
          : "border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
      }`}
      onClick={() => {
        if (!disabled) onSelect(commit.hash, previousCommit.hash);
      }}
    >
      <img
        src={getThumbnailUrl(repoPath, commit.hash, file)}
        alt={commit.subject}
        className="w-16 h-16 object-contain bg-gray-100 rounded shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{commit.subject}</p>
        <p className="text-xs text-gray-500">
          {commit.hash.substring(0, 7)} · {commit.date}
        </p>
      </div>
    </div>
  );
}
