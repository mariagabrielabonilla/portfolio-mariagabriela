(() => {
  const images = [...document.querySelectorAll('article.case-study img')];
  if (!images.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'case-image-lightbox';
  dialog.setAttribute('aria-label', 'Enlarged project image');
  dialog.innerHTML = '<button class="case-image-lightbox-close" type="button" aria-label="Close enlarged image">×</button><img class="case-image-lightbox-image" alt="">';
  document.body.append(dialog);

  const closeButton = dialog.querySelector('.case-image-lightbox-close');
  const enlargedImage = dialog.querySelector('.case-image-lightbox-image');
  let lastImage = null;

  const openImage = (image) => {
    if (image.closest('a[href],button')) return;
    lastImage = image;
    enlargedImage.src = image.currentSrc || image.src;
    enlargedImage.alt = image.alt || 'Enlarged project image';
    dialog.showModal();
    closeButton.focus();
  };

  images.forEach((image, index) => {
    image.classList.add('case-image-zoomable');
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');
    image.setAttribute('aria-label', image.alt ? `View larger image: ${image.alt}` : `View larger project image ${index + 1}`);
    image.addEventListener('click', () => openImage(image));
    image.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openImage(image);
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (lastImage?.isConnected) lastImage.focus({ preventScroll: true });
  });
})();
