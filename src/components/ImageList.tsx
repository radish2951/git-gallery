import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useImages } from "../hooks/useImages";
import { getThumbnailUrl } from "../lib/api";

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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {images.map((file) => {
          const basename = file.split("/").pop() ?? file;
          return (
            <button
              key={file}
              onClick={() =>
                navigate(
                  `/history?path=${encodeURIComponent(repoPath)}&file=${encodeURIComponent(file)}`,
                )
              }
              title={file}
              className="flex flex-col items-center bg-white rounded border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors p-2"
            >
              <div className="aspect-square w-full flex items-center justify-center bg-gray-100 rounded mb-2">
                <img
                  src={getThumbnailUrl(repoPath, "HEAD", file)}
                  alt={file}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-mono truncate w-full text-center">
                {basename}
              </span>
            </button>
          );
        })}
      </div>
      {images.length === 0 && (
        <p className="text-gray-500">画像ファイルが見つかりませんでした</p>
      )}
    </div>
  );
}
