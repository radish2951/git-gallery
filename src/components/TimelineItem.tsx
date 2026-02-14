import { getThumbnailUrl } from "../lib/api";
import type { CommitInfo } from "../types";

interface Props {
  repoPath: string;
  file: string;
  commit: CommitInfo;
  selected: boolean;
  onToggle: (hash: string) => void;
}

export function TimelineItem({
  repoPath,
  file,
  commit,
  selected,
  onToggle,
}: Props) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded border cursor-pointer transition-colors ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
      onClick={() => onToggle(commit.hash)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(commit.hash)}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />
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
