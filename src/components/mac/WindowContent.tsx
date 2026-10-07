import { useRef, useState, type FormEvent } from "react";
import avatar from "../../assets/images/avatar.jpg";
import { getBotResponse } from "../../services/botService";
import { Turnstile, turnstileSiteKey } from "./Turnstile";
import { Personality } from "./Personality";
import { PixelIcon, type IconName } from "./PixelIcon";

export type Page =
  | "home"
  | "about"
  | "bot"
  | "contact"
  | "thoughts"
  | "friends"
  | "trash"
  | "system";
export const pages: {
  id: Page;
  title: string;
  label: string;
  icon: IconName;
}[] = [
  {
    id: "home",
    title: "Welcome to my little world",
    label: "Starry HD",
    icon: "disk",
  },
  { id: "about", title: "About me", label: "About me", icon: "happy" },
  { id: "thoughts", title: "Thoughts", label: "Thoughts", icon: "note" },
  { id: "friends", title: "Friends", label: "Friends", icon: "folder" },
  { id: "contact", title: "Contact me", label: "Contact", icon: "mail" },
];

function AskStarry() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || pending.current) return;
    if (turnstileSiteKey && !token) {
      setError("请完成人机验证后再发送。");
      return;
    }
    pending.current = true;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const result = await getBotResponse(input, token);
      if (result.error)
        setError(result.error);
      else setReply(result.content);
    } catch {
      setError("连接中断了，请稍后再试。");
    } finally {
      pending.current = false;
      setLoading(false);
      setToken("");
      setAttempt(v => v + 1);
    }
  }
  return (
    <div className="bot-content">
      <div className="content-heading">
        <PixelIcon name="bot" />
        <div>
          <h2>Ask Starry.</h2>
          <p>A little digital version of me.</p>
        </div>
      </div>
      <p>
        Computer science, sci-fi, or just a hello.
        <br />
        What would you like to know?
      </p>
      <form onSubmit={submit}>
        <label htmlFor="starry-question">Your message / 你的问题</label>
        <div className="ask-row">
          <input
            id="starry-question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are you curious about?"
            maxLength={500}
            disabled={loading}
          />
          <button
            className="mac-button primary"
            disabled={loading || !input.trim() || Boolean(turnstileSiteKey && !token)}
          >
            {loading ? "Wait…" : "Send ↵"}
          </button>
        </div>
        {turnstileSiteKey && <Turnstile onToken={setToken} attempt={attempt} />}
      </form>
      <div
        className={`bot-reply ${error ? "has-error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {loading
          ? "Connecting to a curious mind…"
          : error ||
            reply || (
              <span className="reply-placeholder">
                Your conversation starts here.
              </span>
            )}
      </div>
      <small className="bot-footnote">
        An AI persona. For the real human, open Contact.
      </small>
    </div>
  );
}
function Contact() {
  const [copyStatus, setCopyStatus] = useState("Copy WeChat ID");
  async function copy() {
    try {
      await navigator.clipboard.writeText("hyvnyf-behhar-1kokVy");
      setCopyStatus("Copied!");
    } catch {
      setCopyStatus("Select the ID above to copy");
    }
  }
  return (
    <div className="contact-content">
      <div className="content-heading">
        <PixelIcon name="mail" />
        <div>
          <h2>Contact me!</h2>
          <p>Good conversations start somewhere.</p>
        </div>
      </div>
      <a
        className="contact-line"
        href="https://github.com/mustbeasaltyfish"
        target="_blank"
        rel="noreferrer"
      >
        <span>GitHub</span>
        <strong>mustbeasaltyfish ↗</strong>
      </a>
      <a className="contact-line" href="mailto:yukaiwu002@gmail.com">
        <span>Email</span>
        <strong>yukaiwu002@gmail.com ↗</strong>
      </a>
      <div className="contact-line">
        <span>WeChat</span>
        <strong>hyvnyf-behhar-1kokVy</strong>
      </div>
      <button className="mac-button" onClick={copy}>
        {copyStatus}
      </button>
    </div>
  );
}
export function WindowContent({
  page,
  open,
  expanded,
  enter,
}: {
  page: Page;
  open: (page: Page) => void;
  expanded: boolean;
  enter: () => void;
}) {
  if (page === "bot") return <AskStarry />;
  if (page === "contact") return <Contact />;
  if (page === "home")
    return (
      <div className="welcome-content">
        <div className="welcome-top">
          <div className="portrait">
            <img src={avatar} alt="Starry" />
          </div>
          <div>
            <span className="tiny-label">A HUMAN, NOT A COMPUTER.</span>
            <h2>I'm Starry!</h2>
            <p>{expanded ? "Welcome, friend." : "Open full screen."}</p>
          </div>
          <PixelIcon name="star" className="welcome-star" />
        </div>
        <div className="welcome-rule" />
        <p className="welcome-description">
          A tech guy. A sci-fi lover.
          <br />A curious mind, always trying new things.
        </p>
        <p className="welcome-aside">
          Pull up a window. Make yourself at home.
        </p>
        <div className="welcome-actions">
          <button
            className={`mac-button primary ${expanded ? "" : "desktop-entry"}`}
            onClick={expanded ? () => open("bot") : enter}
            aria-label={expanded ? "Ask about me" : "Enter full-screen desktop"}
          >
            {expanded ? "Ask about me" : "Enter desktop"}{" "}
            <span>{expanded ? "↵" : "⤢"}</span>
          </button>
          <button className="mac-button" onClick={() => open("about")}>
            Who am I?
          </button>
        </div>
        <div className="welcome-bottom">
          <span>
            <i /> Available for good conversations
          </span>
          <span>hello.txt</span>
        </div>
      </div>
    );
  if (page === "about")
    return (
      <div className="about-content">
        <div className="content-heading">
          <PixelIcon name="happy" />
          <div>
            <h2>Who am I?</h2>
            <p>Starry / Yukai Wu</p>
          </div>
        </div>
        <div className="about-profile">
          <div className="about-copy">
            <p>
              A boy, a tech guy, and a nerd who loves Computer Science and MLLM.
              A sci-fi lover dreaming of space and starships.
            </p>
            <p>
              Outgoing, passionate, always trying new things. I'd love to meet
              friends with a similar curiosity.
            </p>
            <div className="interest-list">
              <span>01 / Computer science</span>
              <span>02 / Recursive Self-Improvement</span>
              <span>03 / Somewhere among the stars</span>
            </div>
            <button className="mac-button" onClick={() => open("contact")}>
              Let's be friends ↗
            </button>
          </div>
          <Personality />
        </div>
      </div>
    );
  if (page === "thoughts" || page === "friends")
    return (
      <div className="empty-content">
        <PixelIcon name={page === "thoughts" ? "note" : "folder"} />
        <h2>
          {page === "thoughts"
            ? "Thoughts in progress."
            : "Room for good company."}
        </h2>
        <p>
          {page === "thoughts"
            ? "This notebook is still waiting for its first entry."
            : "The friends directory is still being put together."}
        </p>
        <p className="empty-stamp">Under construction, with curiosity.</p>
        <button
          className="mac-button"
          onClick={() => open(page === "thoughts" ? "about" : "contact")}
        >
          {page === "thoughts" ? "Meet the author" : "Say hello"}
        </button>
      </div>
    );
  if (page === "trash")
    return (
      <div className="empty-content">
        <PixelIcon name="trash" />
        <h2>No bad ideas in here.</h2>
        <p>
          The Trash is empty.
          <br />
          Even the odd ideas deserve a second chance.
        </p>
        <button className="mac-button" onClick={() => open("home")}>
          Back to hello
        </button>
      </div>
    );
  return (
    <div className="system-content">
      <PixelIcon name="happy" />
      <h2>Starry System</h2>
      <p>Version 1.0 · Personal edition</p>
      <hr />
      <p>
        A small homage to the 1984 Macintosh.
        <br />
        Built for curiosity, conversations, and you.
      </p>
      <p className="system-memory">
        Total curiosity: unlimited
        <br />
        Available memory: room for one more friend
      </p>
      <a
        href="https://www.folklore.org/Busy_Being_Born.html"
        target="_blank"
        rel="noreferrer"
      >
        A little history ↗
      </a>
    </div>
  );
}
