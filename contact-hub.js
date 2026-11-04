(() => {
  const trigger = document.querySelector('.nav-contact');
  if (!trigger) return;

  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'contact-hub');

  const panel = document.createElement('section');
  panel.className = 'contact-hub';
  panel.id = 'contact-hub';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'contact-hub-title');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <p class="contact-hub-kicker">A little hello, your way</p>
    <h2 id="contact-hub-title">Whatever works best for you!</h2>
    <div class="contact-hub-options">
      <a class="contact-hub-option contact-hub-email" href="mailto:gabonilla1594@gmail.com">
        <span class="contact-hub-icon" aria-hidden="true">✉</span><span><strong>Email me</strong><small>gabonilla1594@gmail.com</small></span><span class="contact-hub-arrow" aria-hidden="true">↗</span>
      </a>
      <a class="contact-hub-option contact-hub-call" href="https://wa.me/447842831811" target="_blank" rel="noopener noreferrer">
        <span class="contact-hub-icon" aria-hidden="true">⌕</span><span><strong>Whatsapp me</strong><small>@mariagabrielabonilla</small></span><span class="contact-hub-arrow" aria-hidden="true">↗</span>
      </a>
      <a class="contact-hub-option contact-hub-linkedin" href="https://www.linkedin.com/in/maria-gabriela-bonilla-930776125/" target="_blank" rel="noopener noreferrer">
        <span class="contact-hub-icon contact-hub-in" aria-hidden="true">in</span><span><strong>Find me on LinkedIn</strong><small>Let’s connect professionally</small></span><span class="contact-hub-arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  `;
  document.body.append(panel);

  let open = false;
  const close = (restoreFocus = false) => {
    if (!open) return;
    open = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
  };

  const position = () => {
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(330, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.right - width, window.innerWidth - width - 12));
    const panelHeight = panel.getBoundingClientRect().height || 300;
    let top = rect.bottom + 12;
    if (top + panelHeight > window.innerHeight - 12) top = Math.max(12, rect.top - panelHeight - 12);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if (open) { close(); return; }
    open = true;
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    panel.classList.add('is-open');
    position();
    panel.querySelector('a').focus({ preventScroll: true });
  });

  document.addEventListener('pointerdown', (event) => {
    if (open && !panel.contains(event.target) && !trigger.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) close(true);
    if (event.key === 'Tab' && open) {
      const links = [...panel.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); links[0].focus(); }
    }
  });
  window.addEventListener('resize', () => open && position());
  window.addEventListener('scroll', () => open && position(), { passive: true });
})();
