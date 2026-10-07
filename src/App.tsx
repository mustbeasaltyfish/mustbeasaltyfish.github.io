import { useState } from "react";
import { Macintosh } from "./components/mac/Macintosh";

export default function App() {
  const [expanded, setExpanded] = useState(false);
  return (
    <main id="home" className="studio" aria-label="Starry's Macintosh">
      <Macintosh expanded={expanded} onExpand={setExpanded} />
    </main>
  );
}
