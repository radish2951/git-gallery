import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoPath = searchParams.get("path") ?? "";
  const file = searchParams.get("file") ?? "";
  const { commits, loading, error } = useHistory(repoPath, file);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-600">エラー: {error}</p>;

  function handleSelect(commitHash: string, previousHash: string) {
    navigate(
      `/compare?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}&a=${previousHash}&b=${commitHash}`,
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
        コミットをクリックすると前のコミットと比較します
      </p>

      <div className="space-y-2 mb-4">
        {commits.map((commit, index) => {
          const previousCommit =
            index < commits.length - 1 ? commits[index + 1]! : null;
          return (
            <TimelineItem
              key={commit.hash}
              repoPath={repoPath}
              file={file}
              commit={commit}
              previousCommit={previousCommit}
              onSelect={handleSelect}
            />
          );
        })}
      </div>

      {commits.length === 0 && (
        <p className="text-gray-500">コミット履歴が見つかりませんでした</p>
      )}
    </div>
  );
}
