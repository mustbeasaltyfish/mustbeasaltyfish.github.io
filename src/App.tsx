import { useState } from "react";
import { Macintosh } from "./components/mac/Macintosh";
import { PixelIcon } from "./components/mac/PixelIcon";

export default function App() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="studio">
      <header className="studio-header">
        <a className="wordmark" href="#home" aria-label="Starry's homepage">
          <span className="wordmark-star">✳</span> STARRY'S LITTLE CORNER
        </a>
        <span className="header-note">A personal space. A familiar face.</span>
        <button className="studio-link" onClick={() => setExpanded(true)}>
          Enter the desktop <span>↗</span>
        </button>
      </header>
      <main id="home" className="studio-main">
        <section className="intro" aria-label="Welcome">
          <div className="eyebrow">
            <span /> HELLO, WORLD. AGAIN.
          </div>
          <h1>
            Some things <br />
            start with <br />
            <em>hello.</em>
          </h1>
          <p>
            A curious mind. <br />A small corner of the internet.
            <br />A computer with a little soul.
          </p>
          <div className="intro-signature">
            Make yourself at home.<span>— Starry</span>
          </div>
          <div className="intro-caption">
            <span>01 /</span> A Macintosh-shaped hello
          </div>
        </section>
        <div className="computer-stage">
          <div className="stage-caption">
            <span className="status-dot" /> ALL SYSTEMS CURIOUS{" "}
            <span>EST. 2026</span>
          </div>
          <div className="hello-note" aria-hidden="true">
            hello, friend.
            <svg viewBox="0 0 110 55">
              <path d="M5 8C55 0 86 12 92 43m-13-7 14 10 5-17" />
            </svg>
          </div>
          <Macintosh expanded={expanded} onExpand={setExpanded} />
          <div className="floppy-sticker" aria-hidden="true">
            <div className="floppy-metal" />
            <div className="floppy-label">
              <small>PERSONAL DISK / 001</small>
              <strong>STARRY</strong>
              <span>curiosity, saved.</span>
            </div>
            <i />
          </div>
          <div className="little-sticker" aria-hidden="true">
            <PixelIcon name="happy" />
            <span>stay curious.</span>
          </div>
          <div className="stage-instructions">
            <span>↑</span> Click around. There's a person in there.
          </div>
        </div>
      </main>
      <footer className="studio-footer">
        <span>
          OLD-SCHOOL SHELL. <strong>STILL EXPLORING.</strong>
        </span>
        <span>Computer science · MLLM · distant galaxies</span>
        <a href="mailto:yukaiwu002@gmail.com">
          Say hello <span>↗</span>
        </a>
      </footer>
    </div>
  );
}
