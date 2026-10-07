import { useEffect, useRef, useState, type PointerEvent } from "react";
import { AppleLogo } from "./AppleLogo";
import { PixelIcon } from "./PixelIcon";
import { pages, WindowContent, type Page } from "./WindowContent";
type Menu = "apple" | "File" | "Edit" | "View" | "Special";
interface Props {
  expanded: boolean;
  onExpand: (value: boolean) => void;
  restart: () => void;
}
function time() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export function Desktop({ expanded, onExpand, restart }: Props) {
  const [page, setPage] = useState<Page | null>("home");
  const [menu, setMenu] = useState<Menu | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [clock, setClock] = useState(time);
  const [notice, setNotice] = useState("");
  const desktop = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);
  function open(next: Page) {
    setPage(next);
    setOffset({ x: 0, y: 0 });
    setMenu(null);
  }
  useEffect(() => {
    const timer = window.setInterval(() => setClock(time()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    function dismiss(event: globalThis.PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenu(null);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(() => setOffset({ x: 0, y: 0 }));
    if (desktop.current) observer.observe(desktop.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button") ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;
    const area = desktop.current?.getBoundingClientRect();
    const rect = windowRef.current?.getBoundingClientRect();
    if (!area || !rect) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      startX: offset.x,
      startY: offset.y,
      minX: offset.x + area.left - rect.left + 4,
      maxX: offset.x + area.right - rect.right - 4,
      minY: offset.y + area.top + 29 - rect.top,
      maxY: offset.y + area.bottom - rect.bottom - 23,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    setOffset({
      x: Math.max(d.minX, Math.min(d.maxX, d.startX + event.clientX - d.x)),
      y: Math.max(d.minY, Math.min(d.maxY, d.startY + event.clientY - d.y)),
    });
  }
  async function copyEmail() {
    setMenu(null);
    try {
      await navigator.clipboard.writeText("yukaiwu002@gmail.com");
      setNotice("Email copied.");
    } catch {
      open("contact");
      setNotice("Select the email address to copy.");
    }
  }
  const menuItems: Record<Menu, { label: string; action: () => void }[]> = {
    apple: [
      { label: "About Starry System…", action: () => open("system") },
      { label: "Ask Starry…", action: () => open("bot") },
    ],
    File: [
      { label: "Open welcome", action: () => open("home") },
      { label: "About me", action: () => open("about") },
      { label: "Contact me", action: () => open("contact") },
      {
        label: "Close window",
        action: () => {
          setPage(null);
          setMenu(null);
        },
      },
    ],
    Edit: [{ label: "Copy email address", action: copyEmail }],
    View: [
      {
        label: expanded ? "Return to Macintosh" : "Expand screen",
        action: () => {
          onExpand(!expanded);
          setMenu(null);
        },
      },
      {
        label: "Show desktop",
        action: () => {
          setPage(null);
          setMenu(null);
        },
      },
    ],
    Special: [
      { label: "Restart", action: restart },
      { label: "A little surprise…", action: () => open("trash") },
    ],
  };
  return (
    <div className="mac-desktop" ref={desktop}>
      <div className="mac-menu-bar" ref={menuRef}>
        {(["apple", "File", "Edit", "View", "Special"] as Menu[]).map(
          (item) => (
            <div className="menu-wrap" key={item}>
              <button
                className={`menu-trigger ${menu === item ? "selected" : ""}`}
                aria-label={item === "apple" ? "System menu" : `${item} menu`}
                aria-expanded={menu === item}
                aria-haspopup="true"
                onClick={() => setMenu(menu === item ? null : item)}
              >
                {item === "apple" ? <AppleLogo /> : item}
              </button>
              {menu === item && (
                <div className="mac-dropdown">
                  {menuItems[item].map((option) => (
                    <button key={option.label} onClick={option.action}>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        <span className="mac-clock">{clock}</span>
      </div>
      <nav className="desktop-icons" aria-label="Desktop applications">
        {pages.map((item) => (
          <button
            key={item.id}
            className={`desktop-icon ${page === item.id ? "active" : ""}`}
            onClick={() => open(item.id)}
            title={`Open ${item.label}`}
          >
            <PixelIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button
        className={`desktop-icon trash-icon ${page === "trash" ? "active" : ""}`}
        onClick={() => open("trash")}
      >
        <PixelIcon name="trash" />
        <span>Trash</span>
      </button>
      {page && (
        <section
          className="mac-window"
          ref={windowRef}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
          aria-label={pages.find((p) => p.id === page)?.title || page}
        >
          <div
            className="window-title"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            <button
              className="window-close"
              aria-label="Close window"
              onClick={() => setPage(null)}
            />
            <span>
              {pages.find((p) => p.id === page)?.title ||
                (page === "bot"
                  ? "Ask Starry"
                  : page === "trash"
                    ? "Trash"
                    : "About Starry System")}
            </span>
            <button
              className="window-zoom"
              aria-label={expanded ? "Reduce screen" : "Expand screen"}
              onClick={() => onExpand(!expanded)}
            />
          </div>
          <div className="window-info">
            <span>
              {page === "home"
                ? "1 very curious human"
                : page === "bot"
                  ? "Personal assistant"
                  : "Starry’s personal disk"}
            </span>
            <span>
              {page === "home" ? "∞ ideas available" : "Read & explore"}
            </span>
          </div>
          <div className="window-body" key={page} tabIndex={0}>
            <WindowContent
              page={page}
              open={open}
              expanded={expanded}
              enter={() => onExpand(true)}
            />
          </div>
          <div className="window-bottom">
            <span>◇</span>
            <div />
            <span className="resize-grip" aria-hidden="true" />
          </div>
        </section>
      )}
      <div className="desktop-status">
        <span>{notice || "Starry System 1.0"}</span>
        <button onClick={expanded ? () => open("bot") : () => onExpand(true)}>
          {expanded ? "Ask Starry ↗" : "Enter desktop ⤢"}
        </button>
      </div>
    </div>
  );
}
