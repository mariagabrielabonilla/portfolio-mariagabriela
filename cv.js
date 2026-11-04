(() => {
  const cv = window.portfolioCV;
  if (!cv) return;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  document.getElementById('cv-hero-summary').textContent = cv.summary[0];
  document.getElementById('cv-contact-line').innerHTML = `${escapeHtml(cv.location)}<br><a href="tel:${escapeHtml(cv.phone.replace(/\s/g, ''))}">${escapeHtml(cv.phone)}</a><br><a href="mailto:${escapeHtml(cv.email)}">${escapeHtml(cv.email)}</a>`;
  document.getElementById('cv-summary-copy').innerHTML = cv.summary.slice(1).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  document.getElementById('cv-quote').textContent = cv.quote;

  document.getElementById('cv-timeline').innerHTML = cv.experience.map((job, index) => `
    <details class="cv-role" ${index === 0 ? 'open' : ''}>
      <summary>
        <span class="cv-role-number">0${index + 1}</span>
        <span class="cv-role-heading"><span class="cv-role-company">${escapeHtml(job.company)}</span><span class="cv-role-title">${escapeHtml(job.role)}</span></span>
        <span class="cv-role-meta"><span>${escapeHtml(job.dates)}</span><span>${escapeHtml(job.location)}</span></span>
        <span class="cv-role-toggle" aria-hidden="true">+</span>
      </summary>
      <div class="cv-role-content">${job.highlight === 0 ? `<p class="cv-award"><svg class="flower-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(45 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(90 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(135 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(180 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(225 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(270 12 12)"/><ellipse cx="12" cy="5.2" rx="2.05" ry="4.1" transform="rotate(315 12 12)"/></svg> ${escapeHtml(job.bullets[0])}</p>` : ''}<ul>${job.bullets.map((bullet, bulletIndex) => job.highlight === bulletIndex ? '' : `<li>${escapeHtml(bullet)}</li>`).join('')}</ul></div>
    </details>`).join('');

  const educationEntries = [
    ...cv.education.map((item) => ({ ...item, eyebrow: item.location, footer: item.dates || item.detail })),
    ...cv.exchanges.map((exchange) => {
      const match = exchange.match(/^(.*) \((\d{4})\)$/);
      return {
        eyebrow: match && match[1].includes('Budapest') ? 'Budapest, Hungary' : 'São Paulo, Brazil',
        institution: match ? match[1] : exchange,
        qualification: 'Academic exchange',
        footer: match ? match[2] : ''
      };
    })
  ];
  document.getElementById('cv-education-grid').innerHTML = educationEntries.map((item, index) => `
    <article class="cv-education-card"><span class="cv-education-number">0${index + 1}</span><p class="eyebrow">${escapeHtml(item.eyebrow)}</p><h3>${escapeHtml(item.institution)}</h3><p class="cv-qualification">${escapeHtml(item.qualification)}</p>${item.footer ? `<span class="cv-study-date">${escapeHtml(item.footer)}</span>` : ''}</article>`).join('');

  document.getElementById('cv-strength-grid').innerHTML = cv.competencies.map((group) => `
    <article class="cv-strength-card"><div class="cv-strength-heading"><span class="eyebrow">${escapeHtml(group.label)}</span></div><ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('');
  document.getElementById('cv-languages').innerHTML = cv.languages.map((language) => `<li>${escapeHtml(language)}</li>`).join('');

  const revealItems = document.querySelectorAll('.cv-intro, .cv-section-heading, .cv-role, .cv-education-card, .cv-strength-card, .cv-language-card, .cv-linkedin-inner, .cv-off-duty-card, .cv-off-duty-heading, .cv-download-inner');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => {
    item.classList.add('will-reveal');
    observer.observe(item);
  });
})();
