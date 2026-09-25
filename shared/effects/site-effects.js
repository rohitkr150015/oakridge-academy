/* Progressive enhancement for static and React pages. No dependencies or delayed rendering. */
(() => {
  if (window.__schoolEffects) return;
  window.__schoolEffects = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animated = new Set();
  const seen = new WeakSet();
  const enhanced = new WeakSet();
  const cardSelector = 'a.feature-story,a.event-preview,a.event-row,.project-card:has(a[href]),.life-grid>a,.life-mosaic>a,.campus-trio>a,a.content-card,a.card,a.image-tile,a.week-event,a.role-card,a.program-card,a.programme-card,.card:has(a[href]),.programme-card:has(a[href]),.program-card:has(a[href])';
  const imageSelector = 'a.image-tile,a.gallery-card,button.gallery-card,.life-mosaic>a,.campus-trio a,a.content-card:has(img)';
  const revealSelector = '.section-heading,.page-heading,.week-intro,.section .heading,.oak-aside .aside-block';
  const motionAllowed = () => !reduced.matches && !document.body.classList.contains('motion-off');
  function play(element, frames, duration) {
    if (!motionAllowed() || !element.animate) return;
    const animation = element.animate(frames, {duration,easing:'cubic-bezier(.2,.7,.3,1)'});
    animated.add(animation);
    animation.finished.catch(() => {}).finally(() => animated.delete(animation));
  }
  const reveal = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal.unobserve(entry.target);
      play(entry.target,[{opacity:.7,translate:'0 8px'},{opacity:1,translate:'0 0'}],280);
    });
  },{threshold:.12}) : null;
  function find(root, selector) {
    return [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
  }
  function enhance(root) {
    find(root,cardSelector).forEach(el => {
      if (enhanced.has(el)) return;
      enhanced.add(el);
      el.classList.add('fx-hover-card');
    });
    find(root,imageSelector).forEach(el => el.classList.add('fx-image-link'));
    find(root,revealSelector).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      if (motionAllowed()) reveal?.observe(el);
    });
  }
  const intro = document.querySelector('.fx-intro');
  intro?.addEventListener('animationend',event => {
    if (event.animationName === 'fx-intro-away') intro.remove();
  });
  // CSS also hides the intro at 540ms, including when this script cannot load.
  setTimeout(() => intro?.remove(),700);
  if (!motionAllowed()) intro?.remove();
  const progress = document.createElement('div');
  progress.className = 'fx-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.append(progress);
  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--fx-progress',String(max > 0 ? Math.min(1,Math.max(0,scrollY/max)) : 0));
    document.documentElement.toggleAttribute('data-fx-scrolled',scrollY > 12);
  }
  function scheduleScroll() { if (!scrollFrame) scrollFrame=requestAnimationFrame(updateScroll); }
  addEventListener('scroll',scheduleScroll,{passive:true});
  addEventListener('resize',scheduleScroll,{passive:true});
  addEventListener('pageshow',scheduleScroll);
  enhance(document.body);
  updateScroll();
  const pending = new Set();
  let enhancementFrame = 0;
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.attributeName === 'data-page-key') {
          play(record.target,[{opacity:.82},{opacity:1}],180);
          scheduleScroll();
        } else if (!motionAllowed()) {
          animated.forEach(animation => animation.cancel());
          intro?.remove();
        }
        continue;
      }
      record.addedNodes.forEach(node => {if(node.nodeType===1)pending.add(node);});
      record.removedNodes.forEach(node => {
        if(node.nodeType===1)find(node,revealSelector).forEach(el=>reveal?.unobserve(el));
      });
    }
    if (pending.size && !enhancementFrame) enhancementFrame=requestAnimationFrame(() => {
      enhancementFrame=0;
      pending.forEach(node=>{if(node.isConnected)enhance(node);});
      pending.clear();
      scheduleScroll();
    });
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-page-key','class']});
  reduced.addEventListener('change',() => {
    if (reduced.matches) { animated.forEach(animation=>animation.cancel()); intro?.remove(); }
  });
})();
