/* A visual story driven entirely by the authored conversation clock. */
(() => {
  'use strict';
  let renderedKey = '';
  function render(state, timeline, ui) {
    const { E, el, avatar, model, byId, t } = ui;
    const scene = E.sceneFor(state), story = scene.cinema;
    const stage = byId('council-stage');
    stage.dataset.scene = state.completed ? 'decision' : state.phase;
    stage.dataset.researchStep = String(state.event.researchStep || 0);
    byId('question-context').textContent = story.context;
    const key = [state.language, state.scenario, state.participants.join(','), state.index].join(':');
    if (key === renderedKey) return;
    renderedKey = key;
    const panel = byId('cinema-content');
    panel.replaceChildren();
    byId('core-contributions').replaceChildren();
    const chapters = {
      research: ['Explore the possibilities', state.event.short],
      proposal: ['Independent perspectives', state.event.short],
      challenge: ['Put the idea under pressure.', state.event.short],
      revision: ['What changed', 'Compare the trade-offs.'],
      synthesis: ['Bringing the arguments together', 'A direction is taking shape.']
    };
    const [eyebrow, title] = state.completed ? ['Shared recommendation', scene.title] : chapters[state.phase];
    byId('core-eyebrow').textContent = t(eyebrow);
    byId('core-title').textContent = t(title);
    byId('core-copy').textContent = state.completed ? scene.brief : '';
    byId('core-copy').hidden = !state.completed;
    byId('jump-decision').hidden = state.phase === 'synthesis';
    byId('core-counter').textContent = t(state.completed ? 'Sample decision · not a verified conclusion' : state.phase === 'research' ? 'Hypotheses, not market findings.' : 'Scripted preview');
    const personLine = (id, label) => {
      const person = model(id), line = el('div', 'cinema-person');
      line.append(avatar(person, 'cinema-avatar'), el('strong', '', person.name));
      if (label) line.append(el('span', '', t(label)));
      return line;
    };
    const candidate = (item, index) => {
      const card = el('article', 'market-candidate');
      card.dataset.candidate = String(index);
      card.style.setProperty('--card-index', index);
      card.append(el('span', 'candidate-number', String(index + 1).padStart(2, '0')),
        el('h5', '', item.name), el('p', 'candidate-signal', item.signal));
      const risk = el('div', 'candidate-risk');
      risk.append(el('span', '', t('Open question')), el('p', '', item.risk));
      risk.hidden = state.phase === 'research' && !state.event.researchStep;
      card.append(risk);
      return card;
    };
    if (state.phase === 'research') {
      const grid = el('div', 'market-grid');
      story.candidates.forEach((item, i) => grid.append(candidate(item, i)));
      panel.append(grid);
      const brief = el('p', 'research-prompt');
      brief.append(el('span', 'brief-mark', '↳'), document.createTextNode(state.event.text));
      panel.append(brief);
    } else if (state.phase === 'proposal') {
      const card = el('article', 'proposal-sheet');
      card.style.setProperty('--voice-color', model(state.event.speaker).color);
      card.append(personLine(state.event.speaker), el('p', 'proposal-argument', state.event.text));
      const thread = el('div', 'perspective-thread');
      state.participants.forEach(id => {
        const item = el('span', 'perspective-token');
        const proposed = timeline.slice(0, state.index + 1).some(event => event.kind === 'proposal' && event.speaker === id);
        item.dataset.ready = String(proposed);
        item.append(avatar(model(id), 'cinema-avatar'));
        thread.append(item);
      });
      const count = timeline.slice(0, state.index + 1).filter(event => event.kind === 'proposal').length;
      thread.append(el('span', 'perspective-caption', t('{n} of {total} perspectives', { n: count, total: state.participants.length })));
      card.append(thread); panel.append(card);
    } else if (state.phase === 'challenge') {
      const parent = timeline[state.event.replyTo];
      const pair = el('div', 'debate-pair');
      const original = el('article', 'argument-sheet argument-original');
      original.append(el('p', 'argument-label', t('The original proposal')), personLine(parent.speaker), el('p', 'argument-body', parent.text));
      const counter = el('article', 'argument-sheet argument-counter');
      counter.append(el('p', 'argument-label', t('The counterpoint')), personLine(state.event.speaker), el('p', 'argument-body', state.event.text));
      pair.append(original, counter); panel.append(pair);
    } else if (state.phase === 'revision') {
      const table = el('table', 'comparison-table');
      const head = el('thead'), headRow = el('tr');
      [t('Option'), ...story.criteria].forEach(label => { const th = el('th', '', label); th.scope = 'col'; headRow.append(th); });
      head.append(headRow); table.append(head);
      const body = el('tbody');
      story.candidates.forEach((item, index) => {
        const row = el('tr'); row.dataset.candidate = String(index);
        row.dataset.preferred = String(index === story.selected);
        const name = el('th', '', item.name); name.scope = 'row'; row.append(name);
        story.rows[index].forEach((value, col) => { const td = el('td', '', value); td.dataset.label = story.criteria[col]; row.append(td); });
        body.append(row);
      });
      table.append(body); panel.append(table);
      const update = el('div', 'revision-note');
      update.append(personLine(state.event.speaker, 'The response'), el('p', '', state.event.text)); panel.append(update);
      byId('core-counter').textContent = t('Illustrative comparison, not measured scores.');
    } else if (!state.completed) {
      const choices = el('div', 'selection-stack');
      story.candidates.forEach((item, index) => {
        const card = el('article', 'selection-card');
        card.dataset.candidate = String(index);
        card.dataset.selected = String(index === story.selected);
        card.append(el('span', 'selection-tick', index === story.selected ? '✓' : '—'), el('h5', '', item.name), el('p', '', item.status));
        choices.append(card);
      });
      panel.append(choices);
      const list = el('div', 'merge-contributions');
      state.integrated.forEach(id => {
        const item = el('div', 'merge-contribution'); item.dataset.voice = id;
        item.append(avatar(model(id), 'cinema-avatar'), el('span', '', E.scriptFor(state).revisions[E.models.findIndex(person => person.id === id)]), el('span', 'merge-check', '✓'));
        list.append(item);
      });
      panel.append(list);
      byId('core-counter').textContent = t('{n} of {total} contributions combined', { n: state.integrated.length, total: state.participants.length });
    } else {
      const selected = el('div', 'decision-choice');
      selected.append(el('span', 'decision-seal', '✓'), el('span', '', t('Suggested first test')), el('strong', '', story.candidates[story.selected].name));
      const grid = el('div', 'verdict-grid');
      [['Why this direction', story.reason], ['The next move', story.next]].forEach(([label, body]) => {
        const block = el('section', 'verdict-block'); block.append(el('h5', '', t(label)), el('p', '', body)); grid.append(block);
      });
      const open = el('div', 'verdict-open'); open.append(el('span', '', t('Still unproven')), el('p', '', scene.open));
      const alternate = el('p', 'verdict-alternative'); alternate.append(el('strong', '', t('Keep in view') + '. '), document.createTextNode(story.alternate));
      panel.append(selected, grid, open, alternate);
    }
  }
  globalThis.CouncilCinema = { render };
})();
