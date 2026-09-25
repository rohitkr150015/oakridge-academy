/* Self-contained school discovery UI. Curated local ideas; no external AI calls. */
(() => {
  const themes = {
    heritage: { eyebrow: 'THE HERITAGE DISCOVERY STUDIO', title: 'A little curiosity.<br><em>An extraordinary orbit.</em>', intro: 'Big ideas begin with a small “what if”. Follow a spark and see where your imagination takes you.', object: 'compass', label: 'A world of possibility', campus: '/campus' },
    bloomfield: { eyebrow: 'THE BLOOMFIELD WONDER LAB', title: 'Plant a little wonder.<br><em>Watch an idea bloom.</em>', intro: 'Every interest is a seed of something wonderful. Pick what makes you curious and grow a little adventure.', object: 'flower', label: 'Room for every kind of mind', campus: '/campus' },
    northford: { eyebrow: 'THE NORTHFORD IDEA LAB', title: 'Small sparks.<br><em>New dimensions.</em>', intro: 'Step into a space for the not-yet-imagined. Choose a curiosity and discover a new way to look at the world.', object: 'prism', label: 'Your next idea starts here', campus: 'campus.html' },
    oakridge: { eyebrow: 'THE OAKRIDGE WONDER ROOM', title: 'Turn a new page.<br><em>Find your kind of magic.</em>', intro: 'Some adventures start with a question. Open a little window into the things you could make, explore and become.', object: 'book', label: 'A story only you can write', campus: 'campus.html' },
  };
  const ideas = [
    { label: 'Invent', icon: '✧', colour: '#92d9ef', title: 'What if light could tell a story?', subtitle: 'Your spark: the everyday inventor', steps: ['Notice how shadows change through the day.', 'Sketch a tiny theatre from a recycled box.', 'Tell a one-minute story with paper silhouettes.'], tag: 'SCIENCE × STORYTELLING', word: 'Imagine', note: 'A shadow theatre', time: '20-minute idea' },
    { label: 'Create', icon: '✺', colour: '#f7ba9c', title: 'Could a colour have a sound?', subtitle: 'Your spark: the creative explorer', steps: ['Choose three colours that match your mood.', 'Give each colour a clap, tap or hum.', 'Make a small artwork with its own soundtrack.'], tag: 'ART × MUSIC', word: 'Create', note: 'Colour you can hear', time: '15-minute idea' },
    { label: 'Explore', icon: '❋', colour: '#c4dda2', title: 'A whole world in a single leaf.', subtitle: 'Your spark: the nature detective', steps: ['Find a fallen leaf and study its tiny patterns.', 'Draw the pathways you notice in its veins.', 'Imagine a neighbourhood shaped like your leaf.'], tag: 'NATURE × DESIGN', word: 'Discover', note: 'A pocket-sized world', time: '15-minute idea' },
    { label: 'Dream', icon: '✦', colour: '#d6c1f1', title: 'Design a school among the stars.', subtitle: 'Your spark: the future thinker', steps: ['Imagine a classroom with a view of the Moon.', 'Draw a place to learn, play and grow food.', 'Explain one invention that makes life there better.'], tag: 'SPACE × IMAGINATION', word: 'Dream', note: 'Beyond the ordinary', time: '20-minute idea' },
  ];
  class SchoolDiscovery extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) { this.observe(); return; }
      this.theme = themes[this.getAttribute('theme')] || themes.heritage;
      this.index = 0;
      this.paused = false;
      this.attachShadow({ mode: 'open' });
      const t = this.theme;
      this.shadowRoot.innerHTML = `<style>
        :host{display:block;--bg:#11273c;--deep:#091927;--accent:#eed2a0;--text:#f7f3e9;--muted:#c1cbd0;--spark:#92d9ef;max-width:1320px;margin:64px auto;padding:0 28px;box-sizing:border-box;container-type:inline-size;color:var(--text);font-family:Inter,Arial,sans-serif;scroll-margin-top:120px}
        :host([theme=bloomfield]){--bg:#163f33;--deep:#0c2d24;--accent:#f6d875;--muted:#c6d8cd;font-family:Manrope,Arial,sans-serif}
        :host([theme=northford]){--bg:#183b47;--deep:#0b232e;--accent:#b0e0e5;--muted:#c0d4da}
        :host([theme=oakridge]){--bg:#652d40;--deep:#3c1e2b;--accent:#ffd5ad;--muted:#efdad7}
        *{box-sizing:border-box}button,a{-webkit-tap-highlight-color:transparent}button{font:inherit;cursor:pointer}a{color:inherit}button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:5px}button:disabled{cursor:default}h2,h3,p{margin:0}.studio{position:relative;isolation:isolate;background:var(--bg);border-radius:24px;overflow:hidden;border:1px solid #ffffff1c;box-shadow:0 24px 70px #102b3314}.studio::before{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 80% 5%,#ffffff0e,transparent 55%)}
        .top{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 36px;border-bottom:1px solid #ffffff18}.eyebrow{font-size:10px;letter-spacing:2.2px;font-weight:700;color:var(--accent);line-height:1.6}.live{display:inline-flex;gap:9px;align-items:center;white-space:nowrap;font-size:11px;color:var(--muted)}.live i{width:6px;height:6px;background:var(--accent);border-radius:50%;box-shadow:0 0 15px var(--accent)}
        .layout{display:grid;grid-template-columns:1fr 1.05fr}.copy{padding:44px 0 32px 36px;position:relative;z-index:2}h2{font:400 clamp(32px,3.6vw,48px)/1.1 Georgia,serif;letter-spacing:-1.2px;color:var(--text)}h2 em{color:var(--accent);font-weight:400}.intro{max-width:405px;font-size:14px;line-height:1.85;color:var(--muted);margin:22px 0 24px}.prompt{font-size:11px;letter-spacing:.7px;margin-bottom:12px;color:var(--text)}.choices{display:flex;flex-wrap:wrap;gap:8px}.choice{display:flex;gap:8px;align-items:center;border:1px solid #ffffff35;background:#ffffff06;color:var(--text);padding:10px 13px;border-radius:24px;font-size:12px;min-height:42px;transition:background .2s,transform .2s}.choice:hover{background:#ffffff15;transform:translateY(-2px)}.choice[aria-pressed=true]{color:var(--deep);background:var(--accent);border-color:var(--accent)}.choice span{font-size:18px;line-height:1}.actions{display:flex;align-items:center;gap:20px;margin-top:22px;flex-wrap:wrap}.surprise{padding:10px 0;border:0;background:none;color:var(--accent);font-size:12px;text-decoration:underline;text-underline-offset:5px}.campus{font-size:12px;text-decoration:none;color:var(--muted)}.campus:hover{color:white}.disclaimer{font-size:10px;color:var(--muted);line-height:1.6;margin-top:22px}
        .visual{position:relative;min-height:405px;display:grid;place-items:center;perspective:900px;overflow:hidden;touch-action:pan-y;background:radial-gradient(ellipse at center,color-mix(in srgb,var(--spark) 11%,transparent),transparent 62%)}.grid{position:absolute;width:500px;height:500px;background-image:linear-gradient(#ffffff0a 1px,transparent 1px),linear-gradient(90deg,#ffffff0a 1px,transparent 1px);background-size:38px 38px;transform:rotateX(65deg) rotateZ(-30deg);mask-image:radial-gradient(ellipse,black,transparent 68%);bottom:-185px}.universe{width:330px;height:330px;position:relative;transform-style:preserve-3d;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .35s ease-out}.halo{position:absolute;inset:30px;border:1px solid #ffffff26;border-radius:50%;transform:rotateX(64deg) rotateZ(-24deg);box-shadow:0 0 35px #ffffff04,inset 0 0 20px #ffffff03}.halo.two{inset:4px;transform:rotateX(35deg) rotateY(58deg)}.halo.three{inset:61px;transform:rotateY(65deg) rotateZ(20deg);border-style:dashed;border-color:#ffffff35}.orbit{position:absolute;inset:20px;animation:orbit 28s linear infinite;transform-style:preserve-3d}.star{position:absolute;width:8px;height:8px;top:35px;left:55px;border-radius:50%;background:var(--spark);box-shadow:0 0 22px var(--spark)}.star.second{top:auto;left:auto;right:45px;bottom:32px;width:5px;height:5px;background:var(--accent)}
        .object{position:absolute;inset:85px;transform-style:preserve-3d;animation:float 7s ease-in-out infinite}.core{position:absolute;inset:21px;display:grid;place-items:center;border-radius:50%;border:1px solid #ffffff65;background:radial-gradient(circle at 30% 20%,#ffffff70,transparent 38%),radial-gradient(circle at 60% 70%,var(--spark),var(--bg) 85%);box-shadow:inset -12px -14px 26px #0005,inset 5px 8px 18px #fff3,0 0 65px color-mix(in srgb,var(--spark) 22%,transparent);color:var(--text);font:44px Georgia,serif;z-index:3;transform:translateZ(40px)}.core::after{content:'';position:absolute;inset:-11px;border:1px solid var(--accent);border-radius:50%;opacity:.6;transform:rotateY(45deg)}.petal{position:absolute;inset:20px;border:1px solid #ffffff65;border-radius:12px;transform:rotateY(45deg) rotateX(55deg) rotateZ(calc(var(--i)*60deg));background:linear-gradient(135deg,#ffffff12,#ffffff03);box-shadow:inset 0 0 18px #ffffff10}.flower .petal{border-radius:65% 65% 40% 40%;background:linear-gradient(135deg,#f5dc9299,#b4d49b30);width:64px;height:110px;left:48px;top:-12px;transform-origin:50% 86%;transform:rotateZ(calc(var(--i)*60deg)) rotateX(25deg)}.flower .core{inset:48px;background:radial-gradient(circle at 35% 25%,#fff2ab,#b17a2c);font-size:25px}.flower .core::after{display:none}.prism .core{border-radius:18px;transform:rotate(-30deg) rotateY(25deg) rotateX(20deg);background:linear-gradient(140deg,#e2ffffcc,#64c2d470 45%,#7387cb88);font-size:48px}.prism .core::after{border-radius:12px;transform:translate(18px,15px);inset:-5px}.prism .petal{border-radius:8px;inset:0;transform:rotateY(45deg) rotateX(55deg) rotateZ(calc(var(--i)*30deg));border-color:#a6f6ff45}.book .core{border-radius:4px 12px 12px 4px;inset:15px 12px 15px 76px;background:linear-gradient(100deg,#c5b381,#fff4d5);transform:rotateY(-30deg) rotateZ(-8deg);color:#6b5633;box-shadow:4px 4px 0 #b9a477,8px 8px 0 #d9c59a}.book .core::after{inset:0;transform:translateX(-100%) rotateY(30deg);border:0;border-radius:12px 4px 4px 12px;background:repeating-linear-gradient(0deg,transparent 0 17px,#a28d5833 18px 19px),linear-gradient(90deg,#fff4d5,#dbc697);opacity:1}.book .petal{display:none}.book .object{transform:rotateX(12deg)}
        .float-label{position:absolute;z-index:4;display:flex;align-items:center;gap:9px;border:1px solid #ffffff30;background:var(--deep);box-shadow:0 8px 30px #0002;border-radius:10px;padding:12px 14px;font-size:11px;animation:float 8s ease-in-out infinite;white-space:nowrap}.label-one{top:42px;right:8px;transform:rotate(7deg)}.label-two{bottom:35px;left:0;animation-delay:-3s}.float-label b{font-weight:400;color:var(--accent);font-size:18px}.caption{position:absolute;bottom:19px;left:20px;right:20px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:10px;letter-spacing:.4px;color:var(--muted)}.pause{border:1px solid #ffffff40;background:transparent;color:var(--text);border-radius:20px;padding:8px 12px;font-size:10px;min-height:34px}.pause:disabled{opacity:.65}
        .result{margin:0 22px 22px;padding:23px 25px;border-radius:14px;background:var(--deep);border:1px solid #ffffff16;display:grid;grid-template-columns:1fr 1.2fr;gap:28px}.result .tag{font-size:9px;letter-spacing:1.8px;color:var(--accent);display:block;margin-bottom:12px}.result h3{font:400 24px/1.25 Georgia,serif;color:var(--text);margin-bottom:10px}.result p{font-size:11px;line-height:1.6;color:var(--muted)}ol{list-style:none;padding:0;margin:0;display:grid;gap:9px;counter-reset:steps}li{counter-increment:steps;display:flex;gap:12px;color:var(--muted);font-size:12px;line-height:1.65}li::before{content:'0' counter(steps);color:var(--accent);font-size:10px;padding-top:2px}.result.changed{animation:arrive .35s ease-out}
        @keyframes orbit{to{transform:rotateZ(360deg)}}@keyframes float{0%,100%{translate:0 0}50%{translate:0 -12px}}@keyframes arrive{from{opacity:.5;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        :host([still]) *, :host([offscreen]) *{animation-play-state:paused!important}:host([still]) .universe{transform:none!important;transition:none}:host([still]) .choice{transition:none}:host([still]) .result{animation:none!important}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.universe{transform:none!important}}
        @container(max-width:760px){.layout{grid-template-columns:1fr}.copy{padding:30px 26px 0}.intro{max-width:100%}.visual{min-height:350px}.top{padding:22px 26px}.result{grid-template-columns:1fr;gap:18px}.disclaimer{margin-top:14px}h2{font-size:38px}.live{display:none}}
        @media(max-width:480px){:host{padding:0 14px;margin:36px auto}.studio{border-radius:18px}.copy{padding:28px 20px 0}.top{padding:18px 20px}.eyebrow{font-size:9px;letter-spacing:1.5px}h2{font-size:33px}.intro{font-size:13px}.choice{font-size:11px;padding:9px 11px}.result{margin:0 12px 12px;padding:20px}.universe{scale:.85}.visual{min-height:320px}.caption{font-size:9px;left:16px;right:16px}.float-label{font-size:11px}.result h3{font-size:23px}}
      </style>
      <section class="studio" aria-labelledby="studio-title">
        <div class="top"><span class="eyebrow">${t.eyebrow}</span><span class="live"><i></i> A playground for possibility</span></div>
        <div class="layout"><div class="copy"><h2 id="studio-title">${t.title}</h2><p class="intro">${t.intro}</p><p class="prompt" id="choose-label">What sparks your curiosity?</p>
          <div class="choices" role="group" aria-labelledby="choose-label">${ideas.map((idea,i)=>`<button class="choice" data-choice="${i}" aria-pressed="${i===0}"><span aria-hidden="true">${idea.icon}</span>${idea.label}</button>`).join('')}</div>
          <div class="actions"><button class="surprise">✦ Surprise me</button><a class="campus" href="${t.campus}">Explore our campus ↗</a></div><p class="disclaimer">A little inspiration, chosen by you. Curated ideas, no live AI.</p>
        </div><div class="visual"><div class="grid" aria-hidden="true"></div><div class="universe" aria-hidden="true"><div class="halo"></div><div class="halo two"></div><div class="halo three"></div><div class="orbit"><i class="star"></i><i class="star second"></i></div><div class="object ${t.object}">${Array.from({length:6},(_,i)=>`<i class="petal" style="--i:${i}"></i>`).join('')}<div class="core">✧</div></div><div class="float-label label-one"><b>✦</b><span class="idea-word">Imagine</span></div><div class="float-label label-two"><b>↗</b><span class="idea-note">A shadow theatre</span></div></div><div class="caption"><span>${t.label}</span><button class="pause" aria-pressed="false">Pause motion</button></div></div></div>
        <div class="result" role="status" aria-live="polite" aria-atomic="true"></div>
      </section>`;
      this.root = this.shadowRoot;
      this.root.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => this.select(Number(button.dataset.choice), true)));
      this.root.querySelector('.surprise').addEventListener('click', () => this.select((this.index + 1 + Math.floor(Math.random()*3)) % ideas.length, true));
      this.root.querySelector('.pause').addEventListener('click', () => { this.paused = !this.paused; this.syncMotion(); });
      const visual = this.root.querySelector('.visual');
      visual.addEventListener('pointermove', e => {
        if (this.hasAttribute('still') || e.pointerType !== 'mouse') return;
        const rect = visual.getBoundingClientRect();
        this.root.querySelector('.universe').style.cssText = `--rx:${-(e.clientY-rect.top-rect.height/2)/28}deg;--ry:${(e.clientX-rect.left-rect.width/2)/28}deg`;
      });
      visual.addEventListener('pointerleave', () => this.root.querySelector('.universe').removeAttribute('style'));
      this.select(0, false);
      this.observe();
    }
    select(index, animate) {
      this.index = index;
      const idea = ideas[index];
      this.style.setProperty('--spark', idea.colour);
      this.root.querySelectorAll('[data-choice]').forEach((button,i) => button.setAttribute('aria-pressed', String(i===index)));
      this.root.querySelector('.core').textContent = idea.icon;
      this.root.querySelector('.idea-word').textContent = idea.word;
      this.root.querySelector('.idea-note').textContent = idea.note;
      const result = this.root.querySelector('.result');
      result.innerHTML = `<div><span class="tag">${idea.tag}</span><h3>${idea.title}</h3><p>${idea.subtitle} · ${idea.time}</p></div><ol>${idea.steps.map(step=>`<li>${step}</li>`).join('')}</ol>`;
      result.classList.remove('changed');
      if (animate) { void result.offsetWidth; result.classList.add('changed'); }
    }
    observe() {
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.motionListener = () => this.syncMotion();
      this.media.addEventListener('change', this.motionListener);
      this.bodyObserver = new MutationObserver(this.motionListener);
      this.bodyObserver.observe(document.body, {attributes:true,attributeFilter:['class']});
      this.visibilityListener = () => this.setAttributeState('offscreen', document.hidden || !this.inView);
      document.addEventListener('visibilitychange', this.visibilityListener);
      this.intersection = new IntersectionObserver(entries => {this.inView=entries[0].isIntersecting;this.visibilityListener();});
      this.intersection.observe(this);
      this.syncMotion();
    }
    setAttributeState(name, state) { this.toggleAttribute(name, Boolean(state)); }
    syncMotion() {
      const forced = this.media.matches || document.body.classList.contains('motion-off');
      this.setAttributeState('still', this.paused || forced);
      const button = this.root.querySelector('.pause');
      button.textContent = forced ? 'Motion reduced' : this.paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(this.paused || forced));
      button.disabled = forced;
    }
    disconnectedCallback() {
      this.media?.removeEventListener('change', this.motionListener);
      this.bodyObserver?.disconnect();
      this.intersection?.disconnect();
      document.removeEventListener('visibilitychange', this.visibilityListener);
    }
  }
  if (!customElements.get('school-discovery')) customElements.define('school-discovery', SchoolDiscovery);
})();
