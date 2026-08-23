/* Rastreio de conversão compartilhado (GA4).
   Escuta cliques/envios em todas as páginas sem precisar marcar cada botão manualmente. */
(function () {
  function track(name, label) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, { event_category: 'engagement', event_label: label });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.href;
    if (href.indexOf('calendly.com') !== -1) track('click_calendly', href);
    else if (href.indexOf('wa.me') !== -1) track('click_whatsapp', href);
    else if (href.indexOf('mailto:') === 0) track('click_email', href);
    else if (/\.pdf(\?|$)/.test(href)) track('download_pdf', href);
  }, true);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.tagName === 'FORM' && /formspree\.io/.test(form.action || '')) {
      track('form_submit', form.getAttribute('data-next') || form.action);
    }
  }, true);

  document.querySelectorAll('form[action*="sibforms.com"]').forEach(function (form) {
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.newsletter-status');
    var response = form.querySelector('iframe');
    if (!button || !status || !response) return;

    form.addEventListener('submit', function () {
      button.disabled = true;
      status.textContent = 'Enviando...';
      status.className = 'newsletter-status is-visible';
    });

    response.addEventListener('load', function () {
      if (!button.disabled) return;
      status.textContent = 'Cadastro enviado. Confira seu email para confirmar a inscrição.';
      status.className = 'newsletter-status is-visible is-success';
      button.disabled = false;
    });
  });
})();
