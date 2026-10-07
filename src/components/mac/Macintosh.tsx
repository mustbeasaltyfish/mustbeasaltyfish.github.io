import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Desktop } from "./Desktop";
import { PixelIcon } from "./PixelIcon";
export function Macintosh({
  expanded,
  onExpand,
}: {
  expanded: boolean;
  onExpand: (value: boolean) => void;
}) {
  const [boot, setBoot] = useState(true);
  const [sleeping, setSleeping] = useState(false);
  const [session, setSession] = useState(0);
  const bezel = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!boot) return;
    const timer = window.setTimeout(
      () => setBoot(false),
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1400,
    );
    return () => window.clearTimeout(timer);
  }, [boot]);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.activeElement as HTMLElement | null;
    const fallback = expandButton.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bezel.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      (previous?.isConnected ? previous : fallback)?.focus();
    };
  }, [expanded]);
  function restart() {
    setBoot(true);
    setSleeping(false);
    setSession((value) => value + 1);
  }
  function keys(event: KeyboardEvent) {
    if (!expanded) return;
    if (event.key === "Escape") {
      event.preventDefault();
      onExpand(false);
    }
    if (event.key === "Tab") {
      const controls = bezel.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]',
      );
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === bezel.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === bezel.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  }
  return (
    <div className={`macintosh ${expanded ? "is-expanded" : ""}`}>
      {expanded && <div className="fullscreen-backdrop" />}
      <div className="machine-sticker">
        <div className="machine-side" aria-hidden="true" />
        <div className="machine-front">
          <div className="case-top-detail" aria-hidden="true" />
          <div
            className="screen-bezel"
            ref={bezel}
            tabIndex={-1}
            onKeyDown={keys}
            role={expanded ? "dialog" : undefined}
            aria-modal={expanded ? true : undefined}
            aria-label="Starry Macintosh desktop"
          >
            {expanded && (
              <div className="expanded-bar">
                <span>STARRY'S MACINTOSH</span>
                <button onClick={() => onExpand(false)}>
                  Return to the Mac <span>×</span>
                </button>
              </div>
            )}
            <div className="crt-screen">
              {sleeping ? (
                <button
                  className="sleep-screen"
                  onClick={restart}
                  aria-label="Wake Macintosh"
                >
                  <PixelIcon name="happy" />
                  <span>Click to wake up.</span>
                </button>
              ) : boot ? (
                <div className="boot-screen" role="status">
                  <PixelIcon name="happy" />
                  <span>Welcome to Macintosh.</span>
                  <div className="boot-progress">
                    <i />
                  </div>
                </div>
              ) : (
                <Desktop
                  key={session}
                  expanded={expanded}
                  onExpand={onExpand}
                  restart={restart}
                />
              )}
              <div className="screen-glass" aria-hidden="true" />
            </div>
          </div>
          <div className="machine-chin">
            <div className="machine-brand">
              <div className="rainbow-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <span>Macintosh</span>
            </div>
            <div className="floppy-drive" aria-hidden="true">
              <span />
              <i />
            </div>
            <div className="speaker-grille" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <span className="machine-serial">STARRY / PERSONAL EDITION</span>
            <button
              className={`power-button ${sleeping ? "off" : ""}`}
              onClick={() => (sleeping ? restart() : setSleeping(true))}
              aria-label={
                sleeping ? "Turn Macintosh on" : "Put Macintosh to sleep"
              }
              title={sleeping ? "Power on" : "Sleep"}
            >
              <span />
            </button>
          </div>
          <div className="case-foot" aria-hidden="true" />
        </div>
      </div>
      <div className="peripherals" aria-hidden="true">
        <div className="keyboard">
          <div className="keyboard-keys">
            {[
              "esc  1  2  3  4  5  6  7  8  9  0  −  +",
              "tab  Q  W  E  R  T  Y  U  I  O  P  [  ]",
              "ctrl  A  S  D  F  G  H  J  K  L  ;  ↵",
              "shift  Z  X  C  V  B  N  M  ,  .  /",
            ].map((row, i) => (
              <div className="key-row" key={i}>
                {row.split("  ").map((key, j) => (
                  <span key={j}>{key}</span>
                ))}
              </div>
            ))}
            <div className="key-row bottom-keys">
              <span>⌘</span>
              <span />
              <span>⌘</span>
            </div>
          </div>
        </div>
        <div className="mouse-cable" />
        <div className="mouse">
          <div />
        </div>
      </div>
      <button
        className="expand-control"
        ref={expandButton}
        onClick={() => onExpand(true)}
      >
        <span>⤢</span> A closer look <small>EXPAND SCREEN</small>
      </button>
    </div>
  );
}
