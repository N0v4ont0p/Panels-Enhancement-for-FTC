(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const r=(s,e,t)=>Math.min(t,Math.max(e,s)),k=(s,e,t)=>s+(e-s)*t;class x{time=0;heading=Math.PI/6;speed=.82;position={x:72,y:72};graph=Array.from({length:64},(e,t)=>38+Math.sin(t/7)*10);connection="connected";notifications=["Panels mock runtime booted","Loaded profile: FullPanels baseline","Telemetry stream established"];tick(e){const t=r(e/1e3,0,1);this.time+=t,this.updateConnection(),this.updateGraph(),this.updateRobotPose(t),this.updateNotifications()}getSnapshot(){const e=13.05+Math.sin(this.time/4.2)*.16,t=46.5+Math.sin(this.time/5.7)*1.8,i=22+Math.sin(this.time/3.6)*3,n=this.connection==="degraded"?65+Math.sin(this.time/1.8)*8:29+Math.sin(this.time/2.8)*4,o=this.generatePath();return{nowIso:new Date().toISOString(),cycleSeconds:this.time,connection:this.connection,latencyMs:Math.round(n),voltage:e,cpuTempC:t,pingMs:i,telemetry:this.buildTelemetry(e,t),opModes:this.buildOpModes(),widgets:this.buildWidgets(),graphSeries:[...this.graph],fieldPath:o,configurables:this.buildConfigurables(),notifications:[...this.notifications],gamepad:this.buildGamepad()}}updateConnection(){if((Math.sin(this.time/14)+1)/2>.87){this.connection="degraded";return}this.connection="connected"}updateGraph(){const e=38+Math.sin(this.time*1.6)*8+Math.sin(this.time*.53)*4+(this.connection==="degraded"?5:0);this.graph=[...this.graph.slice(1),e]}updateRobotPose(e){const t=Math.sin(this.time/2.4)*.34+Math.sin(this.time/6.8)*.21,i=.72+Math.sin(this.time/2)*.12;this.heading+=t*e,this.speed=k(this.speed,i,.2),this.position.x=r(this.position.x+Math.cos(this.heading)*this.speed,8,136),this.position.y=r(this.position.y+Math.sin(this.heading)*this.speed,8,136)}updateNotifications(){const e=Math.floor(this.time)%20;e===5&&!this.notifications[0].includes("vision")&&this.notifications.unshift("Vision confidence updated: 0.91"),e===10&&!this.notifications[0].includes("loop")&&this.notifications.unshift("Loop watchdog: stable"),e===15&&!this.notifications[0].includes("template")&&this.notifications.unshift("Template autosave complete"),this.notifications=this.notifications.slice(0,6)}generatePath(){const e=[];for(let t=0;t<34;t++){const i=t*.24;e.push({x:r(this.position.x-Math.cos(this.heading+i)*t*.75,0,144),y:r(this.position.y-Math.sin(this.heading+i)*t*.75,0,144)})}return e}buildTelemetry(e,t){const i=this.position.x-72,n=this.position.y-72;return[{key:"Robot State",value:this.connection==="degraded"?"ACTIVE (DEGRADED)":"ACTIVE"},{key:"Pose X",value:`${i.toFixed(1)} in`},{key:"Pose Y",value:`${n.toFixed(1)} in`},{key:"Heading",value:`${(this.heading*180/Math.PI).toFixed(1)} deg`},{key:"Battery",value:`${e.toFixed(2)} V`},{key:"Control Hub Temp",value:`${t.toFixed(1)} C`},{key:"Loop Time",value:`${(18+Math.sin(this.time*1.35)*2.5).toFixed(1)} ms`},{key:"Detected AprilTags",value:`${Math.max(0,Math.round(2+Math.sin(this.time/2.6)*2))}`}]}buildOpModes(){const e=Math.sin(this.time/9)>.82;return[{name:"TeleOp_Main",type:"TeleOp",state:e?"idle":"running"},{name:"TeleOp_DriveOnly",type:"TeleOp",state:"idle"},{name:"Auto_Blue_Left",type:"Autonomous",state:e?"running":"idle"},{name:"Auto_Red_Right",type:"Autonomous",state:"queued"},{name:"Vision_Tuner",type:"TeleOp",state:"idle"}]}buildWidgets(){const e=this.connection==="degraded"?"warning":"ok";return[{name:"Telemetry",plugin:"com.bylazar.telemetry",health:"ok",fps:Math.round(54+Math.sin(this.time*.8)*3)},{name:"Graph",plugin:"com.bylazar.graph",health:"ok",fps:Math.round(47+Math.sin(this.time*.9)*3)},{name:"Field",plugin:"com.bylazar.field",health:"ok",fps:Math.round(58+Math.sin(this.time*.7)*2)},{name:"Gamepad",plugin:"com.bylazar.gamepad",health:e,fps:Math.round(50+Math.sin(this.time*.6)*5)},{name:"Camera Stream",plugin:"com.bylazar.camerastream",health:this.connection==="degraded"?"warning":"ok",fps:Math.round(33+Math.sin(this.time*.8)*6)},{name:"OpMode Control",plugin:"com.bylazar.opmodecontrol",health:"ok",fps:Math.round(59+Math.sin(this.time*.58))}]}buildConfigurables(){const e=this.time;return[{key:"Drive PID kP",value:(.083+Math.sin(e/8)*.002).toFixed(4),changed:!0},{key:"Arm Feedforward",value:(.215+Math.sin(e/6)*.005).toFixed(4),changed:!1},{key:"Intake Power",value:(.76+Math.sin(e/3.2)*.08).toFixed(2),changed:!0},{key:"Vision Threshold",value:(.65+Math.sin(e/5)*.04).toFixed(2),changed:!1}]}buildGamepad(){const e=this.time;return{leftStick:{x:Math.sin(e/1.9)*.8,y:Math.cos(e/2.2)*.76},rightStick:{x:Math.sin(e/2.8)*.7,y:Math.cos(e/3.1)*.62},triggers:{left:r((Math.sin(e/1.7)+1)/2,0,1),right:r((Math.cos(e/2.3)+1)/2,0,1)},buttons:{a:Math.sin(e*1.6)>.85,b:Math.cos(e*1.4)>.9,x:Math.sin(e*1.2)<-.85,y:Math.cos(e*1.1)<-.9,leftBumper:Math.sin(e*.7)>.92,rightBumper:Math.cos(e*.75)>.92}}}}const h=new x;let p=performance.now(),c=!1,d="blue";const y=document.querySelector("#app");if(!y)throw new Error("Missing #app root element");y.innerHTML=`
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Panels mock home">
        <span class="brand-pill">P</span>
        <div>
          <p class="eyebrow">FTC Team 19859</p>
          <h1>Panels Mock Runtime</h1>
        </div>
      </a>
      <div class="status-wrap">
        <span class="badge" id="connection-badge">CONNECTING</span>
        <p class="mono" id="runtime-clock">--</p>
      </div>

      <div class="top-actions">
        <button class="toggle" id="toggle-live">Start Live Mock</button>
        <button class="toggle" id="toggle-theme">Theme: Blue</button>
        <label class="speed">
          Speed
          <input id="speed" type="range" min="0.25" max="1.5" step="0.05" value="0.9" />
        </label>
      </div>
    </header>

    <section class="toolbar card">
      <div class="toolbar-item"><span>Preset</span><strong>Competition Baseline</strong></div>
      <div class="toolbar-item"><span>Profile</span><strong>Full Panels</strong></div>
      <div class="toolbar-item"><span>Runtime</span><strong>Mock Isolated</strong></div>
      <div class="toolbar-item"><span>Mode</span><strong>No Robot Required</strong></div>
    </section>

    <section class="grid">
      <article class="card telemetry-card">
        <h2>Telemetry</h2>
        <div id="telemetry-grid" class="telemetry-grid"></div>
      </article>

      <article class="card opmodes-card">
        <h2>OpModes</h2>
        <ul id="opmodes" class="list"></ul>
      </article>

      <article class="card widgets-card">
        <h2>Widget Health</h2>
        <ul id="widgets" class="list"></ul>
      </article>

      <article class="card graph-card">
        <h2>Graph</h2>
        <svg id="graph" viewBox="0 0 600 200" preserveAspectRatio="none" aria-label="Mock graph"></svg>
      </article>

      <article class="card field-card">
        <h2>Field State</h2>
        <svg id="field" viewBox="0 0 144 144" class="field" aria-label="Mock field"></svg>
      </article>

      <article class="card gamepad-card">
        <h2>Gamepad</h2>
        <div class="sticks">
          <div class="stick" id="left-stick"><span></span></div>
          <div class="stick" id="right-stick"><span></span></div>
        </div>
        <div class="triggers">
          <label>L2 <progress id="left-trigger" max="1" value="0"></progress></label>
          <label>R2 <progress id="right-trigger" max="1" value="0"></progress></label>
        </div>
        <div class="buttons" id="buttons"></div>
      </article>

      <article class="card config-card">
        <h2>Configurables</h2>
        <ul id="configurables" class="list"></ul>
      </article>

      <article class="card camera-card">
        <h2>Camera Stream</h2>
        <div class="camera-frame">
          <div class="scan"></div>
          <p>Mock stream active</p>
          <p class="subtle">Rendered locally with no robot camera input.</p>
        </div>
      </article>

      <article class="card notifications-card">
        <h2>Notifications</h2>
        <ul id="notifications" class="list notifications"></ul>
      </article>
    </section>

    <footer class="card footer">
      <p>High-fidelity mock: Panels-style UX with deterministic data and optional live updates.</p>
      <p class="subtle">Production FTC runtime in library/ and examples/ remains untouched.</p>
    </footer>
  </main>
`;const u=a("connection-badge"),w=a("runtime-clock"),m=a("toggle-live"),g=a("toggle-theme"),$=a("speed"),T=a("telemetry-grid"),P=a("opmodes"),L=a("widgets"),F=a("configurables"),S=a("notifications"),C=a("graph"),I=a("field"),O=a("left-stick"),R=a("right-stick"),G=a("left-trigger"),H=a("right-trigger"),B=a("buttons"),M=()=>{document.body.classList.remove("blue","red"),document.body.classList.add(d)};m.addEventListener("click",()=>{c=!c,m.textContent=c?"Pause Live Mock":"Start Live Mock"});g.addEventListener("click",()=>{d=d==="blue"?"red":"blue",g.textContent=`Theme: ${d==="blue"?"Blue":"Red"}`,M()});const b=()=>{const s=performance.now(),e=s-p;if(p=s,c){const i=Number($.value);h.tick(e*i)}const t=h.getSnapshot();w.textContent=`${t.nowIso} | ${t.latencyMs} ms latency | ${t.pingMs.toFixed(1)} ms ping`,E(t.connection),T.innerHTML=t.telemetry.map(i=>`<p class="key">${i.key}</p><p class="val">${i.value}</p>`).join(""),P.innerHTML=t.opModes.map(i=>`<li><span>${i.name} <small>${i.type}</small></span><span class="state ${i.state}">${i.state}</span></li>`).join(""),L.innerHTML=t.widgets.map(i=>`<li><span>${i.name}</span><span class="pill ${i.health}">${i.health}</span><span class="mono">${i.fps} fps</span></li>`).join(""),F.innerHTML=t.configurables.map(i=>`<li><span>${i.key}</span><span class="pill ${i.changed?"warning":"ok"}">${i.changed?"changed":"stable"}</span><span class="mono">${i.value}</span></li>`).join(""),S.innerHTML=t.notifications.map(i=>`<li><span>${i}</span><span class="mono">${t.cycleSeconds.toFixed(1)}s</span></li>`).join(""),N(t.graphSeries),j(t.fieldPath),f(O,t.gamepad.leftStick),f(R,t.gamepad.rightStick),G.value=t.gamepad.triggers.left,H.value=t.gamepad.triggers.right,B.innerHTML=Object.entries(t.gamepad.buttons).map(([i,n])=>`<span class="button ${n?"active":""}">${i}</span>`).join("")},A=setInterval(b,220);b();M();window.addEventListener("beforeunload",()=>{clearInterval(A)});function a(s){const e=document.getElementById(s);if(!e)throw new Error(`Missing required element #${s}`);return e}function E(s){u.className=`badge ${s}`,u.textContent=s.toUpperCase()}function N(s){const e=Math.max(...s),t=Math.min(...s),i=s.map((n,o)=>{const l=o/(s.length-1)*600,v=180-(n-t)/(e-t||1)*150;return`${l.toFixed(2)},${v.toFixed(2)}`}).join(" ");C.innerHTML=`
    <defs>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(0, 161, 255, 0.85)"/>
        <stop offset="100%" stop-color="rgba(0, 161, 255, 0)"/>
      </linearGradient>
    </defs>
    <polyline fill="none" stroke="var(--accent)" stroke-width="3" points="${i}" />
  `}function j(s){const e=s.map(i=>`${i.x.toFixed(2)},${i.y.toFixed(2)}`).join(" "),t=s[0];I.innerHTML=`
    <rect x="0" y="0" width="144" height="144" fill="#0d141f" rx="4" />
    <rect x="6" y="6" width="132" height="132" fill="none" stroke="#2f4b69" stroke-dasharray="3 2" />
    <line x1="72" y1="6" x2="72" y2="138" stroke="#2f4b69" stroke-width="1" />
    <line x1="6" y1="72" x2="138" y2="72" stroke="#2f4b69" stroke-width="1" />
    <polyline points="${e}" fill="none" stroke="var(--accent-soft)" stroke-width="1.8" />
    <circle cx="${t.x.toFixed(2)}" cy="${t.y.toFixed(2)}" r="3" fill="var(--accent)" />
  `}function f(s,e){const t=s.querySelector("span");if(!t)return;const i=e.x*13,n=e.y*13;t.style.transform=`translate(${i}px, ${n}px)`}
