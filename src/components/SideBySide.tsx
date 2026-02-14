import { getImageUrl } from "../lib/api";

interface Props {
  repoPath: string;
  file: string;
  commitA: string;
  commitB: string;
}

export function SideBySide({ repoPath, file, commitA, commitB }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">{commitA.substring(0, 7)}</p>
        <img
          src={getImageUrl(repoPath, commitA, file)}
          alt={commitA.substring(0, 7)}
          className="w-full"
        />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">{commitB.substring(0, 7)}</p>
        <img
          src={getImageUrl(repoPath, commitB, file)}
          alt={commitB.substring(0, 7)}
          className="w-full"
        />
      </div>
    </div>
  );
}
