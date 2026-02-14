import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoPath = searchParams.get("path") ?? "";
  const file = searchParams.get("file") ?? "";
  const { commits, loading, error } = useHistory(repoPath, file);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-600">エラー: {error}</p>;

  function handleToggle(hash: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(hash)) {
        next.delete(hash);
      } else if (next.size < 2) {
        next.add(hash);
      } else {
        // 2つ選択済み → 古い方（配列で後ろ）を入れ替え
        const selectedArray = [...next];
        const idxA = commits.findIndex((c) => c.hash === selectedArray[0]);
        const idxB = commits.findIndex((c) => c.hash === selectedArray[1]);
        // インデックスが大きい方が古い（commits は新しい順）
        const olderHash = idxA > idxB ? selectedArray[0] : selectedArray[1];
        next.delete(olderHash!);
        next.add(hash);
      }
      return next;
    });
  }

  function getSelectionLabel(hash: string): "A" | "B" | null {
    if (!selected.has(hash)) return null;
    const selectedArray = [...selected];
    if (selectedArray.length === 1) return "A";
    const idxA = commits.findIndex((c) => c.hash === selectedArray[0]);
    const idxB = commits.findIndex((c) => c.hash === selectedArray[1]);
    // A = 古い方（インデックスが大きい）、B = 新しい方
    if (idxA > idxB) {
      return hash === selectedArray[0] ? "A" : "B";
    }
    return hash === selectedArray[1] ? "A" : "B";
  }

  function handleCompare() {
    const selectedArray = [...selected];
    const idxA = commits.findIndex((c) => c.hash === selectedArray[0]);
    const idxB = commits.findIndex((c) => c.hash === selectedArray[1]);
    // a = 古い方、b = 新しい方
    const [older, newer] = idxA > idxB
      ? [selectedArray[0], selectedArray[1]]
      : [selectedArray[1], selectedArray[0]];
    navigate(
      `/compare?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}&a=${older}&b=${newer}`,
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/images?path=${encodeURIComponent(repoPath)}`}
          className="text-blue-600 hover:underline"
        >
          ← 画像一覧
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-2">{file}</h2>
      <p className="text-sm text-gray-500 mb-4">
        2つのコミットを選択して比較
      </p>

      <div className="space-y-2 mb-4">
        {commits.map((commit) => (
          <TimelineItem
            key={commit.hash}
            repoPath={repoPath}
            file={file}
            commit={commit}
            selected={selected.has(commit.hash)}
            selectionLabel={getSelectionLabel(commit.hash)}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {selected.size === 2 && (
        <div className="sticky bottom-4">
          <button
            onClick={handleCompare}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            比較する
          </button>
        </div>
      )}

      {commits.length === 0 && (
        <p className="text-gray-500">コミット履歴が見つかりませんでした</p>
      )}
    </div>
  );
}
