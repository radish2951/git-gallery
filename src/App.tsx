import { Routes, Route } from "react-router-dom";
import { RepoSelector } from "./components/RepoSelector";
import { ImageList } from "./components/ImageList";
import { Timeline } from "./components/Timeline";
import { CompareView } from "./components/CompareView";

export function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-semibold">git-gallery</h1>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<RepoSelector />} />
          <Route path="/images" element={<ImageList />} />
          <Route path="/history" element={<Timeline />} />
          <Route path="/compare" element={<CompareView />} />
        </Routes>
      </main>
    </div>
  );
}
