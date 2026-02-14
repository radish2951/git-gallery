import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { OnionSkin } from "./OnionSkin";
import { SideBySide } from "./SideBySide";

type Mode = "onion-skin" | "side-by-side";

export function CompareView() {
  const [searchParams] = useSearchParams();
  const repoPath = searchParams.get("path") ?? "";
  const file = searchParams.get("file") ?? "";
  const commitA = searchParams.get("a") ?? "";
  const commitB = searchParams.get("b") ?? "";
  const [mode, setMode] = useState<Mode>("onion-skin");

  if (!file || !commitA || !commitB) {
    return <p className="text-red-600">パラメータが不足しています</p>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-white border-b border-gray-200 shrink-0">
        <Link
          to={`/history?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}`}
          className="text-blue-600 hover:underline shrink-0 text-sm"
        >
          ←
        </Link>
        <span className="text-xs font-mono truncate text-gray-600">
          {file} — {commitA.substring(0, 7)} vs {commitB.substring(0, 7)}
        </span>
        <div className="flex gap-1 ml-auto shrink-0">
          <button
            onClick={() => setMode("onion-skin")}
            className={`px-2.5 py-0.5 rounded text-xs ${
              mode === "onion-skin"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            オニオンスキン
          </button>
          <button
            onClick={() => setMode("side-by-side")}
            className={`px-2.5 py-0.5 rounded text-xs ${
              mode === "side-by-side"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            サイドバイサイド
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {mode === "onion-skin" ? (
          <OnionSkin
            repoPath={repoPath}
            file={file}
            commitA={commitA}
            commitB={commitB}
          />
        ) : (
          <SideBySide
            repoPath={repoPath}
            file={file}
            commitA={commitA}
            commitB={commitB}
          />
        )}
      </div>
    </div>
  );
}
