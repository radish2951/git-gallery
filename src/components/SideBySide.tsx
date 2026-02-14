import { getImageUrl } from "../lib/api";

interface Props {
  repoPath: string;
  file: string;
  commitA: string;
  commitB: string;
}

export function SideBySide({ repoPath, file, commitA, commitB }: Props) {
  return (
    <div className="h-full grid grid-cols-2 gap-2 p-2">
      <div className="flex flex-col items-center min-h-0">
        <p className="text-xs text-gray-500 mb-1 shrink-0">{commitA.substring(0, 7)}</p>
        <img
          src={getImageUrl(repoPath, commitA, file)}
          alt={commitA.substring(0, 7)}
          className="max-w-full max-h-full object-contain min-h-0"
        />
      </div>
      <div className="flex flex-col items-center min-h-0">
        <p className="text-xs text-gray-500 mb-1 shrink-0">{commitB.substring(0, 7)}</p>
        <img
          src={getImageUrl(repoPath, commitB, file)}
          alt={commitB.substring(0, 7)}
          className="max-w-full max-h-full object-contain min-h-0"
        />
      </div>
    </div>
  );
}
