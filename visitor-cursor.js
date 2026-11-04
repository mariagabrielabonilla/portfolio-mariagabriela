(() => {
  const cursor = document.getElementById('visitor-cursor');
  const cursorLabel = document.getElementById('visitor-cursor-label');
  const trail = document.getElementById('visitor-cursor-trail');
  const navLabel = document.getElementById('visitor-name-nav');
  const nameControl = document.getElementById('visitor-name-control');
  const dialog = document.getElementById('visitor-name-dialog');
  const form = document.getElementById('visitor-name-form');
  const input = document.getElementById('visitor-name-input');
  const reset = document.getElementById('visitor-name-reset');
  const close = document.querySelector('.visitor-dialog-close');
  const storageKey = 'gaby-portfolio-visitor-name';
  const root = document.documentElement;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleColors = ['#ff68b5', '#f48ac5', '#c8f000', '#b8e900', '#d9cdf4'];
  const interactiveSelector = 'a[href],button:not(:disabled),input[type="button"]:not(:disabled),input[type="submit"]:not(:disabled),input[type="reset"]:not(:disabled),input[type="checkbox"]:not(:disabled),input[type="radio"]:not(:disabled),input[type="file"]:not(:disabled),input[type="range"]:not(:disabled),input[type="color"]:not(:disabled),select:not(:disabled),summary,[role="button"],[role="link"],[role="menuitem"],[role="tab"],[role="switch"],[role="checkbox"],[role="radio"],[role="option"],[onclick],[tabindex]:not([tabindex="-1"])';
  let visitorName = 'You';
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let lastTrailX = null;
  let lastTrailY = null;
  let lastMode = 'default';
  let pressed = false;

  try {
    const savedName = window.localStorage.getItem(storageKey);
    if (savedName && savedName.trim()) visitorName = savedName.trim().slice(0, 24);
  } catch (_) {
    // Keep the name change available for this visit if browser storage is disabled.
  }

  const updateName = (name) => {
    visitorName = name || 'You';
    cursorLabel.textContent = visitorName;
    navLabel.textContent = visitorName;
    nameControl.setAttribute('aria-label', `Change your cursor name, currently ${visitorName}`);
  };
  updateName(visitorName);


  nameControl.addEventListener('click', () => {
    input.value = visitorName === 'You' ? '' : visitorName;
    root.classList.remove('visitor-cursor-active', 'visitor-cursor-native-text', 'visitor-cursor-native-default');
    dialog.showModal();
    cursor.classList.remove('is-visible');
    input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = input.value.trim().slice(0, 24) || 'You';
    try {
      if (name === 'You') window.localStorage.removeItem(storageKey);
      else window.localStorage.setItem(storageKey, name);
    } catch (_) {
      // The current page still reflects the chosen name if storage is unavailable.
    }
    updateName(name);
    dialog.close();
  });

  reset.addEventListener('click', () => {
    try { window.localStorage.removeItem(storageKey); } catch (_) {}
    updateName('You');
    dialog.close();
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => nameControl.focus());

  if (!finePointer) return;

  const pointerMode = (target, event) => {
    if (!target) return 'custom';
    const disabled = target.closest(':disabled,[aria-disabled="true"],[inert]');
    if (disabled) return 'native-default';
    const zoomImage = target.closest('article.case-study img.case-image-zoomable');
    const interactive = target.closest(interactiveSelector);
    if (interactive && (!zoomImage || (interactive !== zoomImage && !zoomImage.contains(interactive)))) return 'interactive';
    if (zoomImage) return 'zoomable';
    if (interactive) return 'interactive';
    if (target.closest('input:not([type="button"]):not([type="submit"]):not([type="reset"]),textarea,[contenteditable="true"],[role="textbox"],[role="searchbox"]')) return 'native-text';

    const caret = document.caretPositionFromPoint?.(event.clientX, event.clientY);
    if (caret?.offsetNode?.nodeType === Node.TEXT_NODE && caret.offsetNode.textContent.trim()) return 'native-text';
    const range = document.caretRangeFromPoint?.(event.clientX, event.clientY);
    if (range?.startContainer?.nodeType === Node.TEXT_NODE && range.startContainer.textContent.trim()) return 'native-text';
    if (target.closest('p,h1,h2,h3,h4,h5,h6,li,label,blockquote,figcaption,dt,dd')) return 'native-text';
    return 'custom';
  };

  const applyMode = (mode) => {
    lastMode = mode;
    root.classList.toggle('visitor-cursor-active', mode === 'custom' || mode === 'interactive' || mode === 'zoomable');
    root.classList.toggle('visitor-cursor-native-text', mode === 'native-text');
    root.classList.toggle('visitor-cursor-native-default', mode === 'native-default');
    cursor.classList.toggle('is-interactive', mode === 'interactive');
    cursor.classList.toggle('is-zoomable', mode === 'zoomable');
    cursor.classList.toggle('is-visible', mode === 'custom' || mode === 'interactive' || mode === 'zoomable');
  };

  const addParticle = (x, y, burst = false) => {
    if (reducedMotion || !trail) return;
    const particle = document.createElement('span');
    const crystal = Math.random() < 0.38;
    const twinkle = !burst && Math.random() < 0.16;
    const size = burst ? 3 + Math.random() * 2 : (twinkle ? 4.5 + Math.random() * 2.5 : 2.8 + Math.random() * 2.8);
    const life = burst ? 420 + Math.random() * 220 : 1050 + Math.random() * 750;
    const driftX = burst ? Math.random() * 34 - 17 : Math.random() * 12 - 6;
    const driftY = burst ? Math.random() * 34 - 17 : 5 + Math.random() * 14;
    particle.className = `sparkle-particle${crystal ? ' is-crystal' : ''}${twinkle ? ' is-twinkle' : ''}${burst ? ' is-burst' : ''}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--particle-size', `${size}px`);
    particle.style.setProperty('--particle-life', `${life}ms`);
    particle.style.setProperty('--particle-x', `${driftX}px`);
    particle.style.setProperty('--particle-y', `${driftY}px`);
    particle.style.setProperty('--particle-color', particleColors[Math.floor(Math.random() * particleColors.length)]);
    trail.append(particle);
    while (trail.childElementCount > 110) trail.firstElementChild.remove();
    window.setTimeout(() => particle.remove(), life + 80);
  };

  const createBurst = (x, y) => {
    for (let i = 0; i < 7; i += 1) {
      const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.4;
      const radius = 5 + Math.random() * 10;
      addParticle(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, true);
    }
  };

  const moveCursor = (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (dialog.open) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    applyMode(pointerMode(target, event));
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) {
      frame = window.requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
        frame = 0;
      });
    }
    if (!reducedMotion && (lastTrailX === null || Math.hypot(pointerX - lastTrailX, pointerY - lastTrailY) >= 7)) {
      addParticle(pointerX + (Math.random() * 6 - 3), pointerY + (Math.random() * 6 - 3));
      lastTrailX = pointerX;
      lastTrailY = pointerY;
    }
  };

  document.addEventListener('pointermove', moveCursor, { passive: true });
  root.addEventListener('pointerleave', () => {
    cursor.classList.remove('is-visible', 'is-interactive', 'is-zoomable');
    root.classList.remove('visitor-cursor-active', 'visitor-cursor-native-text', 'visitor-cursor-native-default');
    lastTrailX = null;
    lastTrailY = null;
  });
  dialog.addEventListener('close', () => {
    root.classList.add('visitor-cursor-active');
    root.classList.remove('visitor-cursor-native-text', 'visitor-cursor-native-default');
    cursor.classList.remove('is-visible', 'is-interactive');
    lastMode = 'default';
  });

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (dialog.open) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const mode = pointerMode(target, event);
    if (mode === 'interactive') {
      createBurst(event.clientX, event.clientY);
      cursor.classList.add('is-pressed');
      pressed = true;
    }
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (!event.isTrusted || event.detail !== 0 || dialog.open) return;
    const target = event.target.closest(interactiveSelector);
    if (!target || target.closest(':disabled,[aria-disabled="true"],[inert]')) return;
    const bounds = target.getBoundingClientRect();
    createBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  });
  const releaseCursor = () => {
    if (!pressed) return;
    cursor.classList.remove('is-pressed');
    pressed = false;
  };
  document.addEventListener('pointerup', releaseCursor, { passive: true });
  document.addEventListener('pointercancel', releaseCursor, { passive: true });
})();
