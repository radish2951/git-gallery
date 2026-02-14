import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useImages } from "../hooks/useImages";

export function ImageList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const repoPath = searchParams.get("path") ?? "";
  const { images, loading, error } = useImages(repoPath);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-600">エラー: {error}</p>;

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← リポジトリ選択
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-1">画像ファイル一覧</h2>
      <p className="text-sm text-gray-500 font-mono mb-4">{repoPath}</p>
      <ul className="space-y-1">
        {images.map((file) => (
          <li key={file}>
            <button
              onClick={() =>
                navigate(
                  `/history?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}`,
                )
              }
              className="block w-full text-left px-4 py-2 bg-white rounded border border-gray-200 hover:bg-gray-100 transition-colors text-sm font-mono"
            >
              {file}
            </button>
          </li>
        ))}
      </ul>
      {images.length === 0 && (
        <p className="text-gray-500">画像ファイルが見つかりませんでした</p>
      )}
    </div>
  );
}
