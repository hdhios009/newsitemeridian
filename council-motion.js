(() => {
  'use strict';
  const clamp = (v,lo=0,hi=1) => Math.max(lo,Math.min(hi,v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const mix = (a,b,t) => ({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
  function cubic(c,t) {
    const a=1-t;
    return {x:a*a*a*c[0].x+3*a*a*t*c[1].x+3*a*t*t*c[2].x+t*t*t*c[3].x,y:a*a*a*c[0].y+3*a*a*t*c[1].y+3*a*t*t*c[2].y+t*t*t*c[3].y};
  }
  function partial(c,t) {
    const a=mix(c[0],c[1],t),b=mix(c[1],c[2],t),d=mix(c[2],c[3],t),e=mix(a,b,t),f=mix(b,d,t);
    return [c[0],a,e,mix(e,f,t)];
  }
  function curve(a,b,bend=0) {
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy)),nx=-dy/len,ny=dx/len;
    return [a,{x:a.x+dx*.32+nx*bend,y:a.y+dy*.32+ny*bend},{x:a.x+dx*.68+nx*bend,y:a.y+dy*.68+ny*bend},b];
  }
  function overlaps(a,b,padding=0) {
    return Math.abs(a.x-b.x)<(a.width+b.width)/2+padding && Math.abs(a.y-b.y)<(a.height+b.height)/2+padding;
  }
  function route(a,b,hub,bend=0,obstacles=[]) {
    let offset=0;
    const dx=b.x-a.x,dy=b.y-a.y,length=Math.max(1,Math.hypot(dx,dy));
    const signed=(dx*(hub.y-a.y)-dy*(hub.x-a.x))/length;
    const projection=((hub.x-a.x)*dx+(hub.y-a.y)*dy)/(length*length);
    if(Math.abs(signed)<hub.radius+45&&projection>.05&&projection<.95) {
      offset+=(signed>0?-1:1)*(hub.radius+45-Math.abs(signed))/.75;
    }
    const make=amount=>{
      const path=curve(a,b,amount);
      if(hub.viewportWidth&&hub.viewportHeight)for(const control of path.slice(1,3)) {
        control.x=clamp(control.x,12,hub.viewportWidth-12);
        control.y=clamp(control.y,15,hub.viewportHeight-15);
      }
      return path;
    };
    if(obstacles.length) {
      const blockers=[hub,...obstacles.filter(node=>node!==a&&node!==b)];
      let bestScore=Infinity;
      // Pick one shared route for the bundle; a fifth card is an obstacle too.
      for(const candidate of [offset,offset-80,offset+80,offset-160,offset+160,offset-260,offset+260]) {
        const path=make(candidate);let score=Math.abs(candidate)*.01;
        for(let i=2;i<39;i++) {
          const point={...cubic(path,i/40),width:1,height:1};
          for(const block of blockers)if(overlaps(point,block,23))score+=100;
        }
        if(score<bestScore){bestScore=score;offset=candidate;}
      }
    }
    return make(offset+bend);
  }
  function labelPosition(path,label,obstacles,bounds) {
    if(label.width>bounds.width-20||label.height>bounds.height-24)return null;
    for(const t of [.5,.4,.6,.3,.7,.2,.8,.1,.9]) {
      const point=cubic(path,t),box={...label,x:clamp(point.x,label.width/2+10,bounds.width-label.width/2-10),y:clamp(point.y,label.height/2+12,bounds.height-label.height/2-12)};
      if(!obstacles.some(obstacle=>overlaps(box,obstacle,12)))return box;
    }
    // The same action is already visible in the fixed caption and transcript.
    return null;
  }
  function rgba(hex,alpha) {
    const n=parseInt(hex.replace('#',''),16);
    return `rgba(${n>>16&255},${n>>8&255},${n&255},${clamp(alpha)})`;
  }
  function create(options) {
    const { canvas, stage, core, nodeFor, read, models, reducedMotion = false, isPaused = () => false } = options;
    let ctx;
    try { ctx = canvas.getContext('2d', { alpha: true }); } catch (_) { return null; }
    if (!ctx) return null;
    const colors = new Map([
      ['claude', '#f6ae79'], ['gpt', '#72d6bb'], ['gemini', '#76b8ff'],
      ['deepseek', '#ac9aff'], ['qwen', '#e5a5eb']
    ]);
    let state = read(), history = [], frame = null, width = 0, height = 0, dpr = 1;
    let visible = false, dead = false, focused = null, lastPaint = -Infinity;
    let lastKey = '', lastScene = '', lastPlaying = false, settling = 0;
    let animations = [], completedAt = -Infinity;
    const ease = 'cubic-bezier(.16,1,.3,1)';
    stage.classList.add('motion-ready');
    const sceneKey = s => s.completed ? 'decision' : s.phase;
    function size() {
      const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight), scale = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== width || h !== height || scale !== dpr) {
        width = w; height = h; dpr = scale;
        canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
    }
    function rect(node, root) {
      const r = node.getBoundingClientRect();
      return { x: r.left - root.left + r.width / 2, y: r.top - root.top + r.height / 2, width: r.width, height: r.height };
    }
    function geometry() {
      const root = stage.getBoundingClientRect(), center = rect(core, root), points = new Map();
      state.participants.forEach(id => { const node = nodeFor(id); if (node) points.set(id, rect(node, root)); });
      const mobile = window.matchMedia('(max-width: 900px)').matches;
      const left = center.x - center.width / 2, top = center.y - center.height / 2;
      const nodes = [...points.values()];
      const furthest = nodes.length ? Math.max(...nodes.map(n => mobile ? n.y + n.height / 2 : n.x + n.width / 2)) : 0;
      const junction = mobile
        ? { x: width / 2, y: furthest + Math.max(30, (top - furthest) * .48) }
        : { x: furthest + Math.max(24, (left - furthest) * .48), y: height * .5 };
      const targets = [...core.querySelectorAll('[data-candidate]')].map(node => ({ box: rect(node, root), selected: node.dataset.selected === 'true' || node.dataset.preferred === 'true' }));
      if (!targets.length) {
        const target = core.querySelector('.proposal-sheet,.argument-counter,.decision-choice') || core;
        targets.push({ box: rect(target, root), selected: state.phase === 'synthesis' });
      }
      return { center, points, junction, targets, mobile };
    }
    function line(path, paint, weight = 1, alpha = 1) {
      ctx.globalAlpha = clamp(alpha); ctx.strokeStyle = paint; ctx.lineWidth = weight; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
      ctx.bezierCurveTo(path[1].x, path[1].y, path[2].x, path[2].y, path[3].x, path[3].y); ctx.stroke(); ctx.globalAlpha = 1;
    }
    function gradient(path, a, b) {
      const g = ctx.createLinearGradient(path[0].x, path[0].y, path[3].x, path[3].y);
      g.addColorStop(0, a); g.addColorStop(1, b); return g;
    }
    function glow(point, radius, color, alpha) {
      if (radius <= 0) return;
      const g = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      g.addColorStop(0, rgba(color, alpha)); g.addColorStop(.3, rgba(color, alpha * .25)); g.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = g; ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
    }
    function spark(path, progress, color, alpha, radius = 1.6) {
      const p = clamp(progress);
      for (let tail = 5; tail >= 0; tail--) {
        const position = cubic(path, clamp(p - tail * .018));
        ctx.fillStyle = rgba(color, alpha * (1 - tail / 6));
        ctx.beginPath(); ctx.arc(position.x, position.y, Math.max(.3, radius * (1 - tail * .12)), 0, Math.PI * 2); ctx.fill();
      }
    }
    function flow(a, b, spread, mobile, sway = 0) {
      if (mobile) {
        const dy = b.y - a.y;
        return [a, { x: a.x + spread + sway, y: a.y + dy * .45 }, { x: b.x + spread, y: b.y - dy * .45 }, b];
      }
      const dx = b.x - a.x;
      return [a, { x: a.x + dx * .43, y: a.y + spread + sway }, { x: b.x - dx * .35, y: b.y + spread }, b];
    }
    function draw(now) {
      size(); ctx.clearRect(0, 0, width, height); state = read();
      const { points, junction, targets, mobile } = geometry();
      if (points.size !== state.participants.length) return;
      const p = state.eventProgress, clock = state.index + p, phase = state.phase;
      const gathering = phase === 'synthesis', final = state.completed;
      const finalProgress = clamp((now - completedAt) / 2300);
      const lanes = mobile ? 12 : 24;
      glow(junction, mobile ? 90 : 160, final ? '#bfdfff' : '#819acd', final ? .17 : .07);
      const ports = new Map();
      state.participants.forEach((id, index) => {
        const box = points.get(id), color = colors.get(id), active = state.event.speaker === id;
        const integrated = state.integrated.includes(id), target = state.event.target === id;
        const port = mobile ? { x: box.x, y: box.y + box.height / 2 + 2 } : { x: box.x + box.width / 2 + 2, y: box.y };
        ports.set(id, port);
        const hot = active || target || focused === id || phase === 'research' || integrated;
        const strength = hot ? .6 : .19;
        const sharedColor = gathering ? '#d3ebff' : color;
        const broad = flow(port, junction, 0, mobile, Math.sin(clock * .75 + index) * 8);
        line(broad, gradient(broad, rgba(color, .1), rgba(sharedColor, .14)), mobile ? 15 : 23, hot ? .85 : .25);
        ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = hot ? 13 : 0;
        line(broad, gradient(broad, rgba(color, .4), rgba(sharedColor, .35)), mobile ? 2.6 : 4, hot ? .75 : .2);
        ctx.restore();
        for (let lane = 0; lane < lanes; lane++) {
          const v = (lane / (lanes - 1) - .5), offset = v * (mobile ? 16 : 26);
          const from = mobile ? { x: port.x + v * 13, y: port.y } : { x: port.x, y: port.y + v * 20 };
          const to = mobile ? { x: junction.x + v * 21, y: junction.y } : { x: junction.x, y: junction.y + v * 23 };
          const sway = Math.sin(clock * .7 + lane * .1 + index * 1.4) * (hot ? 8 : 4);
          const path = flow(from, to, offset, mobile, sway);
          line(path, gradient(path, color, sharedColor), lane % 4 === 0 ? .95 : .52, strength * (.45 + .5 * Math.sin((v + .5) * Math.PI)));
          if (!reducedMotion && hot && lane % 8 === 0) {
            const cycle = final ? clamp(finalProgress * 1.2 - lane * .005) : (clock * .55 + lane * .043 + index * .09) % 1;
            if (!final || finalProgress < 1) spark(path, cycle, color, .85, mobile ? 1.25 : 1.7);
          }
        }
        glow(port, hot ? 20 : 11, color, hot ? .36 : .1);
      });
      // Opposed arguments travel in both directions across the same junction.
      const event = state.event;
      if (event.target && event.target !== 'council' && ports.has(event.speaker) && ports.has(event.target)) {
        const from = ports.get(event.speaker), to = ports.get(event.target);
        const path = mobile
          ? [from, { x: from.x, y: junction.y + 24 }, { x: to.x, y: junction.y + 24 }, to]
          : [from, { x: junction.x + 35, y: from.y }, { x: junction.x + 35, y: to.y }, to];
        const a = colors.get(event.speaker), b = colors.get(event.target);
        line(path, gradient(path, a, b), 13, .035);
        line(path, gradient(path, a, b), 1.5, .65);
        if (!reducedMotion) {
          spark(path, (p * 1.2) % 1, a, .95, 2.5);
          if (p > .32) spark([...path].reverse(), clamp((p - .32) * 1.35), b, .8, 2);
        }
      }
      const outputTargets = mobile ? [{ box: geometry().center, selected: gathering }] : targets;
      const candidateCount = outputTargets.length;
      outputTargets.forEach((item, index) => {
        const box = item.box;
        const end = mobile ? { x: box.x, y: box.y - box.height / 2 - 3 } : { x: box.x - box.width / 2 - 4, y: box.y };
        const selected = item.selected || candidateCount === 1;
        const strength = gathering ? selected ? .76 : .12 : .36;
        const outputColor = gathering ? '#e6f3ff' : ['#9dbced', '#bcb2ef', '#98c7d0'][index % 3];
        for (let lane = 0; lane < lanes; lane++) {
          const v = lane / (lanes - 1) - .5;
          const from = mobile ? { x: junction.x + v * 21, y: junction.y } : { x: junction.x, y: junction.y + v * 23 };
          const dest = mobile ? { x: end.x + v * Math.min(box.width * .7, 75), y: end.y } : { x: end.x, y: end.y + v * Math.min(box.height * .55, 70) };
          const path = flow(from, dest, v * 9, mobile);
          line(path, gradient(path, '#bdd9f8', outputColor), .7, strength);
          if (!reducedMotion && lane % 8 === 0 && (selected || !gathering) && !final) spark(path, (clock * .5 + lane * .035) % 1, outputColor, .75, 1.5);
        }
        glow(end, gathering && selected ? 31 : 17, outputColor, gathering && selected ? .23 : .1);
      });
      const glowRadius = final ? 6 : gathering ? 3.5 + state.integrated.length * .4 : 2.5;
      glow(junction, final ? 37 : 23, '#d9edff', final ? .4 : .22);
      ctx.fillStyle = final ? '#eff9ff' : '#d6e8fa'; ctx.beginPath(); ctx.arc(junction.x, junction.y, glowRadius, 0, Math.PI * 2); ctx.fill();
      const phaseEvents = history.filter(item => item.phase === state.phase);
      const phaseOffset = phaseEvents.findIndex(item => item.index === state.index);
      const activeButton = document.querySelector('.phase-navigation button[aria-pressed=true]');
      if (activeButton && phaseEvents.length) activeButton.style.setProperty('--phase-progress', `${100 * (phaseOffset + p) / phaseEvents.length}%`);
    }
    function active(now) { return !isPaused() && (state.playing || now < settling || (state.completed && now < completedAt + 2400)); }
    function paint(now) {
      frame = null;
      if (dead || !visible || document.hidden) return;
      if (now - lastPaint > (width < 700 ? 1000 / 30 : 1000 / 45) || !active(now)) { draw(now); lastPaint = now; }
      if (!reducedMotion && active(now)) frame = requestAnimationFrame(paint);
    }
    function wake() { if (!dead && visible && !document.hidden && frame === null) frame = requestAnimationFrame(paint); }
    function animate(node, frames, settings = {}) {
      if (reducedMotion || !visible || isPaused() || (!state.playing && !state.completed) || !node || typeof node.animate !== 'function') return null;
      const animation = node.animate(frames, { duration: 700, easing: ease, fill: 'none', ...settings });
      if (!visible || (!state.playing && !state.completed)) animation.pause();
      animations.push(animation); return animation;
    }
    function clean() {
      animations.forEach(animation => animation.cancel()); animations = [];
    }
    function update(next, timeline = []) {
      state = next; history = timeline;
      const key = [state.language, state.scenario, state.participants.join(','), state.index].join(':');
      const changed = key !== lastKey, chapter = sceneKey(state);
      if (changed) {
        clean(); settling = performance.now() + 1600;
        const chapterChanged = chapter !== lastScene;
        const content = core.querySelector('#cinema-content');
        // The words stay fully visible; motion belongs to the objects and their connections.
        if (chapterChanged) animate(content, [{ transform: 'translateX(12px)' }, { transform: 'none' }], { duration: 550 });
        else animate(content, [{ transform: 'translateY(5px)' }, { transform: 'none' }], { duration: 350 });
        if (chapterChanged || state.phase === 'research') {
          core.querySelectorAll('.market-candidate,.comparison-table tbody tr,.selection-card').forEach((node, index) => {
            animate(node, [{ transform: 'translateX(14px)' }, { transform: 'none' }], { duration: 650, delay: index * 65, fill: 'backwards' });
          });
        }
        if (state.phase === 'challenge') {
          animate(core.querySelector('.argument-counter'), [{ transform: 'translateY(12px)' }, { transform: 'none' }], { duration: 550 });
        }
        if (state.phase === 'synthesis' && !state.completed) {
          animate(core.querySelector('.merge-contribution:last-child'), [{ transform: 'translateX(-14px)' }, { transform: 'none' }], { duration: 550 });
        }
        if (state.completed) {
          completedAt = performance.now(); settling = completedAt + 2200;
          core.querySelectorAll('.verdict-block,.verdict-open,.verdict-alternative').forEach((node, index) => {
            animate(node, [{ transform: 'translateY(10px)' }, { transform: 'none' }], { duration: 700, delay: index * 90, fill: 'backwards' });
          });
          animate(core.querySelector('.decision-choice'), [
            { boxShadow: '0 0 0 1px rgba(214,235,255,.5),0 0 40px rgba(141,182,236,.12)' },
            { boxShadow: '0 0 0 1px rgba(214,235,255,0),0 0 40px rgba(141,182,236,0)' }
          ], { duration: 1700 });
        } else completedAt = -Infinity;
        lastKey = key; lastScene = chapter;
      } else if (lastPlaying && !state.playing && !state.completed) {
        animations.forEach(animation => animation.pause()); settling = 0;
      } else if (!lastPlaying && state.playing) animations.forEach(animation => { if (animation.playState === 'paused') animation.play(); });
      if (isPaused()) { clean(); settling = 0; }
      lastPlaying = state.playing; wake();
    }
    function setVisible(value) {
      visible = !!value;
      if (!visible) { if (frame !== null) cancelAnimationFrame(frame); frame = null; animations.forEach(animation => { if (animation.playState === 'running') animation.pause(); }); }
      else { if (state.playing || state.completed) animations.forEach(animation => { if (animation.playState === 'paused') animation.play(); }); wake(); }
    }
    const resized = () => { settling = performance.now() + 500; wake(); };
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resized) : null;
    observer?.observe(stage);
    if (!observer) window.addEventListener('resize', resized);
    function destroy() { dead = true; if (frame !== null) cancelAnimationFrame(frame); clean(); observer?.disconnect(); window.removeEventListener('resize', resized); }
    return { update, setVisible, focus: id => { focused = id; wake(); }, destroy };
  }
  const api={create,cubic,partial,curve,route,overlaps,labelPosition};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else globalThis.CouncilMotion=api;
})();
