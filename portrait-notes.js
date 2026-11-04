(() => {
  const art = document.querySelector('.hero-art');
  const frame = document.querySelector('.portrait-frame');
  const layer = document.querySelector('.portrait-word-layer');
  if (!art || !frame || !layer) return;

  const words = ['Words', 'Flows', 'Dogs', 'Travel', 'UX/UI', 'Service design', 'Human Behaviour', 'Storytelling'];
  const palettes = ['lilac', 'peach', 'butter', 'mint', 'rose'];
  const active = [];
  let bag = [];
  let lastX = null;
  let lastY = null;
  let lastSpawn = 0;

  const nextWord = () => {
    if (!bag.length) bag = [...words].sort(() => Math.random() - 0.5);
    return bag.pop();
  };

  const revealWord = (clientX, clientY) => {
    const bounds = layer.getBoundingClientRect();
    const x = Math.min(Math.max(8, clientX - bounds.left), bounds.width - 8);
    const y = Math.min(Math.max(8, clientY - bounds.top), bounds.height - 8);
    const note = document.createElement('span');
    note.className = `portrait-word-pop ${palettes[Math.floor(Math.random() * palettes.length)]}`;
    note.textContent = nextWord();
    note.style.left = `${x / bounds.width * 100}%`;
    note.style.top = `${y / bounds.height * 100}%`;
    note.style.setProperty('--drift-x', `${Math.round(Math.random() * 30 - 15)}px`);
    note.style.setProperty('--drift-y', `${Math.round(Math.random() * -22 - 8)}px`);
    layer.append(note);
    active.push(note);
    if (active.length > 5) active.shift().remove();
    window.setTimeout(() => {
      note.classList.add('is-fading');
      window.setTimeout(() => {
        note.remove();
        const index = active.indexOf(note);
        if (index >= 0) active.splice(index, 1);
      }, 380);
    }, 1250 + Math.random() * 650);
  };

  const revealNearPointer = (event) => {
    const bounds = layer.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const now = performance.now();
    if (lastX !== null && (Math.hypot(x - lastX, y - lastY) < 38 || now - lastSpawn < 150)) return;
    lastX = x;
    lastY = y;
    lastSpawn = now;
    const offset = 25 + Math.random() * 48;
    const angle = Math.random() * Math.PI * 2;
    const left = Math.min(Math.max(bounds.left + 8, x + Math.cos(angle) * offset), bounds.right - 8);
    const top = Math.min(Math.max(bounds.top + 8, y + Math.sin(angle) * offset), bounds.bottom - 8);
    revealWord(left, top);
  };

  art.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') revealNearPointer(event);
  });
  art.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') revealNearPointer(event);
  });
  art.addEventListener('click', (event) => {
    if (event.detail === 0) return;
    revealNearPointer(event);
  });
  art.addEventListener('pointerleave', () => {
    lastX = null;
    lastY = null;
  });
  art.addEventListener('focus', () => {
    const bounds = layer.getBoundingClientRect();
    revealWord(bounds.left + bounds.width * 0.5, bounds.top + bounds.height * 0.5);
  });
  art.addEventListener('keydown', (event) => {
    if (![' ', 'Enter', 'ArrowRight', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const bounds = layer.getBoundingClientRect();
    revealWord(bounds.left + bounds.width * (0.2 + Math.random() * 0.6), bounds.top + bounds.height * (0.2 + Math.random() * 0.6));
  });
})();
