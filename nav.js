/* nav.js — Hamburger toggle behavior */
(function(){
  const btn  = document.querySelector('.hamburger');
  const menu = document.getElementById('site-menu');

  if (!btn || !menu) return;

  function toggle(open){
    const isOpen = open ?? (btn.getAttribute('aria-expanded') !== 'true');
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  }

  btn.addEventListener('click', () => toggle());
  menu.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
})();
