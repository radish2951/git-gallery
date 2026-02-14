import { Routes, Route, useLocation } from "react-router-dom";
import { RepoSelector } from "./components/RepoSelector";
import { ImageList } from "./components/ImageList";
import { Timeline } from "./components/Timeline";
import { CompareView } from "./components/CompareView";

export function App() {
  const location = useLocation();
  const isCompare = location.pathname === "/compare";

  if (isCompare) {
    return (
      <Routes>
        <Route path="/compare" element={<CompareView />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-2">
        <h1 className="text-sm font-semibold">git-gallery</h1>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<RepoSelector />} />
          <Route path="/images" element={<ImageList />} />
          <Route path="/history" element={<Timeline />} />
        </Routes>
      </main>
    </div>
  );
}
