(() => {
  'use strict';
  const E = globalThis.CouncilEngine;
  const byId = id => document.getElementById(id);
  const model = id => E.models.find(item => item.id === id);
  const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
  const phaseButtons = [...document.querySelectorAll('button[data-phase]')];
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const nodeViews = new Map(), rosterButtons = new Map(), modelButtons = new Map(), connectionPaths = new Map();
  let overlayOpen = false;
  let boardKey = '', lastEventKey = '', toastTimer, motion = null, autoplay = null, stageVisible = false;
  let currentLanguage = 'en';
  try { if (localStorage.getItem('meridian-language') === 'ru') currentLanguage = 'ru'; } catch (_) {}
  const staticBindings = collectStaticBindings();
  const controller = E.createController({ config: { language: currentLanguage }, onChange: render });
  const t = (key, values) => E.translate(currentLanguage, key, values);

  function collectStaticBindings() {
    const bindings = [], walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script, style')) continue;
      const key = node.textContent.trim();
      if (Object.hasOwn(E.content.messages, key)) {
        const prefix = node.textContent.match(/^\s*/)[0], suffix = node.textContent.match(/\s*$/)[0];
        const textNode = walker.currentNode;
        bindings.push(language => { textNode.textContent = prefix + E.translate(language, key) + suffix; });
      }
    }
    document.querySelectorAll('[aria-label], [title]').forEach(element => {
      for (const attribute of ['aria-label', 'title']) {
        const key = element.getAttribute(attribute);
        if (key && Object.hasOwn(E.content.messages, key)) bindings.push(language => element.setAttribute(attribute, E.translate(language, key)));
      }
    });
    return bindings;
  }
  function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    staticBindings.forEach(apply => apply(language));
    document.title = t('Meridian Council — A meeting of minds.');
    document.querySelector('meta[name="description"]').content = t('Meet Meridian Council. Bring different AI models together to propose, challenge, and refine an idea. Explore the interactive product preview.');
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.dispatchEvent(new CustomEvent('meridian:language', {detail:language}));
    try { localStorage.setItem('meridian-language', language); } catch (_) {}
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function styled(node, person) {
    node.style.setProperty('--color', person.color);
    node.style.setProperty('--tint', person.tint);
    return node;
  }
  function avatar(person, className = 'node-avatar') {
    const node = styled(el('span', className), person);
    node.dataset.brand = person.id;
    const img = el('img', 'model-logo');
    img.src = person.logo; img.alt = ''; img.width = 32; img.height = 32;
    node.append(img);
    node.setAttribute('aria-hidden', 'true');
    return node;
  }
  function notify(message) {
    clearTimeout(toastTimer);
    byId('toast').textContent = message;
    byId('toast').classList.add('show');
    toastTimer = setTimeout(() => byId('toast').classList.remove('show'), 3200);
  }
  function createSelectors() {
    E.models.forEach(person => {
      const chip = styled(el('button', 'roster-chip'), person);
      chip.type = 'button'; chip.dataset.model = person.id;
      const selectedMark = el('span', 'roster-state');
      selectedMark.setAttribute('aria-hidden', 'true');
      chip.append(avatar(person, 'mini-avatar'), el('span', '', person.name), selectedMark);
      byId('council-roster').append(chip);
      rosterButtons.set(person.id, { button: chip, mark: selectedMark });
      const button = styled(el('button', 'model-card'), person);
      button.type = 'button'; button.dataset.model = person.id;
      const check = el('span', 'selected-check', '✓'); check.setAttribute('aria-hidden', 'true');
      button.append(check, avatar(person, 'model-symbol'), el('span', 'model-name', person.name));
      byId('model-selection').append(button);
      modelButtons.set(person.id, button);
    });
  }
  function createBoard(state) {
    byId('agent-layer').replaceChildren();
    byId('connection-lines').replaceChildren();
    nodeViews.clear(); connectionPaths.clear();
    byId('agent-layer').dataset.count = String(state.participants.length);
    state.participants.forEach(id => {
      const person = model(id);
      const button = styled(el('button', 'agent-node'), person);
      button.type = 'button'; button.dataset.agent = id;
      const byline = el('span', 'node-byline');
      byline.append(avatar(person), el('strong', '', person.name));
      const quote = el('span', 'node-quote');
      const status = el('span', 'node-status');
      const indicator = el('span', 'node-indicator'); indicator.setAttribute('aria-hidden','true');
      const statusText = el('span'); status.append(indicator, statusText);
      const signal = el('span','node-signal'); signal.setAttribute('aria-hidden','true');
      for(let i=0;i<4;i++)signal.append(el('i'));
      status.append(signal);
      button.append(byline, quote, status);
      byId('agent-layer').append(button);
      nodeViews.set(id, { button, quote, statusText });
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'connection-line');
      byId('connection-lines').append(path); connectionPaths.set(id,path);
    });
  }
  function point(coords) { return [coords[0] * 10, coords[1] * 5.3]; }
  function linkToCenter(coords) {
    const [x,y] = point(coords);
    return `M ${x} ${y} C ${x} 244 500 ${y} 500 244`;
  }
  function linkBetween(from, to) {
    const [x1,y1] = point(from), [x2,y2] = point(to);
    if (Math.abs(y1-y2) < 70) {
      const arc = y1 < 265 ? Math.min(y1,y2)-80 : Math.max(y1,y2)+65;
      return `M ${x1} ${y1} C ${x1} ${arc} ${x2} ${arc} ${x2} ${y2}`;
    }
    if (Math.abs(x1-x2) < 100) {
      const arc = x1 < 500 ? Math.min(x1,x2)-75 : Math.max(x1,x2)+75;
      return `M ${x1} ${y1} C ${arc} ${y1} ${arc} ${y2} ${x2} ${y2}`;
    }
    return `M ${x1} ${y1} C ${x1} ${y2} ${x2} ${y1} ${x2} ${y2}`;
  }
  function drawBoard(state, timeline) {
    const visited = timeline.slice(0,state.index+1), coords = new Map();
    state.participants.forEach((id,i) => {
      const person = model(id), view = nodeViews.get(id);
      const integrated = state.integrated.includes(id);
      const gathering = state.phase === 'synthesis';
      const position = [10.5, 10 + (i + .5) * 80 / state.participants.length];
      coords.set(id,position);
      view.button.style.setProperty('--x',position[0]+'%');
      view.button.style.setProperty('--y',position[1]+'%');
      const latest = visited.filter(item=>item.speaker===id).at(-1);
      const active = state.event.speaker === id;
      view.button.dataset.active = String(active);
      view.button.dataset.target = String(state.event.target === id);
      view.button.dataset.integrated = String(integrated);
      view.button.dataset.gathered = String(gathering);
      view.button.setAttribute('aria-pressed',String(active));
      view.button.setAttribute('aria-label', t('Read {name}’s argument', { name: person.name }));
      view.quote.textContent = latest?.short || E.scriptFor(state).ideas[E.models.indexOf(person)];
      const statuses = { proposal: 'First view', challenge: 'Raises a concern', revision: 'Refines the idea', integration: 'Added to decision' };
      view.statusText.textContent = t(integrated ? 'Combined' : latest ? statuses[latest.kind] : 'Ready to contribute');
      if(state.event.target===id)view.statusText.textContent=t(state.phase==='challenge'?'Considers the objection':'Reviews the reply');
      const path = connectionPaths.get(id);
      path.setAttribute('d',linkToCenter(position));
      path.setAttribute('class','connection-line'+(integrated?' is-integrated':''));
    });
    let d = '';
    if (state.event.speaker !== 'council') {
      const source = coords.get(state.event.speaker);
      d = state.event.target && state.event.target !== 'council' ? linkBetween(source,coords.get(state.event.target)) : linkToCenter(source);
    }
    byId('exchange-line').setAttribute('d',d);
    byId('exchange-travel').setAttribute('d',d);
  }
  function renderCore(state, timeline) {
    globalThis.CouncilCinema.render(state, timeline, { E, el, avatar, model, byId, t });
  }
  function renderExchange(state, timeline) {
    const event = state.event, byline=byId('exchange-byline');
    byline.replaceChildren();
    if (event.speaker !== 'council') {
      const person=model(event.speaker);
      byline.append(avatar(person),el('strong','',person.name));
      const actions={ proposal:'proposes',challenge:'challenges',revision:'responds to',integration:'contributes to' };
      byline.append(el('span','exchange-action',t(actions[event.kind])));
      if(event.target) {
        if(event.target==='council') byline.append(el('strong','',t('the shared decision')));
        else byline.append(avatar(model(event.target)),el('strong','',model(event.target).name));
      }
    } else byline.append(el('strong','',t('The council’s shared decision')));
    const evidence = byId('event-evidence');
    evidence.hidden = true;
    evidence.textContent = '';
    byId('exchange-position').textContent=String(state.index+1).padStart(2,'0')+' / '+state.total;
    byId('exchange-text').textContent=event.text;
    const reply=byId('reply-context');
    reply.hidden=event.replyTo===null;
    if(event.replyTo!==null) {
      const parent=timeline[event.replyTo];
      reply.textContent=t('Read the earlier argument')+' · '+model(parent.speaker).name+': '+parent.text;
      reply.dataset.step=String(event.replyTo);
    }
    byId('exchange-panel').hidden=state.completed || state.phase === 'research';
    byId('decision-detail').hidden=!state.completed;
    byId('conversation-notes').hidden=state.phase==='research';
    byId('conversation-notes-label').textContent=t(state.completed?'See each contribution':'Read the exchange');
    if(state.completed) {
      byId('contribution-list').replaceChildren(...state.participants.map(id=>{
        const person=model(id), row=el('div','contribution-item'), text=el('p');
        text.append(el('strong','',person.name),document.createTextNode(E.sceneFor(state).revision[E.models.indexOf(person)]));
        row.append(avatar(person),text); return row;
      }));
      byId('open-question').textContent=E.sceneFor(state).open;
    }
    const key=state.scenario+':'+state.participants.join(',')+':'+state.index;
    if(key!==lastEventKey && !reducedMotion && typeof byId('exchange-text').animate==='function') {
      byId('exchange-text').animate([{opacity:.3,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
    }
    lastEventKey=key;
  }
  function renderCaption(state) {
    const event=state.event;
    byId('exchange-caption').hidden=state.completed;
    if(state.completed)return;
    const source=model(event.speaker),target=event.target&&event.target!=='council'?model(event.target):null;
    if (!source) { byId('caption-route').textContent=t('Source brief'); byId('caption-argument').textContent=event.short; return; }
    const action={proposal:'First view',challenge:'Counterpoint',revision:'Revision',integration:'Contributing'}[event.kind];
    byId('caption-route').textContent=source.name+' · '+t(action)+(target?' → '+target.name:'');
    byId('caption-argument').textContent=event.short;
    byId('exchange-caption').style.setProperty('--signal-color',source.color);
  }
  function render(state) {
    if (state.language !== currentLanguage) applyLanguage(state.language);
    const timeline=controller.getTimeline();
    const key=state.participants.join(',');
    if(key!==boardKey) { createBoard(state); boardKey=key; }
    const scene=E.sceneFor(state);
    byId('sample-question').textContent=scene.question;
    byId('outcome-title').textContent=scene.title;
    byId('outcome-summary').textContent=scene.brief;
    byId('outcome-action').textContent=scene.cinema.next;
    byId('outcome-question').textContent=scene.open;
    scenarioButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scenario===state.scenario)));
    let phaseChanged=false;
    phaseButtons.forEach(button=>{
      const active=button.dataset.phase===state.phase;
      if(active&&button.getAttribute('aria-pressed')!=='true')phaseChanged=true;
      button.setAttribute('aria-pressed',String(active));
      button.dataset.complete=String(E.phases.indexOf(button.dataset.phase)<E.phases.indexOf(state.phase));
    });
    if(phaseChanged) {
      const active=phaseButtons.find(button=>button.dataset.phase===state.phase),nav=active?.parentElement;
      if(nav&&nav.scrollWidth>nav.clientWidth)nav.scrollTo({left:active.getBoundingClientRect().left-nav.getBoundingClientRect().left+nav.scrollLeft-(nav.clientWidth-active.offsetWidth)/2,behavior:reducedMotion?'instant':'smooth'});
    }
    E.models.forEach(person=>{
      const selected=state.participants.includes(person.id), chip=rosterButtons.get(person.id), card=modelButtons.get(person.id);
      for(const button of [chip.button,card]) {
        button.setAttribute('aria-pressed',String(selected));
        button.setAttribute('aria-label',t(selected?'Remove {name}':'Add {name}',{name:person.name}));
      }
      chip.mark.textContent=selected?'':'+';
    });
    byId('selection-status').textContent=t('{n} perspectives selected',{n:state.participants.length});
    byId('council-stage').dataset.phase=state.phase;
    byId('council-stage').dataset.count=String(state.participants.length);
    byId('council-stage').dataset.playing=String(state.playing);
    byId('council-stage').dataset.final=String(state.completed);
    const paused=autoplay?.isPaused() ?? reducedMotion;
    byId('motion-toggle').setAttribute('aria-pressed',String(paused));
    byId('motion-label').textContent=t(paused?'Continue animation':'Pause animation');
    byId('motion-toggle').setAttribute('aria-label',t(paused?'Continue animation':'Pause animation'));
    byId('autoplay-note').textContent=t(paused?'Motion paused':'Automatic preview');
    byId('previous-event').disabled=state.index===0;
    byId('next-event').disabled=state.completed;
    byId('see-outcome').hidden=state.completed;
    const scrubber=byId('council-scrubber');
    scrubber.max=String(state.total-1); scrubber.value=String(state.index);
    scrubber.setAttribute('aria-valuetext',t('Step {n} of {total}: {phase}',{n:state.index+1,total:state.total,phase:t(E.phaseNames[state.phase])}));
    scrubber.style.setProperty('--progress',100*state.index/(state.total-1)+'%');
    byId('playback-status').textContent=state.completed?t(paused?'Sample complete':'Restarts shortly'):(state.playing?t('Playing'):paused?t('Paused'):t('Autoplay'))+' · '+(state.index+1)+' / '+state.total;
    drawBoard(state,timeline); renderCore(state,timeline); renderExchange(state,timeline); renderCaption(state);
    motion?.update(state,timeline);
    autoplay?.sync(state);
  }
  function toggleParticipant(event) {
    const button=event.target.closest('button[data-model]');
    if(!button)return;
    const state=controller.read(), id=button.dataset.model, selected=state.participants.includes(id);
    if(selected&&state.participants.length===2) { notify(t('Keep at least two participants at the table.')); return; }
    autoplay.configure({participants:selected?state.participants.filter(value=>value!==id):[...state.participants,id]});
  }
  function play() { return autoplay.play(); }
  function inspect(action) { return autoplay.inspect(action); }
  function updateVisibility() {
    const visible=stageVisible&&!document.hidden&&!overlayOpen;
    byId('council-stage').dataset.visible=String(visible);
    motion?.setVisible(visible); autoplay.setVisible(visible);
  }
  autoplay = E.createAutoplay({controller,paused:reducedMotion,onError:error=>notify(error.message)});
  createSelectors();
  document.addEventListener('meridian:language-request',event=>{if(['en','ru'].includes(event.detail))controller.setLanguage(event.detail);});
  document.addEventListener('meridian:overlay',event=>{overlayOpen=!!event.detail;updateVisibility();});
  applyLanguage(currentLanguage);
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>controller.setLanguage(button.dataset.language)));
  scenarioButtons.forEach(button=>button.addEventListener('click',()=>autoplay.configure({scenario:button.dataset.scenario})));
  phaseButtons.forEach(button=>button.addEventListener('click',()=>inspect(()=>controller.goToPhase(button.dataset.phase,true))));
  byId('council-roster').addEventListener('click',toggleParticipant);
  byId('model-selection').addEventListener('click',toggleParticipant);
  byId('agent-layer').addEventListener('click',event=>{
    const button=event.target.closest('button[data-agent]');
    if(button)inspect(()=>controller.inspectModel(button.dataset.agent,true));
  });
  byId('agent-layer').addEventListener('pointerover',event=>{const node=event.target.closest('button[data-agent]');if(node)motion?.focus(node.dataset.agent);});
  byId('agent-layer').addEventListener('pointerleave',()=>motion?.focus(null));
  byId('agent-layer').addEventListener('focusin',event=>{const node=event.target.closest('button[data-agent]');if(node)motion?.focus(node.dataset.agent);});
  byId('agent-layer').addEventListener('focusout',()=>motion?.focus(null));
  byId('motion-toggle').addEventListener('click',()=>{autoplay.setPaused(!autoplay.isPaused());render(controller.read());});
  byId('previous-event').addEventListener('click',()=>inspect(()=>controller.seek(Math.max(0,controller.read().index-1),true)));
  byId('next-event').addEventListener('click',()=>inspect(()=>{const state=controller.read();return controller.seek(Math.min(state.total-1,state.index+1),true);}));
  byId('council-scrubber').addEventListener('input',event=>inspect(()=>controller.seek(Number(event.target.value),true)));
  byId('jump-decision').addEventListener('click',()=>inspect(()=>controller.seek(controller.read().total-1,true)));
  byId('see-outcome').addEventListener('click',()=>{inspect(()=>controller.seek(controller.read().total-1,true));const title=byId('core-title');title.tabIndex=-1;title.focus({preventScroll:true});byId('council-stage').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});});
  byId('reply-context').addEventListener('click',()=>inspect(()=>controller.seek(Number(byId('reply-context').dataset.step),true)));
  byId('copy-brief').addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(controller.brief());notify(t('Sample decision copied.'));}
    catch {notify(t('Copy is unavailable here. Select the decision text to copy it manually.'));}
  });
  byId('council-lab').addEventListener('keydown',event=>{if(event.key==='Escape')autoplay.setPaused(true);});
  document.addEventListener('visibilitychange',updateVisibility);
  window.addEventListener('pagehide',()=>{autoplay.setVisible(false);motion?.setVisible(false);});
  window.addEventListener('pageshow',updateVisibility);
  render(controller.read());
  motion=globalThis.CouncilMotion.create({canvas:byId('network-canvas'),stage:byId('council-stage'),core:byId('council-core'),nodeFor:id=>nodeViews.get(id)?.button,read:()=>controller.read(),models:E.models,reducedMotion,translate:t,isPaused:()=>autoplay.isPaused()});
  motion?.update(controller.read(),controller.getTimeline());
  if('IntersectionObserver' in window) {
    const stageObserver=new IntersectionObserver(entries=>{
      const entry=entries[0];stageVisible=entry.isIntersecting;
      updateVisibility();
    },{threshold:0});
    stageObserver.observe(byId('council-stage'));
  } else { stageVisible=true;updateVisibility(); }
  if('IntersectionObserver' in window&&!reducedMotion) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1});
    document.querySelectorAll('.demo-window, .section-intro, .council-principles, .outcome-preview, .pricing-grid, .faq-section, .closing-section').forEach(node=>{node.classList.add('reveal-ready');observer.observe(node);});
  }
  const context=document.modelContext;
  if(context&&typeof context.registerTool==='function') {
    const lifecycle=new AbortController();
    function register(tool) {try {void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch(_){/* The visible demo also works without WebMCP. */}}
    function noArguments(input) {if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('No arguments are accepted.');}
    const emptySchema={type:'object',properties:{},additionalProperties:false};
    register({name:'configure_council_preview',title:'Configure the Council preview',description:'Choose an English or Russian written example and two to five participants. Resets the conversation; autoplay resumes when visible unless explicitly paused. No AI calls.',inputSchema:{type:'object',properties:{language:{type:'string',enum:['en','ru']},scenario:{type:'string',enum:Object.keys(E.scenarios)},participants:{type:'array',minItems:2,maxItems:5,uniqueItems:true,items:{type:'string',enum:E.models.map(person=>person.id)}}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>autoplay.configure(input)});
    register({name:'play_council_preview',title:'Play the Council sample',description:'Resume the scripted conversation, or replay it if complete. Resolves after completion, pause, or reconfiguration; returns waiting_for_visibility if off screen. No AI calls.',inputSchema:emptySchema,annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{noArguments(input);return play();}});
    register({name:'pause_council_preview',title:'Pause the Council sample',description:'Pause the current scripted conversation without losing its position.',inputSchema:emptySchema,annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{noArguments(input);return autoplay.setPaused(true);}});
    register({name:'seek_council_preview',title:'Go to a Council argument',description:'Pause and navigate to a zero-based step in the visible scripted conversation. Read the preview to find its total step count.',inputSchema:{type:'object',properties:{index:{type:'integer',minimum:0}},required:['index'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(key=>key!=='index'))throw new Error('Provide only an index.');if(!Number.isInteger(input.index)||input.index<0||input.index>=controller.read().total)throw new Error('Choose an available step.');autoplay.setPaused(true);return controller.seek(input.index);}});
    register({name:'read_council_preview',title:'Read the Council preview',description:'Read the visible playback state, current written argument, and the sample brief if complete. Not output from AI models.',inputSchema:emptySchema,annotations:{readOnlyHint:true,untrustedContentHint:false},execute:input=>{noArguments(input);const state=controller.read();return {...state,autoplayPaused:autoplay.isPaused(),brief:state.completed?controller.brief():null};}});
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
