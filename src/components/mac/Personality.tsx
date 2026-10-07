import { useEffect, useState } from "react";
import { PixelIcon, type IconName } from "./PixelIcon";

// Preserve the seven ideas and the two-second rhythm of the original homepage.
const frames: { icon: IconName; label: string }[] = [
  { icon: "person", label: "A human." },
  { icon: "code", label: "A tech guy." },
  { icon: "brain", label: "A curious mind." },
  { icon: "bot", label: "An AI explorer." },
  { icon: "heart", label: "Passionate." },
  { icon: "sparkles", label: "Always exploring." },
  { icon: "emblem", label: "A sci-fi lover." },
];

export function Personality() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function change() {
      setReduced(media.matches);
    }
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % frames.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);
  const frame = frames[index];
  return (
    <figure className="personality" aria-label="Starry's personality icons">
      <div className="personality-title">
        <span>PERSONALITY</span>
        <span>{String(index + 1).padStart(2, "0")} / 07</span>
      </div>
      <div className="personality-stage">
        <div
          className="personality-frame"
          role="img"
          aria-label={frame.label}
          data-icon={frame.icon}
        >
          <PixelIcon key={frame.icon} name={frame.icon} />
        </div>
      </div>
      <figcaption className="personality-caption">
        <span>{frame.label}</span>
        <div className="personality-controls">
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused ? "Resume icon animation" : "Pause icon animation"
              }
              title={paused ? "Resume" : "Pause"}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIndex((value) => (value + 1) % frames.length)}
            aria-label="Next personality icon"
            title="Next icon"
          >
            ▸
          </button>
        </div>
      </figcaption>
    </figure>
  );
}
