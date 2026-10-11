import avatar from "../../assets/images/avatar.jpg";
import { CvDownload } from "./CvDownload";
import type { Page } from "./WindowContent";
import "../../styles/macintosh-home.css";

export function Home({ open, expanded, enter }: {
  open: (page: Page) => void;
  expanded: boolean;
  enter: () => void;
}) {
  return (
    <article className="home-content" aria-label="Yukai Wu's personal homepage">
      <header className="home-header">
        <div className="portrait"><img src={avatar} alt="Starry's pixel-art avatar" /></div>
        <div className="home-name">
          <span className="tiny-label">STARRY / PERSONAL FILE</span>
          <h2>Yukai Wu</h2>
          <p><span lang="zh-CN">吴钰恺</span> / Starry</p>
        </div>
        {!expanded && (
          <button className="mac-button primary home-entry" onClick={enter} aria-label="Enter full-screen desktop">
            Enter desktop <span aria-hidden="true">⤢</span>
          </button>
        )}
        {expanded && <CvDownload />}
      </header>
      <p className="home-intro">
        I work on agent memory and reinforcement learning. I want to build
        agents that can remember, learn, and act reliably over long horizons.
      </p>
      <dl className="home-education" aria-label="Education">
        <div>
          <dt>Undergraduate / 2023–2027</dt>
          <dd><strong>Beijing Jiaotong University</strong><span>Computer Science &amp; Technology</span></dd>
        </div>
        <div>
          <dt>Incoming graduate student</dt>
          <dd><strong>Southeast University</strong><span>PALM Laboratory</span></dd>
        </div>
      </dl>
      <section className="home-section home-research" aria-labelledby="home-research-title">
        <div className="home-section-label"><span>01</span> Selected research</div>
        <div className="home-research-heading">
          <h3 id="home-research-title">Agentic Memory</h3>
          <p className="home-paper-status"><strong>First author</strong><span>Under review at AAAI</span></p>
        </div>
        <p className="home-subtitle">Reinforcement learning &amp; strategy routing</p>
        <p>
          My first research work explores learning to manage an agent’s long-term
          memory. It routes memory strategies for individual tasks, coordinating
          writing, organization, retrieval, and answering.
        </p>
        <p>
          I led the core implementation, built the VeRL / Qwen post-training
          pipeline, and designed rewards for memory management and downstream
          question answering.
        </p>
        <div className="home-topics" aria-label="Research topics">
          <span>Agent memory</span><span>RL post-training</span><span>Strategy routing</span>
        </div>
      </section>
      <div className="home-columns">
        <section className="home-section" aria-labelledby="home-interest-title">
          <div className="home-section-label"><span>02</span> Research interests</div>
          <h3 id="home-interest-title">Long-horizon agents</h3>
          <p>
            How can an agent preserve useful context, plan across many steps,
            and improve through feedback during a long-running task?
          </p>
          <p>
            I’m interested in the intersection of memory, reinforcement
            learning, and recursive self-improvement, toward agents that stay
            reliable as tasks get longer.
          </p>
        </section>
        <section className="home-section" aria-labelledby="home-internship-title">
          <div className="home-section-label"><span>03</span> Industry experience</div>
          <h3 id="home-internship-title">ByteDance</h3>
          <p className="home-subtitle">AI Data &amp; Security / Internship</p>
          <p>
            I contributed to internal model evaluation workflows and helped
            build <strong>AutoBench</strong>, spanning difficulty enhancement of
            existing evaluation datasets and the evaluation pipeline.
          </p>
          <ol className="home-pipeline" aria-label="AutoBench evaluation workflow">
            <li>Evaluation datasets</li><li>Difficulty enhancement</li><li>Evaluation pipeline</li>
          </ol>
        </section>
      </div>
      <footer className="home-footer">
        <button className="mac-button" onClick={() => open("bot")}>Ask about me ↵</button>
        {!expanded && <CvDownload />}
        <button className="home-text-link" onClick={() => open("about")}>More about me →</button>
        <button className="home-text-link" onClick={() => open("contact")}>Contact ↗</button>
      </footer>
    </article>
  );
}
