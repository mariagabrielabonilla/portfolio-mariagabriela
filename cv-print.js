(() => {
  const cv = window.portfolioCV;
  if (!cv) return;
  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]).replace(/[–—]/g, '-');
  const role = (job) => `<article class="print-role"><div class="print-role-top"><div><h2>${esc(job.company)}</h2><p>${esc(job.role)}</p></div><div class="print-role-meta"><span>${esc(job.dates)}</span><span>${esc(job.location)}</span></div></div><ul>${job.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join('')}</ul></article>`;

  document.getElementById('print-header').innerHTML = `<div class="print-name-lockup"><h1>${esc(cv.name)}</h1><p>${esc(cv.title)} <span>WORDS - FLOWS - HUMAN BEHAVIOUR</span></p></div><div class="print-contact"><span>${esc(cv.location)}</span><span>${esc(cv.phone)}</span><span>${esc(cv.email)}</span><span><a href="${esc(cv.linkedin)}">LinkedIn profile</a></span></div><div class="print-accent"></div>`;
  document.getElementById('print-summary').innerHTML = cv.summary.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('');
  document.getElementById('print-recent').innerHTML = cv.experience.slice(0, 2).map(role).join('');
  document.getElementById('print-earlier').innerHTML = cv.experience.slice(2).map(role).join('');
  document.getElementById('print-education').innerHTML = cv.education.map((item) => `<article class="print-education-item"><div><h2>${esc(item.institution)}</h2><span>${esc(item.location)}</span></div><p>${esc(item.qualification)}</p><div class="print-education-meta">${item.dates ? esc(item.dates) : esc(item.detail)}</div></article>`).join('');
  document.getElementById('print-exchanges').innerHTML = `<strong>Academic exchanges:</strong> ${cv.exchanges.map(esc).join(' - ')}`;
  document.getElementById('print-skills').innerHTML = cv.competencies.map((group) => `<div class="print-skill-group"><h2>${esc(group.label)}</h2><p>${group.items.map(esc).join(' - ')}</p></div>`).join('');
  document.getElementById('print-languages').textContent = cv.languages.join(' - ');
  document.getElementById('print-quote').textContent = `“${cv.quote}”`;
})();
