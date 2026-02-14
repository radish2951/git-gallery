import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SliderCompare } from "./SliderCompare";
import { SideBySide } from "./SideBySide";

type Mode = "slider" | "side-by-side";

export function CompareView() {
  const [searchParams] = useSearchParams();
  const repoPath = searchParams.get("path") ?? "";
  const file = searchParams.get("file") ?? "";
  const commitA = searchParams.get("a") ?? "";
  const commitB = searchParams.get("b") ?? "";
  const [mode, setMode] = useState<Mode>("slider");

  if (!file || !commitA || !commitB) {
    return <p className="text-red-600">パラメータが不足しています</p>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/history?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}`}
          className="text-blue-600 hover:underline"
        >
          ← タイムライン
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-2">{file}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {commitA.substring(0, 7)} vs {commitB.substring(0, 7)}
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("slider")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "slider"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          スライダー
        </button>
        <button
          onClick={() => setMode("side-by-side")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "side-by-side"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          サイドバイサイド
        </button>
      </div>

      {mode === "slider" ? (
        <SliderCompare
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
  );
}
