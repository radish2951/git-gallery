import { getThumbnailUrl } from "../lib/api";
import type { CommitInfo } from "../types";

interface Props {
  repoPath: string;
  file: string;
  commit: CommitInfo;
  selected: boolean;
  selectionLabel: "A" | "B" | null;
  onToggle: (hash: string) => void;
}

export function TimelineItem({
  repoPath,
  file,
  commit,
  selected,
  selectionLabel,
  onToggle,
}: Props) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded border transition-colors cursor-pointer ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
      onClick={() => onToggle(commit.hash)}
    >
      {selectionLabel && (
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {selectionLabel}
        </span>
      )}
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
