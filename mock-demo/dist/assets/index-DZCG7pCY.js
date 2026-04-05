(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const l=(t,e,n)=>Math.min(n,Math.max(e,t)),s=(t,e)=>t+Math.random()*(e-t),c=(t=.5)=>Math.random()<t;class f{heading=0;speed=.7;position={x:72,y:72};graph=Array.from({length:48},(e,n)=>42+Math.sin(n/6)*12);connection="connected";getSnapshot(){this.updateConnection(),this.updateGraph(),this.updateRobotPose();const e=13.1+Math.sin(Date.now()/3700)*.35,n=47+Math.sin(Date.now()/2200)*3.8,o=this.generatePath();return{nowIso:new Date().toISOString(),connection:this.connection,latencyMs:this.connection==="offline"?0:Math.round(s(17,86)),voltage:e,cpuTempC:n,telemetry:this.buildTelemetry(e,n),opModes:this.buildOpModes(),widgets:this.buildWidgets(),graphSeries:[...this.graph],fieldPath:o,gamepad:this.buildGamepad()}}updateConnection(){const e=Math.random();if(e>.985){this.connection="offline";return}if(e>.93){this.connection="degraded";return}this.connection="connected"}updateGraph(){const e=44+Math.sin(Date.now()/1400)*15+s(-2.2,2.2);this.graph=[...this.graph.slice(1),e]}updateRobotPose(){this.heading+=s(-.22,.22),this.speed=l(this.speed+s(-.18,.18),.2,1.2),this.position.x=l(this.position.x+Math.cos(this.heading)*this.speed,6,138),this.position.y=l(this.position.y+Math.sin(this.heading)*this.speed,6,138)}generatePath(){const e=[];for(let n=0;n<26;n++){const o=n*.35;e.push({x:l(this.position.x+Math.cos(this.heading+o)*n*.8,0,144),y:l(this.position.y+Math.sin(this.heading+o)*n*.8,0,144)})}return e}buildTelemetry(e,n){const o=this.position.x-72,i=this.position.y-72;return[{key:"Robot State",value:this.connection==="offline"?"DISCONNECTED":"ACTIVE"},{key:"Pose X",value:`${o.toFixed(1)} in`},{key:"Pose Y",value:`${i.toFixed(1)} in`},{key:"Heading",value:`${(this.heading*180/Math.PI).toFixed(1)} deg`},{key:"Battery",value:`${e.toFixed(2)} V`},{key:"Control Hub Temp",value:`${n.toFixed(1)} C`},{key:"Loop Time",value:`${Math.round(s(15,34))} ms`},{key:"Detected AprilTags",value:`${Math.round(s(0,6))}`}]}buildOpModes(){const e=this.connection!=="offline"&&c(.15);return[{name:"TeleOp_Main",type:"TeleOp",state:e?"idle":"running"},{name:"TeleOp_DriveOnly",type:"TeleOp",state:"queued"},{name:"Auto_Blue_Left",type:"Autonomous",state:e?"running":"idle"},{name:"Auto_Red_Right",type:"Autonomous",state:"idle"},{name:"Vision_Tuner",type:"TeleOp",state:"idle"}]}buildWidgets(){return[{name:"Telemetry",plugin:"com.bylazar.telemetry",health:"ok",fps:Math.round(s(42,60))},{name:"Graph",plugin:"com.bylazar.graph",health:"ok",fps:Math.round(s(35,55))},{name:"Field",plugin:"com.bylazar.field",health:"ok",fps:Math.round(s(40,60))},{name:"Gamepad",plugin:"com.bylazar.gamepad",health:this.connection==="degraded"?"warning":"ok",fps:Math.round(s(28,60))},{name:"Camera Stream",plugin:"com.bylazar.camerastream",health:this.connection==="offline"?"error":"warning",fps:Math.round(s(20,45))},{name:"OpMode Control",plugin:"com.bylazar.opmodecontrol",health:"ok",fps:Math.round(s(45,60))}]}buildGamepad(){return{leftStick:{x:s(-1,1),y:s(-1,1)},rightStick:{x:s(-1,1),y:s(-1,1)},triggers:{left:l(s(0,1),0,1),right:l(s(0,1),0,1)},buttons:{a:c(.2),b:c(.12),x:c(.16),y:c(.1),leftBumper:c(.14),rightBumper:c(.14)}}}}const y=new f,u=document.querySelector("#app");if(!u)throw new Error("Missing #app root element");u.innerHTML=`
  <main class="shell">
    <header class="topbar card">
      <div>
        <p class="eyebrow">FTC Team 19859</p>
        <h1>Panels Mock Demo</h1>
        <p class="subtle">Standalone UI sandbox for frontend testing without robot hardware.</p>
      </div>
      <div class="status-wrap">
        <span class="badge" id="connection-badge">Connecting</span>
        <p class="mono" id="runtime-clock">--</p>
      </div>
    </header>

    <section class="grid">
      <article class="card telemetry-card">
        <h2>Telemetry</h2>
        <div id="telemetry-grid" class="telemetry-grid"></div>
      </article>

      <article class="card">
        <h2>OpModes</h2>
        <ul id="opmodes" class="list"></ul>
      </article>

      <article class="card">
        <h2>Widget Health</h2>
        <ul id="widgets" class="list"></ul>
      </article>

      <article class="card graph-card">
        <h2>Graph (Loop Metric)</h2>
        <svg id="graph" viewBox="0 0 600 200" preserveAspectRatio="none" aria-label="Mock graph"></svg>
      </article>

      <article class="card">
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
    </section>

    <footer class="card footer">
      <p>This demo uses generated mock services for telemetry, opmodes, widgets, graph, field, and gamepad state.</p>
      <p class="subtle">Production FTC runtime in library/ and examples/ is untouched.</p>
    </footer>
  </main>
`;const p=r("connection-badge"),b=r("runtime-clock"),x=r("telemetry-grid"),M=r("opmodes"),v=r("widgets"),k=r("graph"),w=r("field"),$=r("left-stick"),T=r("right-stick"),S=r("left-trigger"),O=r("right-trigger"),C=r("buttons"),g=()=>{const t=y.getSnapshot();b.textContent=`${t.nowIso} | ${t.latencyMs} ms`,L(t.connection),x.innerHTML=t.telemetry.map(e=>`<p class="key">${e.key}</p><p class="val">${e.value}</p>`).join(""),M.innerHTML=t.opModes.map(e=>`<li><span>${e.name} <small>${e.type}</small></span><span class="state ${e.state}">${e.state}</span></li>`).join(""),v.innerHTML=t.widgets.map(e=>`<li><span>${e.name}</span><span class="pill ${e.health}">${e.health}</span><span class="mono">${e.fps} fps</span></li>`).join(""),P(t.graphSeries),I(t.fieldPath),h($,t.gamepad.leftStick),h(T,t.gamepad.rightStick),S.value=t.gamepad.triggers.left,O.value=t.gamepad.triggers.right,C.innerHTML=Object.entries(t.gamepad.buttons).map(([e,n])=>`<span class="button ${n?"active":""}">${e}</span>`).join("")},F=setInterval(g,450);g();window.addEventListener("beforeunload",()=>{clearInterval(F)});function r(t){const e=document.getElementById(t);if(!e)throw new Error(`Missing required element #${t}`);return e}function L(t){p.className=`badge ${t}`,p.textContent=t.toUpperCase()}function P(t){const e=Math.max(...t),n=Math.min(...t),o=t.map((i,a)=>{const d=a/(t.length-1)*600,m=180-(i-n)/(e-n||1)*150;return`${d.toFixed(2)},${m.toFixed(2)}`}).join(" ");k.innerHTML=`
    <defs>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(243, 179, 91, 0.8)"/>
        <stop offset="100%" stop-color="rgba(243, 179, 91, 0)"/>
      </linearGradient>
    </defs>
    <polyline fill="none" stroke="#f3b35b" stroke-width="3" points="${o}" />
  `}function I(t){const e=t.map(o=>`${o.x.toFixed(2)},${o.y.toFixed(2)}`).join(" "),n=t[0];w.innerHTML=`
    <rect x="0" y="0" width="144" height="144" fill="#0f1414" rx="4" />
    <rect x="6" y="6" width="132" height="132" fill="none" stroke="#35565a" stroke-dasharray="3 2" />
    <line x1="72" y1="6" x2="72" y2="138" stroke="#274247" stroke-width="1" />
    <line x1="6" y1="72" x2="138" y2="72" stroke="#274247" stroke-width="1" />
    <polyline points="${e}" fill="none" stroke="#80f2ff" stroke-width="1.6" />
    <circle cx="${n.x.toFixed(2)}" cy="${n.y.toFixed(2)}" r="3" fill="#f3b35b" />
  `}function h(t,e){const n=t.querySelector("span");if(!n)return;const o=e.x*13,i=e.y*13;n.style.transform=`translate(${o}px, ${i}px)`}
