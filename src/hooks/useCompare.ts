import { useState } from "react";

export function useCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(hash: string) {
    setSelected((prev) => {
      if (prev.includes(hash)) {
        return prev.filter((h) => h !== hash);
      }
      if (prev.length >= 2) {
        return [prev[1]!, hash];
      }
      return [...prev, hash];
    });
  }

  return { selected, toggle };
}
