import { useState } from "react";
import { getImageUrl } from "../lib/api";

interface Props {
  repoPath: string;
  file: string;
  commitA: string;
  commitB: string;
}

export function OnionSkin({ repoPath, file, commitA, commitB }: Props) {
  const [opacity, setOpacity] = useState(50);

  return (
    <div>
      <div className="relative">
        <img
          src={getImageUrl(repoPath, commitA, file)}
          alt={commitA.substring(0, 7)}
          className="max-h-[calc(100vh-10rem)] w-full object-contain"
        />
        <img
          src={getImageUrl(repoPath, commitB, file)}
          alt={commitB.substring(0, 7)}
          className="absolute inset-0 max-h-[calc(100vh-10rem)] w-full object-contain"
          style={{ opacity: opacity / 100 }}
        />
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-500 shrink-0">
          {commitA.substring(0, 7)}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs text-gray-500 shrink-0">
          {commitB.substring(0, 7)}
        </span>
      </div>
    </div>
  );
}
