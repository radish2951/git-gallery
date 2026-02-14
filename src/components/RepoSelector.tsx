import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chooseFolder, validateRepo } from "../lib/api";

export function RepoSelector() {
  const [path, setPath] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function goTo(repoPath: string) {
    navigate(`/images?path=${encodeURIComponent(repoPath)}`);
  }

  async function handleChoose() {
    setLoading(true);
    setError(null);
    try {
      const selected = await chooseFolder();
      if (selected) goTo(selected);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleManual() {
    const trimmed = path.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      await validateRepo(trimmed);
      goTo(trimmed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">リポジトリを開く</h2>

      <button
        onClick={handleChoose}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors mb-6"
      >
        {loading ? "選択中..." : "フォルダを選択..."}
      </button>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div>
        <p className="text-sm text-gray-500 mb-2">またはパスを直接入力</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManual()}
            placeholder="/path/to/git/repo"
            className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManual}
            disabled={loading || !path.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition-colors"
          >
            開く
          </button>
        </div>
      </div>
    </div>
  );
}
