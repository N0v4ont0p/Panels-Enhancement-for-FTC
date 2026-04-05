<svelte:head>
  <title>FTC Team 19859 Panels Fork</title>
  <meta
    name="description"
    content={"Public docs for FTC Team 19859's Panels fork with FTC deployment and standalone mock/demo workflows."}
  />
</svelte:head>

<main class="site">
  <section class="hero card">
    <p class="eyebrow">FTC Team 19859 Fork</p>
    <h1>Panels Enhancement for FTC</h1>
    <p>
      This project is a fork of the original <strong>Panels</strong> ecosystem by Lazar
      (Team 19234 ByteForce). Our fork focuses on production FTC reliability, frontend
      usability improvements, and easier testing workflows for teams that do not always
      have robot hardware available.
    </p>

    <div class="hero-actions">
      <a href="https://github.com/N0v4ont0p/Panels-Enhancement-for-FTC">Fork Repository</a>
      <a href="https://panels.bylazar.com" target="_blank" rel="noreferrer"
        >Original Panels Docs</a
      >
    </div>
  </section>

  <section class="card">
    <h2>Why Team 19859 Made This Fork</h2>
    <ul>
      <li>Harden deployment and day-to-day usage on REV Hub / Control Hub setups.</li>
      <li>Improve UI/UX for faster in-match diagnostics and pit tuning.</li>
      <li>Add safer local testing paths so frontend work can continue without a robot.</li>
      <li>Document a cleaner developer experience for contributors and future students.</li>
    </ul>
  </section>

  <section class="card">
    <h2>Improvements Over Upstream</h2>
    <div class="improvements">
      <article>
        <h3>UI/UX and Clarity</h3>
        <p>
          Dashboard layout and interaction quality updates for faster access to telemetry,
          opmodes, and plugin state while preserving the familiar Panels structure.
        </p>
      </article>
      <article>
        <h3>Deployment Hardening</h3>
        <p>
          FTC/REV deployment workflow remains intact while documentation and review guidance
          are improved for repeatable releases.
        </p>
      </article>
      <article>
        <h3>Standalone Mock Frontend</h3>
        <p>
          Added <code>mock-demo/</code> as an isolated UI testbed with mocked telemetry,
          opmodes, widgets, graphs, field state, and gamepad state.
        </p>
      </article>
    </div>
  </section>

  <section class="card">
    <h2>Screenshots</h2>
    <p class="muted">Visuals from the repo showing Panels UI and plugin experiences.</p>
    <div class="gallery">
      <figure>
        <img src="/homepage-panels.png" alt="Panels homepage" loading="lazy" />
        <figcaption>Main Panels layout</figcaption>
      </figure>
      <figure>
        <img src="/all-plugins.png" alt="All plugins overview" loading="lazy" />
        <figcaption>Plugin ecosystem overview</figcaption>
      </figure>
      <figure>
        <img src="/graph.png" alt="Graph plugin" loading="lazy" />
        <figcaption>Graph tuning dashboard</figcaption>
      </figure>
      <figure>
        <img src="/field.png" alt="Field plugin" loading="lazy" />
        <figcaption>Field visualization</figcaption>
      </figure>
      <figure>
        <img src="/opmode-control.png" alt="OpMode control" loading="lazy" />
        <figcaption>OpMode control and orchestration</figcaption>
      </figure>
      <figure>
        <img src="/gamepads.png" alt="Gamepad state" loading="lazy" />
        <figcaption>Gamepad monitoring</figcaption>
      </figure>
    </div>
  </section>

  <section class="split">
    <article class="card">
      <h2>Real FTC Deployment Workflow</h2>
      <p>
        Use this for actual robot operation on REV hardware. This path keeps the original
        FTC runtime behavior in <code>library/</code> and <code>examples/</code>.
      </p>
      <pre><code>cd library
./gradlew build

# Deploy as documented for your FTC app target
# (Control Hub / Robot Controller flow remains unchanged)</code></pre>
    </article>

    <article class="card">
      <h2>Mock/Demo Testing Workflow</h2>
      <p>
        Use this when hardware is unavailable. It runs independently and never replaces the
        production robot app.
      </p>
      <pre><code>cd mock-demo
npm install
npm run dev

# optional production preview
npm run build
npm run preview</code></pre>
    </article>
  </section>

  <section class="card">
    <h2>Render Hosting Recommendations</h2>
    <div class="split-2">
      <article>
        <h3>Docs Site</h3>
        <ul>
          <li>Service type: Static Site</li>
          <li>Root Directory: <code>docs</code></li>
          <li>Build: <code>npm install && npm run build</code></li>
          <li>Publish: <code>build</code></li>
        </ul>
      </article>
      <article>
        <h3>Mock Demo Site</h3>
        <ul>
          <li>Service type: Static Site</li>
          <li>Root Directory: <code>mock-demo</code></li>
          <li>Build: <code>npm install && npm run build</code></li>
          <li>Publish: <code>dist</code></li>
        </ul>
      </article>
    </div>
  </section>

  <section class="card attribution">
    <h2>Credits and Attribution</h2>
    <p>
      Core project concept and original implementation: <strong>Lazar</strong> and
      <strong>Team 19234 ByteForce</strong>.
    </p>
    <p>
      Team 19859 maintains this fork for internal competition readiness and public
      collaboration while preserving clear credit to the upstream project.
    </p>
  </section>
</main>

<style>
  .site {
    width: min(1140px, 94vw);
    margin: 26px auto;
    display: grid;
    gap: 16px;
    padding-bottom: 40px;
  }

  .card {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(10, 16, 21, 0.86);
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.28);
  }

  .hero h1 {
    margin: 0 0 8px;
    font-size: clamp(1.55rem, 3vw, 2.3rem);
    letter-spacing: 0.02em;
  }

  h2 {
    margin: 0 0 12px;
    font-size: 1.2rem;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 1rem;
  }

  .eyebrow {
    margin: 0;
    color: #8be4ff;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .hero-actions a {
    border-radius: 999px;
    border: 1px solid rgba(139, 228, 255, 0.46);
    padding: 7px 14px;
    text-decoration: none;
    color: #dff7ff;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .hero-actions a:hover {
    background: rgba(139, 228, 255, 0.13);
    transform: translateY(-1px);
  }

  ul {
    margin: 0;
    padding-left: 20px;
    display: grid;
    gap: 7px;
  }

  p {
    margin: 0;
    color: #d5e7f0;
    line-height: 1.48;
  }

  .muted {
    color: #9cb5c4;
    margin-bottom: 12px;
  }

  .improvements {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .improvements article {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    background: rgba(3, 14, 20, 0.7);
  }

  .gallery {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  figure {
    margin: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.23);
  }

  img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }

  figcaption {
    padding: 8px 10px;
    color: #c9dce6;
    font-size: 0.9rem;
  }

  .split {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  pre {
    margin: 10px 0 0;
    border-radius: 12px;
    background: #090d11;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 12px;
    overflow-x: auto;
  }

  code {
    font-family: "IBM Plex Mono", "Consolas", monospace;
    color: #bfeeff;
  }

  .attribution p + p {
    margin-top: 8px;
  }

  @media (max-width: 940px) {
    .improvements,
    .gallery,
    .split,
    .split-2 {
      grid-template-columns: 1fr;
    }
  }
</style>
