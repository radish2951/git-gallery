import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import { useCompare } from "../hooks/useCompare";
import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoPath = searchParams.get("path") ?? "";
  const file = searchParams.get("file") ?? "";
  const { commits, loading, error } = useHistory(repoPath, file);
  const { selected, toggle } = useCompare();

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-600">エラー: {error}</p>;

  function handleCompare() {
    if (selected.length !== 2) return;
    navigate(
      `/compare?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}&a=${selected[0]}&b=${selected[1]}`,
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
        比較するコミットを2つ選択してください
      </p>

      <div className="space-y-2 mb-4">
        {commits.map((commit) => (
          <TimelineItem
            key={commit.hash}
            repoPath={repoPath}
            file={file}
            commit={commit}
            selected={selected.includes(commit.hash)}
            onToggle={toggle}
          />
        ))}
      </div>

      {commits.length === 0 && (
        <p className="text-gray-500">コミット履歴が見つかりませんでした</p>
      )}

      <button
        onClick={handleCompare}
        disabled={selected.length !== 2}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        比較する ({selected.length}/2)
      </button>
    </div>
  );
}
